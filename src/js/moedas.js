import { showAlert, formatarMoeda } from './utils.js';

export class Moedas {
    constructor() {
        this.onChange = null;
        this.carregarDados();
        this.inicializarEventos();
    }

    setOnChangeCallback(callback) {
        this.onChange = callback;
    }

    inicializarEventos() {
        const calcularBtn = document.getElementById('calcularBtn');
        // Usamos addEventListener com verificação para evitar erros se o botão não existir na Tab atual
        if (calcularBtn) {
            calcularBtn.addEventListener('click', () => this.calcularGanhos());
        }
    }

    calcularGanhos() {
        try {
            // Ler valores "Antes"
            const antes = {
                tera: parseFloat(document.getElementById('antesTera').value) || 0,
                mega: parseInt(document.getElementById('antesMega').value) || 0,
                bits: parseInt(document.getElementById('antesBits').value) || 0
            };
            // Ler valores "Depois"
            const depois = {
                tera: parseFloat(document.getElementById('depoisTera').value) || 0,
                mega: parseInt(document.getElementById('depoisMega').value) || 0,
                bits: parseInt(document.getElementById('depoisBits').value) || 0
            };

            // Converter tudo para Bits totais para facilitar a conta (Matemática segura)
            const totalAntes = (antes.tera * 1000000) + (antes.mega * 1000) + antes.bits;
            const totalDepois = (depois.tera * 1000000) + (depois.mega * 1000) + depois.bits;
            
            const diferencaTotal = totalDepois - totalAntes;

            // Converter a diferença de volta para T/M/B para exibição
            const ganhos = {
                tera: Math.floor(Math.abs(diferencaTotal) / 1000000),
                mega: Math.floor((Math.abs(diferencaTotal) % 1000000) / 1000),
                bits: Math.abs(diferencaTotal) % 1000
            };
            
            // Sinal de ganho ou perda
            const sinal = diferencaTotal >= 0 ? '+' : '-';
            const classeCor = diferencaTotal >= 0 ? 'text-success' : 'text-danger';

            // Atualizar UI
            document.getElementById('resultadoAntes').textContent = `${antes.tera}T ${antes.mega}M ${antes.bits}B`;
            document.getElementById('resultadoDepois').textContent = `${depois.tera}T ${depois.mega}M ${depois.bits}B`;

            const ganhosElement = document.getElementById('resultadoGanhos');
            ganhosElement.textContent = `${sinal}${ganhos.tera}T ${ganhos.mega}M ${ganhos.bits}B`;
            ganhosElement.className = `h5 ${classeCor}`;

            this.salvarDados();
            if (this.onChange) this.onChange();

        } catch (error) {
            console.error('Erro ao calcular ganhos:', error);
            showAlert('Erro ao calcular ganhos. Verifique os valores inseridos.');
        }
    }

    salvarDados() {
        const dados = {
            antes: {
                tera: document.getElementById('antesTera').value,
                mega: document.getElementById('antesMega').value,
                bits: document.getElementById('antesBits').value
            },
            depois: {
                tera: document.getElementById('depoisTera').value,
                mega: document.getElementById('depoisMega').value,
                bits: document.getElementById('depoisBits').value
            }
        };
        localStorage.setItem('dmwMoedas', JSON.stringify(dados));
    }

    carregarDados() {
        const dados = JSON.parse(localStorage.getItem('dmwMoedas'));
        if (!dados) return;
        
        if(dados.antes) {
            document.getElementById('antesTera').value = dados.antes.tera || '';
            document.getElementById('antesMega').value = dados.antes.mega || '';
            document.getElementById('antesBits').value = dados.antes.bits || '';
        }
        if(dados.depois) {
            document.getElementById('depoisTera').value = dados.depois.tera || '';
            document.getElementById('depoisMega').value = dados.depois.mega || '';
            document.getElementById('depoisBits').value = dados.depois.bits || '';
        }
    }
}