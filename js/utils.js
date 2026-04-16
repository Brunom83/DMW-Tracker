export function bitsParaMega(bits) {
    return Math.floor(bits / 1000);
}

export function bitsParaTera(bits) {
    return Math.floor(bits / 1000000);
}

export function formatarMoeda(bits) {
    const tera = Math.floor(bits / 1000000);
    const mega = Math.floor((bits % 1000000) / 1000);
    const restoBits = bits % 1000;
    return `${tera}T ${mega}M ${restoBits}B`;
}

// === NOVO SISTEMA DE NOTIFICAÇÕES ===

export function showToast(mensagem, tipo = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // 1. Criar a notificação
    const toast = document.createElement('div');
    toast.className = `custom-toast border-${tipo}`;
    
    // Escolher o ícone dependendo do tipo
    let icone = 'fas fa-info-circle text-info';
    if (tipo === 'success') icone = 'fas fa-check-circle text-success';
    if (tipo === 'warning') icone = 'fas fa-exclamation-triangle text-warning';
    if (tipo === 'danger') icone = 'fas fa-times-circle text-danger';

    toast.innerHTML = `<i class="${icone} me-2 fs-5"></i> <span>${mensagem}</span>`;
    
    // 2. Colocar no ecrã
    container.appendChild(toast);

    // 3. O TEMPORIZADOR SÉNIOR (Destrói após 3 segundos)
    setTimeout(() => {
        // Faz a animação de saída (escorrega para a direita e fica invisível)
        toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        
        // Espera que a animação acabe (400ms) e apaga o lixo do HTML
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 400);
    }, 3000);
}

// Wrapper para manter compatibilidade com código antigo
// Mas agora fica bonito em vez de um alert feio!
export function showAlert(msg) {
    showToast(msg, 'warning'); 
}