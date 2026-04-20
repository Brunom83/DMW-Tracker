export class MentorDMW {
    constructor() {
        this.regrasReborn = null;
        this.dungeonsData = [];
        this.gearTierList = null; 
        this.tabelaReborn = null; // Alojamento para a nova tabela de décimas

        this.carregarDadosBase();
        this.carregarDungeons();
        this.carregarGear();
        this.carregarTabelaReborn(); // Dispara o carregamento do JSON
    }

    async carregarDadosBase() {
        try {
            const res = await fetch('./data/reborn_final.json');
            if (!res.ok) throw new Error("Archivo no encontrado");
            const dados = await res.json();
            this.regrasReborn = dados[0].requisitos_logicos;
        } catch (e) {
            // Agora o tamanho perfeito base é 139.99
            this.regrasReborn = { min_level: 120, min_size_percent: 139.99, clone_stats: "75/75" };
        }
    }

    async carregarDungeons() {
        try {
            const res = await fetch('./data/dungeons_guild.json');
            this.dungeonsData = await res.json();
        } catch (e) { console.error("Error JSON Dungeons", e); }
    }

    async carregarGear() {
        try {
            const res = await fetch('./data/gear_tierlist.json');
            this.gearTierList = await res.json();
            console.log("💍 Tier List de Joyería Cargada!");
        } catch (e) { console.error("Error JSON Gear", e); }
    }

    // A Nova Função que puxa a tua Base de Dados Dinâmica
    async carregarTabelaReborn() {
        try {
            const res = await fetch('./data/reborn_stats.json');
            this.tabelaReborn = await res.json();
            console.log("🧬 Tabla de Reborn Dinámica Cargada!");
        } catch (e) { console.error("Error JSON Reborn Table", e); }
    }

    analisarDigimon(level, size, cloneStatus) {
        if (!this.regrasReborn || !this.tabelaReborn) return `<div class="alert alert-info">Leyendo datos del servidor...</div>`;
        
        const sizeFloat = parseFloat(size);
        const roleDropdown = document.getElementById('statRole');
        let role = roleDropdown ? roleDropdown.value.toLowerCase() : 'sk'; 
        
        // Amortecedores
        if (role === 'support') role = 'sup';
        if (role === 'tank') role = 'ta';
        
        let conselhos = [];
        let pronto = true;

        if (level < this.regrasReborn.min_level) { 
            conselhos.push(`🔴 Falta Nivel (${this.regrasReborn.min_level})`); 
            pronto = false; 
        }

        // Variável para guardar a nossa nova super tabela
        let htmlTabelaDireita = '';

        if (this.tabelaReborn[role]) {
            const tabelaRole = this.tabelaReborn[role];
            const maxBracket = tabelaRole[0]; 
            const currBracket = tabelaRole.find(s => sizeFloat >= s.min);

            if (currBracket) {
                let linhasTabela = '';
                const statsMax = maxBracket.stats;
                const statsCur = currBracket.stats;

                for (const statName in statsMax) {
                    const ganha = statsCur[statName];
                    const perde = parseFloat((statsMax[statName] - statsCur[statName]).toFixed(2));
                    const formatStat = (val) => ['SKD', 'CD', 'ATT', 'EV', 'BL'].includes(statName) ? `${val}%` : val;

                    // Se ele tem 140%, a perda é 0, logo fica um traço cinzento em vez de "-0"
                    const perdaHtml = perde > 0 
                        ? `<td class="text-danger fw-bold align-middle">-${formatStat(perde)}</td>` 
                        : `<td class="text-muted align-middle">-</td>`;

                    linhasTabela += `
                        <tr>
                            <td class="text-light fw-bold align-middle">${statName}</td>
                            <td class="text-success align-middle">+${formatStat(ganha)}</td>
                            ${perdaHtml}
                        </tr>
                    `;
                }

                // Cria o visual da Tabela para o Lado Direito
                const tituloIcon = sizeFloat >= 139.99 ? 'check-circle text-success' : 'exclamation-triangle text-warning';
                const tituloCor = sizeFloat >= 139.99 ? 'text-success border-success' : 'text-warning border-warning';

                htmlTabelaDireita = `
                    <h5 class="${tituloCor} border-bottom pb-3 mb-3"><i class="fas fa-${tituloIcon}"></i> Análisis de Reborn System</h5>
                    <p class="text-light mb-3">Proyección de status para <b>${role.toUpperCase()}</b> con Size <b>${sizeFloat}%</b>:</p>
                    <div class="table-responsive">
                        <table class="table table-dark table-hover table-bordered border-secondary text-center shadow-sm">
                            <thead class="table-active">
                                <tr class="text-info">
                                    <th class="py-2">Status</th>
                                    <th class="py-2">Recibes</th>
                                    <th class="py-2">Pierdes (vs 140%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${linhasTabela}
                            </tbody>
                        </table>
                    </div>
                `;

                if (sizeFloat >= 135 && sizeFloat < 139.99) {
                    conselhos.push(`⚠️ <b>Size débil para Reborn (${sizeFloat}%).</b><br>
                    <span class="text-light">Mira el <b>Motor de Progresión</b> a la derecha para ver la tabla con los stats exactos que pierdes.</span><br>
                    <span class="text-warning small mt-2 d-block">El Guild Master exige llegar a 139.99% o 140%.</span>`);
                    pronto = false;
                }
            } else if (sizeFloat < 135) {
                conselhos.push(`🔴 Size crítico (${sizeFloat}%). Ni lo pienses.`); 
                pronto = false;
            }
        }

        if (cloneStatus !== 'perfect') { 
            conselhos.push(`🔴 Clones Débiles (Necesitas 75/75)`); 
            pronto = false; 
        }

        // --- O TRUQUE: INJETAR NA DIREITA ---
        const painelDireito = document.getElementById('mentorFeedbackArea');
        if (painelDireito && htmlTabelaDireita !== '') {
            painelDireito.innerHTML = htmlTabelaDireita;
        }

        // --- RETORNO NORMAL PARA A ESQUERDA (ALERTA PEQUENO) ---
        if (pronto && sizeFloat >= 139.99) {
            return `<div class="alert alert-success border-success shadow-sm">
                        ✅ <b>¡Listo para un Reborn Perfecto!</b><br>
                        <small>Mira la tabla a la derecha. ¡No pierdes nada de stats! ¡Dale el Reborn!</small>
                    </div>`;
        }

        return `<div class="alert alert-warning shadow-sm">
                    ⚠️ <b>Aún no estás en el punto ideal:</b>
                    <ul class="mb-0 mt-2" style="list-style-type: none; padding-left: 0;">
                        <li>${conselhos.join('</li><li class="mt-2 pt-2 border-top border-secondary">')}</li>
                    </ul>
                </div>`;
    }

    gerarDicaAvancada(stat, role, nivel_exigido) {
        if (!this.gearTierList || !this.gearTierList[role]) return "Mejora tu gear.";
        
        const gearMeta = this.gearTierList[role][nivel_exigido];
        if (!gearMeta) return "Haz upgrades generales.";

        if (stat === 'HP') {
            return `<b>Concéntrate en HP:</b> Necesitas el <i>${gearMeta.ring}</i> o el <i>${gearMeta.neck}</i> con stats perfectos para pasar este nivel.`;
        }
        if (stat === 'HT') {
            return `<b>Falta Hit Rate:</b> Intenta conseguir el <i>${gearMeta.earring}</i> o la <i>${gearMeta.brace}</i> con los stats: <br><span class="text-info">${gearMeta.stats_brace}</span>`;
        }
        if (stat === 'CT' || stat === 'CD') {
            return `<b>Falta Daño Crítico:</b> Verifica si tu collar es el <i>${gearMeta.neck}</i> con los stats: <span class="text-warning">${gearMeta.stats_neck}</span>`;
        }
        if (stat === 'DE') {
            return `<b>Supervivencia:</b> Como Tank, debes buscar la <i>${gearMeta.brace}</i> y concentrarte en estos stats: <span class="text-success">${gearMeta.stats_brace}</span>`;
        }
        return "Haz upgrades generales a tu Gear.";
    }

    analisarProgresso(role, stats, gearInfo) {
        if (!this.dungeonsData.length) return `<div class="alert alert-info">Cargando datos...</div>`;

        let aprovadas = [];
        let quase = [];
        let bloqueadas = [];

        this.dungeonsData.forEach(dung => {
            const reqs = dung.roles[role];
            if (!reqs) return; 

            let falhas = [];
            let dicas = [];
            
            const dungTier = reqs.gear_nivel ? parseInt(reqs.gear_nivel) : 1;
            let gearFailsCount = 0;

            const pecas = [
                { nome: "Anillo", key: "ring", jsonKey: "ring" },
                { nome: "Collar", key: "neck", jsonKey: "neck" },
                { nome: "Arete", key: "earring", jsonKey: "earring" },
                { nome: "Pulsera", key: "brace", jsonKey: "brace" }
            ];

            pecas.forEach(peca => {
                const playerTier = gearInfo[peca.key].tier;
                const playerQual = gearInfo[peca.key].qual;

                if (playerTier < dungTier) {
                    gearFailsCount++;
                    falhas.push(`${peca.nome} Lv${playerTier}`);
                    if (this.gearTierList && this.gearTierList[role] && this.gearTierList[role][dungTier]) {
                        const itemIdeial = this.gearTierList[role][dungTier][peca.jsonKey];
                        dicas.push(`<b>Upgrade de ${peca.nome}:</b> Necesitas el <i>${Array.isArray(itemIdeial) ? itemIdeial[0] : itemIdeial}</i> (Lv ${dungTier}).`);
                    }
                } 
                else if (playerQual !== 'perfect' && this.gearTierList && this.gearTierList[role] && this.gearTierList[role][playerTier]) {
                    const statsIdeais = this.gearTierList[role][playerTier][`stats_${peca.jsonKey}`];
                    dicas.push(`<b>Reroll en el ${peca.nome}:</b> Tu ítem es bueno, pero necesitas estos stats: <span class="text-info">${statsIdeais}</span>.`);
                }
            });

            const checarStat = (nomeStat, valorUser, valorReq, tagStat) => {
                if (valorReq && valorUser < valorReq) {
                    falhas.push(`${nomeStat}: -${(valorReq - valorUser).toLocaleString('es-ES')}`);
                    
                    if (window.dmwTracker && window.dmwTracker.seals) {
                        const recomendados = window.dmwTracker.seals.obterRecomendacoesParaFarm(tagStat, 2);
                        if (recomendados.length > 0) {
                            let recHtml = recomendados.map(r => `<i>${r.nome}</i> (${r.localizacao.split(' | ')[0]})`).join(', ');
                            dicas.push(`<b>Farmea ${tagStat} Seals:</b> Concéntrate en ${recHtml}. <a href="#" class="text-primary text-decoration-none ms-1" onclick="window.switchToTab('seals'); return false;">[Abrir Seals]</a>`);
                        }
                    }
                }
            };

            checarStat('HP', stats.hp, reqs.hp_minimo, 'HP');
            checarStat('HT', stats.ht, reqs.hit_minimo, 'HT');
            checarStat('DE', stats.de, reqs.de_minimo, 'DE');
            
            if (reqs.ct_minimo && stats.ct < reqs.ct_minimo) falhas.push(`CT: -${reqs.ct_minimo - stats.ct}%`);

            if (falhas.length === 0 && gearFailsCount === 0) {
                aprovadas.push(`
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="text-light"><b>${dung.nome}</b></span>
                        <button class="btn btn-sm btn-success py-0 px-2 fw-bold" onclick="window.switchToTab('codex'); window.abrirGuiaCodex('${dung.id}')"><i class="fas fa-book-open"></i> Guía</button>
                    </div>
                `);
            } else {
                let muitoLonge = false;
                if (reqs.hp_minimo && (reqs.hp_minimo - stats.hp) > 15000) muitoLonge = true;
                if (gearFailsCount > 1) muitoLonge = true;

                const msgFalhas = falhas.join(' | ');
                const dicasExibidas = dicas.slice(0, 2).map(d => `<li><i class="fas fa-caret-right text-secondary"></i> ${d}</li>`).join('');

                if (muitoLonge || falhas.length > 2) {
                    bloqueadas.push(`
                        <b class="text-light">${dung.nome}</b><br>
                        <span class="badge bg-danger mb-1 mt-1">Falta: ${msgFalhas}</span><br>
                        <ul class="text-muted small mt-1 mb-0" style="list-style-type: none; padding-left: 0;">${dicasExibidas}</ul>
                    `);
                } else {
                    quase.push(`
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <b class="text-light">${dung.nome}</b><br>
                                <span class="badge bg-warning text-dark mb-1 mt-1">Ajustar: ${msgFalhas}</span><br>
                                <ul class="text-muted small mt-1 mb-0" style="list-style-type: none; padding-left: 0;">${dicasExibidas}</ul>
                            </div>
                            <button class="btn btn-sm btn-outline-warning py-0 px-2 mt-1" onclick="window.switchToTab('codex'); window.abrirGuiaCodex('${dung.id}')">Tácticas</button>
                        </div>
                    `);
                }
            }
        });

        let html = `<h5 class="mb-4 border-bottom border-secondary pb-3 text-warning"><i class="fas fa-map-signs"></i> Tu Roadmap de End-Game</h5>`;
        if (aprovadas.length) html += `<div class="p-3 bg-dark border border-success rounded mb-4 shadow-sm"><h6 class="text-success m-0 mb-3 fw-bold"><i class="fas fa-check-circle"></i> Dungeons Listas para Hacer</h6><ul class="mb-0 mt-1 small" style="list-style-type: none; padding-left: 0;"><li>${aprovadas.join('</li><li class="mt-3 border-top border-secondary pt-3">')}</li></ul></div>`;
        if (quase.length) html += `<div class="p-3 bg-dark border border-warning rounded mb-4 shadow-sm"><h6 class="text-warning m-0 mb-3 fw-bold"><i class="fas fa-exclamation-triangle"></i> Casi Listo (Requieren Ajustes)</h6><ul class="mb-0 mt-1 small" style="list-style-type: none; padding-left: 0;"><li>${quase.join('</li><li class="mt-3 border-top border-secondary pt-3">')}</li></ul></div>`;
        if (bloqueadas.length) html += `<div class="p-3 bg-dark border border-danger rounded mb-2 shadow-sm"><h6 class="text-danger m-0 mb-3 fw-bold"><i class="fas fa-lock"></i> End-Game Lejano</h6><ul class="mb-0 mt-1 small" style="list-style-type: none; padding-left: 0;"><li>${bloqueadas.join('</li><li class="mt-3 border-top border-secondary pt-3">')}</li></ul></div>`;

        return html;
    }
}