import { formatarMoeda, showToast } from './utils.js';
import { Validator } from './validators.js';

export class Eggs {
    constructor() {
        // Carrega logo no início de forma direta
        this.eggs = this.carregarDados();
        this.onChange = null;
        
        // Inicia o "olheiro" de cliques
        this.inicializarEventos();
    }

    setOnChangeCallback(callback) {
        this.onChange = callback;
    }

    // 🛡️ Delegação de Eventos (Adeus Hack do window.eggs!)
    inicializarEventos() {
        const lista = document.getElementById('listaEggs');
        if (lista) {
            lista.addEventListener('click', (e) => {
                const btnRemover = e.target.closest('.btn-remover-egg');
                if (btnRemover) {
                    const index = parseInt(btnRemover.dataset.index, 10);
                    this.removerEgg(index);
                }
            });
        }
    }

    adicionarEgg() {
        const selectElement = document.getElementById('tipoEgg');
        const inputQtd = document.getElementById('quantidadeEgg');

        // --- VALIDAÇÃO ---
        const quantidade = Validator.validatePositiveNumber('quantidadeEgg', 'Quantidade');
        
        if (quantidade === null || quantidade <= 0) {
            if (quantidade === 0) Validator.showError(inputQtd, "A quantidade deve ser maior que 0!");
            return;
        }

        // --- PROCESSAMENTO ---
        const tipo = selectElement.options[selectElement.selectedIndex].text;
        const valorUnitario = parseInt(selectElement.value, 10);
        
        this.eggs.push({ 
            tipo, 
            quantidade, 
            valorUnitario, 
            total: quantidade * valorUnitario 
        });

        // --- LIMPEZA UI ---
        inputQtd.value = '0';
        inputQtd.classList.remove('is-invalid');

        // --- ATUALIZAÇÃO ---
        this.sincronizar();
        showToast(`Adicionado: ${quantidade}x ${tipo}`, "success");
    }

    removerEgg(index) {
        this.eggs.splice(index, 1);
        this.sincronizar();
    }

    // ⚙️ O Motor Central (Evita repetição de código)
    sincronizar() {
        this.salvarDados();
        this.atualizarCalculadoraEggs(); // Alterei o nome de renderizar para manter compatibilidade com o teu app.js
        if (this.onChange) this.onChange();
    }

    // 🎨 Apenas Renderização Visual
    atualizarCalculadoraEggs() {
        const lista = document.getElementById('listaEggs');
        const elementoTotal = document.getElementById('totalEggsConsolidado');
        
        if (!lista || !elementoTotal) return;

        if (this.eggs.length === 0) {
            lista.innerHTML = '<p class="text-muted text-center mt-3">Nenhum egg adicionado...</p>';
            elementoTotal.textContent = "0T 0M 0B";
            return;
        }

        // O segredo está no 'data-index' do botão
        lista.innerHTML = this.eggs.map((egg, index) => `
            <div class="d-flex justify-content-between align-items-center border-bottom border-secondary pb-2 mb-2">
                <div>
                    <strong class="text-light">${egg.tipo}</strong><br>
                    <small class="text-light">${egg.quantidade} × ${egg.valorUnitario} = ${formatarMoeda(egg.total)}</small>
                </div>
                <button class="btn btn-sm btn-outline-danger btn-remover-egg" data-index="${index}">×</button>
            </div>
        `).join('');

        const totalBits = this.eggs.reduce((acc, egg) => acc + egg.total, 0);
        elementoTotal.textContent = formatarMoeda(totalBits);
    }

    // 📋 Agora copia MESMO para a área de transferência
    async copiarParaDepois() {
        const totalBits = this.eggs.reduce((t, e) => t + e.total, 0);
        if (totalBits === 0) {
            showToast("A tua bag está vazia, não há nada para copiar!", "warning");
            return;
        }

        const valorFormatado = formatarMoeda(totalBits);
        
        try {
            await navigator.clipboard.writeText(valorFormatado);
            showToast(`💰 Copiado para o teclado: ${valorFormatado}`, "info");
        } catch (err) {
            showToast("O teu navegador bloqueou a cópia.", "danger");
            console.error("Erro ao copiar:", err);
        }
    }

    salvarDados() {
        localStorage.setItem('dmwEggs', JSON.stringify(this.eggs));
    }

    carregarDados() {
        const dados = localStorage.getItem('dmwEggs');
        return dados ? JSON.parse(dados) : [];
    }
}