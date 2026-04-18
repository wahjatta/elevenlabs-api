export default async function handler(req, res) {
  try {
    // ✅ CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    // ✅ Get text
    const text =
      req.method === "GET" ? req.query.text : req.body?.text;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    // ✅ Call ElevenLabs
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
          text: text,
          model_id: "eleven_multilingual_v2"
        })
      }
    );

    // 🔴 Show real error if API fails
    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({
        error: "ElevenLabs API error",
        details: errText
      });
    }

    // ✅ Convert to base64
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    // ✅ RETURN JSON (CRITICAL)
    return res.status(200).json({
      audio: `data:audio/mpeg;base64,${base64}`
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
