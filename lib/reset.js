const reset = document.getElementsByClassName("reset").item(0)
function resetConfig() {
    setQuestionData("");
    sessionStorage.removeItem("chosenQuestions");
    sessionStorage.setItem("turn", 0);
    sessionStorage.removeItem("team1");
    sessionStorage.removeItem("team2");
}
reset.onclick = async () => {
    if (await showPopup("أفعلًا تُريد مسح المعلومات؟", "confirm")) {
        resetConfig(); window.location.reload();
    }
}