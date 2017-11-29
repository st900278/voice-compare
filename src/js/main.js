var question;

var getQuestion = function(){
  $.get('/getdata', function(res){
    console.log(res);

    if(res.end){
      location.href="/reset";
    }
    question = res.question;
    var left = res.left;
    var right = res.right;
    document.getElementById("source-left").setAttribute("src", left);
    document.getElementById("source-right").setAttribute("src", right);
    document.getElementById("player-left").load();
    document.getElementById("player-right").load();
    document.getElementById("question-number").innerHTML = "Q"+(res.order+1)+":";
  });
};


$(function(){
  getQuestion();
  console.log(question);




  document.getElementById("left").addEventListener('click', function(){
    $.post('/sendanswer', {
      'question': question,
      'answer': "left"
    },function(res){

      console.log(res);
      getQuestion();
    });
  });
  document.getElementById("right").addEventListener('click', function(){
    $.post('/sendanswer', {
      'question': question,
      'answer': "right"
    },function(res){

      console.log(res);
      getQuestion();
    });
  });
});
