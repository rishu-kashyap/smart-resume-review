import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Initialize OpenAI with your API key
const openai = new OpenAI({ apiKey: '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' });

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.post('/api/review', async (req, res) => {
  const { resumeText, jobRole } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a professional resume reviewer. Given a resume and a job role, provide a score (1-5), strengths, and areas for improvement. Respond in JSON format with keys: score, strengths, areas.`
        },
        {
          role: "user",
          content: `Resume:\n${resumeText}\n\nJob Role: ${jobRole}`
        }
      ],
      max_tokens: 300
    });

    const aiResponse = completion.choices[0].message.content;
    let review;
    try {
      review = JSON.parse(aiResponse);

      // Clamp the score between 1 and 5 if it exists
      if (review.score !== undefined && !isNaN(review.score)) {
        let score = parseFloat(review.score);
        if (score < 1) score = 1;
        if (score > 5) score = 5; // <-- fix here!
        review.score = score;
      }
    } catch {
      return res.json({ feedback: aiResponse, score: null });
    }

    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ feedback: "AI review failed.", score: null });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});