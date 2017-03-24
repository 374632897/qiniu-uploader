const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { uptoken }  = require('./util');
const { BUCKET_NAME: bucket } = require('../qiniu.conf');
const app = express();

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
  return res.json({
    success: true,
    uptoken: uptoken(bucket, '')
  });
});

app.listen(4999, (err) => {
  if (!err) {
    console.log('Server runing at localhost:4999/');
  }
});
