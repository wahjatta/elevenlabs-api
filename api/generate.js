export default async function handler(req, res) {

  // ✅ CORS (fixes Wix "Failed to fetch")
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Support GET + POST
    const text =
      req.method === "GET" ? req.query.text : req.body?.text;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
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
          text: text,
          model_id: "eleven_multilingual_v2"
        })
      }
    );

    // Show real error if ElevenLabs fails
    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({
        error: "ElevenLabs API error",
        details: err
      });
    }

    // Convert to audio buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", "audio/mpeg");
    return res.status(200).send(buffer);

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
