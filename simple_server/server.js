const https = require('https');
const express = require('express');
const path = require('path');
const request = require('request');
const app = express();

let main = 'https://oauth.reddit.com';
let resultsObj = createPostsObj(main);
let bodyParser = require('body-parser');
let ClientOAuth2 = require('client-oauth2');

const reddit_pass = process.env.redditPass;
const reddit_id = process.env.redditId;

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
  resultsObj.getPosts((posts) => {
    res.send(posts);
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

      let tokenUrl = 'https://www.reddit.com/api/v1/access_token';
      const redditAuth = new ClientOAuth2({
        accessTokenUri: tokenUrl,
        clientId: reddit_id,
        clientSecret: reddit_pass,
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
                                  'client_id': reddit_id,
                                  'client_secret': reddit_pass
                          },
                          url: url
                        };
          console.log(user.data);
          console.log(token);
          console.log(url);
          request.get(options, (error, res) => {
            cb(res.body);
          });
        });
    }

    this.getComments = (cb) => {
      let commentsJson = '';
      this.posts.forEach( post => {
        let commentUrl = url + post.post.data.permalink + '.json'
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
