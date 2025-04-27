const fetch = require('node-fetch'); // Per fare richieste HTTP

exports.handler = async (event, context) => {
  const API_URL = "https://script.google.com/macros/s/AKfycbxc4ieZ0Xe7hUjSeQvM8BaYZiYlNb7Dn1rf7Nu5OeuSmSghAWz25RlxIW416LJ9MXNfVg/exec";  // Link al tuo Google Apps Script

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // Aggiungiamo un log per vedere i dati che stiamo inviando
    console.log("Richiesta ricevuta dal sito:", event.body);  // Questo mostra i dati che ricevi dal modulo

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: event.body
    });

    // Log per vedere cosa restituisce Google Apps Script
    const data = await response.text();
    console.log("Risposta da Google Apps Script:", data);  // Questo mostra la risposta di Google Apps Script

    return { statusCode: 200, body: data };
  } catch (error) {
    console.error("Errore nella funzione proxy:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
