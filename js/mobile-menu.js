class MobileMenu {
    constructor() {
        this.init();
    }

    init() {
        // Cache dos elementos DOM
        this.menuBtn = document.querySelector('.menu-hamburger');
        this.nav = document.querySelector('nav');
        this.menuLinks = this.nav.querySelectorAll('a');
        
        // Criar overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'menu-overlay';
        document.body.appendChild(this.overlay);
        
        // Configurar acessibilidade inicial
        this.setupAccessibility();
        
        // Inicializar eventos
        this.setupEventListeners();
    }

    setupAccessibility() {
        this.nav.setAttribute('aria-hidden', 'true');
        this.menuLinks.forEach(link => {
            if (link.getAttribute('href') === window.location.pathname) {
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    setupEventListeners() {
        // Eventos do menu
        this.menuBtn.addEventListener('click', () => this.toggleMenu());
        this.overlay.addEventListener('click', () => this.closeMenu());
        
        // Eventos dos links
        this.menuLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Evento de redimensionamento com debounce
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 768) {
                    this.closeMenu();
                }
            }, 250);
        });

        // Eventos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen()) {
                this.closeMenu();
            }
            if (e.key === 'Tab') {
                this.handleTabKey(e);
            }
        });
    }

    isMenuOpen() {
        return this.menuBtn.getAttribute('aria-expanded') === 'true';
    }

    toggleMenu() {
        const isOpen = this.isMenuOpen();
        this.menuBtn.setAttribute('aria-expanded', !isOpen);
        this.nav.setAttribute('aria-hidden', isOpen);
        this.nav.classList.toggle('active');
        this.overlay.classList.toggle('active');
        
        if (!isOpen) {
            document.body.classList.add('menu-open');
            // Foca no primeiro link após a animação
            setTimeout(() => {
                this.menuLinks[0].focus();
            }, 300);
        } else {
            this.closeMenu();
        }
    }

    closeMenu() {
        if (!this.isMenuOpen()) return;
        
        this.menuBtn.setAttribute('aria-expanded', 'false');
        this.nav.setAttribute('aria-hidden', 'true');
        this.nav.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
        this.menuBtn.focus();
    }

    handleTabKey(e) {
        if (!this.isMenuOpen()) return;

        const focusableElements = [this.menuBtn, ...this.menuLinks];
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement;

        if (e.shiftKey && activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
}

// Inicializar o menu quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new MobileMenu();
});