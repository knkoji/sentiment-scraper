
var data = { crutch: "block" };

$.ajax({
  url: "http://localhost:3000/posts",
  method: "POST",
  data: data,
  success: function(posts) {
    console.log(posts);
    $('#posts').append(posts);
  }
});
