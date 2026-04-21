const popup = document.getElementsByClassName("popup")[0];
const popupTitle = document.getElementsByClassName("popupTitle")[0];
const popupContent = document.getElementsByClassName("popupContent")[0];
const closePopup = [document.getElementsByClassName("closePopup")[0], document.getElementsByClassName("okPopup")[0], document.getElementsByClassName("cancelPopup")[0]];
const warnAudio = new Audio("../assets/audio/warn.mp3");
const winAudio = new Audio("../assets/audio/win.mp3")

closePopup.forEach(closing => {
    closing.onclick = () => {
        warnAudio.pause();
        warnAudio.currentTime = 0;
        winAudio.pause();
        winAudio.currentTime = 0;
        setTimeout(() => {
            popup.style.scale = 0;
            popup.style.opacity = 0;
        }, 250);
        setTimeout(() => {
            popupTitle.textContent = "";
            popupContent.textContent = "";
        }, 500)

    }
})
function showPopup(id, type = "alert") {
    popup.classList.remove("hidden")

    return new Promise((resolve) => {
        // 1. Reset/Setup Buttons based on type
        const okBtn = document.getElementsByClassName("okPopup")[0];
        const cancelBtn = document.getElementsByClassName("cancelPopup")[0];

        if (type === "confirm") {
            cancelBtn.style.display = "inline-block"; // Show Cancel
        } else {
            cancelBtn.style.display = "none"; // Hide for alerts
        }

        if (id.startsWith("warn")) {
            setTimeout(() => {
                warnAudio.play();
            }, 200);
        }
        switch (id) {
            case "warnTeamName":
                if (!window.level || !questions) return showPopup("warnInvalidQuestions")
                popupTitle.textContent = "تحذير!";
                popupContent.textContent = "اِختر أسماءً للفرق!";
                setTimeout(() => {
                    popup.style.opacity = 1;
                }, 250);
                popup.style.scale = 1;
                break;

            case "warnAlreadyChosen":
                popupTitle.textContent = "تحذير!";
                popupContent.innerHTML = `<span>تمّ اختيار هذا السّؤال سابقًا!</span>`;
                setTimeout(() => {
                    popup.style.opacity = 1;
                }, 250);
                popup.style.scale = 1;
                break;

            case "warnInvalidQuestions":
                popupTitle.textContent = "تحذير!";
                popupContent.innerHTML = `<span>لم تحدّد مستوًى صحيحًا للأسئلة!</span>` + "</br></br>" + `(من خلال ${(window.location.toString().split("?"))[0]}?level=<a style='color:purple'>here</a>)`;
                setTimeout(() => {
                    popup.style.opacity = 1;
                }, 250);
                popup.style.scale = 1;
                break;

            case "win":
                winAudio.play()
                const team1 = JSON.parse(sessionStorage.getItem("team1"))
                const team2 = JSON.parse(sessionStorage.getItem("team2"))
                let winning = (team1.points > team2.points) ? team1.name : team1.points == team2.points ? "الفريقان" : team2.name
                popupTitle.style.color = "green";
                popupTitle.textContent = "تهانينا!";
                popupContent.textContent = winning == "الفريقان" ? "تعادل الفريقان!" : `فاز فريق ${winning}!`;
                setTimeout(() => {
                    popup.style.opacity = 1;
                }, 250);
                popup.style.scale = 1;
                break;

            default:
                setTimeout(() => {
                    warnAudio.play();
                }, 200);
                popupTitle.textContent = id.startsWith("تنبيه") ? "تنبيه!" : "تحذير!";
                popupTitle.style.color = id.startsWith("تنبيه") ? "orange" : "red"
                popupContent.innerHTML = id.startsWith("تنبيه") ? id.replace("تنبيه:", "").replaceAll("\\n", "</br>") : id.replaceAll("\\n", "</br>");
                setTimeout(() => {
                    popup.style.opacity = 1;
                }, 250);
                popup.style.scale = 1;
                break;
        }
        popup.style.scale = 1;
        setTimeout(() => popup.style.opacity = 1, 50);

        // 4. Capture the user's choice
        okBtn.onclick = () => {
            closePopupInternal();
            resolve(true); // User clicked OK
        };

        cancelBtn.onclick = () => {
            closePopupInternal();
            resolve(false); // User clicked Cancel
        };

        // Helper to close the UI
        function closePopupInternal() {
            setTimeout(() => {
                popup.classList.add("hidden")
            }, 500);
            popup.style.scale = 0;
            popup.style.opacity = 0;
            // (Reset audio/text as per your original closePopup code)
        }
    });
}

