function renderizarTabela() {
  tabelaBody.innerHTML = ''; // Limpa a tabela antes de renderizar

  const idsUnicos = new Set();
  const registrosUnicos = [];

  // Filtra para manter apenas o primeiro registro de cada ID
  registros.forEach(registro => {
    if (!idsUnicos.has(registro.ID)) {
      idsUnicos.add(registro.ID);
      registrosUnicos.push(registro);
    }
  });

  registrosUnicos.sort((a, b) => {
    // Tenta converter para número para ordenar numericamente, senão ordena como string
    const numA = Number(a.ID);
    const numB = Number(b.ID);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    return a.ID.localeCompare(b.ID);
  });

  registrosUnicos.forEach(registro => {
    const linha = document.createElement('tr');
   const completos = parseInt(registro.Percentual.replace('%', '').trim());
   const finalizado = (completos === 100) ? 'OK' : 'PENDENTE';
const celulaPercentual = linha.querySelector('td:nth-child(7)');

    console.log("porcentagem:", completos);
  // Cores com base no percentual
      linha.innerHTML = `
      <td><input type="checkbox" class="selecaoLinha"></td>
      <td>${registro.Disciplina}</td>
      <td class="${completos === 100 ? 'id-completo' : 'id-incompleto'}">${registro.ID}</td>
      <td>${registro.Etapa}</td>
      <td><a href="documentos.html?id=${registro.ID}" target="_blank"><img src="icones/docs.png" class="icones"></img></a></td>
      <td class="${finalizado === 'OK' ? 'id-completo': 'id-incompleto'}">${finalizado}</td>
      <td class="${completos === 100 ? 'percentual-completo' : 'percentual-incompleto'}">${registro.Percentual}</td>
      <td>${registro.Observacao}</td>
      <td><button class="btnExcluir">Excluir</button></td>
    `;
    tabelaBody.appendChild(linha);
  });

    document.querySelectorAll('.btnExcluir').forEach(botao => {
      botao.addEventListener('click', () => {
      if( confirm('Tem certeza que deseja excluir este registro?')){
        const linha = botao.closest('tr');
        const idLinha = linha.cells[2].textContent;

        registros = registros.filter(r => r.ID !== idLinha);
        localStorage.setItem('documentos', JSON.stringify(registros));
        renderizarTabela();
      }
      
    });
  })
    atualizarContadores();
}
function calcularPercentual() {
      let total = 0;
      let okCount = 0;
      statusDocs.forEach(s => {
        if (s.value !== "-") {
          total++;
          if (s.value === "ok") okCount++;
        }
      });
      return total === 0 ? 0 : Math.round((okCount / total) * 100);
    }

    statusDocs.forEach(s => {
      s.addEventListener('change', () => {
        percentualDisplay.textContent = calcularPercentual() + '%';
      });
    });
function atualizarContadores() {
  // Total de pastas únicas (IDs únicos)
  const idsUnicos = new Set(registros.map(r => r.ID));
  document.getElementById('totalPastas').textContent = idsUnicos.size;

  // Contar pastas por etapa (considerando IDs únicos)
  const etapasCount = {};
  // Vamos considerar só um registro por ID para cada etapa
  const vistosPorId = {};

  registros.forEach(r => {
    if (!vistosPorId[r.ID]) {
      vistosPorId[r.ID] = true;
      etapasCount[r.Etapa] = (etapasCount[r.Etapa] || 0) + 1;
    }
  });

  const ul = document.getElementById('pastasPorEtapa');
  ul.innerHTML = ''; // Limpa antes de atualizar

  for (const etapa in etapasCount) {
    const li = document.createElement('li');
    li.textContent = `${etapa}: ${etapasCount[etapa]}`;
    ul.appendChild(li);
  }
}

function atualizarCamposID() {
  const algumaSelecionada = Array.from(document.querySelectorAll('.selecaoLinha')).some(chk => chk.checked);
  idInicioInput.disabled = algumaSelecionada;
  idFimInput.disabled = algumaSelecionada;
}

