import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64, childName, age, theme } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Image is required" });
    }

    const prompt = `
    Turn this real child into a cute children's book illustration.

    Style: Disney / Pixar / storybook
    Character: ${childName}, ${age} years old
    Theme: ${theme}

    Big expressive eyes, soft pastel colors, magical lighting,
    friendly proportions, watercolor storybook background.

    No text. No watermark. No realism.
    `;

    const base64Image = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const result = await openai.images.edit({
      model: "gpt-image-1",
      prompt,
      image: Buffer.from(base64Image, "base64"),
      size: "1024x1024"
    });

    const image = result.data[0].b64_json;

    res.status(200).json({
      success: true,
      image: `data:image/png;base64,${image}`
    });

  } catch (err) {
    console.error("ILLUSTRATE ERROR:", err);
    res.status(500).json({
      error: "Error generating illustration",
      details: err.message
    });
  }
}
