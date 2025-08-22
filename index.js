const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.json());

let questions = [];

// Add a new question
app.post('/api/questions', (req, res) => {
  const { title, description, category, createdBy } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description required' });
  }

  const q = {
    id: uuidv4(),
    title,
    description,
    category: category || 'General',
    createdBy: createdBy || 'Anonymous',
    createdAt: new Date().toISOString(),
    answers: []
  };

  questions.unshift(q); // newest first
  io.emit('new-question', q);
  res.json(q);
});

// Add an answer
app.post('/api/answers/:questionId', (req, res) => {
  const { questionId } = req.params;
  const { text, createdBy } = req.body;
  if (!text) return res.status(400).json({ error: 'Answer text required' });

  const q = questions.find(x => x.id === questionId);
  if (!q) return res.status(404).json({ error: 'Question not found' });

  const a = {
    id: uuidv4(),
    text,
    createdBy: createdBy || 'Anonymous',
    createdAt: new Date().toISOString(),
    votes: 0
  };

  q.answers.push(a);
  io.emit('new-answer', { questionId, answer: a });
  res.json(a);
});

// Voting
function findAnswerById(answerId) {
  for (const question of questions) {
    const answer = question.answers.find(a => a.id === answerId);
    if (answer) return { question, answer };
  }
  return null;
}

app.post('/api/vote/:answerId', (req, res) => {
  const { answerId } = req.params;
  const { delta } = req.body; // +1 or -1
  const r = findAnswerById(answerId);
  if (!r) return res.status(404).json({ error: 'Answer not found' });

  r.answer.votes = (r.answer.votes || 0) + (delta === 1 ? 1 : -1);
  if (r.answer.votes < 0) r.answer.votes = 0; // prevent negative

  io.emit('vote-update', {
    questionId: r.question.id,
    answerId: r.answer.id,
    votes: r.answer.votes
  });

  res.json({ answerId: r.answer.id, votes: r.answer.votes });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`AskLaw server running on http://localhost:${PORT}`);
});
