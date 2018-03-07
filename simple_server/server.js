
const express = require('express');
const path = require('path');
const request = require('request');
const app = express();

app.listen(process.env.PORT || 3000, function(){

  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  console.log(__dirname);
});

module.exports = app;
