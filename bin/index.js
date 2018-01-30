
var data = { subreddit: "CryptoCurrency" };

$.ajax({
  url: "http://localhost:3000/posts",
  method: "POST",
  data: data,
  success: function(posts) {
    console.log(posts);
    $('#posts').append(JSON.stringify(posts));
  }
});
