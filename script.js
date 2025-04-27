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

  turni.forEach(turno => {
    const li = document.createElement('li');
    li.textContent = `${turno.data} - ${turno.oraIn}-${turno.oraOut} (${turno.mansione})`;
    lista.appendChild(li);
  });
}