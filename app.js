const https = require('https');
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const async = require('async');
const watsonNLUV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

let app = require('./simple_server/server.js');
let reddPostsObj = require('./apis/reddit.js');
let watson = require('./apis/watson.js');

console.log(reddPostsObj);
console.log(watson);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './front')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './front', 'index.html'));
});

app.post('/posts', (req, res) => {
  let subreddit = req.body.subreddit;

  reddPostsObj.getPosts((posts) => {
    let postsObj = JSON.parse(posts);
    let postsArray = postsObj.data.children.map((postObj) => {
      return {
              id: postObj.data.id,
              name: postObj.data.subreddit_name_prefixed,
              full_name: postObj.data.permalink,
              title: postObj.data.title,
              self_text: postObj.data.self_text,
              url: postObj.data.url
            };
    });


    res.send(postsArray);
  }, subreddit);
});

app.post('/watson', (req, res) => {
  let posts = JSON.parse(req.body.key);

  res.send(posts);
});
