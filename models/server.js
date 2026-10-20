require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  const ok = mongoose.connection.readyState === 1;
  res.status(ok ? 200 : 503).json({ status: ok ? 'UP' : 'DOWN', db: ok ? 'connected' : 'disconnected' });
});

app.post('/products', async (req, res) => {
  try { res.status(201).json(await Product.create(req.body)); }
  catch (e) { res.status(400).json({ error: e.message }); }
});
app.get('/products', async (req, res) => res.json(await Product.find()));
app.get('/products/:pid', async (req, res) => {
  const p = await Product.findOne({ pid: req.params.pid });
  p ? res.json(p) : res.status(404).json({ error: 'Not found' });
});
app.put('/products/:pid', async (req, res) => {
  const p = await Product.findOneAndUpdate({ pid: req.params.pid }, req.body, { new: true });
  p ? res.json(p) : res.status(404).json({ error: 'Not found' });
});
app.delete('/products/:pid', async (req, res) => {
  const p = await Product.findOneAndDelete({ pid: req.params.pid });
  p ? res.json({ message: 'Deleted' }) : res.status(404).json({ error: 'Not found' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => console.log('API running on port ' + process.env.PORT));
  })
  .catch(err => { console.error('Mongo connection error:', err.message); process.exit(1); });