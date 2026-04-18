export default async function handler(req, res) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");

    const text =
      req.method === "GET" ? req.query.text : req.body?.text;

    if (!text) {
      return res.status(400).json({ error: "Text required" });
    }

    const response = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB",
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg"
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2"
        })
      }
    );

    // 🔴 SHOW REAL ERROR
    if (!response.ok) {
      const err = await response.text();

      return res.status(response.status).json({
        error: "ElevenLabs API error",
        status: response.status,
        details: err
      });
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return res.status(200).json({
      audio: `data:audio/mpeg;base64,${base64}`
    });

  } catch (err) {
    return res.status(500).json({
      error: "Server crash",
      message: err.message
    });
  }
}
