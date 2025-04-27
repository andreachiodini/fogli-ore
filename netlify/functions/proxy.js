const fetch = require('node-fetch'); // Per fare richieste HTTP

exports.handler = async (event, context) => {
  const API_URL = "https://script.google.com/macros/s/AKfycbxc4ieZ0Xe7hUjSeQvM8BaYZiYlNb7Dn1rf7Nu5OeuSmSghAWz25RlxIW416LJ9MXNfVg/exec";  // Link al tuo Google Apps Script

  // Verifica che il metodo della richiesta sia POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,  // Metodo non permesso
      body: "Method Not Allowed"  // Risposta in caso di errore
    };
  }

  try {
    // Log per vedere cosa ricevi dal modulo
    console.log("Richiesta ricevuta:", event.body);  // Log per i dati ricevuti

    // Invia i dati a Google Apps Script
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: event.body  // Corpo della richiesta
    });

    // Log per la risposta di Google Apps Script
    const data = await response.text();
    console.log("Risposta da Google Apps Script:", data);  // Log per vedere cosa restituisce Google Apps Script

    return {
      statusCode: 200,  // Risposta OK
      body: data
    };
  } catch (error) {
    console.error("Errore nella funzione proxy:", error);
    return {
      statusCode: 500,  // Errore server
      body: JSON.stringify({ error: error.message })
    };
  }
};
