const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Sentiment Analysis Backend Running');
});

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

app.post('/analyze', async (req, res) => {
    const { text } = req.body;

    // Ensure text is provided
    if (!text) {
        return res.status(400).json({ error: 'Text input is required' });
    }

    try {
        const response = await fetch('https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer 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`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: text
            })
        });

        const data = await response.json();

        console.log('Hugging Face API Response:', data);

        // Check for errors in the Hugging Face response
        if (data.error) {
            console.error('Error from Hugging Face API:', data.error);
            return res.status(500).json({ error: 'Error from Hugging Face API' });
        }

        // Return the sentiment analysis result
        res.json({
            sentiment: data[0].label,
            score: data[0].score
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error, please try again later.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

