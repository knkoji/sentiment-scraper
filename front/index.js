
$("#getPosts").click(() => {
  let data = {};
  let inputText = $('#subreddit-search').val();
  data.subreddit = inputText;

  //subreddit input check
  console.log(`subreddit: ${inputText}`);

  $.ajax({
    url: "/posts",
    method: "POST",
    data: data,
    success: setPosts
  });
});

function setPosts(postsResp) {

  let data = postsResp.postsData;
  let posts = postsResp.posts;
  
  data = JSON.stringify(data);

  $.ajax({
    url: '/watson',
    method: 'POST',
    data: {
      key: data
    },
    success: sentimentData
  });
}

function sentimentData(watsonResp) {
  console.log(watsonResp);
}
