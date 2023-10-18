// Seleção do elemento de lista no DOM
const ulTransacao = document.querySelector("#transactions");

// Seleção dos elementos do DOM para manipulação
const rendaTela = document.querySelector("#money-plus");
const dispesaTela = document.querySelector("#money-minus");
const saldoTotal = document.querySelector("#balance");
const form = document.querySelector("#form");
const formName = document.querySelector("#text");
const formValor = document.querySelector("#amount");

// Variável para armazenar as transações
let transacao = [];

// Recuperação de transações do localStorage, se existirem
const localstoragenTransacao = JSON.parse(localStorage.getItem("transacao"));
transacao =
  localStorage.getItem("transacao") !== null ? localstoragenTransacao : [];

// Função para remover itens adicionados
const remover = (id) => {
  transacao = transacao.filter((transacao) => transacao.id !== id);
  upLocalstorange();
  init();
};

// Função para inserir informações no DOM
const transacaoInserida = (transacaoAdd) => {
  const operador = transacaoAdd.amount < 0 ? "-" : "+";
  const cssClass = transacaoAdd.amount < 0 ? "minus" : "plus";
  const amountOperador = Math.abs(transacaoAdd.amount);
  const li = document.createElement("li");

  li.classList.add(cssClass);
  li.innerHTML = `
    ${transacaoAdd.name} <span>${operador} R$ ${amountOperador}</span>
    <button class="delete-btn" onClick="()=> remover(${transacaoAdd.id})">x</button>
  `;
  ulTransacao.prepend(li);
};

// Função para calcular os valores das transações e atualizar na tela
const atualizacaoValor = () => {
  const transacaoValores = transacao.map((transacao) => transacao.amount);

  const total = transacaoValores
    .reduce((acomulador, transacao) => acomulador + transacao, 0)
    .toFixed(2);

  const renda = transacaoValores
    .filter((valor) => valor > 0)
    .reduce((acomulador, valor) => acomulador + valor, 0)
    .toFixed(2);

  const dispesas = Math.abs(
    transacaoValores
      .filter((valor) => valor < 0)
      .reduce((acomulador, retirada) => acomulador + retirada, 0)
  ).toFixed(2);

  saldoTotal.textContent = `R$ ${total}`;
  rendaTela.textContent = `R$ ${renda}`;
  dispesaTela.textContent = `R$ ${dispesas}`;
};

// Inicialização das funções ao carregar a página
const init = () => {
  ulTransacao.innerHTML = "";
  transacao.forEach(transacaoInserida);
  atualizacaoValor();
};

init();

// Função para adicionar informações no localStorage
const upLocalstorange = () => {
  localStorage.setItem("transacao", JSON.stringify(transacao));
};

// Função para gerar IDs
const idGenerador = () => Math.round(Math.random() * 1000);

// Lista de eventos para o formulário
form.addEventListener("submit", (evento) => {
  event.preventDefault();

  const transacaoName = formName.value.trim();
  const transacaoValor = formValor.value.trim();

  if (transacaoName == "" || transacaoValor == "") {
    alert("Preencha todos os campos");
    return;
  }

  const transacaoNova = {
    id: idGenerador(),
    name: transacaoName,
    amount: Number(transacaoValor),
  };

  transacao.push(transacaoNova);
  init();
  upLocalstorange();

  formName.value = "";
  formValor.value = "";
});
