export class CodexManager {
    constructor() {
        this.dungeonsData = [];
        this.guiasFreeData = []; // Variável nova para guardar os dados dos Digimons FREE
        
        // Expor as funções para o HTML conseguir chamá-las nos botões (onclick)
        window.voltarParaListaCodex = () => this.mostrarLista();
        window.abrirGuiaCodex = (id) => this.mostrarGuia(id);
        window.abrirGuiaFree = (guiaData) => this.desenharGuiaFreeSSS(guiaData); // Atalho novo para os Guias Free
    }

    async inicializar() {
        try {
            // 1. Carrega o JSON das Dungeons
            const resDungeons = await fetch('./data/dungeons_guild.json');
            this.dungeonsData = await resDungeons.json();

            // 2. Carrega o JSON dos Digimons FREE SSS+
            const resGuias = await fetch('./data/guias_geral_obter_digimon.json');
            this.guiasFreeData = await resGuias.json();

            // 3. Desenha tudo no ecrã
            this.renderizarLista();
            console.log("📖 Codex: Base de Dados (Dungeons & Free SSS+) carregada e renderizada.");
        } catch (e) { 
            console.error("❌ Codex: Erro ao ler JSONs", e); 
        }
    }

    renderizarLista() {
        const container = document.getElementById('listaDungeonsCodex');
        if (!container) return;

        let html = '';

        // --- SECÇÃO 1: DUNGEONS ---
        html += `<div class="col-12 mb-2"><h4 class="text-warning border-bottom border-warning pb-2"><i class="fas fa-dragon"></i> Dungeons da Guild</h4></div>`;
        
        this.dungeonsData.forEach(dung => {
            html += `
            <div class="col-md-4 mb-3">
                <div class="card h-100 border-secondary bg-dark" style="cursor: pointer; transition: 0.2s;" onclick="window.abrirGuiaCodex('${dung.id}')" onmouseover="this.classList.replace('border-secondary','border-warning')" onmouseout="this.classList.replace('border-warning','border-secondary')">
                    <div class="card-body text-center d-flex flex-column justify-content-center">
                        <i class="fas fa-book-open fa-2x text-warning mb-3"></i>
                        <h5 class="text-light">${dung.nome}</h5>
                        <span class="text-info small mt-2">Clique para ler as táticas</span>
                    </div>
                </div>
            </div>`;
        });

        // --- SECÇÃO 2: GUIAS FREE SSS+ ---
        if (this.guiasFreeData && this.guiasFreeData.length > 0) {
            html += `<div class="col-12 mt-4 mb-2"><h4 class="text-info border-bottom border-info pb-2"><i class="fas fa-unlock-alt"></i> Guías de Digimons FREE SSS+</h4></div>`;
            
            this.guiasFreeData.forEach(guia => {
                // Prepara o objeto para ser passado via HTML onclick
                const guiaJson = JSON.stringify(guia).replace(/"/g, '&quot;');
                html += `
                    <div class="col-md-6 col-lg-4 mb-3">
                        <div class="card h-100 border-info bg-dark" style="cursor: pointer; transition: 0.3s;" onclick="window.abrirGuiaFree(${guiaJson})">
                            <div class="card-body text-center d-flex flex-column justify-content-center">
                                <i class="fas fa-robot fa-3x text-info mb-3"></i>
                                <h5 class="text-light">${guia.nome}</h5>
                                <span class="text-muted small mt-2">Ver Requisitos</span>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        container.innerHTML = html;
    }

    mostrarGuia(id) {
        const dung = this.dungeonsData.find(d => d.id === id);
        if (!dung) return;

        document.getElementById('listaDungeonsCodex').classList.add('d-none');
        document.getElementById('guiaDungeonDetalhado').classList.remove('d-none');

        let mecanicasHtml = dung.mecanicas.map(m => `<li class="mb-3 p-2 bg-dark rounded border-start border-warning" style="border-width: 3px !important;">${m}</li>`).join('');
        
        let rolesHtml = '';
        const icones = { skill: 'fa-fire', aa: 'fa-fist-raised', tank: 'fa-shield-alt' };
        
        for (const [role, info] of Object.entries(dung.roles)) {
            
            // CONSTRUTOR DE STATS DINÂMICOS (Só mostra o que a Dungeon pedir)
            let statsHtml = '';
            if(info.hp_minimo) statsHtml += `<span class="badge bg-success me-1 mb-1 fs-6">${info.hp_minimo.toLocaleString('pt-PT')} HP</span>`;
            if(info.hit_minimo) statsHtml += `<span class="badge bg-info text-dark me-1 mb-1 fs-6">${info.hit_minimo.toLocaleString('pt-PT')} HT</span>`;
            if(info.ct_minimo) statsHtml += `<span class="badge bg-danger me-1 mb-1 fs-6">${info.ct_minimo}% CT</span>`;
            if(info.cd_minimo) statsHtml += `<span class="badge bg-warning text-dark me-1 mb-1 fs-6">${info.cd_minimo}% CD</span>`;
            if(info.de_minimo) statsHtml += `<span class="badge bg-secondary me-1 mb-1 fs-6">${info.de_minimo.toLocaleString('pt-PT')} DE</span>`;
            if(info.bl_minimo) statsHtml += `<span class="badge bg-secondary me-1 mb-1 fs-6">${info.bl_minimo}% BL</span>`;
            if(info.ev_minimo) statsHtml += `<span class="badge bg-secondary me-1 mb-1 fs-6">${info.ev_minimo}% EV</span>`;

            rolesHtml += `
             <div class="col-md-4 mb-4">
                <div class="p-4 border border-secondary rounded bg-dark h-100 shadow-lg" style="background: linear-gradient(180deg, rgba(30,30,30,1) 0%, rgba(20,20,20,1) 100%);">
                    <h4 class="text-warning text-uppercase border-bottom border-secondary pb-3 mb-3 fw-bold">
                        <i class="fas ${icones[role] || 'fa-user'} me-2"></i> ${role}
                    </h4>
                    
                    <div class="mb-4">
                        <h6 class="text-info mb-2"><i class="fas fa-dna"></i> Digimons Recomendados</h6>
                        <div class="d-flex flex-wrap gap-1">
                            ${info.recomendados.map(d => `<span class="badge border border-info text-info bg-transparent">${d}</span>`).join('')}
                        </div>
                    </div>

                    <div class="bg-black p-3 rounded mb-4 border border-secondary">
                        <h6 class="text-light mb-2"><i class="fas fa-chart-bar"></i> Stats Mínimos</h6>
                        <div>${statsHtml}</div>
                    </div>

                    <div class="mb-3">
                        <h6 class="text-warning mb-1"><i class="fas fa-ring"></i> Gear Necessária</h6>
                        <p class="text-light small lh-sm">${info.gear}</p>
                    </div>

                    <div>
                        <h6 class="text-primary mb-1"><i class="fas fa-layer-group"></i> Deck Recomendado</h6>
                        <p class="text-light small mb-0">${info.deck || 'N/A'}</p>
                    </div>
                </div>
             </div>`;
        }

        document.getElementById('conteudoGuia').innerHTML = `
            <div class="d-flex justify-content-between align-items-center border-bottom border-warning pb-3 mb-4">
                <h1 class="text-warning fw-bold m-0"><i class="fas fa-dungeon"></i> ${dung.nome}</h1>
                <span class="badge bg-dark border border-warning fs-6 py-2 px-3">
                    <i class="fas fa-users text-info"></i> ${dung.requisitos_party || 'Party Padrão (3 DPS, 1 Tank)'}
                </span>
            </div>
            
            <div class="row mb-5">
                ${rolesHtml}
            </div>

            <h3 class="text-light mb-4"><i class="fas fa-exclamation-triangle text-danger"></i> Mecânicas & Tática da Guild</h3>
            <ul class="text-light fs-5 lh-lg" style="list-style-type: none; padding-left: 0;">
                ${mecanicasHtml}
            </ul>
        `;
    }

    mostrarLista() {
        document.getElementById('listaDungeonsCodex').classList.remove('d-none');
        document.getElementById('guiaDungeonDetalhado').classList.add('d-none');
    }

    desenharGuiaFreeSSS(guiaData) {
        let html = `
            <div class="card border-info mb-4 shadow-lg" style="background: var(--bg-dark);">
                <div class="card-header bg-dark text-info border-bottom border-info d-flex align-items-center">
                    <i class="fas fa-robot fa-2x me-3"></i>
                    <h3 class="m-0 fw-bold">${guiaData.nome}</h3>
                </div>
                <div class="card-body">
                    <div class="alert alert-warning border-warning text-dark mb-4 fw-bold">
                        <i class="fas fa-exclamation-triangle"></i> ${guiaData.descricao}
                    </div>
        `;

        if (guiaData.quest_inicial) {
            html += `
                <p class="text-light fs-6 mb-4 p-3 border border-secondary rounded" style="background: rgba(255,255,255,0.05);">
                    <i class="fas fa-map-marker-alt text-danger me-2"></i> <b>Inicio:</b> ${guiaData.quest_inicial}
                </p>
            `;
        }

        html += `<div class="row g-4">`;

        // ---------------- COLUNA 1: ITENS ----------------
        if (guiaData.requisitos_itens && guiaData.requisitos_itens.length > 0) {
            html += `
                <div class="col-md-6">
                    <h5 class="text-danger border-bottom border-secondary pb-2"><i class="fas fa-box-open"></i> Ítems Requeridos</h5>
                    <div class="list-group list-group-flush bg-transparent mt-3">
            `;
            guiaData.requisitos_itens.forEach(item => {
                html += `
                    <div class="list-group-item bg-transparent border-secondary text-light px-0 py-2">
                        <h6 class="m-0 fw-bold text-warning">${item.nome}</h6>
                        ${item.como_obter ? `<p class="mb-0 text-muted small mt-1">${item.como_obter}</p>` : ''}
                    </div>
                `;
            });
            html += `</div></div>`;
        }

        // ---------------- COLUNA 2: DIGIMONS E/OU QUESTS ----------------
        if (guiaData.requisitos_digimons || guiaData.requisitos_quest) {
            html += `<div class="col-md-6">`;
            
            if (guiaData.requisitos_digimons) {
                html += `<h5 class="text-primary border-bottom border-secondary pb-2"> Digimons Requeridos</h5>
                         <div class="list-group list-group-flush bg-transparent mt-3 mb-4">`;
                guiaData.requisitos_digimons.forEach(digi => {
                    html += `
                        <div class="list-group-item bg-transparent border-secondary text-light px-0 py-2">
                            <h6 class="m-0 fw-bold text-info">${digi.grupo}</h6>
                            <p class="mb-0 text-muted small mt-1">${digi.detalhe}</p>
                        </div>
                    `;
                });
                html += `</div>`;
            }

            if (guiaData.requisitos_quest) {
                html += `<h5 class="text-success border-bottom border-secondary pb-2"><i class="fas fa-scroll"></i> Quests Necesarias</h5>
                         <div class="list-group list-group-flush bg-transparent mt-3">`;
                guiaData.requisitos_quest.forEach(quest => {
                    html += `
                        <div class="list-group-item bg-transparent border-secondary text-light px-0 py-2">
                            <h6 class="m-0 fw-bold text-success">${quest.grupo}</h6>
                            <p class="mb-0 text-muted small mt-1">${quest.detalhe}</p>
                        </div>
                    `;
                });
                html += `</div>`;
            }

            html += `</div>`;
        }

        html += `
                    </div>
                </div>
            </div>
        `;

        const container = document.getElementById('conteudoGuia');
        if(container) {
            container.innerHTML = html;
            document.getElementById('listaDungeonsCodex').classList.add('d-none');
            document.getElementById('guiaDungeonDetalhado').classList.remove('d-none');
        }
    }
}