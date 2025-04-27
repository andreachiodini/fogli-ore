let currentUser = "";
const passwords = {
  "andrea": "andrea123",
  "chiara": "chiara123",
  "stefano": "stefano123"
};

function login(user) {
  currentUser = user;
  document.getElementById('loginSection').style.display = 'block';
}

function checkPassword() {
  const enteredPassword = document.getElementById('passwordInput').value;
  if (enteredPassword === passwords[currentUser]) {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('formSection').style.display = 'block';
    loadTurni();
  } else {
    document.getElementById('errorMsg').innerText = "Password errata!";
  }
}

function salvaDati() {
  const data = document.getElementById('data').value;
  const oraIn = document.getElementById('oraIn').value;
  const oraOut = document.getElementById('oraOut').value;
  const mansione = document.getElementById('mansione').value;

  if (!data || !oraIn || !oraOut || !mansione) {
    alert('Compila tutti i campi!');
    return;
  }

  const turno = {
    data,
    oraIn,
    oraOut,
    mansione
  };

  let turni = JSON.parse(localStorage.getItem(currentUser)) || [];
  turni.push(turno);
  localStorage.setItem(currentUser, JSON.stringify(turni));
  loadTurni();
  alert('Turno salvato!');
}

function loadTurni() {
  const lista = document.getElementById('turniSalvati');
  lista.innerHTML = "";
  const turni = JSON.parse(localStorage.getItem(currentUser)) || [];

  turni.forEach((turno, index) => {
    const li = document.createElement('li');

    const testo = document.createElement('span');
    testo.textContent = `${turno.data} - ${turno.oraIn}-${turno.oraOut} (${turno.mansione}) `;

    const btnModifica = document.createElement('button');
    btnModifica.textContent = "Modifica";
    btnModifica.style.marginLeft = "10px";
    btnModifica.onclick = () => modificaTurno(index);

    const btnElimina = document.createElement('button');
    btnElimina.textContent = "Elimina";
    btnElimina.style.marginLeft = "5px";
    btnElimina.onclick = () => eliminaTurno(index);

    li.appendChild(testo);
    li.appendChild(btnModifica);
    li.appendChild(btnElimina);

    lista.appendChild(li);
  });
}

function eliminaTurno(index) {
  let turni = JSON.parse(localStorage.getItem(currentUser)) || [];
  turni.splice(index, 1);
  localStorage.setItem(currentUser, JSON.stringify(turni));
  loadTurni();
}

function modificaTurno(index) {
  let turni = JSON.parse(localStorage.getItem(currentUser)) || [];
  const turno = turni[index];

  document.getElementById('data').value = turno.data;
  document.getElementById('oraIn').value = turno.oraIn;
  document.getElementById('oraOut').value = turno.oraOut;
  document.getElementById('mansione').value = turno.mansione;

  turni.splice(index, 1);
  localStorage.setItem(currentUser, JSON.stringify(turni));
  loadTurni();
}

function generaPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const turni = JSON.parse(localStorage.getItem(currentUser)) || [];

  if (turni.length === 0) {
    alert('Non ci sono turni salvati!');
    return;
  }

  // Prima Tabella: tutti i turni uno per uno
  const dataTurni = turni.map(turno => {
    const oraIn = turno.oraIn;
    const oraOut = turno.oraOut;
    const mansione = turno.mansione;

    const inTime = new Date(`1970-01-01T${oraIn}:00`);
    const outTime = new Date(`1970-01-01T${oraOut}:00`);
    let oreLavorate = (outTime - inTime) / (1000 * 60 * 60);
    if (oreLavorate < 0) oreLavorate += 24;

    return [
      turno.data,
      oraIn,
      oraOut,
      mansione,
      oreLavorate.toFixed(2)
    ];
  });

  doc.text(`Turni di lavoro - ${currentUser}`, 14, 15);

  doc.autoTable({
    head: [['Data', 'Ora IN', 'Ora OUT', 'Mansione', 'Ore Lavorate']],
    body: dataTurni,
    startY: 20
  });

  // Riepilogo: somma ore per mansione
  const riepilogo = {};

  dataTurni.forEach(item => {
    const mansione = item[3];
    const ore = parseFloat(item[4]);
    if (!riepilogo[mansione]) {
      riepilogo[mansione] = ore;
    } else {
      riepilogo[mansione] += ore;
    }
  });

  const dataRiepilogo = Object.keys(riepilogo).map(mansione => [
    mansione,
    riepilogo[mansione].toFixed(2)
  ]);

  doc.addPage();
  doc.text('Riepilogo Ore per Mansione', 14, 15);

  doc.autoTable({
    head: [['Mansione', 'Ore Totali']],
    body: dataRiepilogo,
    startY: 20
  });

  doc.save(`${currentUser}_turni.pdf`);
}
