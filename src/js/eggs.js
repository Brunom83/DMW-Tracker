<<<<<<< HEAD
import { bitsParaMega, bitsParaTera, showAlert } from './utils.js';

export class Eggs {
    constructor() {
        this.eggs = [];
        this.onChange = null;
        this.carregarDados();
        this.inicializarEventos();
        this.atualizarCalculadoraEggs();
        window.eggs = this; // Necessário p/ removerEgg funcionar nos botões
    }

    setOnChangeCallback(callback) {
        this.onChange = callback;
    }

    inicializarEventos() {
        document.getElementById('adicionarEgg')?.addEventListener('click', () => this.adicionarEgg());
        document.getElementById('copiarParaDepois')?.addEventListener('click', () => this.copiarParaDepois());
        document.getElementById('quantidadeEgg')?.addEventListener('keypress', e => {
            if (e.key === 'Enter') this.adicionarEgg();
        });
    }

    adicionarEgg() {
        const tipoSelect = document.getElementById('tipoEgg');
        const quantidade = parseInt(document.getElementById('quantidadeEgg').value) || 0;
        if (quantidade <= 0) return;

        const tipo = tipoSelect.options[tipoSelect.selectedIndex].text;
        const valor = parseInt(tipoSelect.value);
        this.eggs.push({ tipo, quantidade, valorUnitario: valor, total: quantidade * valor });
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

    atualizarCalculadoraEggs() {
        const lista = document.getElementById('listaEggs');
        if (!lista) return;
        if (this.eggs.length === 0) {
            lista.innerHTML = '<p class="text-muted">Nenhum egg adicionado ainda...</p>';
        } else {
            lista.innerHTML = this.eggs.map((egg, i) => `
                <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                    <div>
                        <strong>${egg.tipo}</strong><br>
                        <small>${egg.quantidade} × ${egg.valorUnitario} bits = ${egg.total} bits</small>
                    </div>
                    <button class="btn btn-sm btn-outline-danger" onclick="window.eggs.removerEgg(${i})">×</button>
                </div>
            `).join('');
        }

        const totalBits = this.eggs.reduce((t, e) => t + e.total, 0);
        document.getElementById('totalBitsEggs').textContent = totalBits;
        document.getElementById('totalMegaEggs').textContent = bitsParaMega(totalBits);
        document.getElementById('totalTeraEggs').textContent = bitsParaTera(totalBits);
    }

    copiarParaDepois() {
        const totalBits = this.eggs.reduce((t, e) => t + e.total, 0);
        const tera = bitsParaTera(totalBits);
        const mega = bitsParaMega(totalBits);
        const bits = totalBits % 999;
        showAlert(`💰 Total dos Eggs: ${tera}T ${mega}M ${bits}Bits`);
    }

    salvarDados() {
        localStorage.setItem('dmwEggs', JSON.stringify(this.eggs));
    }

    carregarDados() {
        const dados = JSON.parse(localStorage.getItem('dmwEggs'));
        if (dados) this.eggs = dados;
    }
}
=======
// js/eggs.js
import { bitsParaMega, bitsParaTera, showAlert } from './utils.js';

export class Eggs {
    constructor() {
        this.eggs = [];
        this.carregarDados();
        this.inicializarEventos();
        this.atualizarCalculadoraEggs();
    }

    inicializarEventos() {
        document.getElementById('adicionarEgg')?.addEventListener('click', () => this.adicionarEgg());
        document.getElementById('copiarParaDepois')?.addEventListener('click', () => this.copiarParaDepois());
        document.getElementById('quantidadeEgg')?.addEventListener('keypress', e => {
            if (e.key === 'Enter') this.adicionarEgg();
        });
    }

    adicionarEgg() {
        const tipoSelect = document.getElementById('tipoEgg');
        const quantidade = parseInt(document.getElementById('quantidadeEgg').value) || 0;
        if (quantidade <= 0) return;

        const tipo = tipoSelect.options[tipoSelect.selectedIndex].text;
        const valor = parseInt(tipoSelect.value);
        this.eggs.push({ tipo, quantidade, valorUnitario: valor, total: quantidade * valor });
        this.atualizarCalculadoraEggs();
        document.getElementById('quantidadeEgg').value = '0';
        this.salvarDados();
    }

    atualizarCalculadoraEggs() {
        const lista = document.getElementById('listaEggs');
        if (this.eggs.length === 0) {
            lista.innerHTML = '<p class="text-muted">Nenhum egg adicionado ainda...</p>';
        } else {
            let html = '';
            this.eggs.forEach((egg, i) => {
                html += `
                <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                    <div><strong>${egg.tipo}</strong><br><small>${egg.quantidade} × ${egg.valorUnitario} bits = ${egg.total} bits</small></div>
                    <button class="btn btn-sm btn-outline-danger" onclick="window.eggs.removerEgg(${i})">×</button>
                </div>`;
            });
            lista.innerHTML = html;
        }

        const totalBits = this.eggs.reduce((t, e) => t + e.total, 0);
        document.getElementById('totalBitsEggs').textContent = totalBits;
        document.getElementById('totalMegaEggs').textContent = bitsParaMega(totalBits);
        document.getElementById('totalTeraEggs').textContent = bitsParaTera(totalBits);
    }

    removerEgg(index) {
        this.eggs.splice(index, 1);
        this.atualizarCalculadoraEggs();
        this.salvarDados();
    }

    copiarParaDepois() {
        const totalBits = this.eggs.reduce((t, e) => t + e.total, 0);
        const tera = bitsParaTera(totalBits);
        const mega = bitsParaMega(totalBits);
        const bits = totalBits % 999;
        showAlert(`💰 Total dos Eggs: ${tera}T ${mega}M ${bits}Bits\n\nPodes somar este valor manualmente ao teu farm!`);
    }

    salvarDados() {
        localStorage.setItem('dmwEggs', JSON.stringify(this.eggs));
    }

    carregarDados() {
        const dados = JSON.parse(localStorage.getItem('dmwEggs'));
        if (dados) this.eggs = dados;
    }
}
>>>>>>> 454285409cb1d136100e634b8c26f292f45eea12
