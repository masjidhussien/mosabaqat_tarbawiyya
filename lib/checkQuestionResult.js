function checkQuestionResult(chosenQuestionNumber, transported, countdown, choice) {
    if (window.answerRevealed) return;
    const options = config.style.config.options;
    const isCorrect = choice && choice.getAttribute("correct") === "true";
    const isTRANSFERABLE = questions[chosenQuestionNumber].TRANSFERABLE;
    const isTimeout = !choice && (parseInt(timer.textContent) <= 0);

    // --- CASE 1: REVEAL IMMEDIATELY ---
    // Reveal if:
    // 1. Choice is correct.
    // 2. We are already on the second attempt (transported === 1).
    // 3. It's the first attempt but the question is NOT TRANSFERABLE (wrong or timeout).
    if (isCorrect || transported === 1 || !isTRANSFERABLE) {
        stopTimer(countdown);
        return revealAnswers(chosenQuestionNumber, choice, countdown, transported, isCorrect);
    }

    // --- CASE 2: TRANSPORT TO OTHER TEAM ---
    // Occurs if: First attempt (transported === 0) AND (Wrong Choice OR Timeout)
    if (transported === 0 && (!isCorrect || isTimeout)) {
        stopTimer(countdown);
        
        // Play wrong sound and mark the choice red if one was clicked
       options['use-teams'] ? new Audio("./assets/audio/wrong.mp3").play() : "";
        if (choice) {
            choice.style.backgroundColor = "red";
        }

        window.switching = true;
        
        // Brief delay before switching to the other team
        setTimeout(() => {
            new Audio("./assets/audio/switch.mp3").play();
            
            // Switch the turn (0 -> 1 or 1 -> 0)
            const currentTurn = parseInt(sessionStorage.getItem("turn")) || 0;
            sessionStorage.setItem("turn", (currentTurn + 1) % 2);
            
            // Reload question for second attempt (transported = 1)
            processQuestion(chosenQuestionNumber, 1);
            window.switching = false;
        }, 2000); // 2 seconds delay feels snappier than 3
    }
}