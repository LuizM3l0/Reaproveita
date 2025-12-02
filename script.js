document.addEventListener('DOMContentLoaded', () => {
    const conteudoPrincipal = document.getElementById('conteudo-principal');
    const caixaBusca = document.getElementById('caixa-busca');
    const botaoBusca = document.getElementById('botao-busca');
    let todosOsArtigos = [];

    // Carrega os dados do JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            todosOsArtigos = data.flatMap(topic => topic.articles);
            renderizarArtigos(todosOsArtigos);
        })
        .catch(error => {
            console.error('Erro ao carregar os dados:', error);
            conteudoPrincipal.innerHTML = '<p>Não foi possível carregar as dicas. Tente novamente mais tarde.</p>';
        });

    // Função para renderizar os artigos na tela
    const renderizarArtigos = (artigos) => {
        conteudoPrincipal.innerHTML = ''; // Limpa o conteúdo atual

        if (artigos.length === 0) {
            conteudoPrincipal.innerHTML = '<p>Nenhum resultado encontrado.</p>';
            return;
        }

        artigos.forEach(artigo => {
            const articleElement = document.createElement('article');
            
            const tagsHTML = artigo.tags.map(tag => `<span class="tag">#${tag}</span>`).join('');

            articleElement.innerHTML = `
                <h2>${artigo.title}</h2>
                ${artigo.paragraphs.map(p => `<p>${p}</p>`).join('')}
                <div class="tags">
                    ${tagsHTML}
                </div>
            `;
            conteudoPrincipal.appendChild(articleElement);
        });
    };

    // Função para filtrar os artigos
    const filtrarArtigos = () => {
        const termoBusca = caixaBusca.value.toLowerCase().trim();

        if (!termoBusca) {
            renderizarArtigos(todosOsArtigos);
            return;
        }

        const artigosFiltrados = todosOsArtigos.filter(artigo => {
            const textoArtigo = (artigo.title + ' ' + artigo.paragraphs.join(' ') + ' ' + artigo.tags.join(' ')).toLowerCase();
            return textoArtigo.includes(termoBusca);
        });

        renderizarArtigos(artigosFiltrados);
    };

    // Adiciona os eventos de busca
    botaoBusca.addEventListener('click', filtrarArtigos);
    caixaBusca.addEventListener('keyup', filtrarArtigos);
});