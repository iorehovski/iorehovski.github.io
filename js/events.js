$(document).ready(function(){
    $('.pauseMenu').hide();
    $('.pauseIndicator').hide();
    $('.startMenu').show();
});

$('.startBtn').click(function(){
    $('.startMenu').hide();
    gameIsPaused = false;
});

$('.resumeBtn').click(function(){
    $('.pauseMenu').toggle();
    $('.pauseIndicator').toggle();
    gameIsPaused = false;
});

$(this).keydown(function(e){
    // alert(e.keyCode);
    if(e.keyCode == 27) {
        gameIsPaused = gameIsPaused ? false : true;
        $('.pauseMenu').toggle();
        $('.pauseIndicator').toggle();
    }
});