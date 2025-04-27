let currentUser = "";
let calendar; // FullCalendar instance

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
    inizializzaCalendario();
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

  const turno = { data, oraIn, oraOut, mansione };

  let turni = JSON.parse(localStorage.getItem(currentUser)) || [];
  turni.push(turno);
  localStorage.setItem(currentUser, JSON.stringify(turni));
  aggiornaCalendario();
  alert('Turno salvato!');
}

function inizializzaCalendario() {
  const calendarEl = document.getElementById('calendar');

  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'it',
    height: 'auto',
    events: caricaEventi(),
    eventClick: function(info) {
      const index = info.event.extendedProps.index;
      if (confirm("Vuoi modificare questo turno? Premi 'Annulla' per eliminarlo.")) {
        modificaTurno(index);
      } else {
        eliminaTurno(index);
      }
    }
  });

  calendar.render();
}

function aggiornaCalendario() {
  if (calendar) {
    calendar.removeAllEvents();
    const eventi = caricaEventi();
    eventi.forEach(event => calendar.addEvent(event));
  }
}

function caricaEventi() {
  const turni = JSON.parse(localStorage.getItem(currentUser)) || [];
  return turni.map((turno, index) => ({
    title: `${turno.mansione} (${turno.oraIn}-${turno.oraOut})`,
    start: turno.data,
    allDay: true,
    extendedProps: { index: index }
  }));
}

function eliminaTurno(index) {
  let turni = JSON.parse(localStorage.getItem(currentUser)) || [];
  turni.splice(index, 1);
  localStorage.setItem(currentUser, JSON.stringify(turni));
  aggiornaCalendario();
  alert('Turno eliminato!');
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
  aggiornaCalendario();
}

function generaPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const turni = JSON.parse(localStorage.getItem(currentUser)) || [];

  if (turni.length === 0) {
    alert('Non ci sono turni salvati!');
    return;
  }

  const dataTurni = turni.map(turno => {
    const inTime = new Date(`1970-01-01T${turno.oraIn}:00`);
    const outTime = new Date(`1970-01-01T${turno.oraOut}:00`);
    let oreLavorate = (outTime - inTime) / (1000 * 60 * 60);
    if (oreLavorate < 0) oreLavorate += 24;
    return [
      turno.data,
      turno.oraIn,
      turno.oraOut,
      turno.mansione,
      oreLavorate.toFixed(2)
    ];
  });

  doc.text(`Turni di lavoro - ${currentUser}`, 14, 15);

  doc.autoTable({
    head: [['Data', 'Ora IN', 'Ora OUT', 'Mansione', 'Ore Lavorate']],
    body: dataTurni,
    startY: 20
  });

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
