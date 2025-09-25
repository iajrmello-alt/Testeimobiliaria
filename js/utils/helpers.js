// Utilitários de armazenamento seguro
export const SafeStorage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Erro ao salvar dados:', e);
        }
    },
    get: (key, defaultValue = []) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('Erro ao ler dados:', e);
            return defaultValue;
        }
    }
};

// Utilitário de sanitização
export const sanitizeInput = (input) => {
    if (typeof input === 'string') {
        return DOMPurify.sanitize(input);
    }
    if (Array.isArray(input)) {
        return input.map(item => sanitizeInput(item));
    }
    if (typeof input === 'object' && input !== null) {
        const sanitized = {};
        for (const [key, value] of Object.entries(input)) {
            sanitized[key] = sanitizeInput(value);
        }
        return sanitized;
    }
    return input;
};

// Formatador de moeda
export const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    }).format(value);
};