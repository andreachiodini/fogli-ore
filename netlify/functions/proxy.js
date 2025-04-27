const fetch = require('node-fetch'); // Per fare richieste HTTP

exports.handler = async (event, context) => {
  const API_URL = "https://script.google.com/macros/s/AKfycbxc4ieZ0Xe7hUjSeQvM8BaYZiYlNb7Dn1rf7Nu5OeuSmSghAWz25RlxIW416LJ9MXNfVg/exec";  // Link al tuo Google Apps Script

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: event.body
    });
    const data = await response.text();
    return { statusCode: 200, body: data };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
