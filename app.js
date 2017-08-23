const express = require('express');
const app = express();
const mustache = require('mustache-express');
const parser = require('body-parser');
const port = 3000;
const session = require('express-session');

app.engine('mustache',mustache());
app.set('view engine', 'mustache');
app.set('views','./views');

app.use(parser.json());
app.use(parser.urlencoded({extended : false}));

app.listen(port, function(){
  console.log('listening on ' + port);
});
