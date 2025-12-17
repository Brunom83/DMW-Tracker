// src/js/utils.js
export function bitsParaMega(bits) {
    return Math.floor(bits / 1000);
}

export function bitsParaTera(bits) {
    return Math.floor(bits / 1000000);
}

// NOVA FUNÇÃO: Formata direto para "X T X M X B"
export function formatarMoeda(bits) {
    const tera = Math.floor(bits / 1000000);
    const mega = Math.floor((bits % 1000000) / 1000);
    const restoBits = bits % 1000;
    
    // Retorna string formatada (Ex: 1T 250M 0B)
    return `${tera}T ${mega}M ${restoBits}B`;
}

export function showAlert(msg) {
    alert(msg);
}