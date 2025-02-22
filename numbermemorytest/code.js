$(function () {
    // initialize the number grid with 9 images
    for (var i=1; i<=9; i++) {
        $('#'+i).css('background-image', 'url("./numbermemorytest/images/normal'+i+'.jpg")');
    }

    // hiding the overlays initially
    $('#overlay').css("display", "none");
    $('#giveup-overlay').css("display","none");

    // sound object
    var successSound = new Audio("./numbermemorytest/sound/success.mp3");

    // total guesses
    var totalGuesses = 0;

    // save the random pattern in an array
    var pattern_array = [];

    // players guess pattern
    var guess_array = [];

    // adding remarks at the top
    var successRemarks = ['Good', 'Perfect', 'Awesome'];            //you can change the success remarks here
    var failRemarks = "Wrong! Better luck next time";               //these remarks appear above when player fails
    var yourTurnText = "Your Turn!";                                //text to show player's turn

    // event listener for give-up button
    $('#giveup-btn').on("click", function () {
        $('#current_score').text($('#level').text());               //tells the current level player was on
        $('#giveup-overlay').css("display", "block");
    }) 

    // event listener for try again button
    $('#try-again').on("click", function () {
        $('#overlay').css("display", "none");
        totalGuesses = 0;
        guess_array.length = 0;
        pattern_array.length = 0;
        game();
    })

    // level up
    function levelUp() {
        var currentLevel = parseInt($('#level').text());
        var newLevel = currentLevel + 1;
        $('#level').text(newLevel);
        game();
    }

    // this function is binded to the buttons
    async function clickAble() {
        // give the animation effect to button clicked
        await animate($(this).attr('id'));

        if (guess_array.length <= pattern_array.length) {
            var number = parseInt($(this).attr('id'));
            guess_array.push(number);
        }

        var clickAllowed = await playerCanClick()
        if ( clickAllowed ) {
            // keep waiting until player has guessed the sequence
        }

        else {
            // now player has guessed the sequence, we can check it
            var results = await checkGuess();
            if (results) {
                // move to the next level
                levelUp();
                var num = Math.floor(Math.random() * successRemarks.length);        //randomly generate a number between 0 and length of "SUCCESS REMARKS"
                $('#remarks').text(successRemarks[num]);                            //displaying the success remarks
            }
            else {
                // game is over now
                $('.item').unbind();
                $('#score').text($('#level').text());
                $('#overlay').css("display", "block");
                
            }

        }
    }

    // adding event listeners to the buttons
    $('.item').on("click", clickAble);

    function clickButton() {
        while (true) {
            var random_number = Math.floor(Math.random() * 9 ) + 1;         // generating random number between 1 and 9
        
            if ($('#'+random_number).hasClass("clicked")) {
                continue;
            }
    
            else {
                $('#'+random_number).css( 'background-image', 'url(./numbermemorytest/images/down'+random_number+'.jpg)' ).addClass('clicked');
                pattern_array.push(random_number);
                var normalButton = setTimeout(() => {
                    $('#'+random_number).css( 'background-image', 'url(./numbermemorytest/images/normal'+random_number+'.jpg)' ).removeClass('clicked');
                }, 500);
                break;
            }
        }
    }

    // clicks the button based on level
    function patternGenerator() {
        return new Promise((resolve, reject)=> {
            $('.item').unbind();
            var current_level = $('#level').text();
            var counter = 0;
    
            var generate_pattern = setInterval( function () {
                counter += 1;
                if (counter <= current_level) {
                    clickButton();
                }
                else {
                    clearInterval(generate_pattern);
                    $('#remarks').text(yourTurnText);
                    resolve('pattern generated');
                    $('.item').bind('click',clickAble);
                }
            },1000);
        })
    }

    function playerCanClick() {
        return new Promise ((resolve, reject) => {
            var currentLevel = parseInt($('#level').text());
            if (currentLevel > totalGuesses) {
                totalGuesses += 1;
                if (currentLevel === totalGuesses) {
                    resolve(false);
                }

                resolve(true);
            }
        })
    }

    function animate(id){
        return new Promise((resolve, reject) => {
            $('#'+id).css( 'background-image', 'url(./numbermemorytest/images/down'+id+'.jpg)' ).addClass('clicked');
            var normalButton = setTimeout(() => {
                $('#'+id).css( 'background-image', 'url(./numbermemorytest/images/normal'+id+'.jpg)' ).removeClass('clicked');
                resolve('Animation done');
            }, 100);
        })
    }

    function checkGuess () {
        return new Promise((resolve, reject) => {
            if (JSON.stringify(guess_array) === JSON.stringify(pattern_array)) {
                successSound.play();
                pattern_array.length = 0;
                totalGuesses = 0;
                guess_array.length = 0;
                resolve(true);
            }
            else {
                $('#remarks').text(failRemarks);
                resolve(false);
            }
        })
    }

    async function game() {
        await patternGenerator();
    }

    game();

})
