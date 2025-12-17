// js/utils.js
export function bitsParaMega(bits) {
    return Math.floor(bits / 1000);
}

export function bitsParaTera(bits) {
    return Math.floor(bits / 1000000); // 1000 * 1000
}

export function formatarMoeda(bits) {
    const tera = bitsParaTera(bits);
    const mega = bitsParaMega(bits % 1000000);
    const restoBits = bits % 1000;
    return `${tera}T ${mega}M ${restoBits}B`;
}

export function showAlert(msg) {
    alert(msg);
}