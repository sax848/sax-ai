export default {
  async fetch(request, env) {
    // Permetti al tuo sito GitHub Pages di comunicare con questo Worker
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Worker Sax-AI attivo!", { headers: corsHeaders });
    }

    try {
      const { prompt, mode } = await request.json();

      // Istruzioni speciali in base a cosa chiede l'utente
      let systemInstruction = "Sei Sax-AI, un assistente intelligente, chiaro e utile. Rispondi in italiano. Se ti chiedono codice, scrivilo sempre dentro blocchi Markdown (es. ```html ... ```).";

      if (mode === "presentation") {
        systemInstruction = "Crea una presentazione strutturata in italiano sull'argomento richiesto. Dividi la risposta in 5-7 slide numerate usando esattamente '---SLIDE---' come separatore tra una slide e l'altra. Ogni slide deve avere un titolo chiaro (# Titolo) e 3-4 punti elenco concisi.";
      } else if (mode === "video") {
        systemInstruction = "L'utente vuole generare un video/animazione. Scrivi una scena animata interattiva completa in un singolo file HTML5/Canvas/JavaScript autoreferenziale (senza dipendenze esterne) che rappresenti visivamente ciò che ha chiesto. Restituisci SOLO il codice HTML racchiuso tra ```html e ```.";
      }

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;

      const response = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();

      if (data.error) {
        return new Response(JSON.stringify({ error: data.error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const reply = data.candidates[0].content.parts[0].text;

      return new Response(JSON.stringify({ reply }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};
