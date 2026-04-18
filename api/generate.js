export default async function handler(req, res) {
  try {
    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    const text =
      req.method === "GET" ? req.query.text : req.body?.text;

    if (!text) {
      return res.status(400).json({ error: "Text required" });
    }

    const voiceId = "21m00Tcm4TlvDq8ikWAM"; // safe
    const modelId = "eleven_v3"; // required

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg"
        },
        body: JSON.stringify({
          text,
          model_id: modelId
        })
      }
    );

    // 🔴 ALWAYS RETURN REAL ERROR
    if (!response.ok) {
      const errText = await response.text();

      return res.status(response.status).json({
        error: "ElevenLabs API error",
        status: response.status,
        details: errText
      });
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const base64 = buffer.toString("base64");

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
