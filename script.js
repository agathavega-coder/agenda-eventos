// Base de dados de eventos (Mínimo 8 eventos)
const eventos = [
    { id: 1, nome: "Interclasse de Futebol", categoria: "Esportes", data: "2026-09-10", hora: "08:00", local: "Quadra Poliesportiva", descricao: "Torneio anual entre os anos escolares com premiação para os três primeiros lugares." },
    { id: 2, nome: "Feira de Ciências e Tecnologia", categoria: "Tecnologia", data: "2026-09-25", hora: "09:00", local: "Pátio Central", descricao: "Apresentação de projetos inovadores desenvolvidos pelos alunos do Ensino Fundamental e Médio." },
    { id: 3, nome: "Mostra Cultural de Primavera", categoria: "Cultura", data: "2026-10-05", hora: "14:00", local: "Auditório Principal", descricao: "Apresentações de teatro, dança, música e exposição de artes visuais." },
    { id: 4, nome: "Olimpíada Interna de Matemática", categoria: "Educação", data: "2026-10-18", hora: "10:00", local: "Salas de Aula", descricao: "Competição acadêmica individual para incentivo ao raciocínio lógico." },
    { id: 5, nome: "Workshop de Robótica", categoria: "Tecnologia", data: "2026-11-02", hora: "13:30", local: "Laboratório de Informática", descricao: "Oficina prática de programação e montagem de robôs seguidores de linha." },
    { id: 6, nome: "Campeonato de Xadrez", categoria: "Esportes", data: "2026-11-15", hora: "09:00", local: "Biblioteca", descricao: "Torneio aberto de xadrez nas modalidades rápido e blitz." },
    { id: 7, nome: "Festival de Poesia", categoria: "Cultura", data: "2026-11-28", hora: "15:00", local: "Auditório Principal", descricao: "Declamação de poesias autorais com júri convidado." },
    { id: 8, nome: "Palestra: Orientação Profissional", categoria: "Educação", data: "2026-12-05", hora: "19:00", local: "Auditório Principal", descricao: "Encontro com profissionais de diversas áreas para tirar dúvidas do 3º ano." }
];

// Elementos DOM
const tabelaCorpo = document.getElementById("tabela-eventos-corpo");
const campoBusca = document.getElementById("campo-busca");
const botoesFiltro = document.querySelectorAll(".btn-filtro");
const selectEvento = document.getElementById("select-evento");
const modal = document.getElementById("modal-detalhes");
const btnFecharModal = document.getElementById("btn-fechar-modal");

let filtroAtual = "todos";

// 1. Renderizar Tabela
function renderizarTabela() {
    const textoBusca = campoBusca.value.toLowerCase();
    tabelaCorpo.innerHTML = "";

    const eventosFiltrados = eventos.filter(evento => {
        const atendeCategoria = filtroAtual === "todos" || evento.categoria === filtroAtual;
        const atendeBusca = evento.nome.toLowerCase().includes(textoBusca) || 
                             evento.local.toLowerCase().includes(textoBusca);
        return atendeCategoria && atendeBusca;
    });

    eventosFiltrados.forEach(evento => {
        const tr = document.createElement("tr");
        
        // Formatar data para exibição (dd/mm/aaaa)
        const dataFormatada = evento.data.split('-').reverse().join('/');

        tr.innerHTML = `
            <td>${dataFormatada}</td>
            <td>${evento.hora}</td>
            <td><strong>${evento.nome}</strong></td>
            <td>${evento.categoria}</td>
            <td>${evento.local}</td>
            <td>
                <button class="btn-detalhes" onclick="abrirModal(${evento.id})">👁️ Ver Detalhes</button>
            </td>
        `;
        tabelaCorpo.appendChild(tr);
    });
}

// 2. Preencher Select do Formulário
function preencherSelectEventos() {
    selectEvento.innerHTML = "";
    eventos.forEach(evento => {
        const option = document.createElement("option");
        option.value = evento.id;
        option.textContent = `${evento.nome} (${evento.data.split('-').reverse().join('/')})`;
        selectEvento.appendChild(option);
    });
}

// 3. Filtros por Categoria e Busca
botoesFiltro.forEach(btn => {
    btn.addEventListener("click", () => {
        botoesFiltro.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        filtroAtual = btn.getAttribute("data-categoria");
        renderizarTabela();
    });
});

campoBusca.addEventListener("input", renderizarTabela);

// 4. Modal de Detalhes
function abrirModal(id) {
    const evento = eventos.find(e => e.id === id);
    if (!evento) return;

    document.getElementById("modal-titulo").innerText = evento.nome;
    document.getElementById("modal-categoria").innerText = evento.categoria;
    document.getElementById("modal-datahora").innerText = `${evento.data.split('-').reverse().join('/')} às ${evento.hora}`;
    document.getElementById("modal-local").innerText = evento.local;
    document.getElementById("modal-descricao").innerText = evento.descricao;

    modal.classList.remove("hidden");
}

btnFecharModal.addEventListener("click", () => modal.classList.add("hidden"));
window.addEventListener("click", (e) => { if (e.target === modal) modal.classList.add("hidden"); });

// 5. Formulário de Inscrição
document.getElementById("form-inscricao").addEventListener("submit", (e) => {
    e.preventDefault();
    const mensagemSucesso = document.getElementById("mensagem-sucesso");
    mensagemSucesso.classList.remove("hidden");
    
    setTimeout(() => {
        mensagemSucesso.classList.add("hidden");
        document.getElementById("form-inscricao").reset();
    }, 3000);
});

// 6. Contador para o Próximo Evento (Regressiva)
function iniciarContador() {
    const proximoEvento = eventos[1]; // Feira de Ciências
    const dataAlvo = new Date(`${proximoEvento.data}T${proximoEvento.hora}:00`).getTime();

    const timer = setInterval(() => {
        const agora = new Date().getTime();
        const diferenca = dataAlvo - agora;

        if (diferenca < 0) {
            clearInterval(timer);
            document.getElementById("contador").innerHTML = "<p>O evento começou!</p>";
            return;
        }

        const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

        document.getElementById("dias").innerText = String(dias).padStart(2, '0');
        document.getElementById("horas").innerText = String(horas).padStart(2, '0');
        document.getElementById("minutos").innerText = String(minutos).padStart(2, '0');
        document.getElementById("segundos").innerText = String(segundos).padStart(2, '0');
    }, 1000);
}

// Inicialização
renderizarTabela();
preencherSelectEventos();
iniciarContador();
