

$("#getPosts").click(() => {
  let data = {};
  let inputText = $('#subreddit').val();
  data.subreddit = inputText;

  console.log(inputText);
  $.ajax({
    url: "http://localhost:3000/posts",
    method: "POST",
    data: data,
    success: displayPosts
  });
});

function displayPosts(postsJSON) {
  if(postsJSON["message"]) {
    console.log(JSON.stringify(postsJSON));
    console.log("safkks");
  } else {
    $('#posts').append(JSON.stringify(postsJSON));
  }
}
