import { Moedas } from './moedas.js';
import { Eggs } from './eggs.js';
import { ToursManager } from './tours.js';
import { DataManager } from './data_manager.js';
import { DungeonManager } from './dungeons.js';
import { ChartsManager } from './charts.js';

class DMWTracker {
    constructor() {
        console.log("🔧 Iniciando DMW Tracker...");
        // Inicializar módulos
        this.moedas = new Moedas();
        this.eggs = new Eggs();
        this.tours = new ToursManager();
        this.dungeons = new DungeonManager();
        this.dataManager = new DataManager();
        this.charts = new ChartsManager();

        // Configurar Callbacks
        this.moedas.setOnChangeCallback(() => this.atualizarDashboard());
        this.eggs.setOnChangeCallback(() => this.atualizarDashboard());
        this.tours.setOnChangeCallback(() => this.atualizarDashboard());

        this.inicializar();
    }

    inicializar() {
        this.inicializarEventos();
        
        // Pequeno delay para garantir que o DOM está pronto antes do primeiro update
        setTimeout(() => {
            this.atualizarDashboard();
        }, 100);
        
        // Loop de atualização (60s)
        setInterval(() => this.atualizarDashboard(), 60000);
        console.log("✅ DMW Tracker pronto e a rodar!");
    }

    inicializarEventos() {
        // --- MOEDAS ---
        const btnCalcular = document.getElementById('calcularBtn');
        if (btnCalcular) {
            btnCalcular.addEventListener('click', () => this.moedas.calcularGanhos());
        }

        // --- EGGS ---
        const btnAddEgg = document.getElementById('adicionarEgg');
        if (btnAddEgg) btnAddEgg.addEventListener('click', () => this.eggs.adicionarEgg());
        
        const btnCopiar = document.getElementById('copiarParaDepois');
        if (btnCopiar) btnCopiar.addEventListener('click', () => this.eggs.copiarParaDepois());
        
        const inputQtdEgg = document.getElementById('quantidadeEgg');
        if (inputQtdEgg) {
            inputQtdEgg.addEventListener('keypress', e => { 
                if(e.key === 'Enter') this.eggs.adicionarEgg(); 
            });
        }

        // --- TOURS (AQUI ESTAVA O PROBLEMA POTENCIAL) ---
        
        // 1. Botão de Registrar Tour (Histórico)
        const btnRegTour = document.getElementById('registrarTourBtn');
        if (btnRegTour) {
            btnRegTour.addEventListener('click', () => {
                console.log("🖱️ Clique: Registrar Tour");
                const tipo = document.getElementById('tipoTourRegistrar').value;
                const tera = parseFloat(document.getElementById('teraGanho').value) || 0;
                const detalhes = document.getElementById('detalhesTour').value;
                const seals = parseInt(document.getElementById('sealsTour').value) || 0;
                
                this.tours.registrarTour(tipo, tera, detalhes, seals);
            });
        } else {
            console.warn("⚠️ Botão 'registrarTourBtn' não encontrado no HTML");
        }

        // 2. Botão de Adicionar Horário (Timer)
        const btnAddHorario = document.getElementById('adicionarHorarioBtn');
        if (btnAddHorario) {
            btnAddHorario.addEventListener('click', () => {
                console.log("🖱️ Clique: Adicionar Horário");
                const tipo = document.getElementById('tipoTour').value;
                const horario = document.getElementById('horarioTour').value;
                
                if (!horario) {
                    alert("Por favor, escolhe um horário!");
                    return;
                }

                this.tours.adicionarHorario(tipo, horario);
            });
        } else {
            console.warn("⚠️ Botão 'adicionarHorarioBtn' não encontrado no HTML");
        }
    }

    atualizarDashboard() {
        try {
            // --- ATUALIZAÇÃO SEGURA DAS MOEDAS ---
            // Tenta ir buscar o elemento original para ler o texto (compatibilidade)
            const moedasGanhos = document.getElementById('resultadoGanhos');
            const moedasDash = document.getElementById('resultadoGanhosDash');

            // Se tiveres o método novo na classe Moedas, usa este:
            // const dados = this.moedas.getDadosAtuais(); 
            // if (moedasDash) moedasDash.textContent = `${dados.totalTera}T...`;

            // Caso contrário, usa o método antigo (DOM scraping) mas com segurança:
            if(moedasGanhos && moedasDash) {
                moedasDash.textContent = moedasGanhos.textContent;
                moedasDash.className = moedasGanhos.className;
            }

            // --- EGGS ---
            this.eggs.atualizarCalculadoraEggs();
            const totalEggsElem = document.getElementById('totalEggsConsolidado');
            const totalEggsDash = document.getElementById('totalEggsDash');
            
            if (totalEggsElem && totalEggsDash) {
                totalEggsDash.textContent = totalEggsElem.textContent;
            }

            // --- TOURS ---
            this.tours.atualizarProximosTours();
            this.tours.atualizarHistoricoTours();

            // --- GRÁFICOS ---
            this.charts.atualizar(this.eggs, this.tours, this.dungeons);

            // --- CÓDIGO NOVO: CÁLCULO DO PATRIMÓNIO (NET WORTH) ---
        
        // 1. Total dos Eggs (está em Bits, convertemos para Tera)
        // Nota: this.eggs.eggs é o array de ovos dentro da classe Eggs
            const eggsTera = this.eggs.eggs.reduce((acc, e) => acc + e.total, 0) / 1000000;

        // 2. Total das Dungeons (está em Bits, convertemos para Tera)
            const dungeonsTera = this.dungeons.runs.reduce((acc, r) => acc + r.lucro, 0) / 1000000;

        // 3. Total dos Tours (já está em Tera no histórico)
            const toursTera = this.tours.config.historico.reduce((acc, t) => acc + t.tera, 0);

        // 4. Moedas Atuais (O valor "Depois" da aba Moedas, se tiver algo lá)
        // Vamos tentar ler o input "depoisTera" se ele existir, senão assumimos 0
            const inputTera = parseFloat(document.getElementById('depoisTera')?.value) || 0;
        // (Simplificando: vamos somar apenas os Teras "na mão" para o Net Worth não ficar maluco com M/B)

        // 5. Soma Tudo
            const totalGeral = eggsTera + dungeonsTera + toursTera + inputTera;

        // 6. Atualiza o HTML
            const elNetWorth = document.getElementById('totalNetWorth');
            if (elNetWorth) {
                // Formata para ficar bonito (ex: 15.4T)
                elNetWorth.innerText = `${totalGeral.toLocaleString('pt-PT', { maximumFractionDigits: 1 })}T`;
            }

        } catch (error) {
            console.error("❌ Erro ao atualizar dashboard:", error);
        }
    }
}

// Inicialização Global
document.addEventListener('DOMContentLoaded', () => { 
    window.dmwTracker = new DMWTracker(); 
});