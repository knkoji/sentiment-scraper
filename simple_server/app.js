const express = require('express');
const path = require('path');
let app = express();

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
// Later on. app could also be router, etc., if you ever get that far

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
    // res.send('Hello World');
});
