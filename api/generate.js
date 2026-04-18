export default async function handler(req, res) {
  try {
    const text =
      req.method === "GET" ? req.query.text : req.body?.text;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    console.log("API KEY EXISTS:", !!process.env.ELEVENLABS_API_KEY);

    const response = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/FmBhnvP58BK0vz65OOj7",
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

    // 🔴 SHOW REAL ERROR FROM ELEVENLABS
    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({
        error: "ElevenLabs API error",
        status: response.status,
        details: errText
      });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", "audio/mpeg");
    return res.status(200).send(buffer);

  } catch (error) {
    console.error("FULL ERROR:", error);

    return res.status(500).json({
      error: "Server crash",
      message: error.message
    });
  }
}
