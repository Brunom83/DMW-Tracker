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

export function showToast(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return; 

    // Ícones automáticos baseados no tipo
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    const icon = icons[type] || icons.info;

    // Criar o elemento HTML
    const toast = document.createElement('div');
    toast.className = `custom-toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${icon}</span> <span>${msg}</span>`;

    // Adicionar ao ecrã
    container.appendChild(toast);

    // Reproduzir som subtil (Opcional, dá um toque premium)
    // playNotificationSound(type); 

    // Auto-remover após 4 segundos
    setTimeout(() => {
        toast.classList.add('hide');
        toast.addEventListener('animationend', () => toast.remove());
    }, 4000);
}

// Wrapper para manter compatibilidade com código antigo
// Mas agora fica bonito em vez de um alert feio!
export function showAlert(msg) {
    showToast(msg, 'warning'); 
}