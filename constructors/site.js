function subReddit(name) {
  let domain = 'http://reddit.com';
  let url = `${domain}/r/name/.json`
  function SubReddit() {
    this.url = url;
  }
  return new SubReddit();
}
