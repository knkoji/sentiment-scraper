
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
    success: tester
  });
});


/////////////////////////////////////////////////
function tester(postsArr) {
  console.log(postsArr);
  // postsArr.forEach(post => console.log(post));
}

function visualize(visData) {
  // visData.values
  // visData.w
  // visData.h

  const w = visData.w, h = visData.h;
  const padding = 4;
  const data = visData.values

  let svg = d3.select('body')
              .append('svg')
              .attr('width', w)
              .attr('height', h);

  svg.selectAll('rect')
    .data(data)
    .enter()
      .append('rect')
      .attrs({
        x: (d, i) => i * (w / data.length),
        y: d => h - d,
        width: w / data.length - padding,
        height: d => d,
        fill: 'green'
  });

  svg.selectAll('text')
    .data(data)
    .enter()
      .append('text')
      .text((d) => d)
      .attrs({
        x: (d,i) => i * (w / data.length) + (w / data.length - padding) / 2,
        y: (d) => h - d + 20
  });
}

function setPosts(posts) {
  // it is necessary to comb through the post data, parsing and extracting into meaningful collections
  // in leiu of an actual database the data attribute can be used to set important information for
  // extraction whenever necessary

  // here we get the posts response from our /post route
  // each post {id, title, selfText, url}
  posts.forEach((post) => {

    let id = post.extras.postId;
    let ul = document.createElement('ul');

    $(ul).addClass('posts');
    $(ul).attr('id', id);
    $('#posts').append(ul);

    for (let source in post.pack) {
      let li = document.createElement('li');
      let type = '';
      let str = '';
      // for each possible source value for Watson analysis
      // appropriate input is chosen for Watson analysis
      // html structure created to hold values with appropriate attributes
      if (source === 'url') {
        type = 'url';
        str += post.pack[source];
        $(li).addClass('url');
      } else if (source === 'title') {
        type = 'title';
        str += post.pack[source];
        $(li).addClass('title');
      } else if (source === 'selfText') {
        type = 'selfText';
        str += post.pack[source];
        $(li).addClass('self-text');
      }
      // html structures are then added to document
      $(li).append(str);
      $(ul).append(li);
      // data is set to be sent in ajax request to watson api through /watson route
      let data = {
        type : type,
        source : str,
        id : id
      };
      // :/watson post request data check
      console.log("data: ", data);

      // create button that has an even hadler that uses stored watson data for d3
      $.ajax({
        url: '/watson',
        method: 'POST',
        data: data,
        success: sentimentData
      });
      // once data is retrieved it can only be manipulated through the function under success
      // but is there anything that i would like done after the fact
    }
  });
}

function sentimentData(watsonRes) {
  let data;
  let id = watsonRes.id;
  let analysis = watsonRes.resp;

  // parse out analysis into variables
  // do complete mapping from object to html structure
  // use viz.js file to expose various vizualizations
  // or set route to get vizualizations and create function to handle response
  // console.log('watson:\n', sentReqData.resp);
  // add data to data attributes so it is always there as there is no real way to access
  // collections due to callbacks

  // let li = document.createElement('li');
  // $(li).append(JSON.stringify(analysis, null, 2));
  //
  // $(`#${id}`).after(li);

  // store data as array on dataset access array and use it as data for d3
}

function commentDrata(postData) {

}
