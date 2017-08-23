const express = require('express');
const app = express();
const mustache = require('mustache-express');
const parser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
let guesses = [];
let letters = [];
let secretWord = '';

app.set('port', process.env.PORT || 3000);
app.engine('mustache',mustache());
app.set('view engine', 'mustache');
app.set('views','./views');

app.use(parser.json());
app.use(parser.urlencoded({extended : false}));
app.use(express.static(__dirname+'/public'));

// TODO: session does not create a unique ID yet
app.use(session({
  secret : 'admin',
  resave : false,
  saveUnitialized : true
  })
);

app.get('/',function(req, res){
  let word = words[Math.floor(Math.random() * words.length)];
  // TODO: can I get spread to create an array or one letter strings?
  req.session.word = word;
  console.clear();
  letters = word.split('');
  req.session.letters = letters;
  console.log(req.session.word);
  console.log("^^ req.session.word");
  console.log(req.session.letters);
  console.log("^^ req.session.letters");
  secretWord = word;
  res.render('index',{
    letters : letters,
    word : word,
    guesses : guesses
  });
});

// TODO: create app.post that pushes letters from guess form
app.post('/',function(req,res,next){
  guesses.push(req.body.guess);
  console.log(req.body.guess);
  res.render('index',{
    guesses : guesses
  });
  next();
});

app.listen(app.get('port'), function(){
  console.log('listening on 3000');
  console.log(session);
});
