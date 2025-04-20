// --- Configuration ---
// Arabic word list (replace/add more as needed)
const wordList = [
    "تفاحة", "موز", "عنب", "برتقال", "بطيخ", "فراولة", "كيوي", "ليمون", "تمر", "كرز", "طماطم", "بطاطا", "بصل", "ثوم", "جزر", "باذنجان", "لفت", "خس", "قلقل", "تين", "خوخ", "فول", "اجاص", "بازلاء",// Fruits
    "سيارة", "حافلة", "قطار", "دراجة", "قارب", "طائرة", "شاحنة", "باخرة", "سفينة",// Transport
    " أخي", "أختي", "أبي", "أمي", "عمي", "خالي", "جدي", "جدتي", "خالتي","عمتي", "جاري",//Persons
    "قطة", "كلب", "طائر", "سمكة", "أسد", "نمر", "دب", "عصفور","خروف", "ثعلب", "قنفذ", "بقرة", "غزال", "حمامة", "ضفدع", "حمار", "دينصور", "تمساح", "فأر", "عنكبوت", "أرنب", "حوت", "دلفين", "فيل", "زرافة", "نعامة", "بومة", "بطريق", // Animals
    "بيت", "كرسي", "طاولة", "باب", "نافذة", "ضوء", "كتاب","كرة","مصباح","سيارة","شجرة", "طريق", "ملعب", "عمارة", "مسجد" , "سكر", "تلفاز", "هاتف", "سرير", "كأس", "ماء", "ملح", "قلم", "محفظة", "مدرسة",  // Objects
    "سعيد", "مشمس", "لعب", "قرأ", "قفز", "غابة", "رقص", "جائع","نشيط","نام", "استيقظ", "تعبان", "حزين",// Actions/Feelings
]; // أضف المزيد من الكلمات المناسبة للعمر!

// Arabic alphabet - Updated to include common Alef forms explicitly
const alphabet = "اأبتثجحخدذرزسشصضطظعغفقكلمنهوية"; // Arabic letters
const numberOfWords = 4;

// --- DOM Elements ---
const targetLetterDiv = document.getElementById('target-letter');
const wordOptionsDiv = document.getElementById('word-options');
const checkButton = document.getElementById('check-button');
const newGameButton = document.getElementById('new-game-button');
const feedbackDiv = document.getElementById('feedback');
// Add references to audio elements
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');
// --- Game State ---
let currentTargetLetter = '';
let currentWords = [];
let correctWords = [];
let selectedWords = [];

// --- Functions ---

// Helper function to check if a word contains a letter, treating specified Alef forms as equivalent
function arabicIncludes(word, letter) {
    // Define the set of equivalent forms (Removed إ, آ, ء. Note: ئ was not previously included)
    const equivalentForms = ['أ', 'ا']; // Only Alef, Alef with Hamza Above

    // Check if the target letter is one of the equivalent forms
    if (equivalentForms.includes(letter)) {
        // If yes, check if the word contains *any* of the equivalent forms
        return equivalentForms.some(form => word.includes(form));
    } else {
        // For all other letters, do a standard check
        return word.includes(letter);
    }
}

// Get a random element from an array or string
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Get unique random words from the list
function getRandomWords(list, count) {
    // Simple shuffle for variety
    const shuffled = list.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Start a new round of the game
function setupNewRound() {
    // Reset state
    selectedWords = [];
    feedbackDiv.textContent = '';
    feedbackDiv.className = 'feedback-message';
    wordOptionsDiv.innerHTML = ''; // Clear previous word buttons

    let letterIsUsable = false;
    let wordsAreValid = false;

    // --- Loop until we find a letter that exists in at least one word (using the new check) ---
    while (!letterIsUsable) {
        currentTargetLetter = getRandomElement(alphabet);
        // Check if *any* word in the master list contains the chosen letter (or its equivalent)
        if (wordList.some(word => arabicIncludes(word, currentTargetLetter))) {
            letterIsUsable = true;
        }
    }

    // Display the chosen, usable letter
    targetLetterDiv.textContent = currentTargetLetter;

    // --- Loop until the selected words contain the target letter (using the new check) ---
    while (!wordsAreValid) {
        // 1. Select random words
        currentWords = getRandomWords(wordList, numberOfWords);

        // 2. Check if at least one selected word contains the target letter (or its equivalent)
        if (currentWords.some(word => arabicIncludes(word, currentTargetLetter))) {
            wordsAreValid = true;
        }
    }

    // 3. Identify correct words for this round (using the new check)
    correctWords = currentWords.filter(word => arabicIncludes(word, currentTargetLetter));

    // 4. Create and display word buttons
    currentWords.forEach(word => {
        const button = document.createElement('button');
        button.textContent = word;
        button.classList.add('word-button');
        button.dataset.word = word; // Store the word

        // Add click listener for selection
        button.addEventListener('click', handleWordSelection);

        wordOptionsDiv.appendChild(button);
    });
}
// Handle clicking on a word button
function handleWordSelection(event) {
    const clickedButton = event.target;
    const word = clickedButton.dataset.word;

    // Toggle selection state
    if (selectedWords.includes(word)) {
        // Deselect
        selectedWords = selectedWords.filter(w => w !== word);
        clickedButton.classList.remove('selected');
    } else {
        // Select
        selectedWords.push(word);
        clickedButton.classList.add('selected');
    }
}

// Check the user's answer
function checkAnswer() {
    // Update feedback messages to Arabic
    if (selectedWords.length === 0) {
        feedbackDiv.textContent = "الرجاء اختيار الكلمات أولاً!"; // "Please select the words first!"
        feedbackDiv.className = 'feedback-message incorrect';
        // Play wrong sound if available
        if (wrongSound) {
            wrongSound.play();
        }
        return;
    }

    // Check if the selected words exactly match the correct words
    const sortedSelected = [...selectedWords].sort();
    const sortedCorrect = [...correctWords].sort();

    const isCorrect = sortedSelected.length === sortedCorrect.length &&
                      sortedSelected.every((word, index) => word === sortedCorrect[index]);


    if (isCorrect) {
        feedbackDiv.textContent = "ـ صحيح أحسنت  ! ـ"; // "Correct! Well done!"
        feedbackDiv.className = 'feedback-message correct';
        // Play correct sound if available
        if (correctSound) {
            correctSound.play();
        }
    } else {
        feedbackDiv.textContent = "غير صحيح. حاول مرة أخرى أو ابدأ جولة جديدة."; // "Not quite right. Try again or get a new round."
        feedbackDiv.className = 'feedback-message incorrect';
        // Play wrong sound if available
        if (wrongSound) {
            wrongSound.play();
        }
    }
}

// --- Event Listeners ---
checkButton.addEventListener('click', checkAnswer);
newGameButton.addEventListener('click', setupNewRound);

// --- Initial Game Setup ---
setupNewRound(); // Start the first round when the page loads