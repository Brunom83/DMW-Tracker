import { Moedas } from './moedas.js';
import { Eggs } from './eggs.js';
import { ToursManager } from './tours.js';
import { DataManager } from './data_manager.js';
import { DungeonManager } from './dungeons.js';
import { ChartsManager } from './charts.js';

class DMWTracker {
    constructor() {
        // Inicializar módulos
        this.moedas = new Moedas();
        this.eggs = new Eggs();
        this.tours = new ToursManager();
        this.dungeons = new DungeonManager(); // <--- INICIAR
        this.dataManager = new DataManager();
        this.charts = new ChartsManager();

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

        // Eggs (ATUALIZADO PARA O NOVO VISUAL)
        this.eggs.atualizarCalculadoraEggs();
        const totalEggsTexto = document.getElementById('totalEggsConsolidado').textContent;
        document.getElementById('totalEggsDash').textContent = totalEggsTexto;

        // Atualiza Tours no Dashboard
        this.tours.atualizarProximosTours();
        this.tours.atualizarHistoricoTours();

        // <--- NOVO: Atualizar Gráficos
        this.charts.atualizar(this.eggs, this.tours, this.dungeons);
    }
}

// Inicialização Global
document.addEventListener('DOMContentLoaded', () => { 
    window.dmwTracker = new DMWTracker(); 
});