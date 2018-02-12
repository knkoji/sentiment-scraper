const https = require('https');
const express = require('express');
const path = require('path');
const request = require('request');
const fs = require('fs');
const bodyParser = require('body-parser');
const ClientOAuth2 = require('client-oauth2');
const loadConfig = require('./process_env.js');
let watsonNLUV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

const app = express();
const config = loadConfig();
const redditPass = config.reddit.pass;
const redditId = config.reddit.id;
const nluWatsonPass = config.nluWatson.pass;
const nluWatsonId = config.nluWatson.id;

let nlu = new watsonNLUV1({
  username: nluWatsonId,
  password: nluWatsonPass,
  version_date: watsonNLUV1.VERSION_DATE_2017_02_27
});
let main = 'https://oauth.reddit.com';
let url = 'https://www.cbinsights.com/research/startup-failure-reasons-top/?utm_content=66767994&utm_medium=social&utm_source=twitter'
let resultsObj = createPostsObj(main)
console.log(resultsObj);

//----------------------------------------------------------------------

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../bin')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../bin', 'index.html'));
});

app.post('/posts', (req, res) => {
  let subreddit = req.body.subreddit;
  let responsePackage = {};

  resultsObj.getPosts((posts) => {

    nlu.analyze(
      {
        url: url,
        features: {
          concepts: {},
          keywords: {}
        }
      },
      (error, response) => {
        if(error) {
          console.log(`error: ${error}`);
        } else {
          res.send(JSON.stringify(response, null, 2));
        }
      }
    );
  }, subreddit);

});

app.get('/comments', (req, res) => {
  resultsObj.getComments((comments) => {
    res.send(comments);
  });
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  console.log(__dirname);
});
//----------------------------------------------------------------------

function createPostsObj(domain) {

  function PostsObj() {
    this.token = '';
    this.posts = [];
    this.comments = [];
    this.getPosts = (cb, sub) => {

      let id = redditId || REDDIT_ID;
      let secret = redditPass || REDDIT_PASSWORD;
      let tokenUrl = 'https://www.reddit.com/api/v1/access_token';

      const redditAuth = new ClientOAuth2({
        accessTokenUri: tokenUrl,
        clientId: id,
        clientSecret: secret
      });

      redditAuth.credentials.getToken()
        .then(function (user) {
          let token = user.accessToken;
          let postsJson = '';
          let url = `${domain}/r/${sub}/new`;
          let options = {
            headers: {
              'User-Agent': 'node:sensi:v.0.0.0 (by u/kokojesus)',
              'Authorization': `Bearer ${token}`
            },
            form: {
                    'client_id': id,
                    'client_secret': secret
            },
            url: url
          };
          // console.log(user.data);
          // console.log(token);
          // console.log(url);
          request.get(options, (error, res) => {
            cb(res.body);
          });
        });
    }

    this.getComments = (cb) => {
      let commentsJson = '';
      this.posts.forEach( post => {
        let commentUrl = url + post.post.data.permalink + '.json';
        https.get(commentUrl, (res) => {
          res.on('data', function(chunk) {
            commentsJson += chunk;
          });
          res.on('end', function() {
            this.comments = JSON.parse(commentsJson);
            cb(this.comments);
          });
        });
      });
    }

  }

  return new PostsObj();
}

function createResponsePack() {
  //what's being organized here??
  //what does the response need to do in this situation?
  //data needs to be sent to the front end but processed first
  //need to send post data with associated comments
  //if there are no comments leave empty
  //if there is a url involved get url
  //also need watson response data
  //would it make sense to tier the response
  //figure out what needs to be extracted from watson info (everything?)
  //send in another object??? try to make faster...
  function ResponsePackage() {
    this.postsData = {};
    this.watsonData = {};
  }
  return new ResponsePackage();
}
