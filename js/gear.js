export class GearManager {
    constructor() {
        this.gearData = null;
    }

    async inicializar() {
        try {
            const res = await fetch('./data/gear_tierlist.json');
            this.gearData = await res.json();
            this.renderizarGuias();
            console.log("💍 ¡Guía de Joyería Renderizada!");
        } catch (e) {
            console.error("Error al cargar JSON para la Guía de Joyería", e);
        }
    }

    renderizarGuias() {
        const container = document.getElementById('guiaJoalhariaContainer');
        if (!container) return;

        let html = '<ul class="nav nav-pills justify-content-center mb-4 gap-3" id="gearTabs" role="tablist">';

        const roles = [
            { id: 'sk', fallback: 'skill', nome: 'SKILL (SK)', icone: 'fa-fire', cor: 'danger' },
            { id: 'aa', fallback: 'aa', nome: 'AUTO-ATTACK (AA)', icone: 'fa-fist-raised', cor: 'primary' },
            { id: 'ta', fallback: 'tank', nome: 'TANK (TA)', icone: 'fa-shield-alt', cor: 'success' }
        ];

        roles.forEach((r, index) => {
            const isActive = index === 0 ? 'active' : '';
            html += `
            <li class="nav-item" role="presentation">
                <button class="nav-link btn-neon-${r.cor} ${isActive}" id="tab-${r.id}" data-bs-toggle="pill" data-bs-target="#pane-${r.id}" type="button" role="tab">
                    <i class="fas ${r.icone} me-2"></i> ${r.nome}
                </button>
            </li>`;
        });
        
        html += `</ul><div class="tab-content" id="gearTabsContent">`;

        roles.forEach((r, index) => {
            const roleData = this.gearData[r.id] || this.gearData[r.fallback] || this.gearData[r.id.toUpperCase()];
            const isShow = index === 0 ? 'show active' : '';

            html += `<div class="tab-pane fade ${isShow}" id="pane-${r.id}" role="tabpanel">
                        <div class="row g-4">`;

            if (roleData) {
                Object.keys(roleData).sort().forEach(tierNum => {
                    const info = roleData[tierNum];
                    
                    html += `
                    <div class="col-xl-6 col-12">
                        <div class="card h-100">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <span><i class="fas fa-level-up-alt text-warning me-2"></i> ${info.tier_name}</span>
                            </div>
                            <div class="card-body">
                                <div class="row g-3 h-100">
                                    ${this.gerarCardAcessorio('Anillo', info.ring, info.stats_ring)}
                                    ${this.gerarCardAcessorio('Collar', info.neck, info.stats_neck)}
                                    ${this.gerarCardAcessorio('Arete', info.earring, info.stats_earring)}
                                    ${this.gerarCardAcessorio('Pulsera', info.brace, info.stats_brace)}
                                </div>
                            </div>
                        </div>
                    </div>`;
                });
            } else {
                html += `<div class="col-12"><div class="alert alert-danger">Error: Datos para ${r.nome} no encontrados en el JSON.</div></div>`;
            }
            html += `</div></div>`;
        });

        html += `</div>`;
        container.innerHTML = html;
    }

    gerarCardAcessorio(tipo, nome, stats) {
        if (!nome || !stats) return '';
        const nomeStr = Array.isArray(nome) ? nome.join(' <br><span class="text-muted small">O</span> ') : nome;
        
        return `
        <div class="col-md-6">
            <div class="p-3 border border-secondary rounded h-100" style="background-color: rgba(0,0,0,0.2);">
                <span class="text-muted fw-bold d-block mb-2" style="font-size: 0.75rem; text-transform: uppercase;">
                    ${tipo}
                </span>
                <div class="text-light fw-bold mb-2" style="font-size: 0.9rem;">${nomeStr}</div>
                <div class="text-info mt-auto" style="font-size: 0.8rem;">${stats}</div>
            </div>
        </div>`;
    }
}