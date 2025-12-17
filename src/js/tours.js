<<<<<<< HEAD
export class ToursManager {
    constructor() {
        this.horarios = JSON.parse(localStorage.getItem('tours_horarios')) || [];
        this.historico = JSON.parse(localStorage.getItem('tours_historico')) || [];
        this.onChange = null;
    }

    setOnChangeCallback(callback) {
        this.onChange = callback;
    }

    salvar() {
        localStorage.setItem('tours_horarios', JSON.stringify(this.horarios));
        localStorage.setItem('tours_historico', JSON.stringify(this.historico));
        if (this.onChange) this.onChange();
    }

    adicionarHorario(tipo, horario) {
        if (!horario) return alert("Defina um horário válido!");
        this.horarios.push({ tipo, horario });
        this.salvar();
        this.atualizarListaHorarios();
    }

    registrarTour(tipo, tera, detalhes, seals) {
        const data = new Date().toLocaleString();
        this.historico.push({ tipo, tera, detalhes, seals, data });
        this.salvar();
        this.atualizarHistoricoTours();
        alert("Tour registado com sucesso!");
    }

    atualizarListaHorarios() {
        const container = document.getElementById('listaHorarios');
        if (!container) return;

        container.innerHTML = this.horarios.map((t, i) => `
            <div class="d-flex justify-content-between align-items-center bg-dark p-2 mb-1 rounded">
                <span>${t.tipo === 'forest' ? '🌲 Forest' : '🙏 Bless'} - ${t.horario}</span>
                <button class="btn btn-sm btn-danger" onclick="dmwTracker.tours.removerHorario(${i})">🗑</button>
            </div>
        `).join('');
    }

    removerHorario(index) {
        this.horarios.splice(index, 1);
        this.salvar();
        this.atualizarListaHorarios();
    }

    atualizarProximosTours() {
        const container = document.getElementById('proximosTours');
        const dashContainer = document.getElementById('proximosToursDashboard');
        if (!container || !dashContainer) return;

        const agora = new Date();
        const proximos = this.horarios
            .map(h => {
                const [hora, minuto] = h.horario.split(':').map(Number);
                const dataTour = new Date();
                dataTour.setHours(hora, minuto, 0, 0);
                if (dataTour < agora) dataTour.setDate(dataTour.getDate() + 1);
                return { ...h, data: dataTour };
            })
            .sort((a, b) => a.data - b.data)
            .slice(0, 3);

        const html = proximos.length
            ? proximos.map(t => `<div>${t.tipo === 'forest' ? '🌲' : '🙏'} ${t.horario}</div>`).join('')
            : '<p class="text-muted">Nenhum tour agendado</p>';

        container.innerHTML = html;
        dashContainer.innerHTML = html;
    }

    atualizarHistoricoTours() {
        const container = document.getElementById('historicoTours');
        const dashContainer = document.getElementById('historicoToursDashboard');
        if (!container || !dashContainer) return;

        const html = this.historico.length
            ? this.historico.map((t, i) => `
                <div class="bg-dark p-2 mb-1 rounded">
                    <strong>${t.tipo === 'forest' ? '🌲 Forest' : '🙏 Bless'}:</strong>
                    ${t.tera}T, ${t.seals} seals - ${t.detalhes || ''} 
                    <small class="text-muted">(${t.data})</small>
                    <button class="btn btn-sm btn-danger float-end" onclick="dmwTracker.tours.removerTour(${i})">🗑</button>
                </div>
            `).join('')
            : '<p class="text-muted">Sem histórico registado</p>';

        container.innerHTML = html;
        dashContainer.innerHTML = html + `
            <button class="btn btn-sm btn-outline-danger mt-2" onclick="dmwTracker.tours.limparHistorico()">🧹 Limpar Histórico</button>
        `;
    }

    removerTour(index) {
        this.historico.splice(index, 1);
        this.salvar();
        this.atualizarHistoricoTours();
    }

    limparHistorico() {
        if (!confirm("Tens a certeza que queres apagar todo o histórico?")) return;
        this.historico = [];
        this.salvar();
        this.atualizarHistoricoTours();
    }
}
=======
// js/tours.js
export class ToursManager {
    constructor() {
        this.toursConfig = this.carregarConfig();
        this.inicializar();
    }

    inicializar() {
        this.atualizarListaHorarios();
        this.atualizarProximosTours();
        this.atualizarHistoricoTours();

        // Atualiza próximos tours a cada minuto
        setInterval(() => this.atualizarProximosTours(), 60000);
    }

    // Carregar config do localStorage
    carregarConfig() {
        const config = localStorage.getItem('dmwToursConfig');
        return config ? JSON.parse(config) : { horarios: { forest: [], bless: [] }, historico: [] };
    }

    salvarConfig() {
        localStorage.setItem('dmwToursConfig', JSON.stringify(this.toursConfig));
    }

    adicionarHorario(tipo, horarioStr) {
        if (!horarioStr) return;
        const [hours, minutes] = horarioStr.split(':').map(Number);
        const horarioObj = { hours, minutes, tipo, id: Date.now() };
        if (!this.toursConfig.horarios[tipo]) this.toursConfig.horarios[tipo] = [];
        this.toursConfig.horarios[tipo].push(horarioObj);
        this.salvarConfig();
        this.atualizarListaHorarios();
        this.atualizarProximosTours();
    }

    removerHorario(tipo, id) {
        if (this.toursConfig.horarios[tipo]) {
            this.toursConfig.horarios[tipo] = this.toursConfig.horarios[tipo].filter(h => h.id !== id);
            this.salvarConfig();
            this.atualizarListaHorarios();
            this.atualizarProximosTours();
        }
    }

    registrarTour(tipo, teraGanho, details, seals) {
        const tourData = {
            tipo,
            tera: teraGanho,
            details,
            seals,
            data: new Date().toLocaleString('pt-PT'),
            timestamp: Date.now()
        };
        this.toursConfig.historico.unshift(tourData);
        if (this.toursConfig.historico.length > 50) this.toursConfig.historico = this.toursConfig.historico.slice(0, 50);
        this.salvarConfig();
        this.atualizarHistoricoTours();
    }

    atualizarListaHorarios() {
        const lista = document.getElementById('listaHorarios');
        if (!lista) return;
        let html = '<h6>Horários Configurados:</h6>';
        let temHorarios = false;

        Object.keys(this.toursConfig.horarios).forEach(tipo => {
            if (this.toursConfig.horarios[tipo].length > 0) {
                temHorarios = true;
                const tipoNome = tipo === 'forest' ? '🌲 Forest Tour' : '🙏 Bless Tour';
                html += `<div class="mb-2"><strong>${tipoNome}:</strong><br>`;
                this.toursConfig.horarios[tipo].forEach(horario => {
                    const horaFormatada = `${horario.hours.toString().padStart(2,'0')}:${horario.minutes.toString().padStart(2,'0')}`;
                    html += `<span class="badge bg-secondary me-1 mb-1">${horaFormatada} 
                             <button class="btn btn-sm btn-outline-light ms-1" onclick="toursManager.removerHorario('${tipo}', ${horario.id})">×</button></span>`;
                });
                html += '</div>';
            }
        });

        if (!temHorarios) html = '<p class="text-muted">Nenhum horário configurado...</p>';
        lista.innerHTML = html;
    }

    atualizarProximosTours() {
        const container = document.getElementById('proximosTours');
        if (!container) return;

        const agora = new Date();
        const agoraMinutos = agora.getHours() * 60 + agora.getMinutes();
        let proximos = [];

        Object.keys(this.toursConfig.horarios).forEach(tipo => {
            this.toursConfig.horarios[tipo].forEach(horario => {
                let diff = horario.hours * 60 + horario.minutes - agoraMinutos;
                if (diff < 0) diff += 1440;
                proximos.push({ tipo, horario: `${horario.hours.toString().padStart(2,'0')}:${horario.minutes.toString().padStart(2,'0')}`, minutosFaltando: diff });
            });
        });

        proximos.sort((a,b) => a.minutosFaltando - b.minutosFaltando);

        let html = '';
        if (proximos.length > 0) {
            html += '<div class="list-group">';
            proximos.slice(0,3).forEach(tour => {
                const tipoNome = tour.tipo === 'forest' ? '🌲 Forest' : '🙏 Bless';
                const h = Math.floor(tour.minutosFaltando/60);
                const m = tour.minutosFaltando % 60;
                html += `<div class="list-group-item d-flex justify-content-between">
                            <span>${tipoNome}</span>
                            <small>${h>0? h+'h ':' '}${m}m</small>
                         </div>`;
            });
            html += '</div>';
        } else html = '<p class="text-muted mb-0">Nenhum tour configurado...</p>';

        container.innerHTML = html;
    }

    atualizarHistoricoTours() {
        const container = document.getElementById('historicoTours');
        if (!container) return;

        if (this.toursConfig.historico.length === 0) {
            container.innerHTML = '<p class="text-muted">Nenhum tour registrado ainda...</p>';
            return;
        }

        let html = '<div class="table-responsive"><table class="table table-sm table-striped"><thead><tr><th>Data</th><th>Tour</th><th>Detalhes</th><th>Tera</th><th>Seals</th></tr></thead><tbody>';
        this.toursConfig.historico.slice(0,10).forEach(tour => {
            const tipoNome = tour.tipo === 'forest' ? '🌲 Forest' : '🙏 Bless';
            html += `<tr>
                        <td><small>${tour.data}</small></td>
                        <td>${tipoNome}</td>
                        <td>${tour.details}</td>
                        <td><strong>${tour.tera.toFixed(1)}T</strong></td>
                        <td>${tour.seals}</td>
                     </tr>`;
        });
        html += '</tbody></table></div>';
        container.innerHTML = html;
    }
}

// Tornar global para index.html
window.toursManager = new ToursManager();
>>>>>>> 454285409cb1d136100e634b8c26f292f45eea12
