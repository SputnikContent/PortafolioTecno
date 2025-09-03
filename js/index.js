document.addEventListener("DOMContentLoaded", function() {
    const animatedTextSpan = document.querySelector(".animated-text");
    const words = ["crecimiento", "aprendizaje", "experiencia", "superación"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 150;
    const deletingSpeed = 100;
    const delayBetweenWords = 1500;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            animatedTextSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            animatedTextSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let currentSpeed = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && charIndex === currentWord.length) {
            currentSpeed = delayBetweenWords;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            currentSpeed = typingSpeed;
        }

        setTimeout(type, currentSpeed);
    }

    type();
});