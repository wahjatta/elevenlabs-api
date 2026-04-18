export default async function handler(req, res) {
  try {
    console.log("🔥 API HIT");

    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    const text =
      req.method === "GET" ? req.query.text : req.body?.text;

    console.log("📝 TEXT:", text);

    if (!text) {
      return res.status(400).json({ error: "Text required" });
    }

    const url =
      "https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB";

    console.log("🎤 VOICE URL:", url);

    const response = await fetch(url, {
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
    });

    console.log("📡 ElevenLabs status:", response.status);

    // 🔴 SHOW REAL ERROR
    if (!response.ok) {
      const err = await response.text();
      console.log("❌ ElevenLabs ERROR:", err);

      return res.status(response.status).json({
        error: "ElevenLabs API error",
        status: response.status,
        details: err
      });
    }

    console.log("✅ ElevenLabs SUCCESS");

    const arrayBuffer = await response.arrayBuffer();
    console.log("📦 Audio size:", arrayBuffer.byteLength);

    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const audio = `data:audio/mpeg;base64,${base64}`;

    console.log("🎧 Returning JSON");

    return res.status(200).json({ audio });

  } catch (err) {
    console.log("💥 SERVER ERROR:", err);

    return res.status(500).json({
      error: "Server crash",
      message: err.message
    });
  }
}
