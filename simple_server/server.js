const https = require('https');
const express = require('express');
const path = require('path');
const request = require('request');
const app = express();
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

//----------------------------------------------------------------------

let main = 'https://www.reddit.com';
let subreddit = 'CryptoCurrency';
let resultsObj = createPostsObj(main, subreddit);

resultsObj.getPosts();


//----------------------------------------------------------------------

function createPostsObj(domain, subreddit) {
  let url = `${domain}/r/${subreddit}.json`;
  function PostsObj() {
    this.url = url;
    this.posts = [];
    this.comments = [];
    this.getPosts = () => {
      let postsJson = '';
      https.get(this.url, (res) => {
        res.on('data', function(chunk) {
          postsJson += chunk;
        });
        res.on('end', function(){
          this.posts = JSON.parse(postsJson);
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
            toTheDOM(this);
          });
        });
      });
    }

  }
  return new PostsObj();
}
function toTheDOM(postsResults) {
  console.log(postsResults.posts.length);
}
