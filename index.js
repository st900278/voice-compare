var fs = require('fs');
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mustacheExpress = require("mustache-express");
var cookieParser = require("cookie-parser");
var session = require("express-session");


var server = app.listen(4000, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
});

var argv = require('optimist').default({ l : 'input.txt', v : 'mixed' }).argv
console.log(argv);

var questionList = [];
var questionAmount;
var fileLocation = argv.v + "/";
var voiceLocation = argv.l;
console.log(argv.l);

fs.readFile(voiceLocation, 'utf8', function (err, text) {
    console.log(text);
    line = text.split("\n");
    for(var i = 0;i<line.length;i++){
      if(line[i] == '') continue;
      [left, right] = line[i].split(" ");
      questionList.push({left:left, right:right, answer:''});
    }
    questionAmount = questionList.length;
    console.log(questionList);

});


app.engine('html', mustacheExpress());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.set('view engine', 'html');
app.set('views', '.')
app.use(express.static(__dirname + "/build/"));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 60 * 1000
  }
}));

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

app.get("/", function(req, res, next){
  if(typeof req.session.taskOrder === 'undefined') {
    order = Array.from(Array(questionAmount).keys());
    req.session.taskOrder = shuffle(order);
    req.session.answer = {};
  }
  if(typeof req.session.ptr === 'undefined'){
    req.session.ptr = 0;
  }
  console.log(req.session.taskOrder);
  console.log(req.session.ptr);
  console.log(req.session.taskOrder[req.session.ptr]);
  res.render("index.html");
});

app.get("/getdata", function(req, res, next){
  if(req.session.ptr >= questionAmount){
    res.json({'end': true});
  }
  else{
    nowQuestion = req.session.taskOrder[req.session.ptr];

    data = {
      end: false,
      question: nowQuestion,
      order: req.session.ptr,
      left: fileLocation + (nowQuestion + 1) + "_" + questionList[nowQuestion].left + ".m4a",
      right: fileLocation + (nowQuestion + 1) + "_" + questionList[nowQuestion].right + ".m4a",
    };
    res.json(data);
  }


});

app.post("/sendanswer", function(req, res, next){
  console.log(req.body);
  question = req.body.question;
  if(parseInt(question) != req.session.taskOrder[req.session.ptr]){
    console.log("wrong order");
    res.send("wrong");
  }
  else{
    nowQuestion = req.session.taskOrder[req.session.ptr];
    questionList[nowQuestion].answer = req.body.answer;
    console.log(questionList);
    var statCalc = {};
    for(var i=0;i<questionList.length;i++){
      var ans = questionList[i][questionList[i].answer];
      if(typeof statCalc[ans] == 'undefined'){
        statCalc[ans] = 1;
      }
      else{
        statCalc[ans] += 1;
      }
    }
    console.log(statCalc);

    req.session.ptr += 1;
    res.send("test");

  }

});
app.get("/reset", function(req, res, next){
  req.session.destroy();
  res.send("success <a href='/'>restart</a>");
});
