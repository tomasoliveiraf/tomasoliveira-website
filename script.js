// Menu responsivo
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Header com background ao scrollar (agora apenas para a página principal)
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname.includes('index')) {
        header.classList.toggle('scrolled', window.scrollY > 100);
    }
});

// Scroll suave apenas para as seções na página principal
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Verificar se o link é para uma seção na página atual
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#') && document.querySelector(targetId)) {
            e.preventDefault();
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Ao carregar a página, adicionar classe 'scrolled' ao header nas páginas secundárias
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    if (window.location.pathname !== '/' &&
        window.location.pathname !== '/index.html' &&
        !window.location.pathname.includes('index')) {
        header.classList.add('scrolled');
    }
});