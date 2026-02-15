import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64, theme, childName, age } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Image not provided" });
    }

    const prompt = `
    Create a colorful children's book illustration.
    Style: soft watercolor, cartoon, storybook.
    Theme: ${theme}.
    Child name: ${childName}, age ${age}.
    The child should look friendly, cute, and illustrated.
    Background magical, soft lighting, pastel colors.
    `;

    const openaiRes = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        image: imageBase64,
        size: "1024x1024"
      })
    });

    const data = await openaiRes.json();

    if (!data.data || !data.data[0]) {
      return res.status(500).json({ error: "Image generation failed" });
    }

    return res.status(200).json({
      image: data.data[0].url
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}
