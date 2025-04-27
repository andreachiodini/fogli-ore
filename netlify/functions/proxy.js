const fetch = require('node-fetch'); // Per fare richieste HTTP

exports.handler = async (event, context) => {
  const API_URL = "https://script.google.com/macros/s/AKfycbxc4ieZ0Xe7hUjSeQvM8BaYZiYlNb7Dn1rf7Nu5OeuSmSghAWz25RlxIW416LJ9MXNfVg/exec";  // Link al tuo Google Apps Script

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405, // Risponde con "Method Not Allowed" se il metodo non è POST
      body: "Method Not Allowed"
    };
  }

  try {
    console.log("Richiesta ricevuta dal sito:", event.body);  // Log per diagnosticare i dati ricevuti
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: event.body // Corpo della richiesta
    });

    // Log per vedere cosa restituisce Google Apps Script
    const data = await response.text();
    console.log("Risposta da Google Apps Script:", data);  // Log per diagnosticare la risposta

    return {
      statusCode: 200,  // Risposta con status 200 se tutto è ok
      body: data
    };
  } catch (error) {
    console.error("Errore nella funzione proxy:", error);
    return {
      statusCode: 500,  // Risposta con status 500 se c'è un errore
      body: JSON.stringify({ error: error.message })
    };
  }
};
