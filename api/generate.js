export default async function handler(req, res) {
  try {
    console.log("🔥 API HIT");

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

    console.log("📝 TEXT:", text);

    if (!text) {
      return res.status(400).json({ error: "Text required" });
    }

    // ✅ SAFE VOICE + MODEL
    const voiceId = "21m00Tcm4TlvDq8ikWAM";
    const modelId = "eleven_monolingual_v1";

    console.log("🎤 Voice:", voiceId);
    console.log("🧠 Model:", modelId);

    console.log("🔑 API KEY EXISTS:", !!process.env.ELEVENLABS_API_KEY);

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

    console.log("📡 ElevenLabs status:", response.status);

    // 🔴 SHOW REAL ERROR
    if (!response.ok) {
      const errText = await response.text();
      console.log("❌ ElevenLabs ERROR:", errText);

      return res.status(response.status).json({
        error: "ElevenLabs API error",
        status: response.status,
        details: errText
      });
    }

    console.log("✅ ElevenLabs SUCCESS");

    // ✅ Convert audio → base64
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    console.log("🎧 Audio size:", arrayBuffer.byteLength);

    return res.status(200).json({
      audio: `data:audio/mpeg;base64,${base64}`
    });

  } catch (err) {
    console.log("💥 SERVER ERROR:", err);

    return res.status(500).json({
      error: "Server crash",
      message: err.message
    });
  }
}
