
$("#getPosts").click(() => {
  let data = {};
  let inputText = $('#subreddit-search').val();
  data.subreddit = inputText;

  console.log(`subreddit: ${inputText}`);
  $.ajax({
    url: "/posts",
    method: "POST",
    data: data,
    success: displayPostData
  });
});

function displayPostData(posts) {

  posts.forEach((post) => {
    let id = post.extras.postId;
    let ul = document.createElement("ul");
    $(ul).addClass('post');
    $(ul).attr('id', id);
    $('#posts').append(ul);

    post.pack.forEach((source) => {
      let li = document.createElement("li");
      let type = '';
      let str = '';
      // console.log(data);
      if (source.url) {
        type = 'url';
        str += source.url;
        $(li).addClass('url');
      }
      if (source.title) {
        type = 'title';
        str += source.title;
        $(li).addClass('title');
      }
      if (source.selfText) {
        type = 'selfTitle';
        str += source.selfText;
        $(li).addClass('self-text');
      }

      $(li).append(str);
      $(ul).append(li);
      let data = {}
      data.type = type;
      data.source = str;
      data.id = id;

      $.ajax({
        url: "/watson",
        method: "POST",
        data: data,
        success: displaySentiment
      });
    });
  });
}

function displaySentiment(sentimentObj) {
  console.log('watson:\n', sentimentObj);
}
