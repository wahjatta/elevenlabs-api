import { fetch } from 'wix-fetch';

export async function generateVoice(text) {
    const now = new Date().toISOString();

    try {
        console.log(`🚀 [${now}] Wix Backend Called`);
        console.log(`📝 [${now}] Text:`, text);

        const res = await fetch(
            "https://elevenlabs-api-six.vercel.app/api/generate",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ text })
            }
        );

        console.log(`📡 [${now}] Response status:`, res.status);

        const raw = await res.text();

        console.log(`📦 [${now}] RAW RESPONSE:`, raw.slice(0, 120));

        let data;

        try {
            data = JSON.parse(raw);
        } catch (err) {
            console.log(`❌ [${now}] JSON PARSE FAILED`);

            return {
                error: "Invalid JSON",
                raw,
                time: now
            };
        }

        console.log(`✅ [${now}] Parsed JSON:`, data);

        return data;

    } catch (err) {
        console.error(`💥 [${now}] Backend Error:`, err);

        return {
            error: err.message,
            time: now
        };
    }
}
