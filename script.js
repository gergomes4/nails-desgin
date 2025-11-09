// 🌙 Tema claro/escuro com animação
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggleTheme");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      toggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
      localStorage.setItem("tema", document.body.classList.contains("dark") ? "dark" : "light");
    });

    const temaSalvo = localStorage.getItem("tema");
    if (temaSalvo === "dark") {
      document.body.classList.add("dark");
      toggle.textContent = "☀️";
    }
  }

  // Splash screen
  const splash = document.getElementById("splash");
  if (splash) setTimeout(() => splash.style.display = "none", 2500);

  // Página de agendamento
  const form = document.getElementById("formAgendamento");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nome = document.getElementById("nome").value;
      const telefone = document.getElementById("telefone").value;
      const servico = document.getElementById("servico").value;
      const data = document.getElementById("data").value;
      const hora = document.getElementById("hora").value;

      const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
      agendamentos.push({ nome, telefone, servico, data, hora, status: "Pendente" });
      localStorage.setItem("agendamentos", JSON.stringify(agendamentos));

      alert("Pré-agendamento enviado com sucesso!");
      form.reset();
    });
  }

  // Página da dona
  const tabela = document.getElementById("tabelaAgendamentos");
  if (tabela) carregarAgendamentos();
});

function carregarAgendamentos() {
  const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
  const tbody = document.querySelector("#tabelaAgendamentos tbody");
  tbody.innerHTML = "";

  agendamentos.forEach((ag, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${ag.nome}</td>
      <td>${ag.telefone}</td>
      <td>${ag.servico}</td>
      <td>${ag.data}</td>
      <td>${ag.hora}</td>
      <td>${ag.status}</td>
      <td>
        <button class="btn-acao btn-confirmar" onclick="atualizarStatus(${index}, 'Confirmado')">✔</button>
        <button class="btn-acao btn-recusar" onclick="atualizarStatus(${index}, 'Recusado')">✖</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function atualizarStatus(index, novoStatus) {
  const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
  const ag = agendamentos[index];
  ag.status = novoStatus;
  localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
  carregarAgendamentos();

  let mensagem = "";
  if (novoStatus === "Confirmado") {
    mensagem = `Olá ${ag.nome}! 💅 Seu agendamento para ${ag.servico} em ${ag.data} às ${ag.hora} foi CONFIRMADO!✨\nAgradecemos pela preferência!\n\nQuando quiser, faça um novo agendamento.`;
  } else {
    mensagem = `Olá ${ag.nome}! 💅 Infelizmente seu agendamento para ${ag.servico} em ${ag.data} às ${ag.hora} foi RECUSADO 😔.\nO horário não está disponível.\nTente outro horário, por favor.`;
  }

  const url = `https://wa.me/${ag.telefone}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
}

// 💅 LOGIN DA DONA (simples e seguro via localStorage)
document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("formLogin");

  if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();

      const usuario = document.getElementById("usuario").value.trim();
      const senha = document.getElementById("senha").value.trim();

      // 🗝️ Usuário e senha definidos pela dona
      const usuarioCorreto = "admin";
      const senhaCorreta = "It@maraNa&ls";

      if (usuario === usuarioCorreto && senha === senhaCorreta) {
        localStorage.setItem("autenticado", "true");
        window.location.href = "admin.html";
      } else {
        alert("Usuário ou senha incorretos!");
      }
    });
  }

  // 🛡️ Protege o painel admin
  if (window.location.pathname.includes("admin.html")) {
    const autenticado = localStorage.getItem("autenticado");
    if (autenticado !== "true") {
      alert("Acesso negado! Faça login primeiro.");
      window.location.href = "login.html";
    }
  }
});
