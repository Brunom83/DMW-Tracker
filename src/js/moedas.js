import { showAlert, formatarMoeda } from './utils.js'; // Mantém o que tinhas
import { Validator } from './validators.js';

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
            // Valores "Antes"
            const aTera = Validator.validatePositiveNumber('antesTera', 'Tera (Antes)');
            const aMega = Validator.validatePositiveNumber('antesMega', 'Mega (Antes)');
            const aBits = Validator.validatePositiveNumber('antesBits', 'Bits (Antes)');

            // Valores "Depois"
            const dTera = Validator.validatePositiveNumber('depoisTera', 'Tera (Depois)');
            const dMega = Validator.validatePositiveNumber('depoisMega', 'Mega (Depois)');
            const dBits = Validator.validatePositiveNumber('depoisBits', 'Bits (Depois)');

            // Se ALGUM destes for null (inválido), o validatePositiveNumber já mostrou o erro.
            // Nós só precisamos de parar a função.
            if (aTera === null || aMega === null || aBits === null || 
                dTera === null || dMega === null || dBits === null) {
                return; // Aborta missão!
            }

            const antes = { tera: aTera, mega: aMega, bits: aBits };
            const depois = { tera: dTera, mega: dMega, bits: dBits };

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
            showAlert('Erro inesperado no sistema. Verifica a consola.');
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