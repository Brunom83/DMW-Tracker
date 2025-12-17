import { bitsParaMega, bitsParaTera, showAlert } from './utils.js';

export class Eggs {
    constructor() {
        this.eggs = [];
        this.onChange = null;
        this.carregarDados();
        // Nota: Os eventos são geridos pelo app.js agora para centralizar,
        // mas mantemos métodos públicos para serem chamados.
        window.eggs = this; // Hack necessário para o botão de remover (onclick no HTML) funcionar
    }

    setOnChangeCallback(callback) {
        this.onChange = callback;
    }

    adicionarEgg() {
        const tipoSelect = document.getElementById('tipoEgg');
        const quantidadeInput = document.getElementById('quantidadeEgg');
        const quantidade = parseInt(quantidadeInput.value) || 0;
        
        if (quantidade <= 0) return showAlert("Insira uma quantidade válida!");

        const tipo = tipoSelect.options[tipoSelect.selectedIndex].text;
        const valor = parseInt(tipoSelect.value);
        
        this.eggs.push({ 
            tipo, 
            quantidade, 
            valorUnitario: valor, 
            total: quantidade * valor 
        });

        quantidadeInput.value = '0';
        this.salvarDados();
        this.atualizarCalculadoraEggs();
        if (this.onChange) this.onChange();
    }

    removerEgg(index) {
        this.eggs.splice(index, 1);
        this.salvarDados();
        this.atualizarCalculadoraEggs();
        if (this.onChange) this.onChange();
    }

    // --- AQUI ESTÁ A MUDANÇA VISUAL ---
    atualizarCalculadoraEggs() {
        const lista = document.getElementById('listaEggs');
        if (!lista) return;

        // Renderiza a lista
        if (this.eggs.length === 0) {
            lista.innerHTML = '<p class="text-muted text-center mt-3">Nenhum egg adicionado...</p>';
        } else {
            lista.innerHTML = this.eggs.map((egg, i) => `
                <div class="d-flex justify-content-between align-items-center border-bottom border-secondary pb-2 mb-2">
                    <div>
                        <strong class="text-light">${egg.tipo}</strong><br>
                        <small class="text-muted">${egg.quantidade} × ${egg.valorUnitario} = ${formatarMoeda(egg.total)}</small>
                    </div>
                    <button class="btn btn-sm btn-outline-danger" onclick="window.eggs.removerEgg(${i})">×</button>
                </div>
            `).join('');
        }

        // Calcula o total
        const totalBits = this.eggs.reduce((t, e) => t + e.total, 0);
        
        // Atualiza o display GRANDE (X T X M X B)
        const textoFormatado = formatarMoeda(totalBits);
        const elementoTotal = document.getElementById('totalEggsConsolidado');
        if(elementoTotal) elementoTotal.textContent = textoFormatado;
    }

    copiarParaDepois() {
        const totalBits = this.eggs.reduce((t, e) => t + e.total, 0);
        showAlert(`💰 Total a copiar: ${formatarMoeda(totalBits)}`);
    }

    salvarDados() {
        localStorage.setItem('dmwEggs', JSON.stringify(this.eggs));
    }

    carregarDados() {
        const dados = JSON.parse(localStorage.getItem('dmwEggs'));
        if (dados) this.eggs = dados;
    }
}