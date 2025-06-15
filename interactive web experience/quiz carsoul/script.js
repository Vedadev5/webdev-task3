document.addEventListener('DOMContentLoaded', function () {
    // Carousel
    const carouselInner = document.querySelector('.carousel-inner');
    const prevBtn = document.querySelector('.carousel-control-prev');
    const nextBtn = document.querySelector('.carousel-control-next');
    const items = document.querySelectorAll('.carousel-item');
    let currentIndex = 0;

    function updateCarousel() {
        carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    prevBtn.addEventListener('click', function () {
        currentIndex = (currentIndex === 0) ? items.length - 1 : currentIndex - 1;
        updateCarousel();
    });

    nextBtn.addEventListener('click', function () {
        currentIndex = (currentIndex === items.length - 1) ? 0 : currentIndex + 1;
        updateCarousel();
    });

    setInterval(() => {
        currentIndex = (currentIndex === items.length - 1) ? 0 : currentIndex + 1;
        updateCarousel();
    }, 5000);

    // Quiz Logic
    const quizOptions = document.querySelectorAll('.quiz-option');
    const submitBtn = document.getElementById('submit-quiz');
    const quizResults = document.getElementById('quiz-results');
    const scoreDisplay = document.getElementById('score-display');
    const scoreMessage = document.getElementById('score-message');
    const answersList = document.getElementById('answers-list');

    let userAnswers = {};

    quizOptions.forEach(option => {
        option.addEventListener('click', function () {
            const questionId = this.parentElement.getAttribute('data-question-id');
            const optionId = this.getAttribute('data-option-id');
            const optionText = this.textContent;

            const siblings = Array.from(this.parentElement.children).filter(el =>
                el.classList.contains('quiz-option')
            );
            siblings.forEach(sib => sib.classList.remove('selected'));

            this.classList.add('selected');

            userAnswers[questionId] = {
                optionId,
                text: optionText,
                isCorrect: this.getAttribute('data-correct') === 'true'
            };
        });
    });

    submitBtn.addEventListener('click', function () {
        let score = 0;
        const questions = document.querySelectorAll('.question');
        const totalQuestions = questions.length;
        answersList.innerHTML = '';

        questions.forEach(question => {
            const questionId = question.getAttribute('data-question-id');
            const questionText = question.querySelector('h3').textContent;
            const correctOption = question.querySelector('.quiz-option[data-correct="true"]');
            const correctText = correctOption.textContent;

            const listItem = document.createElement('li');
            listItem.classList.add('mb-2');

            if (userAnswers[questionId]) {
                if (userAnswers[questionId].isCorrect) {
                    score++;
                    listItem.innerHTML = `<strong>${questionText.split('.')[0]}.</strong> <span class="text-green-600">✓ Correct!</span> You chose: ${userAnswers[questionId].text}`;
                } else {
                    listItem.innerHTML = `<strong>${questionText.split('.')[0]}.</strong> <span class="text-red-600">✗ Incorrect.</span> You chose: ${userAnswers[questionId].text}. Correct answer: ${correctText}`;
                }
            } else {
                listItem.innerHTML = `<strong>${questionText.split('.')[0]}.</strong> <span class="text-orange-600">Not answered.</span> Correct answer: ${correctText}`;
            }

            answersList.appendChild(listItem);
        });

        scoreDisplay.textContent = `${score}/${totalQuestions}`;

        if (score === totalQuestions) {
            scoreMessage.textContent = 'Perfect score! You\'re amazing!';
        } else if (score >= totalQuestions * 0.7) {
            scoreMessage.textContent = 'Great job! Almost perfect!';
        } else if (score >= totalQuestions * 0.3) {
            scoreMessage.textContent = 'Good try! Keep learning!';
        } else {
            scoreMessage.textContent = 'Keep practicing! You\'ll get better!';
        }

        quizResults.classList.remove('hidden');

        quizOptions.forEach(option => {
            const questionId = option.parentElement.getAttribute('data-question-id');
            const optionId = option.getAttribute('data-option-id');
            const isCorrect = option.getAttribute('data-correct') === 'true';

            if (isCorrect) {
                option.classList.add('correct');
            } else if (userAnswers[questionId] && userAnswers[questionId].optionId === optionId) {
                option.classList.add('incorrect');
            }

            option.style.pointerEvents = 'none';
        });

        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50');
    });

    // Joke Generator
    const jokeSetup = document.getElementById('joke-setup');
    const jokePunchline = document.getElementById('joke-punchline');
    const newJokeBtn = document.getElementById('new-joke-btn');

    function fetchJoke() {
        jokeSetup.textContent = 'Loading joke...';
        jokePunchline.textContent = '';

        fetch('https://official-joke-api.appspot.com/random_joke')
            .then(response => response.json())
            .then(data => {
                jokeSetup.textContent = data.setup;
                setTimeout(() => {
                    jokePunchline.textContent = data.punchline;
                }, 1500);
            })
            .catch(() => {
                jokeSetup.textContent = 'Failed to fetch joke. Please try again.';
            });
    }

    newJokeBtn.addEventListener('click', fetchJoke);
});
