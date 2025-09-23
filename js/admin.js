document.addEventListener('DOMContentLoaded', function() {
    const page = window.location.pathname.split("/").pop();

    if (page === 'login.html') {
        handleLoginPage();
    } else if (page === 'admin.html') {
        handleAdminPage();
    }
});

// --- LÓGICA DE LOGIN ---
function handleLoginPage() {
    const loginForm = document.getElementById('login-form');
    if (sessionStorage.getItem('loggedIn') === 'true') {
        window.location.href = 'admin.html';
        return;
    }
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        const errorEl = document.getElementById('login-error');

        if (username === 'admin' && password === 'admin123') {
            sessionStorage.setItem('loggedIn', 'true');
            window.location.href = 'admin.html';
        } else {
            errorEl.textContent = 'Usuário ou senha inválidos.';
        }
    });
}

// --- LÓGICA DA PÁGINA DE ADMIN ---

// Variáveis de escopo do módulo para compartilhar estado
let imoveis = [];
const imovelForm = document.getElementById('imovel-form');
const imoveisListAdmin = document.getElementById('imoveis-list-admin');
const formTitle = document.getElementById('form-title');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const fotosInput = document.getElementById('fotos');
const fotosPreview = document.getElementById('fotos-preview');

/**
 * Função principal que orquestra a página de administração.
 */
function handleAdminPage() {
    if (sessionStorage.getItem('loggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    initAuth();
    initNavigation();
    initImovelForm();
    initImoveisList();

    // Carga inicial
    imoveis = getImoveis();
    populateInitialData();
    loadImoveis();
}

/**
 * Inicializa o botão de logout.
 */
function initAuth() {
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('loggedIn');
        window.location.href = 'login.html';
    });
}

/**
 * Inicializa a navegação da barra lateral.
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-nav a[data-target]');
    const sections = document.querySelectorAll('.admin-section');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');

            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');

            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');

            if (targetId === 'dashboard') {
                loadImoveis();
            }
        });
    });
}

/**
 * Inicializa os eventos do formulário de imóveis.
 */
function initImovelForm() {
    imovelForm.addEventListener('submit', handleFormSubmit);
    fotosInput.addEventListener('change', handlePhotoPreview);
    cancelEditBtn.addEventListener('click', resetForm);
}

/**
 * Inicializa os eventos da lista de imóveis (editar/excluir).
 */
function initImoveisList() {
    imoveisListAdmin.addEventListener('click', handleListClick);
}

// --- FUNÇÕES DE DADOS ---

function getImoveis() {
    return JSON.parse(localStorage.getItem('imoveis')) || [];
}

function saveImoveis() {
    localStorage.setItem('imoveis', JSON.stringify(imoveis));
}

function populateInitialData() {
    if (imoveis.length === 0) {
        imoveis = [
            { id: 1, titulo: "Apartamento Moderno no Coração da Cidade", preco: "1250000", localizacao: "Centro, Cidade Exemplo", tipo: "Apartamento", quartos: "3", banheiros: "2", vagas: "2", area: "120", imagem: "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", descricao: "Este apartamento espaçoso e moderno está localizado no coração da cidade, oferecendo acesso fácil a todas as comodidades. Com acabamentos de alta qualidade, uma cozinha gourmet e uma vista deslumbrante da cidade, é o lugar perfeito para quem busca conforto e conveniência." },
            { id: 2, titulo: "Casa de Família com Quintal Amplo", preco: "980000", localizacao: "Bairro Residencial, Cidade Exemplo", tipo: "Casa", quartos: "4", banheiros: "3", vagas: "3", area: "250", imagem: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", descricao: "Uma casa encantadora, ideal para famílias, localizada em um bairro tranquilo e arborizado. Possui um quintal grande com espaço para piscina e área de lazer. Os interiores são arejados e bem iluminados, com uma suíte master e quartos espaçosos." },
            { id: 3, titulo: "Escritório Comercial em Localização Estratégica", preco: "5500/mês", localizacao: "Distrito Financeiro, Cidade Exemplo", tipo: "Comercial", quartos: "0", banheiros: "2", vagas: "5", area: "200", imagem: "https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", descricao: "Sala comercial moderna e espaçosa, perfeita para empresas que buscam uma localização de prestígio. O edifício oferece segurança 24 horas, estacionamento para clientes e uma infraestrutura completa para o seu negócio prosperar." }
        ];
        saveImoveis();
    }
}

// --- FUNÇÕES DE RENDERIZAÇÃO E MANIPULAÇÃO DO DOM ---

/**
 * Carrega e exibe a lista de imóveis de forma segura.
 */
function loadImoveis() {
    imoveisListAdmin.innerHTML = '';
    if (imoveis.length === 0) {
        imoveisListAdmin.innerHTML = '<p>Nenhum imóvel cadastrado.</p>';
        return;
    }

    imoveis.forEach(imovel => {
        // Criação segura dos elementos para evitar XSS
        const card = document.createElement('div');
        card.className = 'imovel-admin-card';

        const img = document.createElement('img');
        img.src = imovel.imagem || 'images/placeholder.jpg';
        img.alt = imovel.titulo; // .alt é seguro

        const infoDiv = document.createElement('div');
        infoDiv.className = 'imovel-admin-info';

        const h4 = document.createElement('h4');
        h4.textContent = imovel.titulo; // Usar textContent em vez de innerHTML

        const p = document.createElement('p');
        const precoFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(String(imovel.preco).replace('/mês',''));
        p.textContent = `${imovel.localizacao} - ${precoFormatado}`; // Usar textContent

        infoDiv.appendChild(h4);
        infoDiv.appendChild(p);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'imovel-admin-actions';
        actionsDiv.innerHTML = `
            <button class="edit-btn" data-id="${imovel.id}"><i class="fas fa-edit"></i></button>
            <button class="delete-btn" data-id="${imovel.id}"><i class="fas fa-trash"></i></button>
        `; // innerHTML aqui é seguro pois não contém dados do usuário

        card.appendChild(img);
        card.appendChild(infoDiv);
        card.appendChild(actionsDiv);

        imoveisListAdmin.appendChild(card);
    });
}

/**
 * Manipula o envio do formulário para adicionar ou editar um imóvel.
 * @param {Event} e - O evento de submit.
 */
function handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('imovel-id').value;
    
    const imagens = Array.from(fotosPreview.querySelectorAll('img')).map(img => img.src);

    const imovelData = {
        titulo: document.getElementById('titulo').value,
        preco: document.getElementById('preco').value,
        localizacao: document.getElementById('localizacao').value,
        tipo: document.getElementById('tipo-imovel').value,
        quartos: document.getElementById('quartos').value,
        banheiros: document.getElementById('banheiros').value,
        vagas: document.getElementById('vagas').value,
        area: document.getElementById('area').value,
        imagem: imagens.length > 0 ? imagens[0] : 'images/placeholder.jpg', 
        imagens: imagens,
        descricao: document.getElementById('descricao').value,
    };

    if (id) { // Editando
        const index = imoveis.findIndex(imovel => imovel.id == id);
        imoveis[index] = { ...imoveis[index], ...imovelData };
    } else { // Adicionando
        imovelData.id = Date.now();
        imoveis.push(imovelData);
    }

    saveImoveis();
    resetForm();
    document.querySelector('.sidebar-nav a[data-target="dashboard"]').click();
}

/**
 * Manipula cliques na lista de imóveis para editar ou excluir.
 * @param {Event} e - O evento de clique.
 */
function handleListClick(e) {
    const target = e.target.closest('button');
    if (!target) return;

    const id = target.dataset.id;

    if (target.classList.contains('edit-btn')) {
        fillFormForEdit(id);
    }

    if (target.classList.contains('delete-btn')) {
        if (confirm('Tem certeza que deseja excluir este imóvel?')) {
            imoveis = imoveis.filter(i => i.id != id);
            saveImoveis();
            loadImoveis();
        }
    }
}

/**
 * Preenche o formulário com os dados de um imóvel para edição.
 * @param {string} id - O ID do imóvel a ser editado.
 */
function fillFormForEdit(id) {
    const imovel = imoveis.find(i => i.id == id);
    if (!imovel) return;

    formTitle.textContent = 'Editar Imóvel';
    document.getElementById('imovel-id').value = imovel.id;
    document.getElementById('titulo').value = imovel.titulo;
    document.getElementById('preco').value = imovel.preco;
    document.getElementById('localizacao').value = imovel.localizacao;
    document.getElementById('tipo-imovel').value = imovel.tipo;
    document.getElementById('quartos').value = imovel.quartos;
    document.getElementById('banheiros').value = imovel.banheiros;
    document.getElementById('vagas').value = imovel.vagas;
    document.getElementById('area').value = imovel.area;
    document.getElementById('descricao').value = imovel.descricao;

    fotosPreview.innerHTML = '';
    const imagesToPreview = imovel.imagens && imovel.imagens.length > 0 ? imovel.imagens : (imovel.imagem ? [imovel.imagem] : []);
    imagesToPreview.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        fotosPreview.appendChild(img);
    });
    
    cancelEditBtn.style.display = 'inline-block';
    document.querySelector('.sidebar-nav a[data-target="add-imovel"]').click();
}

/**
 * Gera previews para as imagens selecionadas no input de arquivo.
 * @param {Event} e - O evento de change do input.
 */
function handlePhotoPreview(e) {
    fotosPreview.innerHTML = '';
    for (const file of e.target.files) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = document.createElement('img');
            img.src = event.target.result;
            fotosPreview.appendChild(img);
        }
        reader.readAsDataURL(file);
    }
}

/**
 * Reseta o formulário para o estado inicial.
 */
function resetForm() {
    imovelForm.reset();
    document.getElementById('imovel-id').value = '';
    fotosPreview.innerHTML = '';
    formTitle.textContent = 'Adicionar Novo Imóvel';
    cancelEditBtn.style.display = 'none';
}
