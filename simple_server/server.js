const https = require('https');
const express = require('express');
const path = require('path');
const request = require('request');
const app = express();

let main = 'https://www.reddit.com';
let resultsObj = createPostsObj(main);
var bodyParser = require('body-parser');

console.log(resultsObj);
//----------------------------------------------------------------------
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../bin')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../bin', 'index.html'));
});
app.post('/posts', (req, res) => {
  console.log(req.body);
  let subreddit = req.body.subreddit;
  resultsObj.getPosts((posts) => {
    res.send(posts);
  }, subreddit);

});
app.get('/comments', (req, res) => {
  resultsObj.getComments((comments) => {p;kil
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
    this.posts = [];
    this.comments = [];
    this.getPosts = (cb, sub) => {;
      let postsJson = '';
      let url = `${domain}/r/${sub}.json`;
      https.get(url, (res) => {
        res.on('data', function(chunk) {
          postsJson += chunk;
        });
        res.on('end', function(){
          this.posts = JSON.parse(postsJson);
          cb(this.posts);
        });
      });
    }
    this.getComments = (cb) => {
      let commentsJson = '';
      posts.forEach( post => {
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
