// function Peanut(type, quantity) {
//   this.type = type;
//   this.quantity = quantity;
//
// }
function postCreator(site) {
  let url = site.url;
  function Posts() {
    this.posts = [];
    this.comments = [];
  }
  return new Posts();
}
