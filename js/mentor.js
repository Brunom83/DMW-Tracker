export class MentorDMW {
    constructor() {
        this.regrasReborn = null;
        this.dungeonsData = [];
        this.gearTierList = null; 

        this.carregarDadosBase();
        this.carregarDungeons();
        this.carregarGear();
    }

    async carregarDadosBase() {
        try {
            const res = await fetch('./data/reborn_final.json');
            if (!res.ok) throw new Error("Archivo no encontrado");
            const dados = await res.json();
            this.regrasReborn = dados[0].requisitos_logicos;
        } catch (e) {
            this.regrasReborn = { min_level: 120, min_size_percent: 139.9, clone_stats: "75/75" };
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

    analisarDigimon(level, size, cloneStatus) {
        if (!this.regrasReborn) return `<div class="alert alert-info">Leyendo datos...</div>`;
        
        // Vai buscar o Role selecionado
        const roleDropdown = document.getElementById('statRole');
        const role = roleDropdown ? roleDropdown.value : 'sk'; 
        
        let conselhos = [];
        let pronto = true;

        if (level < this.regrasReborn.min_level) { 
            conselhos.push(`🔴 Falta Nivel (${this.regrasReborn.min_level})`); 
            pronto = false; 
        }

        // --- A LÓGICA DO GUILD MASTER (EM ESPANHOL) ---
        let perdeuStats = "";
        if (size >= 135 && size < 139.9) {
            if (role === 'ta') perdeuStats = "¡estás perdiendo cerca de 4500 HP y 1800 DE!";
            else if (role === 'aa') perdeuStats = "¡estás perdiendo cerca de 2700 HP y 900 AT!";
            else perdeuStats = "¡estás perdiendo miles de HP y Daño en vano!";
            
            conselhos.push(`⚠️ <b>Size débil para Reborn (${size}%).</b> Como eres ${role.toUpperCase()}, ${perdeuStats} El Guild Master recomienda llegar a <b>139.9% o 140%</b>.`);
            pronto = false;
        } else if (size < 135) {
            conselhos.push(`🔴 Size crítico (${size}%). Ni lo pienses.`); 
            pronto = false;
        }

        if (cloneStatus !== 'perfect') { 
            conselhos.push(`🔴 Clones Débiles (Necesitas 75/75)`); 
            pronto = false; 
        }

        if (pronto && size >= 139.9) {
            return `<div class="alert alert-success border-success">
                        ✅ <b>¡Listo para un Reborn Perfecto!</b><br>
                        <small>Con ${size}%, recibirás los bonus máximos para tu clase. ¡Dale!</small>
                    </div>`;
        }

        return `<div class="alert alert-warning">
                    ⚠️ <b>Aún no estás en el punto ideal:</b>
                    <ul class="mb-0 mt-2"><li>${conselhos.join('</li><li class="mt-1">')}</li></ul>
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