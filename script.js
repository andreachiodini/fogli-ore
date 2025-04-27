let currentUser = "";
let calendar;
const apiUrl = "https://script.google.com/macros/s/AKfycbwefOykHpYhQJMe6gamCxjLchOBsVOkEmwstuzHiz2jMf_Jjh-umvKbA_q10XEBxi2OaQ/exec";

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

  const turno = { data, oraIn, oraOut, mansione, utente: currentUser };

  fetch(apiUrl, {
    method: "POST",
    body: JSON.stringify(turno),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => response.text())
  .then(res => {
    alert('Turno salvato!');
    aggiornaCalendario();
  })
  .catch(error => {
    console.error("Errore salvataggio", error);
    alert('Errore durante il salvataggio!');
  });
}

function inizializzaCalendario() {
  const calendarEl = document.getElementById('calendar');

  if (!calendar) {
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale: 'it',
      height: 'auto',
      events: caricaEventi,
      eventClick: function(info) {
        alert('Non puoi modificare/eliminare direttamente dal calendario.\nModifica o elimina dal foglio Google.');
      }
    });

    calendar.render();
  } else {
    aggiornaCalendario();
  }
}

function aggiornaCalendario() {
  if (calendar) {
    calendar.refetchEvents();
  }
}

function caricaEventi(fetchInfo, successCallback, failureCallback) {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const eventi = data
        .filter(turno => turno.utente === currentUser)
        .map((turno, index) => ({
          title: `${turno.mansione} (${turno.oraIn}-${turno.oraOut})`,
          start: turno.data,
          allDay: true
        }));
      successCallback(eventi);
    })
    .catch(error => {
      console.error("Errore caricamento", error);
      failureCallback(error);
    });
}

function generaPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  fetch(apiUrl)
    .then(response => response.json())
    .then(turni => {
      const datiUtente = turni.filter(t => t.utente === currentUser);

      if (datiUtente.length === 0) {
        alert('Non ci sono turni salvati!');
        return;
      }

      const dataTurni = datiUtente.map(turno => {
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
    })
    .catch(error => {
      console.error("Errore generazione PDF", error);
      alert('Errore durante la generazione del PDF!');
    });
}
