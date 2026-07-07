let controls = document.getElementsByClassName("controls")[0];


function processQuestion(chosenQuestionNumber, transported = 0) {

    let timerElement = document.getElementsByClassName("timer")[0];

    questionPage.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });


    setTimer(transported);


    if (transported == 0) {

        setQuestionData(chosenQuestionNumber);

        questionsContainer
            .item(chosenQuestionNumber)
            .setAttribute("chosen", true);


        sessionStorage.setItem(
            "chosenQuestions",
            sessionStorage.getItem("chosenQuestions")
                ? sessionStorage.getItem("chosenQuestions") + `,${chosenQuestionNumber}`
                : chosenQuestionNumber
        );


        sessionStorage.setItem(
            "turn",
            (parseInt(sessionStorage.getItem("turn")) + 1) % 2
        );
    }



    let backBtn = document.getElementsByClassName("back")[0];
    let doneBtn = document.getElementsByClassName("done")[0];
    let resetTimer = document.getElementsByClassName("resetTimer")[0];



    // Show controls
    controls.style.display =
        choicesContainer.length < 1 ? "block" : "none";


    // Show reset button
    resetTimer.style.display = "block";



    let countdown = null;
    let timerStarted = false;
    let initialTimerValue = parseInt(timer.textContent);



    function stopTimerSound() {

        tickSound.pause();
        tickSound.currentTime = 0;

    }




    const startCountdown = () => {


        // prevent multiple timers
        if (countdown) return;


        timerStarted = true;


        tickSound.currentTime = 0;
        tickSound.play().catch(() => { });



        countdown = setInterval(() => {


            let currentTime = parseInt(timer.textContent);


            timer.textContent = currentTime - 1;



            // flashing red
            if (parseInt(timer.textContent) <= 10) {

                timer.setAttribute(
                    "red",
                    timer.getAttribute("red") !== "true"
                );

            }



            // finished
            if (parseInt(timer.textContent) <= 0) {


                clearInterval(countdown);
                countdown = null;
                timerStarted = false;


                stopTimerSound();



                checkQuestionResult(
                    chosenQuestionNumber,
                    transported,
                    countdown,
                    lastClickedChoice
                );


            }


        }, 1000);


    };






    resetTimer.onclick = (e) => {


        e.stopPropagation();


        // stop interval
        if (countdown) {

            clearInterval(countdown);
            countdown = null;

        }



        // stop sound
        stopTimerSound();



        // reset timer
        timer.textContent = initialTimerValue;


        // remove red
        timer.setAttribute(
            "red",
            false
        );


        timerStarted = false;



        // restore manual click
        if (config.style.config.options['manual-timer']) {

            timerElement.onclick = null;

            timerElement.addEventListener(
                "click",
                startCountdown,
                {
                    once: true
                }
            );

        }


    };






    doneBtn.onclick = () => {

        new Audio("./assets/audio/correct.mp3").play();

        questionsContainer
            .item(chosenQuestionNumber)
            .setAttribute("chosen", true);



        returnToQuestions(
            countdown,
            0
        );


    };







    backBtn.onclick = () => {


        questionsContainer
            .item(chosenQuestionNumber)
            .setAttribute("chosen", false);



        sessionStorage.setItem(
            "chosenQuestions",
            sessionStorage.getItem("chosenQuestions")
                ? sessionStorage.getItem("chosenQuestions")
                    .split(",")
                    .filter(n => parseInt(n) !== chosenQuestionNumber)
                    .join(",")
                : ""
        );



        returnToQuestions(
            countdown,
            0
        );


    };







    // Start timer
    if (config.style.config.options['manual-timer']) {


        timerElement.addEventListener(
            "click",
            startCountdown,
            {
                once: true
            }
        );


    } else {


        startCountdown();


    }







    choicesContainer.forEach(choice => {


        choice.onclick = () => {


            if (window.switching) return;


            lastClickedChoice = choice;

            choiceClickCount++;



            checkQuestionResult(
                chosenQuestionNumber,
                transported,
                countdown,
                lastClickedChoice
            );


        };


    });



}