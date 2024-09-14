import { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setResult(null); 
    setError('');    

    if (!text) {
      setError('Please enter some text for analysis.');
      return;
    }

    try {
      const response = await axios.post('./api/analyze', { text });
      setResult(response.data);
    } catch (err) {
      console.error('Error fetching analysis:', err);
      setError('There was a problem with the sentiment analysis.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Sentilect - Sentiment Analysis</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text for sentiment analysis"
          rows="4"
          cols="50"
          style={{ padding: '10px', marginBottom: '10px' }}
        />
        <br />
        <button type="submit">Analyze Sentiment</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div>
          <h3>Sentiment Result:</h3>
          <p>Sentiment: <strong>{result.sentiment}</strong></p>
          {result && result.score !== undefined && (
            <p>Score: <strong>{result.score.toFixed(2)}</strong></p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
