
$("#getPosts").click(() => {
  let data = {};
  let inputText = $('#subreddit-search').val();
  data.subreddit = inputText;

  console.log(inputText);
  $.ajax({
    url: "/posts",
    method: "POST",
    data: data,
    success: takeData
  });
});

function takeData(dataPack) {
  if(dataPack.postsData["message"]) {
    console.log("error: \n");
    console.log(JSON.stringify(postsJSON));
  } else {
    // $('#posts').append(JSON.stringify(postsJSON));
    let postsStrData = dataPack.postsData;
    let watsonStrData = dataPack.watsonData;

    console.log("posts: \n", JSON.parse(dataPack.postsData));
    console.log("watson: \n", dataPack.watsonData);
  }
}
