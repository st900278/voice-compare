
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mustacheExpress = require("mustache-express");
var cookieParser = require("cookie-parser");
var session = require("express-session");


var server = app.listen(4000, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
});

var questionList = [];
var questionAmount;

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


app.get("/", function(req, res){
  res.render("temp.html");

});
app.get("/data", function(req, res){
  console.log(req.query);
  res.send("you use get method");
});

app.post("/data", function(req, res){
  console.log(req.body);
  res.send("you use post method");
});
