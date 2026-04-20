import { Moedas } from './moedas.js';
import { Eggs } from './eggs.js';
import { ToursManager } from './tours.js';
import { DataManager } from './data_manager.js';
import { DungeonManager } from './dungeons.js';
import { ChartsManager } from './charts.js';
import { MentorDMW } from './mentor.js';
import { CodexManager } from './codex.js';
import { GearManager } from './gear.js';
import { SealsManager } from './seals.js';
import { auth, provider, signInWithPopup, signOut, onAuthStateChanged } from './firebase.js';

class DMWTracker {
    constructor() {
        console.log("🔧 Iniciando DMW Tracker...");
        // Iniciar TODO
        this.moedas = new Moedas();
        this.eggs = new Eggs();
        this.tours = new ToursManager();
        this.dungeons = new DungeonManager();
        this.dataManager = new DataManager();
        this.charts = new ChartsManager();
        this.mentor = new MentorDMW(); 
        
        this.codex = new CodexManager(); 
        this.codex.inicializar();

        this.gear = new GearManager();
        this.gear.inicializar();

        this.seals = new SealsManager();
        this.seals.inicializar();

        // Configurar Callbacks
        this.moedas.setOnChangeCallback(() => this.atualizarDashboard());
        this.eggs.setOnChangeCallback(() => this.atualizarDashboard());
        this.tours.setOnChangeCallback(() => this.atualizarDashboard());

        this.inicializar();

        // this.inicializarAuth(); // <-- Descomenta esta línea para activar autenticación con Firebase
    }

    inicializar() {
        this.inicializarEventos();
        setTimeout(() => this.atualizarDashboard(), 100);
        setInterval(() => this.atualizarDashboard(), 60000);
        console.log("✅ ¡DMW Tracker listo y en ejecución!");
    }

    inicializarAuth() {
        const btnLogin = document.getElementById('btnLogin');
        const btnLogout = document.getElementById('btnLogout');

        if (btnLogin) {
            btnLogin.addEventListener('click', async () => {
                try {
                    await signInWithPopup(auth, provider);
                } catch (error) {
                    console.error("❌ Error en el login:", error);
                }
            });
        }

        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                signOut(auth);
            });
        }

        onAuthStateChanged(auth, (user) => {
            const loggedOutView = document.getElementById('loggedOutView');
            const loggedInView = document.getElementById('loggedInView');
            
            if (user) {
                loggedOutView.classList.add('d-none');
                loggedInView.classList.remove('d-none');
                
                const primeiroNome = user.displayName.split(' ')[0]; 
                document.getElementById('userName').textContent = primeiroNome;
                document.getElementById('userPhoto').src = user.photoURL;
                
                console.log(`👤 Bienvenido al sistema, ${user.email}`);
            } else {
                loggedInView.classList.add('d-none');
                loggedOutView.classList.remove('d-none');
                console.log("👻 Navegando como Anónimo.");
            }
        });
    }

    inicializarEventos() {
        // --- MONEDAS E EGGS ---
        const btnCalcular = document.getElementById('calcularBtn');
        if (btnCalcular) btnCalcular.addEventListener('click', () => this.moedas.calcularGanhos());

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
        
        // --- TOURS ---
        const btnRegTour = document.getElementById('registrarTourBtn');
        if (btnRegTour) {
            btnRegTour.addEventListener('click', () => {
                const tipo = document.getElementById('tipoTourRegistrar').value;
                const tera = parseFloat(document.getElementById('teraGanho').value) || 0;
                const detalhes = document.getElementById('detalhesTour').value;
                this.tours.registrarTour(tipo, tera, detalhes, 0); 
            });
        }

        const btnAddHorario = document.getElementById('adicionarHorarioBtn');
        if (btnAddHorario) {
            btnAddHorario.addEventListener('click', () => {
                const tipo = document.getElementById('tipoTour').value;
                const horario = document.getElementById('horarioTour').value;
                if (!horario) { alert("¡Por favor, elige un horario!"); return; }
                this.tours.adicionarHorario(tipo, horario);
            });
        }

        // --- MENTOR DMW ---
        const btnMentor = document.getElementById('btnPedirConselho');
        if (btnMentor) {
            btnMentor.addEventListener('click', () => {
                const lvl = parseInt(document.getElementById('digiLevel').value) || 1;
                const size = parseFloat(document.getElementById('digiSize').value) || 100;
                const clone = document.getElementById('digiClone').value;
                const respostaHTML = this.mentor.analisarDigimon(lvl, size, clone);
                const area = document.getElementById('rebornFeedbackArea');
                if(area) area.innerHTML = respostaHTML;
            });
        }

        const inputsStats = document.querySelectorAll('.save-stat');
        const btnAnalisar = document.getElementById('btnAnalisarMentor');
        
        const atualizarRelatorioMentor = () => {
            const elRole = document.getElementById('statRole');
            if(!elRole) return; 

            const role = elRole.value;
            const gearInfo = {
                ring: { tier: parseInt(document.getElementById('ringTier')?.value) || 1, qual: document.getElementById('ringQual')?.value || 'fraco' },
                neck: { tier: parseInt(document.getElementById('neckTier')?.value) || 1, qual: document.getElementById('neckQual')?.value || 'fraco' },
                earring: { tier: parseInt(document.getElementById('earringTier')?.value) || 1, qual: document.getElementById('earringQual')?.value || 'fraco' },
                brace: { tier: parseInt(document.getElementById('braceTier')?.value) || 1, qual: document.getElementById('braceQual')?.value || 'fraco' }
            };
            
            const stats = {
                hp: parseInt(document.getElementById('statHP').value) || 0,
                ht: parseInt(document.getElementById('statHT').value) || 0,
                ct: parseInt(document.getElementById('statCT').value) || 0,
                cd: parseInt(document.getElementById('statCD').value) || 0,
                de: parseInt(document.getElementById('statDE').value) || 0,
                bl: parseInt(document.getElementById('statBL').value) || 0,
                ev: parseInt(document.getElementById('statEV').value) || 0
            };
            
            const feedback = this.mentor.analisarProgresso(role, stats, gearInfo);
            const area = document.getElementById('mentorFeedbackArea');
            
            if (area) {
                if (stats.hp === 0 && stats.ht === 0) {
                    area.innerHTML = `<div class="text-center text-muted mt-5"><i class="fas fa-keyboard fa-3x mb-3"></i><p>Llena tus stats y haz clic en Validar.</p></div>`;
                } else {
                    area.innerHTML = feedback;
                }
            }
        };

        if (btnAnalisar) btnAnalisar.addEventListener('click', atualizarRelatorioMentor);

        if (inputsStats.length > 0) {
            inputsStats.forEach(input => {
                const savedValue = localStorage.getItem('dmw_' + input.id);
                if (savedValue !== null) input.value = savedValue;
                input.addEventListener('input', (e) => localStorage.setItem('dmw_' + e.target.id, e.target.value));
                input.addEventListener('change', (e) => localStorage.setItem('dmw_' + e.target.id, e.target.value));
            });
            
            setTimeout(() => {
                const savedHp = parseInt(document.getElementById('statHP').value) || 0;
                if(savedHp > 0) atualizarRelatorioMentor();
            }, 300);
        }
    }

    atualizarDashboard() {
        try {
            const moedasGanhos = document.getElementById('resultadoGanhos');
            const moedasDash = document.getElementById('resultadoGanhosDash');
            if(moedasGanhos && moedasDash) {
                moedasDash.textContent = moedasGanhos.textContent;
                moedasDash.className = moedasGanhos.className;
            }

            this.eggs.atualizarCalculadoraEggs();
            const totalEggsElem = document.getElementById('totalEggsConsolidado');
            const totalEggsDash = document.getElementById('totalEggsDash');
            if (totalEggsElem && totalEggsDash) totalEggsDash.textContent = totalEggsElem.textContent;

            this.tours.atualizarProximosTours();
            this.tours.atualizarHistoricoTours();
            this.charts.atualizar(this.eggs, this.tours, this.dungeons);

            const eggsTera = this.eggs.eggs.reduce((acc, e) => acc + e.total, 0) / 1000000;
            const dungeonsTera = this.dungeons.runs.reduce((acc, r) => acc + r.lucro, 0) / 1000000;
            const toursTera = this.tours.config.historico.reduce((acc, t) => acc + t.tera, 0);
            const inputTera = parseFloat(document.getElementById('depoisTera')?.value) || 0;

            const totalGeral = eggsTera + dungeonsTera + toursTera + inputTera;
            const elNetWorth = document.getElementById('totalNetWorth');
            if (elNetWorth) elNetWorth.innerText = `${totalGeral.toLocaleString('pt-PT', { maximumFractionDigits: 1 })}T`;

        } catch (error) {
            console.error("❌ Error al actualizar el dashboard:", error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => { window.dmwTracker = new DMWTracker(); });