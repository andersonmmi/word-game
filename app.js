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
let extraSolutionArray = [];
// done: create eachLetter class with "match" constructor so that new letter objects can be created and pushed to solution array
let myObj = class Object {
  constructor(letter) {
    this.letter = letter;
    this.match = false;
  }
}
let secretWord = '';
const data = require('./data.js');

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
  solution = word.split('');
  extraSolutionArray = word.split('')
  req.session.letters = extraSolutionArray;
  req.session.solution = solution;
  console.log(req.session.word);
  console.log("^^ req.session.word");
  console.log(req.session.letters);
  console.log("^^ req.session.letters");
  req.session.guesses = [];
  function createObjectList(){
      letters.push("-");
      return new myObj(letters.shift());
  }
  solution = letters.map(()=>createObjectList());
  // This solution array of objects replaces all elements in array letters with garbage placeholders.  Took like 2 hours to build though :-/
  console.log(solution);
  console.log("^^ solution");
  console.log(letters);
  console.log('^^ letters');
  // done: replace data.js with corresponding key value pairs
  res.render('index',
    // data
    {
      word: word,
      solution: solution
    }
  );
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
  // done: log "--success" if session.letters contains body.guess
  console.log(req.session.letters + ' -- ' + req.body.guess);
  req.session.letters.indexOf(req.body.guess[0][0]) > -1 ? console.log("--success") : console.log("failure");
  // TODO: if success, show letter; else log solution
  req.session.letters.indexOf(req.body.guess[0][0]) > -1
  // TODO: make each letter.match = true
  ? solution[req.session.letters.indexOf(req.body.guess[0][0])].match = true
  : console.log(solution);
  console.log(solution);
  console.log("^^ solution");
  console.log(solution.every());
  //render page anew
  // done: replace data with key value pairs
  res.render('index',
    // data
    {
      word: req.session.word,
      solution: solution,
      guesses: guesses
    }
  );
  next();
});

app.listen(app.get('port'), function(){
  console.log('listening on 3000');
  console.log(session);
});
