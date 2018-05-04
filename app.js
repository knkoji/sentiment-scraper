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
              name: postObj.data.subreddit_name_prefixed,
              full_name: postObj.data.permalink,
              title: postObj.data.title,
              self_text: postObj.data.self_text,
              url: postObj.data.url
              // link: true ? :
            };
    });

    let watsonContentArr = postsArray.map((postData) => {
      // if (isUrlValid(postData.url)) {
      return {
        url: postData.url,
        text: postData.text
      }
    });

    async.map(
      watsonContentArr,
      watson.getNLU,
      (err, results) => {
        if (err) {
          console.error(err);
        } else {
          res.send(
            {
              posts: postsArray,
              watson_content: watsonContentArr,
              watson_results: results
            });
        }
      }
    );

  }, subreddit);
});

app.post('/watson', (req, res) => {
  let content = req.body;
  let id = req.body.id;
  let resObj = {
    id: id
  };
  watson.getNLU(content, (resp) => {
    resObj.resp = resp;
    res.send(resObj);
  });
});

// app.get('/comments', (req, res) => {
//   reddPostsObj.getComments((comments) => {
//     res.send(comments);
//   });
// });
function isUrlValid(url) {

}
