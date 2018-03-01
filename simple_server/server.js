const https = require('https');
const express = require('express');
const path = require('path');
const request = require('request');
const fs = require('fs');
const bodyParser = require('body-parser');
const async = require("async");
const ClientOAuth2 = require('client-oauth2');
const loadConfig = require('./process_env.js');
let watsonNLUV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

const app = express();
const config = loadConfig();
const redditPass = config.reddit.pass;
const redditId = config.reddit.id;
const nluWatsonPass = config.nluWatson.pass;
const nluWatsonId = config.nluWatson.id;


let main = 'https://oauth.reddit.com';
let url = 'https://www.cbinsights.com/research/startup-failure-reasons-top/?utm_content=66767994&utm_medium=social&utm_source=twitter'
let resultsObj = createPostsObj(main);
let watson = createWatson();

console.log(resultsObj);
console.log(watson);

//----------------------------------------------------------------------

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

  watson.getNLU(content, (resp) => {
    console.log(resp);
    res.send(resp);
  });
})

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

function createWatson() {
  function WatsonObj() {

    this.nlu = new watsonNLUV1({
      username: nluWatsonId,
      password: nluWatsonPass,
      version_date: watsonNLUV1.VERSION_DATE_2017_02_27
    });

    this.getNLU = (data, cb) => {
      let parameters = {};

      if(data.type === 'url') {
        parameters = {
          'url': data.source,
          'features': {
            'entities': {
              'emotion': true,
              'sentiment': true,
              'limit': 2
            },
            'keywords': {
              'emotion': true,
              'sentiment': true,
              'limit': 2
            }
          }
        }
      }
      if (data.type === 'title' || data.type === 'selfTitle') {
        let apprStr = '';
        let str = data.source;
        let numWords = str.split(' ').length;
        console.log(`numWords: ${numWords}`);

        if (numWords <= 15) {
          let count = 15 - numWords;
          // console.log(`count: ${count}`);
          let i = 0;
          while (i < count) {
            str += ' 000000';
            // console.log(str);
            // console.log(count);
            i++;
          }
        }

        parameters = {
          'text': str,
          'features': {
            'entities': {
              'emotion': true,
              'sentiment': true,
              'limit': 2
            },
            'keywords': {
              'emotion': true,
              'sentiment': true,
              'limit': 2
            }
          }
        }
      }
      // if (data.type === 'selfTitle') {
      //   parameters = {
      //     'text': data.source,
      //     'features': {
      //       'entities': {
      //         'emotion': true,
      //         'sentiment': true,
      //         'limit': 2
      //       },
      //       'keywords': {
      //         'emotion': true,
      //         'sentiment': true,
      //         'limit': 2
      //       }
      //     }
      //   }
      // }

      // cb(parameters);
      // if (data.type === 'selfTitle') {
        this.nlu.analyze(
          parameters,
          (error, response) => {
            if(error) {
              console.log(`error: ${error}`);
            } else {
              cb(response);
            }
          });
      // } else {
      //   cb({ watson: 'ooohyesh' })
      // }

    }
  }
  return new WatsonObj();
}
