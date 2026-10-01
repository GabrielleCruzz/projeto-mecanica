//Mandar os dados do formulario para o PHP
const formulario = document.querySelector(".form-cliente");

formulario.addEventListener("submit", (enviar) => {
  enviar.preventDefault();

  const dados = new FormData(formulario);

  fetch("../php/cadastro-cliente.php", {
    method: "POST",
    body: dados,
  })
    .then((resposta) => resposta.text())
    .then((resultado) => {
      alert(resultado);
location.reload()
    });
});

//Fazer a cultado desses dados
fetch("../php/listar-cliente.php", {
  method: "GET",
})
  .then((resposta_lista) => resposta_lista.text())
  .then((resulta_lista) => {
    const infoCliente = JSON.parse(resulta_lista);

    const containerPai = document.querySelector(".cards-clientes");
    const cardModelo = document.querySelector(".cliente-card");

    infoCliente.forEach((cliente) => {
      const card = cardModelo.cloneNode(true);
      card.querySelector(".info-destaque").textContent = cliente.nome;

      card.querySelector(".telefone").textContent = cliente.telefone;

      card.querySelector(".qt_veiculo").textContent =
        cliente.quantidade_veiculo + " Veículos cadastrado";

      containerPai.appendChild(card);
    });
  });
