<<<<<<< HEAD
// js/utils.js
export function bitsParaMega(bits) {
    return Math.floor(bits / 1000);
}

export function bitsParaTera(bits) {
    return Math.floor(bits / 1000 / 1000);
}

export function showAlert(msg) {
    alert(msg);
}
=======
// js/utils.js
export function bitsParaMega(bits) {
    return Math.floor(bits / 999);
}

export function bitsParaTera(bits) {
    return Math.floor(bits / (1000 * 999));
}

export function showAlert(message) {
    alert(message);
}
>>>>>>> 454285409cb1d136100e634b8c26f292f45eea12
