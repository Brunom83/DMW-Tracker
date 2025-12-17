<<<<<<< HEAD
import { Moedas } from './moedas.js';
import { Eggs } from './eggs.js';
import { ToursManager } from './tours.js';

class DMWTracker {
    constructor() {
        this.moedas = new Moedas();
        this.eggs = new Eggs();
        this.tours = new ToursManager();

        this.moedas.setOnChangeCallback(() => this.atualizarDashboard());
        this.eggs.setOnChangeCallback(() => this.atualizarDashboard());
        this.tours.setOnChangeCallback(() => this.atualizarDashboard());

        this.inicializar();
    }

    inicializar() {
        this.inicializarEventos();
        this.atualizarDashboard();
    }

    inicializarEventos() {
        document.getElementById('calcularBtn')?.addEventListener('click', () => this.moedas.calcularGanhos());
        document.getElementById('adicionarEgg')?.addEventListener('click', () => this.eggs.adicionarEgg());
        document.getElementById('copiarParaDepois')?.addEventListener('click', () => this.eggs.copiarParaDepois());
        document.getElementById('quantidadeEgg')?.addEventListener('keypress', e => { if(e.key==='Enter') this.eggs.adicionarEgg(); });
        document.getElementById('registrarTourBtn')?.addEventListener('click', () => {
            const tipo = document.getElementById('tipoTourRegistrar').value;
            const tera = parseFloat(document.getElementById('teraGanho').value) || 0;
            const detalhes = document.getElementById('detalhesTour').value;
            const seals = parseInt(document.getElementById('sealsTour').value) || 0;
            this.tours.registrarTour(tipo, tera, detalhes, seals);
        });
        document.getElementById('adicionarHorarioBtn')?.addEventListener('click', () => {
            const tipo = document.getElementById('tipoTour').value;
            const horario = document.getElementById('horarioTour').value;
            this.tours.adicionarHorario(tipo, horario);
        });
    }

    atualizarDashboard() {
        document.getElementById('resultadoAntesDash').textContent = document.getElementById('resultadoAntes').textContent;
        document.getElementById('resultadoDepoisDash').textContent = document.getElementById('resultadoDepois').textContent;
        document.getElementById('resultadoGanhosDash').textContent = document.getElementById('resultadoGanhos').textContent;
        this.eggs.atualizarCalculadoraEggs();
        document.getElementById('totalBitsEggsDash').textContent = document.getElementById('totalBitsEggs').textContent;
        document.getElementById('totalMegaEggsDash').textContent = document.getElementById('totalMegaEggs').textContent;
        document.getElementById('totalTeraEggsDash').textContent = document.getElementById('totalTeraEggs').textContent;
        this.tours.atualizarProximosTours();
        this.tours.atualizarHistoricoTours();
    }
}

document.addEventListener('DOMContentLoaded', () => { window.dmwTracker = new DMWTracker(); });
window.switchToTab = function(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('d-none'));
    const tab = document.getElementById(tabName);
    if(tab) tab.classList.remove('d-none');
};
=======
// js/app.js
import { Moedas } from './moedas.js';
import { Eggs } from './eggs.js';
import { ToursManager } from './tours.js';

class DMWTracker {
    constructor() {
        this.eggs = [];
        this.tours = window.toursManager; // link para ToursManager
        this.inicializar();
    }

    atualizarDashboard() {
        this.atualizarGanhosMoedasDashboard();
        this.atualizarEggsDashboard();
        this.atualizarProximosToursDashboard();
        this.atualizarHistoricoToursDashboard();
    }
    
    // Moedas
    atualizarGanhosMoedasDashboard() {
        document.getElementById('resultadoAntesDash').textContent = document.getElementById('resultadoAntes').textContent;
        document.getElementById('resultadoDepoisDash').textContent = document.getElementById('resultadoDepois').textContent;
        document.getElementById('resultadoGanhosDash').textContent = document.getElementById('resultadoGanhos').textContent;
    }
    
    // Eggs
    atualizarEggsDashboard() {
        document.getElementById('totalBitsEggsDash').textContent = document.getElementById('totalBitsEggs').textContent;
        document.getElementById('totalMegaEggsDash').textContent = document.getElementById('totalMegaEggs').textContent;
        document.getElementById('totalTeraEggsDash').textContent = document.getElementById('totalTeraEggs').textContent;
    }
    
    // Próximos Tours
    atualizarProximosToursDashboard() {
        const container = document.getElementById('proximosToursDashboard');
        container.innerHTML = document.getElementById('proximosTours').innerHTML;
    }
    
    // Histórico resumido
    atualizarHistoricoToursDashboard() {
        const container = document.getElementById('historicoToursDashboard');
        container.innerHTML = document.getElementById('historicoTours').innerHTML;
    }
    

    inicializar() {
        this.carregarDados();
        this.inicializarEventos();
        this.atualizarCalculadoraEggs();
        this.atualizarDashboard();
        setInterval(() => this.atualizarDashboard(), 60000);
    }

    inicializarEventos() {
        // Botões de moedas e eggs
        this.addEventListener('calcularBtn','click',()=>this.calcularGanhos());
        this.addEventListener('adicionarEgg','click',()=>this.adicionarEgg());
        this.addEventListener('quantidadeEgg','keypress',(e)=>{ if(e.key==='Enter') this.adicionarEgg(); });
        this.addEventListener('copiarParaDepois','click',()=>this.copiarParaDepois());
        this.addEventListener('adicionarHorarioBtn','click',() => {
            const tipo = document.getElementById('tipoTour').value;
            const horario = document.getElementById('horarioTour').value;
            this.tours.adicionarHorario(tipo, horario);
        });
        
        this.addEventListener('registrarTourBtn','click',() => {
            const tipo = document.getElementById('tipoTourRegistrar').value;
            const tera = parseFloat(document.getElementById('teraGanho').value) || 0;
            const detalhes = document.getElementById('detalhesTour').value;
            const seals = parseInt(document.getElementById('sealsTour').value) || 0;
            this.tours.registrarTour(tipo, tera, detalhes, seals);
        });
    }

    addEventListener(id, evento, callback) {
        const el = document.getElementById(id);
        if(el) el.addEventListener(evento, callback);
    }    

    atualizarDashboard() {
        this.atualizarResumoDia();
        this.tours.atualizarProximosTours(); // mostra próximos tours no dashboard
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.dmwTracker = new DMWTracker();
});

window.switchToTab = function(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('d-none'));
    const tab = document.getElementById(tabName);
    if(tab) tab.classList.remove('d-none');
};

>>>>>>> 454285409cb1d136100e634b8c26f292f45eea12
