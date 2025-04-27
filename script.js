<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="Content-Style-Type" content="text/css">
  <title></title>
  <meta name="Generator" content="Cocoa HTML Writer">
  <meta name="CocoaVersion" content="2575.5">
  <style type="text/css">
    p.p1 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Helvetica}
    p.p2 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Helvetica; min-height: 14.0px}
  </style>
</head>
<body>
<p class="p1">let currentUser = "";</p>
<p class="p1">const passwords = {</p>
<p class="p1"><span class="Apple-converted-space">  </span>"andrea": "andrea123",</p>
<p class="p1"><span class="Apple-converted-space">  </span>"chiara": "chiara123",</p>
<p class="p1"><span class="Apple-converted-space">  </span>"stefano": "stefano123"</p>
<p class="p1">};</p>
<p class="p2"><br></p>
<p class="p1">function login(user) {</p>
<p class="p1"><span class="Apple-converted-space">  </span>currentUser = user;</p>
<p class="p1"><span class="Apple-converted-space">  </span>document.getElementById('loginSection').style.display = 'block';</p>
<p class="p1">}</p>
<p class="p2"><br></p>
<p class="p1">function checkPassword() {</p>
<p class="p1"><span class="Apple-converted-space">  </span>const enteredPassword = document.getElementById('passwordInput').value;</p>
<p class="p1"><span class="Apple-converted-space">  </span>if (enteredPassword === passwords[currentUser]) {</p>
<p class="p1"><span class="Apple-converted-space">    </span>document.getElementById('loginSection').style.display = 'none';</p>
<p class="p1"><span class="Apple-converted-space">    </span>document.getElementById('formSection').style.display = 'block';</p>
<p class="p1"><span class="Apple-converted-space">    </span>loadTurni();</p>
<p class="p1"><span class="Apple-converted-space">  </span>} else {</p>
<p class="p1"><span class="Apple-converted-space">    </span>document.getElementById('errorMsg').innerText = "Password errata!";</p>
<p class="p1"><span class="Apple-converted-space">  </span>}</p>
<p class="p1">}</p>
<p class="p2"><br></p>
<p class="p1">function salvaDati() {</p>
<p class="p1"><span class="Apple-converted-space">  </span>const data = document.getElementById('data').value;</p>
<p class="p1"><span class="Apple-converted-space">  </span>const oraIn = document.getElementById('oraIn').value;</p>
<p class="p1"><span class="Apple-converted-space">  </span>const oraOut = document.getElementById('oraOut').value;</p>
<p class="p1"><span class="Apple-converted-space">  </span>const mansione = document.getElementById('mansione').value;</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">  </span>if (!data || !oraIn || !oraOut || !mansione) {</p>
<p class="p1"><span class="Apple-converted-space">    </span>alert('Compila tutti i campi!');</p>
<p class="p1"><span class="Apple-converted-space">    </span>return;</p>
<p class="p1"><span class="Apple-converted-space">  </span>}</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">  </span>const turno = {</p>
<p class="p1"><span class="Apple-converted-space">    </span>data,</p>
<p class="p1"><span class="Apple-converted-space">    </span>oraIn,</p>
<p class="p1"><span class="Apple-converted-space">    </span>oraOut,</p>
<p class="p1"><span class="Apple-converted-space">    </span>mansione</p>
<p class="p1"><span class="Apple-converted-space">  </span>};</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">  </span>let turni = JSON.parse(localStorage.getItem(currentUser)) || [];</p>
<p class="p1"><span class="Apple-converted-space">  </span>turni.push(turno);</p>
<p class="p1"><span class="Apple-converted-space">  </span>localStorage.setItem(currentUser, JSON.stringify(turni));</p>
<p class="p1"><span class="Apple-converted-space">  </span>loadTurni();</p>
<p class="p1"><span class="Apple-converted-space">  </span>alert('Turno salvato!');</p>
<p class="p1">}</p>
<p class="p2"><br></p>
<p class="p1">function loadTurni() {</p>
<p class="p1"><span class="Apple-converted-space">  </span>const lista = document.getElementById('turniSalvati');</p>
<p class="p1"><span class="Apple-converted-space">  </span>lista.innerHTML = "";</p>
<p class="p1"><span class="Apple-converted-space">  </span>const turni = JSON.parse(localStorage.getItem(currentUser)) || [];</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">  </span>turni.forEach(turno =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">    </span>const li = document.createElement('li');</p>
<p class="p1"><span class="Apple-converted-space">    </span>li.textContent = `${turno.data} - ${turno.oraIn}-${turno.oraOut} (${turno.mansione})`;</p>
<p class="p1"><span class="Apple-converted-space">    </span>lista.appendChild(li);</p>
<p class="p1"><span class="Apple-converted-space">  </span>});</p>
<p class="p1">}</p>
</body>
</html>
