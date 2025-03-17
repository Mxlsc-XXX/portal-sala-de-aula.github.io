// Estado da aplicação
let estado = {
    trabalhos: [],
    datas: [],
    apps: [],
    guias: [],
    planilhas: [],
    avisos: [],
    respostas: [],
    monitoria: [],
    monitores: []
};

// Configuração dos modais
let modalItem;
let modalLogin;
let tipoAtual = '';
let modoEdicao = false;

// Configuração de autenticação
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
    
    atualizarPagina();
    
    // Configurar preview de imagem
    const itemImagem = document.getElementById('itemImagem');
    const itemArquivo = document.getElementById('itemArquivo');
    const botaoSalvar = document.getElementById('botaoSalvar');

    if (itemImagem) {
        itemImagem.addEventListener('change', previewImagem);
    } else {
        console.error("Elemento 'itemImagem' não encontrado.");
    }

    if (itemArquivo) {
        itemArquivo.addEventListener('change', previewArquivo);
    } else {
        console.error("Elemento 'itemArquivo' não encontrado.");
    }

    if (botaoSalvar) {
        botaoSalvar.removeEventListener('click', salvarItem); // Remove o evento anterior
        botaoSalvar.addEventListener('click', salvarItem); // Adiciona o evento
    } else {
        console.error("Elemento 'botaoSalvar' não encontrado.");
    }

    // Adiciona evento para o botão de recarregar
    const botaoRecarregar = document.getElementById('botaoRecarregar');
    if (botaoRecarregar) {
        botaoRecarregar.addEventListener('click', atualizarPagina);
    } else {
        console.error("Elemento 'botaoRecarregar' não encontrado.");
    }
});

async function carregarDadosDoJSONBin() {
    try {
        const response = await fetch('https://api.jsonbin.io/v3/b/67d87de58561e97a50edfb77', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': '$2a$10$HQGRW2f7cor8XO9DyhyVo.ww1bbpBu/XQ0YCVbZUcyj/k51fOSK4u'
            }
        });
        if (!response.ok) throw new Error('Erro ao carregar dados: ' + response.statusText);
        const data = await response.json();
        estado = data.record; // Atualiza o estado com os dados carregados
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

async function salvarDadosNoJSONBin() {
    try {
        const response = await fetch('https://api.jsonbin.io/v3/b/67d87de58561e97a50edfb77', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': '$2a$10$HQGRW2f7cor8XO9DyhyVo.ww1bbpBu/XQ0YCVbZUcyj/k51fOSK4u'
            },
            body: JSON.stringify(estado)
        });
        if (!response.ok) throw new Error('Erro ao salvar dados: ' + response.statusText);
        console.log('Dados salvos com sucesso');
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
    }
}

function atualizarPagina() {
    carregarDadosDoJSONBin();
    renderizarTodos();
}

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

function atualizarVisibilidadeBotoes() {
    const botoesAdicionar = document.querySelectorAll('.modo-edicao');
    const botoesMonitor = document.querySelectorAll('.modo-monitor'); // Seleciona botões específicos para o modo monitor

    botoesAdicionar.forEach(btn => {
        if (modoEdicao) {
            btn.style.display = 'block'; // Mostra os botões no modo de edição
        } else {
            btn.style.display = 'none'; // Oculta os botões no modo de visualização
        }
    });

    botoesMonitor.forEach(btn => {
        if (document.body.classList.contains('modo-monitor')) {
            btn.style.display = 'block'; // Mostra os botões no modo monitor
        } else {
            btn.style.display = 'none'; // Oculta os botões se não estiver no modo monitor
        }
    });
}

atualizarVisibilidadeBotoes();

// Funções de autenticação
function abrirModalLogin() {
    if (modoEdicao || document.body.classList.contains('modo-monitor')) {
        desativarModoEdicao(); // Desativa o modo de edição
        document.body.classList.remove('modo-monitor'); // Remove a classe do modo monitor
    } else {
        modalLogin.show(); // Mostra o modal de login
    }
}

async function verificarAcesso() {
    const codigo = document.getElementById('codigoAcesso').value;
    if (codigo === estado.senhas.editor) {
        ativarModoEdicao();
        localStorage.setItem(CHAVE_AUTENTICACAO, 'true');
        modalLogin.hide();
    } else if (codigo === estado.senhas.monitor) {
        entrarModoMonitor(); // Chama a função que ativa o modo monitor
        localStorage.setItem(CHAVE_AUTENTICACAO_MONITOR, 'true'); // Armazena a autenticação do monitor
        modalLogin.hide();
    } else {
        alert('Código de acesso incorreto!');
    }
}

function entrarModoMonitor() {
        modoEdicao = false; 
        document.body.classList.add('modo-monitor'); 
        atualizarVisibilidadeBotoes();

        const btnLogin = document.getElementById('btnLogin');
        btnLogin.classList.add('modo-edicao');
        btnLogin.innerHTML = '<i class="bi bi-key"></i> Sair do Modo Monitor';
}

function ativarModoEdicao() {
    modoEdicao = true;
    document.body.classList.remove('modo-visualizacao');
    
    // Atualizar a visibilidade dos botões
    atualizarVisibilidadeBotoes();

    // Atualizar botão desktop
    const btnLogin = document.getElementById('btnLogin');
    btnLogin.classList.add('modo-edicao');
    btnLogin.innerHTML = '<i class="bi bi-key"></i> Sair do Modo Edição';
}

function desativarModoEdicao() {
    modoEdicao = false;
    document.body.classList.add('modo-visualizacao');
    
    // Atualizar a visibilidade dos botões
    atualizarVisibilidadeBotoes();

    // Atualizar botão desktop
    const btnLogin = document.getElementById('btnLogin');
    btnLogin.classList.remove('modo-edicao');
    btnLogin.innerHTML = '<i class="bi bi-key"></i> Modo Edição';
    
    localStorage.removeItem(CHAVE_AUTENTICACAO);
}

// Funções de gerenciamento de dados
async function carregarDados() {
    try {
        const response = await fetch('dados.json');
        if (!response.ok) throw new Error('Erro ao carregar dados: ' + response.statusText);
        const dados = await response.json();
        estado = dados; // Atualiza o estado com os dados carregados
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        // Inicializar as listas se não houver dados
        estado.trabalhos = [];
        estado.datas = [];
        estado.apps = [];
        estado.guias = [];
        estado.planilhas = [];
        estado.avisos = [];
        estado.respostas = [];
        estado.monitoria = [];
        estado.monitores = [];
    }
}

function salvarDados() {
    const dados = JSON.stringify(estado);
    // Salvar os dados no arquivo JSON
    fetch('salvarDados.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: dados
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro ao salvar dados: ' + response.statusText);
    })
    .catch(error => console.error('Erro ao salvar dados:', error));
}

// Funções de renderização
function renderizarTodos() {
    renderizarLista('trabalhos');
    renderizarLista('datas');
    renderizarLista('apps');
    renderizarLista('guias');
    renderizarLista('planilhas');
    renderizarLista('avisos');
    renderizarLista('respostas');
    renderizarLista('monitoria');
}

function renderizarLista(tipo) {
    const container = document.getElementById(`${tipo}-lista`);
    container.innerHTML = '';

    // Verifique se o tipo existe e é um array
    if (!Array.isArray(estado[tipo])) {
        console.error('Tipo inválido ou não inicializado:', tipo);
        estado[tipo] = []; // Inicializa como um array vazio
    }

    estado[tipo].forEach((item, index) => {
        const card = criarCard(item, tipo, index);
        container.appendChild(card);

        // Renderizar respostas dentro do card
        if (item.respostas && item.respostas.length > 0) {
            const respostasContainer = document.createElement('div');
            respostasContainer.className = 'respostas-container p-3 bg-light';

            item.respostas.forEach(resposta => {
                const respostaDiv = document.createElement('div');
                respostaDiv.className = 'resposta mb-2';
                respostaDiv.innerHTML = `
                    <div class="border p-2 rounded" style="background-color: #f0f0f0;">
                        <strong>${resposta.autor}:</strong> 
                        <span>${resposta.texto}</span>
                        ${resposta.imagem ? `<img src="${resposta.imagem}" class="imagem-preview" alt="Imagem da resposta">` : ''}
                        <small class="text-muted d-block">${formatarData(resposta.data)}</small>
                    </div>
                `;
                respostasContainer.appendChild(respostaDiv);
            });

            card.querySelector('.card-body').appendChild(respostasContainer);
        }
    });
}

function criarCard(item, tipo, index) {
    const div = document.createElement('div');
    div.className = 'card item-card';
    
    let conteudo = `
        <div class="card-body">
            <h5 class="card-title">${item.titulo || item.nome}</h5>
            <p class="card-text">${item.descricao || ''}</p>
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
    if (document.body.classList.contains('modo-monitor') && tipo === 'monitoria') { 
        conteudo += `
            <button class="btn btn-sm btn-primary float-end" onclick="responderPergunta(${index})">
                Responder
            </button>
            <button class="btn btn-sm btn-danger float-end" onclick="removerItem('${tipo}', ${index})">
 <i class="bi bi-trash"></i>
            </button>
        `;
    } else if (tipo === 'monitoria') { 
        conteudo += `
            <button class="btn btn-sm btn-danger float-end" onclick="removerItem('${tipo}', ${index})">
                <i class="bi bi-trash"></i>
            </button>
        `;
    }

    conteudo += '</div>';
    div.innerHTML = conteudo;
    return div;

    atualizarPagina();
}

function responderPergunta(index) {
    const resposta = prompt("Digite sua resposta:");
    if (resposta) {
        const novaResposta = {
            texto: resposta,
            data: new Date().toISOString(),
            autor: 'Monitor' // Pode capturar o nome real se necessário
        };
        
        if (!estado.monitoria[index]) {
            console.error('Índice inválido:', index);
            return;
        }
        
        estado.monitoria[index].respostas = estado.monitoria[index].respostas || [];
        estado.monitoria[index].respostas.push(novaResposta);
        salvarDadosNoJSONBin();
        renderizarLista('monitoria');
    }
}

function adicionarPergunta() {
    tipoAtual = 'monitoria';
    // Limpar campos específicos antes de abrir o modal
    document.getElementById('itemData').value = '';
    document.getElementById('itemLink').value = '';
    abrirModalItem();
}

// Modifique a função de adicionar resposta
function adicionarResposta() {
    tipoAtual = 'respostas';
    // Limpar campos não relevantes
    document.getElementById('itemData').value = '';
    abrirModalItem();
}

// Função para inscrever como monitor
function inscreverComoMonitor() {
    // Redireciona para o formulário de inscrição
    window.open("https://forms.gle/gDhNFEjo7EFYANic6", "_blank");
}

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

async function salvarItem() {
    const botaoSalvar = document.getElementById('botaoSalvar');
    botaoSalvar.disabled = true; // Desabilita o botão

    const titulo = document.getElementById('itemTitulo').value;
    const descricao = document.getElementById('itemDescricao').value;
    const data = document.getElementById('itemData').value;
    const link = document.getElementById('itemLink').value;
    const imagemInput = document.getElementById('itemImagem');
    const arquivoInput = document.getElementById('itemArquivo');

    if (!titulo) {
        alert('Por favor, preencha o título');
        botaoSalvar.disabled = false; // Reabilita o botão
        return;
    }

    // Verificar se o item já existe
    const itemExistente = estado[tipoAtual].find(item => item.titulo === titulo);
    if (itemExistente) {
        botaoSalvar.disabled = false; // Reabilita o botão
        return;
    }

    let novoItem = {
        titulo,
        descricao,
        data: data || null,
        link: link || null,
        respostas: [] // Inicializa a lista de respostas
    };

    console.log("Novo item antes de processar arquivos:", novoItem);

    const processarArquivos = async () => {
        if (imagemInput.files[0]) {
            novoItem.imagem = await lerArquivo(imagemInput.files[0]);
        }
        if (arquivoInput.files[0]) {
            novoItem.arquivo = await lerArquivo(arquivoInput.files[0]);
        }
        
        console.log("Novo item após processar arquivos:", novoItem);
        
        estado[tipoAtual].push(novoItem); // Adiciona uma única vez
        salvarDados();
        await salvarDadosNoJSONBin(); // Salva no JSONBin
        renderizarLista(tipoAtual); // Renderiza apenas uma vez
        modalItem.hide();
        botaoSalvar.disabled = false; // Reabilita o botão após o salvamento
    };

    await processarArquivos();
}

function lerArquivo(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

async function removerItem(tipo, index) {
    if (confirm('Tem certeza que deseja remover este item?')) {
        estado[tipo].splice(index, 1);
        salvarDados();
        await salvarDadosNoJSONBin();
        renderizarLista(tipo);
    }
}

// Funções auxiliares
function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}