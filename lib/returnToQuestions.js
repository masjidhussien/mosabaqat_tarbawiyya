function returnToQuestions(countdown, time = TIME_TO_RETURN) {
    window.switching = false;
    clearInterval(countdown);
    tickSound.pause();  // stop
    tickSound.remove()
    setTimeout(() => {
        document.querySelectorAll("p").forEach(p => {
            p.style.color = invertColor("#FFFFFF", true)
        })
        questionsContainer.item(0).parentElement.parentElement.scrollIntoView({ behavior: "smooth", block: "center" })
        setTimeout(() => {
            timer.textContent = 0;
            setQuestionData("")
            choiceClickCount = 0;
            window.answerRevealed = false;
        }, 500);
        if (eval(`[${sessionStorage.getItem("chosenQuestions")}]`).length == questions.length) {
            showPopup("win");
        }
    }, time);
}