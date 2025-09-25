// Utility functions
const SafeStorage = {
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

const sanitizeInput = (input) => {
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

import { ImoveisService } from './services/ImoveisService.js';
import { ImovelCard } from './components/ImovelCard.js';

document.addEventListener('DOMContentLoaded', function() {
    const imoveisService = new ImoveisService();
    const page = window.location.pathname.split("/").pop();

    // Função para popular com dados iniciais se o localStorage estiver vazio
    function popularDadosIniciais() {
        let imoveis = SafeStorage.get('imoveis', []);
        if (imoveis.length === 0) {
            imoveis = [
                {
                    id: 1,
                    titulo: "Apartamento Moderno no Coração da Cidade",
                    preco: "1250000",
                    localizacao: "Centro, Cidade Exemplo",
                    tipo: "Apartamento",
                    quartos: "3",
                    banheiros: "2",
                    vagas: "2",
                    area: "120",
                    imagem: "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                    descricao: "Este apartamento espaçoso e moderno está localizado no coração da cidade, oferecendo acesso fácil a todas as comodidades. Com acabamentos de alta qualidade, uma cozinha gourmet e uma vista deslumbrante da cidade, é o lugar perfeito para quem busca conforto e conveniência."
                },
                {
                    id: 2,
                    titulo: "Casa de Família com Quintal Amplo",
                    preco: "980000",
                    localizacao: "Bairro Residencial, Cidade Exemplo",
                    tipo: "Casa",
                    quartos: "4",
                    banheiros: "3",
                    vagas: "3",
                    area: "250",
                    imagem: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                    descricao: "Uma casa encantadora, ideal para famílias, localizada em um bairro tranquilo e arborizado. Possui um quintal grande com espaço para piscina e área de lazer. Os interiores são arejados e bem iluminados, com uma suíte master e quartos espaçosos."
                },
                {
                    id: 3,
                    titulo: "Escritório Comercial em Localização Estratégica",
                    preco: "5500/mês",
                    localizacao: "Distrito Financeiro, Cidade Exemplo",
                    tipo: "Comercial",
                    quartos: "0",
                    banheiros: "2",
                    vagas: "5",
                    area: "200",
                    imagem: "https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                    descricao: "Sala comercial moderna e espaçosa, perfeita para empresas que buscam uma localização de prestígio. O edifício oferece segurança 24 horas, estacionamento para clientes e uma infraestrutura completa para o seu negócio prosperar."
                }
            ];
            localStorage.setItem('imoveis', JSON.stringify(imoveis));
        }
    }

    // Garante que os dados existam antes de tentar renderizar
    popularDadosIniciais();

    // --- CARREGAMENTO DINÂMICO DE IMÓVEIS ---
    if (page === 'index.html' || page === 'imoveis.html' || page === '') { // page === '' para o acesso raiz
        const imoveis = JSON.parse(localStorage.getItem('imoveis')) || [];
        
        if (page === 'index.html' || page === '') {
            renderImoveisDestaque(imoveis);
        }
        if (page === 'imoveis.html') {
            renderImoveisListagem(imoveis);
        }
    }

    function createImovelCard(imovel) {
        // Sanitizar dados do imóvel
        const safeImovel = sanitizeInput(imovel);
        
        const precoFormatado = safeImovel.preco.includes('/mês') 
            ? safeImovel.preco 
            : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(safeImovel.preco);

        // Criar o template com os dados sanitizados
        const template = `
            <div class="imovel-card">
                <img src="${safeImovel.imagem || 'images/placeholder.jpg'}" 
                     alt="${safeImovel.titulo}"
                     loading="lazy"
                     onerror="this.src='images/placeholder.jpg'">
                <div class="imovel-card-content">
                    <h3>${safeImovel.titulo}</h3>
                    <p class="preco">${precoFormatado}</p>
                    <p class="localizacao">${safeImovel.localizacao}</p>
                    <div class="imovel-card-features">
                        ${imovel.area > 0 ? `<div class="card-feature-item">
                            <i class="fa-solid fa-ruler-combined"></i>
                            <span>${imovel.area} m²</span>
                        </div>` : ''}
                        ${imovel.quartos > 0 ? `<div class="card-feature-item">
                            <i class="fa-solid fa-bed"></i>
                            <span>${imovel.quartos} Quartos</span>
                        </div>` : ''}
                        ${imovel.banheiros > 0 ? `<div class="card-feature-item">
                            <i class="fa-solid fa-bath"></i>
                            <span>${imovel.banheiros} Banh.</span>
                        </div>` : ''}
                        ${imovel.vagas > 0 ? `<div class="card-feature-item">
                            <i class="fa-solid fa-car"></i>
                            <span>${imovel.vagas} Vagas</span>
                        </div>` : ''}
                    </div>
                    <a href="detalhe-imovel.html?id=${imovel.id}" class="btn-detalhes">Ver Detalhes</a>
                </div>
            </div>
        `;
    }

    function renderImoveisDestaque(imoveis) {
        const container = document.querySelector('#recentes .imoveis-grid');
        if (!container) return;
        // Pega os 3 últimos imóveis adicionados
        const destaque = imoveis.slice(-3).reverse();
        if (destaque.length > 0) {
            container.innerHTML = destaque.map(createImovelCard).join('');
        } else {
            container.innerHTML = '<p>Nenhum imóvel em destaque no momento.</p>';
        }
    }

    function renderImoveisListagem(imoveis) {
        const container = document.querySelector('#grid-container');
        const resultadoCountEl = document.querySelector('.listagem-header h3');

        if (!container || !resultadoCountEl) return;

        resultadoCountEl.textContent = `Exibindo ${imoveis.length} resultados`;

        if (imoveis.length > 0) {
            container.innerHTML = imoveis.map(createImovelCard).join('');
        } else {
            container.innerHTML = '<p>Nenhum imóvel encontrado para os critérios selecionados.</p>';
        }
        // Após renderizar a grid, atualiza a visualização em lista
        setTimeout(generateListView, 100);
    }


    // --- LÓGICA PARA A PÁGINA DE LISTAGEM DE IMÓVEIS ---
    if (page === 'imoveis.html') {
        const filtroForm = document.querySelector('.form-filtros');
        
        // Função para aplicar filtros da URL na carga da página
        function aplicarFiltrosDaUrl() {
            const params = new URLSearchParams(window.location.search);
            const tipoUrl = params.get('tipo');

            if (tipoUrl) {
                document.getElementById('tipo').value = tipoUrl;
                filtroForm.dispatchEvent(new Event('submit')); // Simula o envio do formulário para aplicar o filtro
            }
        }

        aplicarFiltrosDaUrl(); // Chama a função na carga da página

        filtroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let imoveisFiltrados = JSON.parse(localStorage.getItem('imoveis')) || [];

            // Pega os valores dos filtros
            const finalidade = document.getElementById('finalidade').value;
            const tipo = document.getElementById('tipo').value;
            const cidade = document.getElementById('cidade').value.trim().toLowerCase();
            const quartos = parseInt(document.getElementById('quartos').value, 10);
            const precoMin = parseFloat(document.getElementById('preco-min').value);
            const precoMax = parseFloat(document.getElementById('preco-max').value);

            // 1. Filtro por Finalidade
            if (finalidade) {
                imoveisFiltrados = imoveisFiltrados.filter(imovel => {
                    const isAluguel = String(imovel.preco).includes('/mês');
                    if (finalidade === 'alugar') return isAluguel;
                    if (finalidade === 'comprar') return !isAluguel;
                    return true; // Caso o valor seja ""
                });
            }

            // 2. Filtro por Tipo de Imóvel
            if (tipo) { // Ignora se for "" (Todos)
                imoveisFiltrados = imoveisFiltrados.filter(imovel => imovel.tipo.toLowerCase() === tipo.toLowerCase());
            }

            // 3. Filtro por Cidade
            if (cidade) {
                imoveisFiltrados = imoveisFiltrados.filter(imovel => imovel.localizacao.toLowerCase().includes(cidade));
            }

            // 4. Filtro por Número de Quartos
            if (quartos) { // Ignora se for NaN (Todos)
                imoveisFiltrados = imoveisFiltrados.filter(imovel => parseInt(imovel.quartos, 10) >= quartos);
            }

            // 5. Filtro por Faixa de Preço
            imoveisFiltrados = imoveisFiltrados.filter(imovel => {
                const precoNumerico = parseFloat(String(imovel.preco).replace(/\D/g, ''));
                
                if (!isNaN(precoMin) && precoNumerico < precoMin) {
                    return false;
                }
                if (!isNaN(precoMax) && precoNumerico > precoMax) {
                    return false;
                }
                return true;
            });

            renderImoveisListagem(imoveisFiltrados);
        });
    }

    const viewGridBtn = document.getElementById('view-grid');
    const viewListBtn = document.getElementById('view-list');

    const gridContainer = document.getElementById('grid-container');
    const listContainer = document.getElementById('list-container');

    function generateListView() {
        if (!gridContainer || !listContainer) return;
        
        const imovelCards = gridContainer.querySelectorAll('.imovel-card');
        let listHTML = '';

        imovelCards.forEach(card => {
            const imgSrc = card.querySelector('img').src;
            const title = card.querySelector('h3').innerText;
            const price = card.querySelector('.preco').innerText;
            const location = card.querySelector('.localizacao').innerText;
            const features = card.querySelector('.imovel-card-features').innerHTML;
            const detailsLink = card.querySelector('.btn-detalhes').href;

            listHTML += `
                <div class="imovel-list-item">
                    <img src="${imgSrc}" alt="${title}">
                    <div class="imovel-list-content">
                        <h3>${title}</h3>
                        <p class="preco">${price}</p>
                        <p class="localizacao">${location}</p>
                        <div class="imovel-card-features">${features}</div>
                        <a href="${detailsLink}" class="btn-detalhes">Ver Detalhes</a>
                    </div>
                </div>
            `;
        });

        listContainer.innerHTML = listHTML;
    }

    if (viewGridBtn) {
        // A geração da lista agora depende dos dados dinâmicos
        // Vamos chamar após a renderização inicial
        setTimeout(generateListView, 100); 

        viewGridBtn.addEventListener('click', () => {
            gridContainer.style.display = 'grid';
            listContainer.style.display = 'none';

            viewGridBtn.classList.add('active');
            viewListBtn.classList.remove('active');
        });

        viewListBtn.addEventListener('click', () => {
            gridContainer.style.display = 'none';
            listContainer.style.display = 'block';

            viewGridBtn.classList.remove('active');
            viewListBtn.classList.add('active');
        });
    }


    // --- LÓGICA PARA A PÁGINA DE DETALHES DO IMÓVEL ---
    if (page === 'detalhe-imovel.html') {
        const params = new URLSearchParams(window.location.search);
        const imovelId = params.get('id');
        const imoveis = JSON.parse(localStorage.getItem('imoveis')) || [];
        const imovel = imoveis.find(i => i.id == imovelId);

        if (imovel) {
            document.title = `Imobiliária Valor - ${imovel.titulo}`;
            
            const precoFormatado = imovel.preco.includes('/mês') 
                ? imovel.preco 
                : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(imovel.preco);

            document.querySelector('.imovel-header h1').textContent = imovel.titulo;
            document.querySelector('.imovel-header .localizacao').innerHTML = `<i class="fa-solid fa-map-marker-alt"></i> ${imovel.localizacao}`;
            document.getElementById('imagem-destaque').src = imovel.imagem || 'images/placeholder.jpg';
            document.querySelector('.descricao-imovel p').textContent = imovel.descricao;
            
            const featuresContainer = document.querySelector('.features-grid');
            featuresContainer.innerHTML = `
                <div class="feature-item"><div><i class="fa-solid fa-ruler-combined"></i></div><span>${imovel.area} m²</span><p>Área útil</p></div>
                <div class="feature-item"><div><i class="fa-solid fa-bed"></i></div><span>${imovel.quartos}</span><p>Quartos</p></div>
                <div class="feature-item"><div><i class="fa-solid fa-bath"></i></div><span>${imovel.banheiros}</span><p>Banheiros</p></div>
                <div class="feature-item"><div><i class="fa-solid fa-car"></i></div><span>${imovel.vagas}</span><p>Vagas</p></div>
            `;

            const whatsappLink = document.querySelector('.btn-whatsapp');
            whatsappLink.href = `https://wa.me/5599999999999?text=Olá!%20Tenho%20interesse%20no%20imóvel:%20${encodeURIComponent(imovel.titulo)}`;

            // --- INICIALIZAÇÃO DO MAPA ---
            const secaoMapa = document.querySelector('.localizacao-mapa');
            if (secaoMapa) {
                secaoMapa.style.display = 'block'; // Garante que a seção esteja visível

                let lat = -23.55052; // Coordenadas genéricas de São Paulo
                let lon = -46.633308;
                let zoom = 12;
                let popupText = `<b>Localização de Exemplo</b><br>Centro, São Paulo`;

                if (imovel.coords && imovel.coords.lat && imovel.coords.lon) {
                    lat = imovel.coords.lat;
                    lon = imovel.coords.lon;
                    zoom = 16;
                    popupText = `<b>${imovel.titulo}</b><br>${imovel.localizacao}`;
                }

                const map = L.map('mapa-detalhe').setView([lat, lon], zoom);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

                L.marker([lat, lon]).addTo(map)
                    .bindPopup(popupText)
                    .openPopup();
            }

        } else {
            document.querySelector('.detalhe-imovel-grid').innerHTML = '<h1>Imóvel não encontrado</h1><p>O imóvel que você está procurando não existe ou foi removido.</p>';
        }
    }

    const imagemDestaque = document.getElementById('imagem-destaque');
    const thumbnails = document.querySelectorAll('.thumbnail-item');

    if (imagemDestaque && thumbnails.length > 0) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                thumbnails.forEach(item => item.classList.remove('active'));
                this.classList.add('active');
                
                // Para este exemplo, as imagens da galeria ainda são estáticas
                // A lógica para carregar várias imagens por imóvel precisaria ser adicionada
                const newSrc = this.src.replace('-thumb', '-large');
                imagemDestaque.src = newSrc;
            });
        });
    }


    // Lógica do Menu Hambúrguer
    const menuHamburger = document.querySelector('.menu-hamburger');
    const nav = document.querySelector('header nav ul');

    if (menuHamburger && nav) {
        menuHamburger.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuHamburger.classList.toggle('active');
        });
    }


    // Lógica do Formulário de Anúncio
    const formAnuncio = document.getElementById('form-anuncio');
    const formFeedback = document.getElementById('form-feedback');

    if (formAnuncio) {
        formAnuncio.addEventListener('submit', function(e) {
            e.preventDefault();

            // Simulação de envio bem-sucedido
            // Em um cenário real, aqui você enviaria os dados para um servidor
            const formData = new FormData(formAnuncio);
            const data = Object.fromEntries(formData.entries());

            // Exibir mensagem de sucesso
            formFeedback.textContent = 'Seu anúncio foi enviado com sucesso! Nossa equipe entrará em contato em breve.';
            formFeedback.classList.remove('hidden', 'error');
            formFeedback.classList.add('success');

            // Limpar o formulário
            formAnuncio.reset();

            // Opcional: rolar para a mensagem de feedback
            formFeedback.scrollIntoView({ behavior: 'smooth' });
        });
    }
});
