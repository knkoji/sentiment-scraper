let http = require('https');

let url = "https://www.reddit.com"
let num = 53;
let posts = [];
let comments = {};

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

      console.log(posts.length);

      posts.forEach( post => {
        // console.log(post);
        let commentsJson = '';
        let commentUrl = url + post.post.data.permalink + '.json'
        console.log(commentUrl);
        http.get(commentUrl, (res) => {
          res.on('data', function(chunk) {
            commentsJson += chunk;
          });
          res.on('end', function() {
            let commentsObj = JSON.parse(commentsJson);
            // console.log(commentsObj);
            // console.log(posts);
            post.comments = commentsObj;
            console.log(post);
          });
        });
      });
    });
  });
}
