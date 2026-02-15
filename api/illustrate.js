import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64, name, age, theme } = req.body;

    if (!imageBase64 || !imageBase64.startsWith("data:image/")) {
      return res.status(400).json({ error: "Invalid image" });
    }

    const prompt = `
Children's book illustration.
Cute, colorful, soft pastel storybook style.
The child is named ${name}, ${age} years old.
Theme: ${theme}.
Turn the real child into a cartoon character.
Big expressive eyes, soft lighting, magical atmosphere.
No text in the image.
`;

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      image: imageBase64
    });

    const img = result.data[0].b64_json;

    res.status(200).json({
      success: true,
      image: `data:image/png;base64,${img}`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Error generating illustration",
      details: err.message
    });
  }
}
