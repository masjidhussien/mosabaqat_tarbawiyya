import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import {
    getFirestore,
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// 1. Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDAf_Az3osVqlUOFORqaxeyaAgnNBePLqo",
    authDomain: "mosabaqat-a35ff.firebaseapp.com",
    projectId: "mosabaqat-a35ff",
    storageBucket: "mosabaqat-a35ff.firebasestorage.app",
    messagingSenderId: "887308645858",
    appId: "1:887308645858:web:72125a27e8e6fcd59b35bb"
};

// 2. Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. Global Variables
const params = new URLSearchParams(window.location.search);
const level = params.get("level");


window.config = null;
window.questions = [];
window.level = level;

// --- FUNCTIONS ---

/**
 * Fetches a specific quiz from Firestore based on the 'level' URL parameter
 */
async function loadConfig() {
    if (!level) return;

    try {
        const docRef = doc(db, "quizzes", level);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            if (typeof showPopup === 'function') showPopup("warnInvalidQuestions");
            return;
        }
        document.getElementsByClassName("body")[0].style.display = "block";
        document.getElementsByClassName("questionPage")[0].style.display = "block";
        document.getElementsByClassName("nashat")[0].style.display = "block";

        const data = docSnap.data();
        window.config = data;
        window.questions = data.questions || [];
        window.nashatName = data.style?.nashatName || "مسابقة";

        // Apply Styles (Colors)
        if (data.style?.colorConfig) {
            Object.entries(data.style.colorConfig).forEach(([k, v]) =>
                document.documentElement.style.setProperty(k, v)
            );
        }

        // Load Images
        if (data.style?.images) {
            const imgs = data.style.images;
            const imageMapping = {
                'nashat': '.nashat img'
            };

            Object.entries(imageMapping).forEach(([key, selector]) => {
                const el = document.querySelector(selector);
                if (el) el.src = imgs[key] || "../assets/images/logo.png";
            });

            // Backgrounds
            if (imgs.list_background) {
                const bodyEl = document.querySelector(".body");
                if (bodyEl) bodyEl.style.backgroundImage = `url(${imgs.list_background})`;
            }
            if (imgs.question_page_background) {
                const qPageEl = document.querySelector(".questionPage");
                if (qPageEl) qPageEl.style.backgroundImage = `url(${imgs.question_page_background})`;
            }
            if (imgs.choice_background) {
                document.documentElement.style.setProperty('--choice-bg-img', `url(${imgs.choice_background})`);
            }
        }

        // UI Updates
        generateQuestionGrid(window.questions);

        const nashatContainer = document.getElementsByClassName("nashat")[0];
        if (nashatContainer && nashatContainer.children[1]) {
            nashatContainer.children[1].textContent = window.nashatName;
        }

        // Signal other scripts that data is ready
        window.dispatchEvent(new Event('configLoaded'));

    } catch (error) {
        console.error("Failed to load config from Firebase:", error);
    }
}

/**
 * Fetches all documents in 'quizzes' collection and lists them
 */
async function listAllQuizzes() {
    document.getElementsByClassName("body")[0].style.display = "none"
    document.getElementsByClassName("questionPage")[0].style.display = "none"
    document.getElementsByClassName("nashat")[0].style.display = "none"

    const container = document.querySelector(".quizzes");
    if (!container) return;

    container.innerHTML = "<p style='text-align:center;'>جاري تحميل المسابقات...</p>";

    try {
        const quizzesRef = collection(db, "quizzes");
        const q = query(quizzesRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        container.innerHTML = "";

        if (querySnapshot.empty) {
            container.innerHTML = "<p style='text-align:center;'>لا توجد مسابقات متاحة حالياً.</p>";
            return;
        }
        container.innerHTML = `<h1 class="title">اِختر مسابقة من المسابقات</h1>`;

        querySnapshot.forEach((doc) => {
            const quizData = doc.data();
            const quizId = doc.id;
            const name = quizData.style?.nashatName || "مسابقة بدون اسم";

            const quizBtn = document.createElement("div");
            quizBtn.className = "quiz-card";
            quizBtn.innerHTML = `
                <span style="font-weight:bold;">${name}</span>
                <button onclick="window.location.search = '?level=${quizId}'; resetConfig()" 
                        style="cursor:pointer; background:var(--question-button-color2, #28a745); color:white; border:none; padding:8px 15px; border-radius:5px;">
                    ابدأ الآن
                </button>
            `;
            quizBtn.style = "display:flex; justify-content:space-between; align-items:center; background:white; padding:15px; margin-bottom:10px; border-radius:10px; box-shadow:0 2px 5px rgba(0,0,0,0.1); width:100%; max-width:500px;";

            container.appendChild(quizBtn);
        });
    } catch (error) {
        console.error("Error fetching quiz list:", error);
        container.innerHTML = "<p style='text-align:center; color:red;'>خطأ في تحميل القائمة.</p>";
    }
}

/**
 * Dynamically creates the 1, 2, 3... buttons for the quiz
 */
function generateQuestionGrid(questionsArray) {
    const container = document.querySelector(".questions");
    if (!container) return;

    container.innerHTML = "";

    const arabicNumbers = [
        "الأوّل", "الثّاني", "الثّالث", "الرّابع", "الخامس", "السّادس", "السّابع", "الثّامن", "التّاسع", "العاشر",
        "الحادي عشر", "الثّاني عشر", "الثّالث عشر", "الرّابع عشر", "الخامس عشر", "السّادس عشر", "السّابع عشر", "الثّامن عشر", "التّاسع عشر", "العشرون"
    ];

    questionsArray.forEach((q, index) => {
        const qDiv = document.createElement("div");
        qDiv.className = "question";
        const nameAttr = arabicNumbers[index] || `سؤال ${index + 1}`;
        qDiv.setAttribute("name", nameAttr);
        qDiv.textContent = index + 1;

        container.appendChild(qDiv);
        qDiv.onclick = () => {
            if (typeof processQuestion === 'function') processQuestion(index);
        };
    });
}

// --- EXECUTION ---

if (level) {
    // Hide the list container if a game is active
    const listContainer = document.querySelector(".quizzes");
    if (listContainer) listContainer.style.display = "none";
    loadConfig();
} else {
    // Show the list if no game is selected
    listAllQuizzes();
}