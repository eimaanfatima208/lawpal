const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const chatRoutes = require('./routes/chat');
const analyzeRoutes = require('./routes/analyze');
const roadmapRoutes = require('./routes/roadmap');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', chatRoutes);
app.use('/api', analyzeRoutes);
app.use('/api', roadmapRoutes);

const distPath = path.join(__dirname, '..', 'react-frontend', 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(config.port, () => {
  console.log(`LawPal running at http://localhost:${config.port}`);
});
