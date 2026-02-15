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
      return res.status(400).json({ error: "No image provided" });
    }

    const prompt = `
    Create a children's book illustration.
    Style: cute, colorful, soft, storybook illustration.
    The child is ${childName}, ${age} years old.
    Theme: ${theme}.
    Turn the real child into a cartoon-style character.
    Big eyes, soft lighting, pastel colors, magical atmosphere.
    Background matches a children's storybook.
    No text in the image.
    `;

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      image: imageBase64.replace(/^data:image\/\w+;base64,/, "")
    });

    const image = result.data[0].b64_json;

    res.status(200).json({
      success: true,
      image: `data:image/png;base64,${image}`
    });

  } catch (error) {
    console.error("IMAGE ERROR:", error);
    res.status(500).json({
      error: "Error generating illustration",
      details: error.message
    });
  }
}
