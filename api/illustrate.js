import OpenAI from "openai";

export const config = {
  api: { bodyParser: { sizeLimit: "10mb" } }
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { imageBase64, childName = "child", age = "6", theme = "Adventure" } = req.body || {};
    if (!imageBase64) return res.status(400).json({ error: "No image provided" });

    // remove header "data:image/...;base64,"
    const base64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const bytes = Buffer.from(base64, "base64");

    const prompt = [
      "Children's book illustration based on the uploaded child photo.",
      "Convert the real child into a cute storybook character (same face identity, same hair, same skin tone).",
      "Big friendly eyes, soft lighting, pastel colors, magical atmosphere.",
      `Theme: ${theme}.`,
      `Child name: ${childName}. Age: ${age}.`,
      "No text, no watermark, no logo.",
      "High quality, clean, kid-friendly."
    ].join(" ");

    // ✅ Use Image Edit so the model actually uses the photo
    const result = await openai.images.edits({
      model: "gpt-image-1",
      image: bytes,
      prompt,
      size: "1024x1024"
    });

    const b64 = result.data?.[0]?.b64_json;
    if (!b64) throw new Error("No image returned from OpenAI");

    return res.status(200).json({
      success: true,
      image: `data:image/png;base64,${b64}`
    });
  } catch (err) {
    console.error("IMAGE ERROR:", err);
    return res.status(500).json({
      error: "Error generating illustration",
      details: err?.message || String(err)
    });
  }
}
