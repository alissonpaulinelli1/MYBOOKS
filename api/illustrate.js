import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { childName, age, theme } = req.body;

    if (!childName || !age || !theme) {
      return res.status(400).json({ error: "Missing data" });
    }

    const prompt = `
    Cute children's book illustration.
    Storybook style, soft watercolor, pastel colors.
    A ${age}-year-old child named ${childName}.
    Theme: ${theme}.
    Big expressive eyes, friendly smile.
    Magical, warm, Pixar / Disney inspired.
    No text, no watermark.
    `;

    const image = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    res.status(200).json({
      success: true,
      image: image.data[0].url,
    });

  } catch (error) {
    console.error("API ERROR:", error);
    res.status(500).json({
      error: "Error generating illustration",
      details: error.message,
    });
  }
}
