
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

function setPosts(postsArr) {

  let data = postsArr;
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
