const https = require('https');
const express = require('express');
const path = require('path');
const request = require('request');
const app = express();

let main = 'https://www.reddit.com';
let subreddit = 'CryptoCurrency';
let resultsObj = createPostsObj(main, subreddit);
console.log(resultsObj);
//----------------------------------------------------------------------

app.use(express.static(path.join(__dirname, '../bin')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../bin', 'index.html'));
});
app.get('/posts', (req, res) => {
  resultsObj.getPosts((posts) => {
    res.send(posts);
  });
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

function createPostsObj(domain, subreddit) {
  let url = `${domain}/r/${subreddit}.json`;
  function PostsObj() {
    this.url = url;
    this.posts = [];
    this.comments = [];
    this.getPosts = () => {;
      let postsJson = '';
      https.get(this.url, (res) => {
        res.on('data', function(chunk) {
          postsJson += chunk;
        });
        res.on('end', function(){
          this.posts = JSON.parse(postsJson);
          cb(this.posts);
        });
      });
    }
    this.getComments = () => {
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
