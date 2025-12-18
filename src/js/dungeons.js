import { formatarMoeda, showToast } from './utils.js';
import { Validator } from './validators.js'; // <--- Importar o Xerife

export class DungeonManager {
    constructor() {
        this.runs = JSON.parse(localStorage.getItem('dmwDungeons')) || [];
        this.inicializarEventos();
        this.atualizarTabela();
        this.atualizarStats();
    }

    inicializarEventos() {
        document.getElementById('btnRegistarDungeon')?.addEventListener('click', () => this.registarRun());
    }

    registarRun() {
        // 1. Sacar valores brutos
        const dungeon = document.getElementById('selectDungeon').value;
        const partySize = document.getElementById('selectParty').value;

        // 2. VALIDAÇÃO ROBUSTA 🛡️
        // Drops: Não pode estar vazio
        const drops = Validator.validateText('inputDrops', 'Drops');
        
        // Lucro: Tem de ser número >= 0 (Se quiseres registar prejuízo, teríamos de criar outro validador)
        const lucroTera = Validator.validatePositiveNumber('inputLucro', 'Lucro');

        // Se algum falhou (retornou null), o Validator já mostrou o erro visual. Paramos aqui.
        if (drops === null || lucroTera === null) return;

        // 3. Tudo válido? Siga para a base de dados!
        const novaRun = {
            id: Date.now(),
            data: new Date().toLocaleString('pt-PT'),
            timestamp: Date.now(),
            dungeon,
            drops,     // Já vem limpo pelo validateText
            lucro: lucroTera * 1000000, // Converter Teras para Bits
            party: parseInt(partySize)
        };

        this.runs.unshift(novaRun);
        this.salvar();
        
        // 4. Feedback e Limpeza
        this.atualizarTabela();
        this.atualizarStats();
        
        // Limpar inputs (e remover os vermelhos se existirem)
        const inputDrops = document.getElementById('inputDrops');
        const inputLucro = document.getElementById('inputLucro');
        
        inputDrops.value = '';
        inputLucro.value = '';
        inputDrops.classList.remove('is-invalid');
        inputLucro.classList.remove('is-invalid');

        showToast(`Run de ${dungeon} registada com sucesso!`, "success");
        
        // Se tiveres os Gráficos ativos, isto atualiza-os também (via app.js observer ou reload)
        // Nota: Idealmente chamarias um callback aqui, tal como fazemos nos Eggs/Moedas
        if (window.dmwTracker) window.dmwTracker.atualizarDashboard(); 
    }

    removerRun(id) {
        if(confirm("Apagar esta run do histórico?")) {
            this.runs = this.runs.filter(r => r.id !== id);
            this.salvar();
            this.atualizarTabela();
            this.atualizarStats();
            if (window.dmwTracker) window.dmwTracker.atualizarDashboard();
            showToast("Run removida.", "info");
        }
    }

    atualizarTabela() {
        const tbody = document.getElementById('tabelaDungeonsBody');
        if (!tbody) return;

        if (this.runs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3">Sem registos. Vai farmar! ⚔️</td></tr>';
            return;
        }

        tbody.innerHTML = this.runs.map(run => `
            <tr>
                <td><small>${run.data.split(' ')[0]}</small></td>
                <td><span class="badge bg-info text-dark">${run.dungeon}</span></td>
                <td>${run.drops}</td>
                <td>${run.party} ppl</td>
                <td class="text-success fw-bold">+${formatarMoeda(run.lucro)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger py-0" onclick="window.dmwTracker.dungeons.removerRun(${run.id})">×</button>
                </td>
            </tr>
        `).join('');
    }

    atualizarStats() {
        const totalRuns = this.runs.length;
        const totalLucro = this.runs.reduce((acc, r) => acc + r.lucro, 0);

        const elRuns = document.getElementById('statTotalRuns');
        const elProfit = document.getElementById('statTotalDungeonProfit');
        
        if(elRuns) elRuns.textContent = totalRuns;
        if(elProfit) elProfit.textContent = formatarMoeda(totalLucro);
    }

    salvar() {
        localStorage.setItem('dmwDungeons', JSON.stringify(this.runs));
    }
}