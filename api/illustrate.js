export default async function handler(req, res) {
  // CORS (pra não dar erro no browser)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64, childName, age, theme, style = "storybook" } = req.body || {};

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY on Vercel env vars" });
    }
    if (!imageBase64) {
      return res.status(400).json({ error: "No image provided" });
    }

    // 1) Primeiro: descreve a criança pela foto (sem identificar, só características)
    const visionResp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: "Descreva apenas características visuais da criança (cabelo, cor, roupa, expressão). Não tente identificar. Responda em 1 parágrafo curto." },
              { type: "input_image", image_url: imageBase64 }
            ]
          }
        ]
      })
    });

    const visionJson = await visionResp.json();
    const childDesc =
      visionJson?.output?.[0]?.content?.[0]?.text ||
      "uma criança com aparência fofa e amigável";

    // 2) Depois: gera a ilustração estilo livro infantil (sem usar edit/imagem-to-imagem)
    const styleMap = {
      storybook: "cute children’s storybook illustration, soft pastel colors, warm lighting, clean lines",
      watercolor: "watercolor children’s book illustration, soft washes, paper texture, gentle colors",
      pixar_like: "3D cute animated style, soft lighting, big expressive eyes, vibrant but gentle colors"
    };

    const prompt = `
Create a children’s book illustration of the same child described below.
CHILD DESCRIPTION: ${childDesc}
Child name: ${childName || "the child"} | Age: ${age || "young"} | Theme: ${theme || "adventure"}
Art style: ${styleMap[style] || styleMap.storybook}
Magical atmosphere, friendly, colorful, high quality.
NO text, NO letters, NO watermark.
    `.trim();

    const imgResp = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024"
      })
    });

    const imgJson = await imgResp.json();

    const b64 = imgJson?.data?.[0]?.b64_json;
    if (!b64) {
      return res.status(500).json({ error: "Image generation failed", details: imgJson });
    }

    return res.status(200).json({
      success: true,
      image: `data:image/png;base64,${b64}`
    });

  } catch (e) {
    return res.status(500).json({ error: "Server error", details: String(e?.message || e) });
  }
}
