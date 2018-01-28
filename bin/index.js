$.get('/posts', function(posts) {
  console.log(posts);

  $('#posts').append(JSON.stringify(posts));
});
