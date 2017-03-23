const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { uptoken } = require('./util');
const app = express();

const bucket = 'blog2';

app.use(express.static(path.join(__dirname, '..', 'client')));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.get('/upload', (req, res) => {
  res.json({
    success: true,
  });
})

app.get('/getToken', (req, res) => {
  const name = req.query.name;
  if (!name) {
    res.json({
      success: false,
      message: 'expected name'
    });
  } else {
    res.json({
      success: true,
      token: uptoken(bucket, req.query.name)
    });
  }
});

app.listen(4999);
