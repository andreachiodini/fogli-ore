const fetch = require('node-fetch');  // Assicurati di avere node-fetch importato

exports.handler = async (event, context) => {
  const API_URL = "https://script.google.com/macros/s/AKfycbxc4ieZ0Xe7hUjSeQvM8BaYZiYlNb7Dn1rf7Nu5OeuSmSghAWz25RlxIW416LJ9MXNfVg/exec";  // Link al tuo Google Apps Script

  // Verifica che la richiesta sia POST
  if (event.httpMethod !== "POST") {
    console.log("Metodo non consentito:", event.httpMethod);  // Aggiungi log per diagnosticare
    return {
      statusCode: 405,  // Risponde con "Method Not Allowed"
      body: "Method Not Allowed"  // Risposta con errore
    };
  }

  try {
    console.log("Dati ricevuti:", event.body);  // Log per i dati ricevuti

    // Invia i dati al Google Apps Script
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: event.body  // Corpo della richiesta
    });

    const data = await response.text();  // Ottieni la risposta da Google Apps Script
    console.log("Risposta da Google Apps Script:", data);  // Log per la risposta

    return {
      statusCode: 200,  // Risposta OK
      body: data  // Restituisce la risposta
    };
  } catch (error) {
    console.error("Errore nella funzione proxy:", error);
    return {
      statusCode: 500,  // Errore server
      body: JSON.stringify({ error: error.message })
    };
  }
};
