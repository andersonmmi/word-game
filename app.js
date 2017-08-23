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

// TODO: session does not create an object yet
app.use(session({
  secret : 'admin',
  resave : false,
  saveUnitialized : true
}));

app.get('/',function(req, res){
  res.render('index');
});

app.listen(port, function(){
  console.log('listening on ' + port);
  console.log(session.object);
});
