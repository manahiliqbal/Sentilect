import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text input is required' });
  }

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: text }),
    });

    const data = await response.json();

    //console.log(data);
    if (data.error) {
      console.error('Error from Hugging Face API:', data.error);
      return res.status(500).json({ error: 'Error from Hugging Face API' });
    }
    const [results] = data;
    const { label: sentiment, score } = results[0]; 
    res.status(200).json({
      sentiment: sentiment,
      score: score,
    });
  } catch (error) {
    console.error('Error during analysis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
