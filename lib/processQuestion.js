function processQuestion(chosenQuestionNumber, transported = 0) {
    // if no team names, warn.
    if (!JSON.parse(sessionStorage.getItem("team1")) || !JSON.parse(sessionStorage.getItem("team2")) || !JSON.parse(sessionStorage.getItem("team1")).name || !JSON.parse(sessionStorage.getItem("team2")).name) return showPopup("warnTeamName");
    // if question transported to other team, play sfx

    let savedChosen = sessionStorage.getItem("chosenQuestions") ?? "";
    let chosen = savedChosen.split(",");
    if (chosen.includes(chosenQuestionNumber.toString()) && transported == 0) return showPopup("warnAlreadyChosen");
    // Question Logic
    questionPage.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimer(transported)
    if (transported == 0) {
        setQuestionData(chosenQuestionNumber);
        questionsContainer.item(chosenQuestionNumber).setAttribute("chosen", true);
        sessionStorage.setItem("chosenQuestions", sessionStorage.getItem("chosenQuestions") ? sessionStorage.getItem("chosenQuestions") + `,${chosenQuestionNumber}` : chosenQuestionNumber);
        sessionStorage.setItem("turn", (parseInt(sessionStorage.getItem("turn")) + 1) % 2);
    }
    turn = sessionStorage.getItem("turn");
    let countdown = setInterval(() => {
        // Subtract Time
        timer.textContent = (parseInt(timer.textContent) - 1)
        // if time <= 10 start flashing color
        if (parseInt(timer.textContent) <= 10) {
            let stateColor = timer.getAttribute("red") === 'true';
            timer.setAttribute("red", !stateColor);
        }
        // if out of time
        if (parseInt(timer.textContent) <= 0) {
            stopTimer(countdown)
            return checkQuestionResult(chosenQuestionNumber, transported, countdown, lastClickedChoice);
        }
    }, 1000);
    choicesContainer.forEach(choice => {
        choice.onclick = () => {
            if(window.switching) return;
            lastClickedChoice = choice;
            choiceClickCount++;
            return checkQuestionResult(chosenQuestionNumber, transported, countdown, lastClickedChoice);
        };
    });

}

