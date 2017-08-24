const express = require('express');
const app = express();
const mustache = require('mustache-express');
const parser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
let guesses = [];
let letters = [];
let solution = [];
// done: create eachLetter class with "match" constructor so that new letter objects can be created and pushed to solution array
let letter = class letter {
  constructor(match) {
    this.match = match;
  }
}
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
  // done: used .split to create an array of one letter strings
  req.session.word = word;
  console.clear();
  letters = word.split('');
  solution = letters;
  req.session.letters = letters;
  req.session.solution = solution;
  console.log(req.session.word);
  console.log("^^ req.session.word");
  console.log(req.session.letters);
  console.log("^^ req.session.letters");
  req.session.guesses = [];
  secretWord = word;
  solution = letters.map(()=> new letter('a'));
  console.log(solution);
  console.log("^^ solution");
  console.log("index 0 = " + solution[0]);
  res.render('index',{
    solution : solution,
    word : word,
    guesses : guesses
  });
});

// done: create app.post that pushes letters from guess form
app.post('/',function(req,res,next){
  guesses.push(req.body.guess);
  console.log(req.body.guess[0][0]);
  console.log("^^ req.body.guess[0][0]");
  // done: push strings to session.guesses, not arrays (time spent 45 min smh)
  req.session.guesses.push(req.body.guess[0][0]);
  console.log(req.session.guesses);
  console.log("^^ req.session.guesses");
  // done: log "success" if session.letters contains body.guess
  req.session.letters.indexOf(req.body.guess[0][0]) > -1 ? console.log("success") : console.log("failure");
  // TODO: if success, show letter; else log solution
  req.session.letters.indexOf(req.body.guess[0][0]) > -1
  // TODO: make each letter.match = 'b'
  ? solution = solution.map(()=> new letter('b'))
  : console.log(solution);
  //render page anew
  res.render('index',{
    solution : solution,
    word : secretWord,
    guesses : guesses
  });
  next();
});

app.listen(app.get('port'), function(){
  console.log('listening on 3000');
  console.log(session);
});
