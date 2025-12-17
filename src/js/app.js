import { Moedas } from './moedas.js';
import { Eggs } from './eggs.js';
import { ToursManager } from './tours.js';

class DMWTracker {
    constructor() {
        // Inicializar módulos
        this.moedas = new Moedas();
        this.eggs = new Eggs();
        this.tours = new ToursManager();

        // Configurar Callbacks (Quando os dados mudam, atualiza o Dashboard)
        this.moedas.setOnChangeCallback(() => this.atualizarDashboard());
        this.eggs.setOnChangeCallback(() => this.atualizarDashboard());
        this.tours.setOnChangeCallback(() => this.atualizarDashboard());

        this.inicializar();
    }

    inicializar() {
        this.inicializarEventos();
        this.atualizarDashboard();
        
        // Atualiza o dashboard a cada minuto (para os timers dos tours)
        setInterval(() => this.atualizarDashboard(), 60000);
    }

    inicializarEventos() {
        // Eventos de Moedas
        document.getElementById('calcularBtn')?.addEventListener('click', () => this.moedas.calcularGanhos());

        // Eventos de Eggs
        document.getElementById('adicionarEgg')?.addEventListener('click', () => this.eggs.adicionarEgg());
        document.getElementById('copiarParaDepois')?.addEventListener('click', () => this.eggs.copiarParaDepois());
        document.getElementById('quantidadeEgg')?.addEventListener('keypress', e => { 
            if(e.key === 'Enter') this.eggs.adicionarEgg(); 
        });

        // Eventos de Tours
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
        // Atualiza Moedas no Dashboard
        const moedasGanhos = document.getElementById('resultadoGanhos');
        if(moedasGanhos) {
            document.getElementById('resultadoGanhosDash').textContent = moedasGanhos.textContent;
            document.getElementById('resultadoGanhosDash').className = moedasGanhos.className;
        }

        // Atualiza Eggs no Dashboard
        this.eggs.atualizarCalculadoraEggs(); // Garante que o UI está fresco
        document.getElementById('totalBitsEggsDash').textContent = document.getElementById('totalBitsEggs').textContent;
        document.getElementById('totalMegaEggsDash').textContent = document.getElementById('totalMegaEggs').textContent;
        document.getElementById('totalTeraEggsDash').textContent = document.getElementById('totalTeraEggs').textContent;

        // Atualiza Tours no Dashboard
        this.tours.atualizarProximosTours();
        this.tours.atualizarHistoricoTours();
    }
}

// Inicialização Global
document.addEventListener('DOMContentLoaded', () => { 
    window.dmwTracker = new DMWTracker(); 
});

// Helper Global para as Tabs
window.switchToTab = function(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('d-none'));
    const tab = document.getElementById(tabName);
    if(tab) tab.classList.remove('d-none');
};