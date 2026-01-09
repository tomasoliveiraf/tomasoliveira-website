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

// Scroll suave apenas para as secções na página principal
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Verificar se o link é para uma secção na página atual
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

    // Carregar eventos do Bandsintown se estiver na página principal
    if (document.querySelector('#concertos')) {
        carregarEventosBandsintown();
    }
});

// ===== INTEGRAÇÃO BANDSINTOWN =====

async function carregarEventosBandsintown() {
    // Configure estas variáveis:
    const APP_ID = 'tomasoliveira-website'; // Pode usar qualquer identificador único
    const ARTIST_NAME = 'Tomás Oliveira';

    const url = `https://rest.bandsintown.com/artists/${encodeURIComponent(ARTIST_NAME)}/events?app_id=${APP_ID}`;

    // Mostrar loading
    mostrarLoading();

    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.error('Erro na resposta da API:', response.status);
            throw new Error('Erro ao carregar eventos');
        }

        const eventos = await response.json();

        console.log('Eventos recebidos:', eventos); // Para debug

        // Verificar se há eventos
        if (!eventos || eventos.length === 0 || (eventos.errorMessage)) {
            console.log('Nenhum evento encontrado');
            mostrarMensagemSemEventos();
            return;
        }

        // Renderizar eventos
        renderizarEventos(eventos);

    } catch (erro) {
        console.error('Erro ao carregar eventos do Bandsintown:', erro);
        mostrarMensagemSemEventos(); // Mostra mensagem padrão em vez de erro
    }
}

function mostrarLoading() {
    const container = document.querySelector('.concertos-list');
    container.innerHTML = `
        <div class="concerto-item" style="justify-content: center; padding: 40px;">
            <div class="concerto-info" style="text-align: center;">
                <div class="concerto-local">A carregar eventos...</div>
            </div>
        </div>
    `;
}

function renderizarEventos(eventos) {
    const container = document.querySelector('.concertos-list');

    // Limpar eventos existentes
    container.innerHTML = '';

    // Ordenar eventos por data (mais próximos primeiro)
    eventos.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

    // Renderizar cada evento
    eventos.forEach(evento => {
        const eventoElement = criarElementoEvento(evento);
        container.appendChild(eventoElement);
    });
}

function criarElementoEvento(evento) {
    const div = document.createElement('div');
    div.className = 'concerto-item';

    // Processar data
    const dataEvento = new Date(evento.datetime);
    const dia = dataEvento.getDate();
    const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    const mes = meses[dataEvento.getMonth()];
    const hora = dataEvento.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

    // Informações do venue
    const venue = evento.venue;
    const local = venue.name || 'Por Anunciar';
    const cidade = venue.city || '';

    // Tipo de evento (se houver descrição ou título)
    const tipoEvento = evento.title || evento.description || 'Concerto';

    // Link para bilhetes ou página do evento
    let linkEvento = evento.url || '#';
    if (evento.offers && evento.offers.length > 0) {
        linkEvento = evento.offers[0].url || linkEvento;
    }

    div.innerHTML = `
        <div class="concerto-data">
            <div class="dia">${dia}</div>
            <div class="mes">${mes}</div>
        </div>
        <div class="concerto-info">
            <div class="concerto-local">${local}</div>
            <div class="concerto-cidade">${cidade}${hora !== '00:00' ? ` - ${hora}` : ''}</div>
        </div>
        <div class="concerto-nota">
            <p>${tipoEvento}</p>
        </div>
        <div class="concerto-btn">
            <a href="${linkEvento}" target="_blank" class="btn">
                ${evento.offers && evento.offers.length > 0 ? 'BILHETES' : 'SABER MAIS'}
            </a>
        </div>
    `;
    
    return div;
}

function mostrarMensagemSemEventos() {
    const container = document.querySelector('.concertos-list');
    container.innerHTML = `
        <div class="concerto-item">
            <div class="concerto-data">
                <div class="dia">TBD</div>
                <div class="mes">TBD</div>
            </div>
            <div class="concerto-info">
                <div class="concerto-local">Por Anunciar</div>
                <div class="concerto-cidade">Brevemente</div>
            </div>
            <div class="concerto-nota">
                <p></p>
            </div>
            <div class="concerto-btn">
                <a href="#contacto" class="btn">CONTACTAR</a>
            </div>
        </div>
    `;
}

function mostrarErro() {
    const container = document.querySelector('.concertos-list');
    container.innerHTML = `
        <div class="concerto-item">
            <div class="concerto-info" style="text-align: center; width: 100%;">
                <div class="concerto-local">Erro ao carregar eventos</div>
                <div class="concerto-cidade">Por favor, tente novamente mais tarde</div>
            </div>
        </div>
    `;
}