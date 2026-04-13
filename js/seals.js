export class SealsManager {
    constructor() {
        this.sealsData = null;
        this.userProgress = JSON.parse(localStorage.getItem('dmwSealsProgress')) || {};
        this.abasRenderizadas = new Set();
    }

    async inicializar() {
        try {
            const res = await fetch('./data/seals.json'); 
            if (!res.ok) throw new Error("¡Archivo seals.json no encontrado!");
            
            const rawData = await res.json();
            this.sealsData = rawData.dados;
            
            Object.keys(this.sealsData).forEach(stat => {
                if (!this.userProgress[stat]) this.userProgress[stat] = {};
            });

            this.renderizarEstruturaBase();
            this.calcularTotais();
            console.log("🎴 Seal Master: ¡Cargado súper rápido!");
        } catch (e) {
            console.error("Error fatal en los Seals", e);
            document.getElementById('sealsContainer').innerHTML = `<div class="alert alert-danger shadow-lg border-danger"><b>Error:</b> No pude leer el archivo <code>data/seals.json</code>.<br>¡Verifica si el nombre del archivo es correcto!</div>`;
        }
    }

    renderizarEstruturaBase() {
        const container = document.getElementById('sealsContainer');
        if (!container) return;

        let htmlTabs = '<ul class="nav nav-pills justify-content-center mb-4 gap-2" id="sealsTabs" role="tablist">';
        let htmlContent = '<div class="tab-content" id="sealsTabsContent">';
        let index = 0;
        let primeiroStat = null;

        for (const stat of Object.keys(this.sealsData)) {
            if (this.sealsData[stat].length === 0) continue;
            if (!primeiroStat) primeiroStat = stat;

            const isActive = index === 0 ? 'active' : '';
            const isShow = index === 0 ? 'show active' : '';
            
            htmlTabs += `
            <li class="nav-item" role="presentation">
                <button class="nav-link btn-neon-primary ${isActive} py-1 px-3 fw-bold" id="tab-seal-${stat}" data-bs-toggle="pill" data-bs-target="#pane-seal-${stat}" type="button" role="tab" onclick="window.dmwTracker.seals.renderizarTabela('${stat}')">
                    ${stat} <span class="badge bg-dark ms-1">${this.sealsData[stat].length}</span>
                </button>
            </li>`;

            htmlContent += `
            <div class="tab-pane fade ${isShow}" id="pane-seal-${stat}" role="tabpanel">
                <div class="text-center text-muted p-5">
                    <i class="fas fa-cog fa-spin fa-2x mb-2"></i><br>Montando tabla...
                </div>
            </div>`;
            index++;
        }

        htmlTabs += '</ul>';
        htmlContent += '</div>';
        container.innerHTML = htmlTabs + htmlContent;

        if (primeiroStat) this.renderizarTabela(primeiroStat);
    }

    renderizarTabela(stat) {
        if (this.abasRenderizadas.has(stat)) return;

        const pane = document.getElementById(`pane-seal-${stat}`);
        if (!pane) return;

        const digimons = this.sealsData[stat];
        let html = `
            <div class="card bg-dark border-secondary shadow-lg">
                <div class="card-body p-0" style="max-height: 60vh; overflow-y: auto;">
                    <table class="table table-dark table-hover table-sm align-middle m-0" style="font-size: 0.85rem;">
                        <thead class="text-muted" style="position: sticky; top: 0; background-color: #111; z-index: 10;">
                            <tr>
                                <th style="width: 25%; padding-left: 15px;">Digimon</th>
                                <th style="width: 35%;">Localización</th>
                                <th class="text-end" style="width: 40%; padding-right: 15px;">Cant / Bonus</th>
                            </tr>
                        </thead>
                        <tbody>`;

        digimons.forEach(digi => {
            const userAmount = this.userProgress[stat][digi.nome] || 0;
            
            const marcos = [0, 1, 50, 200, 500, 1000, 3000];
            let botoesHtml = '<div class="btn-group" role="group">';
            marcos.forEach(m => {
                const btnClass = userAmount === m ? 'btn-primary' : 'btn-outline-secondary';
                const displayVal = m === 0 ? '0' : m;
                botoesHtml += `<button type="button" class="btn btn-sm ${btnClass} py-0 px-2" onclick="window.dmwTracker.seals.atualizarProgresso('${stat}', '${digi.nome}', ${m}, this)">${displayVal}</button>`;
            });
            botoesHtml += '</div>';

            const bonusAtual = userAmount > 0 ? digi[userAmount.toString()] : 0;
            let loc = digi.localizacao || '';
            if (loc.length > 50) loc = loc.substring(0, 48) + '...';

            html += `
                            <tr>
                                <td class="fw-bold text-light" style="padding-left: 15px;">${digi.nome}</td>
                                <td class="text-muted small" title="${digi.localizacao}">${loc}</td>
                                <td class="text-end" style="padding-right: 15px;">
                                    ${botoesHtml}
                                    <span class="ms-2 badge bg-success" style="width: 60px;">+${bonusAtual}</span>
                                </td>
                            </tr>`;
        });

        html += `           </tbody>
                        </table>
                </div>
            </div>`;

        pane.innerHTML = html;
        this.abasRenderizadas.add(stat);
    }

    atualizarProgresso(stat, digimon, amount, btnElement) {
        this.userProgress[stat][digimon] = amount;
        localStorage.setItem('dmwSealsProgress', JSON.stringify(this.userProgress));

        const btnGroup = btnElement.parentElement;
        Array.from(btnGroup.children).forEach(b => {
            b.classList.remove('btn-primary');
            b.classList.add('btn-outline-secondary');
        });
        btnElement.classList.remove('btn-outline-secondary');
        btnElement.classList.add('btn-primary');

        const digiData = this.sealsData[stat].find(d => d.nome === digimon);
        const novoBonus = amount > 0 ? digiData[amount.toString()] : 0;
        btnGroup.nextElementSibling.textContent = `+${novoBonus}`;

        this.calcularTotais();
    }

    calcularTotais() {
        let totais = {};
        for (const [stat, digimons] of Object.entries(this.sealsData)) {
            totais[stat] = 0;
            digimons.forEach(digi => {
                const amount = this.userProgress[stat][digi.nome] || 0;
                if (amount > 0) totais[stat] += digi[amount.toString()];
            });
        }

        const container = document.getElementById('sealsTotalResumo');
        if (container) {
            container.innerHTML = Object.entries(totais).map(([stat, val]) => `
                <div class="col-3 col-md-2">
                    <div class="p-2 border border-secondary rounded bg-black">
                        <small class="text-muted d-block">${stat}</small>
                        <strong class="text-${val > 0 ? 'success' : 'light'} fs-5">+${val}</strong>
                    </div>
                </div>
            `).join('');
        }
        return totais; 
    }

    obterRecomendacoesParaFarm(statFaltoso, limite = 3) {
        if (!this.sealsData || !this.sealsData[statFaltoso]) return [];
        let recomendacoes = [];
        this.sealsData[statFaltoso].forEach(digi => {
            const userAmount = this.userProgress[statFaltoso][digi.nome] || 0;
            const isFarmavel = !digi.localizacao.toLowerCase().includes('event') && !digi.localizacao.toLowerCase().includes('not obtainable');
            if (userAmount < 1000 && isFarmavel) {
                const ganhoPotencial = digi["1000"] - (userAmount > 0 ? digi[userAmount.toString()] : 0);
                recomendacoes.push({ ...digi, ganhoPotencial, userAmount });
            }
        });
        return recomendacoes.sort((a, b) => b.ganhoPotencial - a.ganhoPotencial).slice(0, limite);
    }
}