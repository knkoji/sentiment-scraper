const https = require('https');
const path = require('path');
const request = require('request');
const fs = require('fs');
const bodyParser = require('body-parser');
const async = require('async');
const ClientOAuth2 = require('client-oauth2');
const loadConfig = require('./process_env.js');
const watsonNLUV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

const config = loadConfig();
const redditPass = config.reddit.pass;
const redditId = config.reddit.id;
const nluWatsonPass = config.nluWatson.pass;
const nluWatsonId = config.nluWatson.id;

let resultsObj = createPostsObj();
let watson = createWatson();

console.log(resultsObj);
console.log(watson);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../bin')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../bin', 'index.html'));
});

app.post('/posts', (req, res) => {
  let subreddit = req.body.subreddit;

  resultsObj.getPosts((posts) => {
    let postsObj = JSON.parse(posts);
    postsArray = postsObj.data.children.map((postObj) => {
      let pack = [];
      let postData = {};
      if (postObj.data.post_hint) {
        if(postObj.data.post_hint === 'link') {
          let url = postObj.data.url;
          pack.push({ url: url });
        }
      }
      if (postObj.data.selftext) {
        let selfText = postObj.data.selftext;
        pack.push({ selfText: selfText })
      }
      pack.push({ title: postObj.data.title });
      postData.pack = pack;

      let extras = {}
      extras.postId = postObj.data.id;
      postData.extras = extras;
      return postData;
    });
    res.send(postsArray);
  }, subreddit);
});

app.post('/watson', (req, res) => {
  let content = req.body;
  let id = req.body.id;
  let resObj = {};

  resObj.id = id;
  watson.getNLU(content, (resp) => {
    resObj.resp = resp;
    res.send(resObj);
  });
})

app.get('/comments', (req, res) => {
  resultsObj.getComments((comments) => {
    res.send(comments);
  });
});
