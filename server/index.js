const path = require('path')
const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, '..', 'client')));

app.get('/upload', (req, res) => {
  res.json({
    success: true,
  });
})

app.listen(4999);
