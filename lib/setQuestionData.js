function setQuestionData(chosenQuestionNumber) {
    const choicesElements = Array.from(questionPage.children.item(2).children);
    const currentQuestion = questions[chosenQuestionNumber];
    window.state = true;

    // Handle Reset/Invalid state
    if (isNaN(parseInt(chosenQuestionNumber))) {
        window.state = false;
        choicesElements.forEach((choiceDiv) => {
            choiceDiv.remove()
        });
        questionPage.children.item(0).textContent = "الـــــــــــــسّـــــــــــؤال ";
        questionPage.children.item(1).textContent = "";
        timer.textContent = 0;
        return;
    }

    // 1. Set Title (Question Name)
    const titleBase = questionPage.children.item(0).textContent.split(" ").shift();
    const questionName = questionsContainer.item(chosenQuestionNumber).getAttribute("name");
    questionPage.children.item(0).textContent = titleBase + " " + questionName;

    // 2. Set Question Text
    questionPage.children.item(1).textContent = currentQuestion.question;

    // 3. Set Choices Dynamically
    currentQuestion.choices.forEach((choice, index) => {
        const choiceText = currentQuestion.choices[index];
        // Check if the choice exists and isn't just an empty string
        if (choiceText && choiceText.trim() !== "") {
            const child = document.createElement("div");
            child.classList.add("choice")
            child.innerHTML = `<span>${choiceText}</span>`;
            child.style.display = "block"; // Show the box
            
            // Set the "correct" attribute for checkQuestionResult logic
            const isCorrect = (choiceText === currentQuestion.correct);
            child.setAttribute("correct", isCorrect);
            
            // Reset colors in case they were chan  ged in a previous question
            child.style.backgroundColor = "var(--question-page-option-color)";
            choicesContainerElement.appendChild(child)
            choicesContainer = Array.from(choicesContainerElement.children)
            
        }
    });
}
function setTimer(transported) {
    tickSound = new Audio("./assets/audio/tick.mp3");
    tickSound.loop = true;
    tickSound.play();
    timer.textContent = transported == 0 ? TIME_PER_QUESTION : TRANSPORTABLE_QUESTION_TIME;
}
function stopTimer(countdown) {
    clearInterval(countdown);
    tickSound.pause();
    tickSound.currentTime = 0;
}
