export default async function handler(req, res) {
  const now = new Date().toISOString();

  try {
    console.log(`🔥 [${now}] API HIT`);

    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      console.log(`⚡ [${now}] OPTIONS request`);
      return res.status(200).end();
    }

    const text =
      req.method === "GET" ? req.query.text : req.body?.text;

    console.log(`📝 [${now}] TEXT:`, text);

    if (!text) {
      return res.status(400).json({
        error: "Text required",
        time: now
      });
    }

    const voiceId = "21m00Tcm4TlvDq8ikWAM"; // safe voice
    const modelId = "eleven_v3";

    console.log(`🎤 [${now}] Voice: ${voiceId}`);
    console.log(`🧠 [${now}] Model: ${modelId}`);
    console.log(`🔑 [${now}] API KEY EXISTS:`, !!process.env.ELEVENLABS_API_KEY);

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

    console.log(`📡 [${now}] ElevenLabs status:`, response.status);

    // 🔴 REAL ERROR WITH TIME
    if (!response.ok) {
      const errText = await response.text();

      console.log(`❌ [${now}] ElevenLabs ERROR:`, errText);

      return res.status(response.status).json({
        error: "ElevenLabs API error",
        status: response.status,
        details: errText,
        time: now
      });
    }

    console.log(`✅ [${now}] ElevenLabs SUCCESS`);

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    console.log(`🎧 [${now}] Audio generated`);

    return res.status(200).json({
      audio: `data:audio/mpeg;base64,${base64}`,
      time: now
    });

  } catch (err) {
    console.log(`💥 [${now}] SERVER ERROR:`, err);

    return res.status(500).json({
      error: "Server crash",
      message: err.message,
      time: now
    });
  }
}
