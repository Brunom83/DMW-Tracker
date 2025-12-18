// src/js/validators.js
import { showToast } from './utils.js';

export class Validator {
    /**
     * Valida se um número é positivo.
     * @param {string} elementId - ID do input HTML.
     * @param {string} fieldName - Nome para mostrar no erro (ex: "Quantidade").
     * @returns {number|null} Retorna o número limpo ou null se falhar.
     */
    static validatePositiveNumber(elementId, fieldName) {
        const input = document.getElementById(elementId);
        if (!input) return null;

        const value = parseFloat(input.value);

        // Reset visual inicial
        input.classList.remove('is-invalid');

        // Validação: Não pode ser NaN e tem de ser >= 0
        if (isNaN(value) || value < 0) {
            this.showError(input, `${fieldName} não pode ser negativo!`);
            return null;
        }

        return value;
    }

    /**
     * Valida se um texto não está vazio.
     * @param {string} elementId 
     * @param {string} fieldName 
     */
    static validateText(elementId, fieldName) {
        const input = document.getElementById(elementId);
        if (!input) return null;

        const value = input.value.trim();
        input.classList.remove('is-invalid');

        if (value === "") {
            this.showError(input, `${fieldName} é obrigatório!`);
            return null;
        }

        return value;
    }

    // Helper privado para mostrar erro visual
    static showError(input, msg) {
        input.classList.add('is-invalid'); // Classe do Bootstrap/CSS para borda vermelha
        // Pequena animação de "shake" se quisermos ser extra (adicionar no CSS)
        showToast(`❌ ${msg}`, 'error');
    }
}