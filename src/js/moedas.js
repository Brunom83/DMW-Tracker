<<<<<<< HEAD
// js/moedas.js
import { showAlert } from './utils.js';

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
        if (calcularBtn) {
            calcularBtn.addEventListener('click', () => this.calcularGanhos());
        }
    }

    calcularGanhos() {
        try {
            const antes = {
                tera: parseFloat(document.getElementById('antesTera').value) || 0,
                mega: parseInt(document.getElementById('antesMega').value) || 0,
                bits: parseInt(document.getElementById('antesBits').value) || 0
            };
            const depois = {
                tera: parseFloat(document.getElementById('depoisTera').value) || 0,
                mega: parseInt(document.getElementById('depoisMega').value) || 0,
                bits: parseInt(document.getElementById('depoisBits').value) || 0
            };

            let ganhos = {
                tera: depois.tera - antes.tera,
                mega: depois.mega - antes.mega,
                bits: depois.bits - antes.bits
            };

            if (ganhos.bits < 0 && ganhos.mega > 0) {
                ganhos.mega -= 1;
                ganhos.bits += 999;
            }
            if (ganhos.mega < 0 && ganhos.tera > 0) {
                ganhos.tera -= 1;
                ganhos.mega += 1000;
            }

            document.getElementById('resultadoAntes').textContent =
                `${antes.tera}T ${antes.mega}M ${antes.bits}Bits`;
            document.getElementById('resultadoDepois').textContent =
                `${depois.tera}T ${depois.mega}M ${depois.bits}Bits`;

            const ganhosElement = document.getElementById('resultadoGanhos');
            ganhosElement.textContent = 
                `${ganhos.tera >= 0 ? '+' : ''}${ganhos.tera}T ${ganhos.mega >= 0 ? '+' : ''}${ganhos.mega}M ${ganhos.bits >= 0 ? '+' : ''}${ganhos.bits}Bits`;
            ganhosElement.className = `h5 ${ganhos.tera < 0 || ganhos.mega < 0 ? 'text-danger' : 'text-success'}`;

            this.salvarDados();
            if (this.onChange) this.onChange();

        } catch (error) {
            console.error('Erro ao calcular ganhos:', error);
            showAlert('Erro ao calcular ganhos. Verifique o console.');
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
        document.getElementById('antesTera').value = dados.antes.tera;
        document.getElementById('antesMega').value = dados.antes.mega;
        document.getElementById('antesBits').value = dados.antes.bits;
        document.getElementById('depoisTera').value = dados.depois.tera;
        document.getElementById('depoisMega').value = dados.depois.mega;
        document.getElementById('depoisBits').value = dados.depois.bits;
    }
}
=======
// js/moedas.js
import { showAlert } from './utils.js';

export class Moedas {
    constructor() {
        this.carregarDados();
        this.inicializarEventos();
    }

    inicializarEventos() {
        const calcularBtn = document.getElementById('calcularBtn');
        if (calcularBtn) {
            calcularBtn.addEventListener('click', () => this.calcularGanhos());
        }
    }

    calcularGanhos() {
        try {
            const antes = {
                tera: parseFloat(document.getElementById('antesTera').value) || 0,
                mega: parseInt(document.getElementById('antesMega').value) || 0,
                bits: parseInt(document.getElementById('antesBits').value) || 0
            };
            const depois = {
                tera: parseFloat(document.getElementById('depoisTera').value) || 0,
                mega: parseInt(document.getElementById('depoisMega').value) || 0,
                bits: parseInt(document.getElementById('depoisBits').value) || 0
            };

            let ganhos = {
                tera: depois.tera - antes.tera,
                mega: depois.mega - antes.mega,
                bits: depois.bits - antes.bits
            };

            // Ajuste entre moedas
            if (ganhos.bits < 0 && ganhos.mega > 0) {
                ganhos.mega -= 1;
                ganhos.bits += 999;
            }
            if (ganhos.mega < 0 && ganhos.tera > 0) {
                ganhos.tera -= 1;
                ganhos.mega += 1000;
            }

            document.getElementById('resultadoAntes').textContent =
                `${antes.tera}T ${antes.mega}M ${antes.bits}Bits`;
            document.getElementById('resultadoDepois').textContent =
                `${depois.tera}T ${depois.mega}M ${depois.bits}Bits`;

            const ganhosElement = document.getElementById('resultadoGanhos');
            ganhosElement.textContent = 
                `${ganhos.tera >= 0 ? '+' : ''}${ganhos.tera}T ${ganhos.mega >= 0 ? '+' : ''}${ganhos.mega}M ${ganhos.bits >= 0 ? '+' : ''}${ganhos.bits}Bits`;
            ganhosElement.className = `h5 ${ganhos.tera < 0 || ganhos.mega < 0 ? 'text-danger' : 'text-success'}`;

            this.salvarDados();
        } catch (error) {
            console.error('Erro ao calcular ganhos:', error);
            showAlert('Erro ao calcular ganhos. Verifique o console.');
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
        document.getElementById('antesTera').value = dados.antes.tera;
        document.getElementById('antesMega').value = dados.antes.mega;
        document.getElementById('antesBits').value = dados.antes.bits;
        document.getElementById('depoisTera').value = dados.depois.tera;
        document.getElementById('depoisMega').value = dados.depois.mega;
        document.getElementById('depoisBits').value = dados.depois.bits;
    }
}
>>>>>>> 454285409cb1d136100e634b8c26f292f45eea12
