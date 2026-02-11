function revealAnswers(chosenQuestionNumber, choice, countdown, transported = 0, isCorrect) {
    window.answerRevealed = true;
    stopTimer(countdown);
    if (choice && isCorrect) {
        let teamData = JSON.parse(
            sessionStorage.getItem(`team${(parseInt(turn) + 1)}`)
        );

        teamData.points += 1;
        document.getElementsByClassName("points")[turn].value = teamData.points;
        sessionStorage.setItem(
            `team${(parseInt(turn) + 1)}`,
            JSON.stringify(teamData)
        );
        new Audio("./assets/audio/correct.mp3").play();
        choiceClickCount = 0;
        return colorAnswers(chosenQuestionNumber, countdown);
    }

    if (choice && !isCorrect) {
        choice.classList.add("red");
        colorAnswers(chosenQuestionNumber, countdown);
        choiceClickCount = 0;
        return new Audio("./assets/audio/wrong.mp3").play();
    }

    // timeout (no choice)
    if (choiceClickCount == 0) {
        new Audio("./assets/audio/wrong.mp3").play();
        colorAnswers(chosenQuestionNumber, countdown);
    }
}

function colorAnswers(chosenQuestionNumber, countdown) {
    // Set Colors
    const correctIndex = questions[chosenQuestionNumber].choices.findIndex(
        choice => choice === questions[chosenQuestionNumber].correct
    );
    window.answerRevealed = true;
    choicesContainer.forEach(el => el.classList.remove("red", "green"));

    choicesContainer.forEach((el, index) => {
        if (index === correctIndex) el.classList.add("green");
        else el.classList.add("red");
    });

    returnToQuestions(countdown)
}