const http = require('https');
const express = require('express');
const path = require('path');

let url = "https://www.reddit.com"
let num = 53;
let posts = [];
let comments = {};
let app = express();
const path = require('path');

// Later on. app could also be router, etc., if you ever get that far

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

topPosts(url, num, posts);


function topPosts(url, num, posts) {
  postsJson = '';
  commentsJson = '';
  http.get(url + '/r/CryptoCurrency/.json', (res) => {
    res.on('data', function(chunk) {
      postsJson += chunk;
    });

    res.on('end', function(){
      let jsonObj = JSON.parse(postsJson);
      jsonObj.data.children.forEach(function(post) {
        posts.push({ post: post, comments: true });
      });

      posts.forEach( post => {
        // console.log(post);
        let commentsJson = '';
        let commentUrl = url + post.post.data.permalink + '.json'
        http.get(commentUrl, (res) => {
          res.on('data', function(chunk) {
            commentsJson += chunk;
          });
          res.on('end', function() {
            let commentsObj = JSON.parse(commentsJson);
            // console.log(commentsObj);
            // console.log(posts);
            post.comments = commentsObj;
          });
        });
      });
    });
  });
}
