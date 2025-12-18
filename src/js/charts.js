import { bitsParaTera } from './utils.js';

export class ChartsManager {
    constructor() {
        this.wealthChart = null;
        this.historyChart = null;
        this.inicializarGraficos();
    }

    inicializarGraficos() {
        // 1. Gráfico de Pizza (Wealth Distribution)
        const ctxWealth = document.getElementById('wealthChart')?.getContext('2d');
        if (ctxWealth) {
            this.wealthChart = new Chart(ctxWealth, {
                type: 'doughnut',
                data: {
                    labels: ['Eggs', 'Tours', 'Dungeons'],
                    datasets: [{
                        data: [0, 0, 0], // Valores iniciais
                        backgroundColor: ['#ffbb33', '#00C851', '#33b5e5'], // Cores (Amarelo, Verde, Azul)
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'right', labels: { color: '#fff' } }
                    }
                }
            });
        }

        // 2. Gráfico de Barras (Histórico)
        const ctxHistory = document.getElementById('historyChart')?.getContext('2d');
        if (ctxHistory) {
            this.historyChart = new Chart(ctxHistory, {
                type: 'bar',
                data: {
                    labels: [], // Dias
                    datasets: [{
                        label: 'Lucro (Teras)',
                        data: [],
                        backgroundColor: '#00C851',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { 
                            beginAtZero: true, 
                            ticks: { color: '#ccc' }, 
                            grid: { color: '#444' } 
                        },
                        x: { ticks: { color: '#ccc' }, grid: { display: false } }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }
    }

    /**
     * Atualiza os gráficos com dados frescos
     * @param {Object} eggsManager - Instância dos Eggs
     * @param {Object} toursManager - Instância dos Tours
     * @param {Object} dungeonManager - Instância das Dungeons
     */
    atualizar(eggsManager, toursManager, dungeonManager) {
        if (!this.wealthChart || !this.historyChart) return;

        // --- CÁLCULO 1: Riqueza Total (Acumulada) ---
        // Eggs: Soma de todos os totais
        const totalEggs = eggsManager.eggs.reduce((acc, e) => acc + e.total, 0);
        
        // Tours: Soma dos Teras no histórico (convertidos para Bits para a conta ser igual)
        // Nota: Tours guarda em "Teras", Eggs em "Bits". Vamos normalizar tudo para Tera no gráfico.
        const totalToursTera = toursManager.config.historico.reduce((acc, t) => acc + t.tera, 0);
        
        // Dungeons: Soma do lucro (já guardado em Bits no nosso código novo, certo? Verifica o dungeons.js)
        // Se no dungeons.js guardamos em Bits, dividimos. Se for Teras, somamos direto.
        // No passo anterior guardámos: lucro: lucro * 1000000 (Bits).
        const totalDungeons = dungeonManager.runs.reduce((acc, r) => acc + r.lucro, 0);

        // Atualizar Pizza (Tudo em Teras para ficar legível)
        this.wealthChart.data.datasets[0].data = [
            bitsParaTera(totalEggs),
            totalToursTera,
            bitsParaTera(totalDungeons)
        ];
        this.wealthChart.update();

        // --- CÁLCULO 2: Histórico Diário (Complexo!) ---
        // Vamos agrupar os ganhos por data (DD/MM)
        const ganhosPorDia = {};
        
        // Helper para somar no dia certo
        const adicionarAoDia = (timestamp, valorTera) => {
            const data = new Date(timestamp).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });
            if (!ganhosPorDia[data]) ganhosPorDia[data] = 0;
            ganhosPorDia[data] += valorTera;
        };

        // Varrer Tours
        toursManager.config.historico.forEach(t => adicionarAoDia(t.timestamp, t.tera));
        // Varrer Dungeons
        dungeonManager.runs.forEach(d => adicionarAoDia(d.timestamp, bitsParaTera(d.lucro)));

        // Pegar nos últimos 7 dias (ordenar chaves)
        const diasOrdenados = Object.keys(ganhosPorDia).sort((a,b) => {
            // Pequeno hack para ordenar strings DD/MM (assume mesmo ano)
            const [dA, mA] = a.split('/');
            const [dB, mB] = b.split('/');
            return mA - mB || dA - dB;
        }).slice(-7);

        const valoresOrdenados = diasOrdenados.map(d => ganhosPorDia[d]);

        // Atualizar Barras
        this.historyChart.data.labels = diasOrdenados;
        this.historyChart.data.datasets[0].data = valoresOrdenados;
        this.historyChart.update();
    }
}