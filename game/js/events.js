$(document).ready(function(){
    $('.pauseMenu').hide();
    $('.pauseIndicator').hide();
    $('.gameOverMenu').hide();
});

$('.resumeBtn').click(function(){
    $('.pauseMenu').toggle();
    $('.pauseIndicator').toggle();
    gameIsPaused = false;
});

$('.restartBtn').click(function(){
    $('.gameOverMenu').hide();
    window.location.reload();
});

$(this).keydown(function(e){
    if(e.keyCode == 27) {
        gameIsPaused = gameIsPaused ? false : true;
        $('.pauseMenu').toggle();
        $('.pauseIndicator').toggle();
    }
});

$('.landingBtn').click(function(){
    $(location).attr('href','../index.html');
});

$("html,body").on("contextmenu", false);
