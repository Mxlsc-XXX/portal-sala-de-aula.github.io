// Estado da aplicação
let estado = {
    trabalhos: [],
    datas: [],
    apps: [],
    guias: [],
    planilhas: [],
    avisos: []
};

// Configuração dos modais
let modalItem;
let modalLogin;
let tipoAtual = '';
let modoEdicao = false;

// Configuração de autenticação
const CODIGO_ACESSO = '123456'; // Você pode alterar este código
const CHAVE_ESTADO = 'portalSala';
const CHAVE_AUTENTICACAO = 'portalSalaAuth';

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    modalItem = new bootstrap.Modal(document.getElementById('itemModal'));
    modalLogin = new bootstrap.Modal(document.getElementById('loginModal'));
    
    // Verificar autenticação salva
    const autenticado = localStorage.getItem(CHAVE_AUTENTICACAO);
    if (autenticado === 'true') {
        ativarModoEdicao();
    } else {
        document.body.classList.add('modo-visualizacao');
    }
    
    carregarDados();
    renderizarTodos();
    
    // Configurar preview de imagem
    document.getElementById('itemImagem').addEventListener('change', previewImagem);
    document.getElementById('itemArquivo').addEventListener('change', previewArquivo);
});

// Funções de preview
function previewImagem(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('imagemPreview');
    preview.innerHTML = '';
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'imagem-preview';
            preview.appendChild(img);
        }
        reader.readAsDataURL(file);
    }
}

function previewArquivo(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('arquivoPreview');
    preview.innerHTML = '';
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const link = document.createElement('a');
            link.href = e.target.result;
            link.className = 'arquivo-link';
            link.innerHTML = `<i class="bi bi-file-earmark"></i> ${file.name}`;
            preview.appendChild(link);
        }
        reader.readAsDataURL(file);
    }
}

// Funções de autenticação
function abrirModalLogin() {
    if (modoEdicao) {
        desativarModoEdicao();
    } else {
        modalLogin.show();
    }
}

function verificarAcesso() {
    const codigo = document.getElementById('codigoAcesso').value;
    if (codigo === CODIGO_ACESSO) {
        ativarModoEdicao();
        localStorage.setItem(CHAVE_AUTENTICACAO, 'true');
        modalLogin.hide();
    } else {
        alert('Código de acesso incorreto!');
    }
}

function ativarModoEdicao() {
    modoEdicao = true;
    document.body.classList.remove('modo-visualizacao');
    
    // Atualizar botão desktop
    const btnLogin = document.getElementById('btnLogin');
    btnLogin.classList.add('modo-edicao');
    btnLogin.innerHTML = '<i class="bi bi-key"></i> Sair do Modo Edição';
    
    // Atualizar botão mobile
    const btnLoginMobile = document.getElementById('btnLoginMobile');
    btnLoginMobile.classList.add('modo-edicao');
    btnLoginMobile.innerHTML = '<i class="bi bi-key"></i>';
}

function desativarModoEdicao() {
    modoEdicao = false;
    document.body.classList.add('modo-visualizacao');
    
    // Atualizar botão desktop
    const btnLogin = document.getElementById('btnLogin');
    btnLogin.classList.remove('modo-edicao');
    btnLogin.innerHTML = '<i class="bi bi-key"></i> Modo Edição';
    
    // Atualizar botão mobile
    const btnLoginMobile = document.getElementById('btnLoginMobile');
    btnLoginMobile.classList.remove('modo-edicao');
    btnLoginMobile.innerHTML = '<i class="bi bi-key"></i>';
    
    localStorage.removeItem(CHAVE_AUTENTICACAO);
}

// Funções de gerenciamento de dados
function salvarDados() {
    localStorage.setItem(CHAVE_ESTADO, JSON.stringify(estado));
}

function carregarDados() {
    const dados = localStorage.getItem(CHAVE_ESTADO);
    if (dados) {
        estado = JSON.parse(dados);
    }
}

// Funções de renderização
function renderizarTodos() {
    renderizarLista('trabalhos');
    renderizarLista('datas');
    renderizarLista('apps');
    renderizarLista('guias');
    renderizarLista('planilhas');
    renderizarLista('avisos');
}

function renderizarLista(tipo) {
    const container = document.getElementById(`${tipo}-lista`);
    container.innerHTML = '';
    
    estado[tipo].forEach((item, index) => {
        const card = criarCard(item, tipo, index);
        container.appendChild(card);
    });
}

function criarCard(item, tipo, index) {
    const div = document.createElement('div');
    div.className = 'card item-card';
    
    let conteudo = `
        <div class="card-body">
            <h5 class="card-title">${item.titulo}</h5>
            <p class="card-text">${item.descricao}</p>
            ${item.data ? `<p class="data">Data: ${formatarData(item.data)}</p>` : ''}
            ${item.link ? `<a href="${item.link}" target="_blank" class="btn btn-sm btn-outline-primary">Acessar Link</a>` : ''}
    `;
    
    if (item.imagem) {
        conteudo += `<img src="${item.imagem}" class="imagem-preview" alt="Imagem do item">`;
    }
    
    if (item.arquivo) {
        conteudo += `
            <a href="${item.arquivo}" class="arquivo-link" target="_blank" download="${item.titulo}">
                <i class="bi bi-file-earmark"></i> ${item.titulo}
            </a>

        `;
    }
    
    if (modoEdicao) {
        conteudo += `
            <button class="btn btn-sm btn-danger float-end" onclick="removerItem('${tipo}', ${index})">
                <i class="bi bi-trash"></i>
            </button>
        `;
    }
    
    conteudo += '</div>';
    div.innerHTML = conteudo;
    return div;
}

// Funções de manipulação de itens
function adicionarTrabalho() {
    if (!modoEdicao) return;
    tipoAtual = 'trabalhos';
    abrirModalItem();
}

function adicionarData() {
    if (!modoEdicao) return;
    tipoAtual = 'datas';
    abrirModalItem();
}

function adicionarApp() {
    if (!modoEdicao) return;
    tipoAtual = 'apps';
    abrirModalItem();
}

function adicionarGuia() {
    if (!modoEdicao) return;
    tipoAtual = 'guias';
    abrirModalItem();
}

function adicionarPlanilha() {
    if (!modoEdicao) return;
    tipoAtual = 'planilhas';
    abrirModalItem();
}

function adicionarAviso() {
    if (!modoEdicao) return;
    tipoAtual = 'avisos';
    abrirModalItem();
}

function abrirModalItem() {
    document.getElementById('itemForm').reset();
    document.getElementById('imagemPreview').innerHTML = '';
    document.getElementById('arquivoPreview').innerHTML = '';
    modalItem.show();
}

function salvarItem() {
    if (!modoEdicao) return;
    
    const titulo = document.getElementById('itemTitulo').value;
    const descricao = document.getElementById('itemDescricao').value;
    const data = document.getElementById('itemData').value;
    const link = document.getElementById('itemLink').value;
    const imagemInput = document.getElementById('itemImagem');
    const arquivoInput = document.getElementById('itemArquivo');

    if (!titulo) {
        alert('Por favor, preencha o título');
        return;
    }

    const novoItem = {
        titulo,
        descricao,
        data: data || null,
        link: link || null
    };

    // Processar imagem
    if (imagemInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            novoItem.imagem = e.target.result;
            salvarEAtualizar(novoItem);
        }
        reader.readAsDataURL(imagemInput.files[0]);
    } else {
        salvarEAtualizar(novoItem);
    }

    // Processar arquivo
    if (arquivoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            novoItem.arquivo = e.target.result;
            salvarEAtualizar(novoItem);
        }
        reader.readAsDataURL(arquivoInput.files[0]);
    }
}

function salvarEAtualizar(novoItem) {
    estado[tipoAtual].push(novoItem);
    salvarDados();
    renderizarLista(tipoAtual);
    modalItem.hide();
}

function removerItem(tipo, index) {
    if (!modoEdicao) return;
    
    if (confirm('Tem certeza que deseja remover este item?')) {
        estado[tipo].splice(index, 1);
        salvarDados();
        renderizarLista(tipo);
    }
}

// Funções auxiliares
function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}
