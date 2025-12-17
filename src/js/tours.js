export class ToursManager {
    constructor() {
        // Carrega configurações ou inicia defaults
        this.config = JSON.parse(localStorage.getItem('dmwToursConfig')) || { 
            horarios: [], 
            historico: [] 
        };
        this.onChange = null;
    }

    setOnChangeCallback(callback) {
        this.onChange = callback;
    }

    salvar() {
        localStorage.setItem('dmwToursConfig', JSON.stringify(this.config));
        if (this.onChange) this.onChange();
    }

    adicionarHorario(tipo, horarioStr) {
        if (!horarioStr) return alert("Escolha um horário!");
        
        // Guardamos apenas a string "HH:MM", a lógica de data é feita na exibição
        this.config.horarios.push({ 
            tipo, 
            horario: horarioStr, 
            id: Date.now() 
        });
        
        this.config.horarios.sort((a, b) => a.horario.localeCompare(b.horario)); // Ordenar por hora
        this.salvar();
        this.atualizarProximosTours();
    }

    removerHorario(id) {
        this.config.horarios = this.config.horarios.filter(h => h.id !== id);
        this.salvar();
        this.atualizarProximosTours();
    }

    registrarTour(tipo, tera, detalhes, seals) {
        const historicoItem = {
            tipo,
            tera,
            detalhes,
            seals,
            data: new Date().toLocaleString('pt-PT'), // Data legível
            timestamp: Date.now()
        };

        this.config.historico.unshift(historicoItem); // Adiciona no início
        // Manter apenas os últimos 50 registos para poupar espaço
        if (this.config.historico.length > 50) this.config.historico.pop();
        
        this.salvar();
        this.atualizarHistoricoTours();
        alert("Tour registado no histórico!");
    }

    // --- Lógica de Visualização ---

    atualizarProximosTours() {
        const container = document.getElementById('proximosTours');
        const dashContainer = document.getElementById('proximosToursDashboard');
        const listaConfig = document.getElementById('listaHorarios');

        // 1. Atualizar Lista de Configuração (Onde adicionas horários)
        if (listaConfig) {
            listaConfig.innerHTML = this.config.horarios.length ? this.config.horarios.map(h => `
                <div class="d-flex justify-content-between align-items-center bg-dark p-2 mb-1 rounded border border-secondary">
                    <span>${h.tipo === 'forest' ? '🌲' : '🙏'} ${h.horario}</span>
                    <button class="btn btn-sm btn-danger py-0" onclick="window.dmwTracker.tours.removerHorario(${h.id})">×</button>
                </div>
            `).join('') : '<p class="text-muted small">Sem horários configurados.</p>';
        }

        // 2. Calcular "Falta Quanto Tempo?" (Lógica UTC simplificada)
        const agora = new Date();
        const agoraMinutos = (agora.getHours() * 60) + agora.getMinutes();

        const proximos = this.config.horarios.map(h => {
            const [hora, min] = h.horario.split(':').map(Number);
            const tourMinutos = (hora * 60) + min;
            
            let diff = tourMinutos - agoraMinutos;
            if (diff < 0) diff += 1440; // Se já passou hoje, é amanhã (+24h)

            return { ...h, diff };
        }).sort((a, b) => a.diff - b.diff); // Ordenar pelo que está mais perto

        // HTML para Dashboard e Tab Tours
        const htmlProximos = proximos.length ? proximos.slice(0, 3).map(h => {
            const horasFaltam = Math.floor(h.diff / 60);
            const minFaltam = h.diff % 60;
            const tempoStr = horasFaltam > 0 ? `${horasFaltam}h ${minFaltam}m` : `${minFaltam}m`;
            const cor = h.diff < 15 ? 'text-warning fw-bold' : 'text-light'; // Amarelo se faltar menos de 15min

            return `<div class="mb-1 border-bottom border-secondary pb-1">
                ${h.tipo === 'forest' ? '🌲' : '🙏'} <strong>${h.horario}</strong> 
                <span class="float-end ${cor}">em ${tempoStr}</span>
            </div>`;
        }).join('') : '<p class="text-muted">Nenhum tour agendado.</p>';

        if (container) container.innerHTML = htmlProximos;
        if (dashContainer) dashContainer.innerHTML = htmlProximos;
    }

    atualizarHistoricoTours() {
        const container = document.getElementById('historicoTours');
        const dashContainer = document.getElementById('historicoToursDashboard');

        const htmlHistorico = this.config.historico.length ? this.config.historico.map((t, i) => `
            <div class="bg-dark p-2 mb-2 rounded border border-secondary position-relative">
                <div class="d-flex justify-content-between">
                    <strong>${t.tipo === 'forest' ? '🌲 Forest' : '🙏 Bless'}</strong>
                    <span class="text-info">${t.tera}T</span>
                </div>
                <div class="small text-muted">${t.data}</div>
                <div class="small mt-1">
                    ${t.seals > 0 ? `<span class="badge bg-secondary">${t.seals} Seals</span>` : ''} 
                    ${t.detalhes}
                </div>
                <button class="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-1 py-0 px-1" 
                    onclick="window.dmwTracker.tours.removerHistorico(${i})" style="font-size: 0.7rem">×</button>
            </div>
        `).join('') : '<p class="text-muted text-center">Histórico vazio.</p>';

        if (container) container.innerHTML = htmlHistorico;
        // No dashboard mostramos apenas os últimos 3
        if (dashContainer) {
            const resumo = this.config.historico.slice(0, 3);
            dashContainer.innerHTML = resumo.length ? resumo.map(t => 
                `<div class="small mb-1 border-bottom border-secondary pb-1">
                    ${t.tipo === 'forest' ? '🌲' : '🙏'} ${t.tera}T <span class="text-muted float-end">${t.data.split(' ')[1]}</span>
                </div>`
            ).join('') + '<small class="text-muted d-block text-center mt-1">Ver todos na aba Tours</small>' 
            : '<p class="text-muted">Histórico vazio.</p>';
        }
    }

    removerHistorico(index) {
        if(confirm("Apagar este registo?")) {
            this.config.historico.splice(index, 1);
            this.salvar();
            this.atualizarHistoricoTours();
        }
    }
}