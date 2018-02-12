
$("#getPosts").click(() => {
  let data = {};
  let inputText = $('#subreddit-search').val();
  data.subreddit = inputText;

  console.log(inputText);
  $.ajax({
    url: "/posts",
    method: "POST",
    data: data,
    success: displayPosts
  });
});

function displayPosts(postsJSON) {
  if(postsJSON["message"]) {
    console.log("error: \n");
    console.log(JSON.stringify(postsJSON));
  } else {
    $('#posts').append(JSON.stringify(postsJSON));
    console.log(postsJSON);
  }
}
