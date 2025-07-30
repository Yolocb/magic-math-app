class MathApp {
    constructor() {
        this.exercises = [];
        this.selectedTypes = [];
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.answeredCount = 0;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateCheckboxStyles();
        this.updateRadioStyles();
    }

    bindEvents() {
        const generateBtn = document.getElementById('generateBtn');
        const newGameBtn = document.getElementById('newGameBtn');
        const printBtn = document.getElementById('printBtn');
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const radioButtons = document.querySelectorAll('input[type="radio"]');

        generateBtn.addEventListener('click', () => this.generateExercises());
        newGameBtn.addEventListener('click', () => this.resetApp());
        printBtn.addEventListener('click', () => this.printExercises());

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateCheckboxStyles());
        });

        radioButtons.forEach(radio => {
            radio.addEventListener('change', () => this.updateRadioStyles());
        });
    }

    updateCheckboxStyles() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const label = checkbox.closest('.checkbox-label');
            if (checkbox.checked) {
                label.style.background = '#e8f8f7';
                label.style.borderColor = '#4ecdc4';
            } else {
                label.style.background = '#f8f9fa';
                label.style.borderColor = 'transparent';
            }
        });
    }

    updateRadioStyles() {
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            const label = radio.closest('.radio-label');
            if (radio.checked) {
                label.style.background = '#ffe6e6';
                label.style.borderColor = '#ff6b6b';
            } else {
                label.style.background = '#f8f9fa';
                label.style.borderColor = 'transparent';
            }
        });
    }

    getSelectedTypes() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    getSelectedCount() {
        const selectedRadio = document.querySelector('input[name="exerciseCount"]:checked');
        return selectedRadio ? parseInt(selectedRadio.value) : 10;
    }

    generateExercises() {
        this.selectedTypes = this.getSelectedTypes();
        const exerciseCount = this.getSelectedCount();
        
        if (this.selectedTypes.length === 0) {
            this.showMessage('Bitte wähle mindestens eine Übungsart aus! 😊', 'error');
            return;
        }

        this.exercises = [];
        
        // Generiere die gewählte Anzahl von Aufgaben basierend auf den ausgewählten Typen
        for (let i = 0; i < exerciseCount; i++) {
            const randomType = this.selectedTypes[Math.floor(Math.random() * this.selectedTypes.length)];
            const exercise = this.createExercise(randomType, i + 1);
            this.exercises.push(exercise);
        }

        this.displayExercises();
        this.showMessage('Deine magischen Zahlen sind bereit! 🎉', 'success');
    }

    createExercise(type, number) {
        let exercise = {
            number: number,
            type: type,
            question: '',
            answer: 0
        };

        switch (type) {
            case 'halbieren':
                exercise = this.createHalbierenExercise(exercise);
                break;
            case 'verdoppeln':
                exercise = this.createVerdoppelnExercise(exercise);
                break;
            case 'plusrechnen':
                exercise = this.createPlusExercise(exercise);
                break;
            case 'minusrechnen':
                exercise = this.createMinusExercise(exercise);
                break;
            case 'zahlenfolge':
                exercise = this.createZahlenfolgeExercise(exercise);
                break;
        }

        return exercise;
    }

    createHalbierenExercise(exercise) {
        // Verwende gerade Zahlen zwischen 2 und 20 für einfaches Halbieren
        const evenNumbers = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
        const number = evenNumbers[Math.floor(Math.random() * evenNumbers.length)];
        
        exercise.question = `Die Hälfte von ${number} ist ___`;
        exercise.answer = number / 2;
        exercise.typeName = 'Halbieren';
        
        return exercise;
    }

    createVerdoppelnExercise(exercise) {
        // Verwende Zahlen zwischen 1 und 10 für einfaches Verdoppeln
        const number = Math.floor(Math.random() * 10) + 1;
        
        exercise.question = `Das Doppelte von ${number} ist ___`;
        exercise.answer = number * 2;
        exercise.typeName = 'Verdoppeln';
        
        return exercise;
    }

    createPlusExercise(exercise) {
        // Verwende Zahlen zwischen 1 und 10, Ergebnis max 20
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * (20 - num1)) + 1;
        
        exercise.question = `${num1} + ${num2} = ___`;
        exercise.answer = num1 + num2;
        exercise.typeName = 'Plusrechnen';
        
        return exercise;
    }

    createMinusExercise(exercise) {
        // Verwende Zahlen zwischen 1 und 20, Ergebnis immer positiv
        const num1 = Math.floor(Math.random() * 15) + 5; // 5-20
        const num2 = Math.floor(Math.random() * num1) + 1; // 1 bis num1
        
        exercise.question = `${num1} - ${num2} = ___`;
        exercise.answer = num1 - num2;
        exercise.typeName = 'Minusrechnen';
        
        return exercise;
    }

    createZahlenfolgeExercise(exercise) {
        // Verschiedene Arten von Zahlenfolgen
        const patterns = [
            // Aufsteigende Folgen
            { start: 1, step: 1, length: 5, missing: 3 }, // 1, 2, ?, 4, 5
            { start: 2, step: 2, length: 5, missing: 2 }, // 2, ?, 6, 8, 10
            { start: 5, step: 5, length: 4, missing: 2 }, // 5, ?, 15, 20
            { start: 10, step: 10, length: 4, missing: 1 }, // ?, 20, 30, 40
            // Absteigende Folgen
            { start: 10, step: -1, length: 5, missing: 2 }, // 10, ?, 8, 7, 6
            { start: 20, step: -2, length: 5, missing: 3 }, // 20, 18, ?, 14, 12
        ];
        
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        const sequence = [];
        
        // Generiere die Zahlenfolge
        for (let i = 0; i < pattern.length; i++) {
            sequence.push(pattern.start + (i * pattern.step));
        }
        
        const missingIndex = pattern.missing;
        const correctAnswer = sequence[missingIndex];
        
        // Erstelle die Frage mit der fehlenden Zahl
        const questionSequence = sequence.map((num, index) => 
            index === missingIndex ? '___' : num
        ).join(', ');
        
        exercise.question = `Welche Zahl fehlt? ${questionSequence}`;
        exercise.answer = correctAnswer;
        exercise.typeName = 'Zahlenfolge';
        
        return exercise;
    }

    displayExercises() {
        const exercisesContainer = document.getElementById('exercises');
        const exerciseList = document.getElementById('exerciseList');
        const exerciseTitle = exercisesContainer.querySelector('h2');
        const checkAllBtn = document.getElementById('checkAllBtn');
        
        // Reset scores
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.answeredCount = 0;
        this.updateScoreDisplay();
        
        // Aktualisiere die Überschrift mit der tatsächlichen Anzahl
        exerciseTitle.textContent = `Deine ${this.exercises.length} Aufgaben:`;
        
        exerciseList.innerHTML = '';
        
        this.exercises.forEach(exercise => {
            const exerciseDiv = document.createElement('div');
            exerciseDiv.className = 'exercise-item';
            exerciseDiv.dataset.exerciseId = exercise.number;
            
            // Replace ___ with input field in question
            const questionWithInput = exercise.question.replace('___', 
                `<input type="number" class="answer-input" data-answer="${exercise.answer}" placeholder="">`
            );
            
            exerciseDiv.innerHTML = `
                <span class="exercise-number">${exercise.number}</span>
                <span class="exercise-type">${exercise.typeName}</span>
                <div class="exercise-question">${questionWithInput}</div>
                <span class="feedback-icon"></span>
                <div class="correct-answer">Richtige Antwort: ${exercise.answer}</div>
            `;
            
            exerciseList.appendChild(exerciseDiv);
        });
        
        // Add event listeners to input fields
        this.bindAnswerInputs();
        
        // Show check all button
        checkAllBtn.style.display = 'inline-block';
        checkAllBtn.addEventListener('click', () => this.checkAllAnswers());
        
        exercisesContainer.style.display = 'block';
        
        // Scroll zu den Aufgaben
        exercisesContainer.scrollIntoView({ behavior: 'smooth' });
    }

    showMessage(text, type) {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        
        // Verstecke Nachricht nach 3 Sekunden
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }

    printExercises() {
        if (this.exercises.length === 0) {
            this.showMessage('Bitte generiere zuerst Aufgaben zum Drucken! 📝', 'error');
            return;
        }

        // Erstelle Print-Header und Footer
        this.addPrintElements();
        
        // Zeige Erfolgsnachricht
        this.showMessage('Druckvorschau wird geöffnet... 🖨️', 'success');
        
        // Kurze Verzögerung für bessere Benutzererfahrung
        setTimeout(() => {
            window.print();
        }, 500);
    }

    addPrintElements() {
        // Entferne vorherige Print-Elemente falls vorhanden
        const existingHeader = document.querySelector('.print-header');
        const existingFooter = document.querySelector('.print-footer');
        if (existingHeader) existingHeader.remove();
        if (existingFooter) existingFooter.remove();

        // Erstelle Print-Header
        const printHeader = document.createElement('div');
        printHeader.className = 'print-header';
        printHeader.style.display = 'none'; // Nur beim Drucken sichtbar
        printHeader.innerHTML = `
            <h1>🎯 Magische Zahlen - Mathe-Übungen</h1>
            <p>Name: _________________ Datum: _________________</p>
        `;

        // Erstelle Print-Footer
        const printFooter = document.createElement('div');
        printFooter.className = 'print-footer';
        printFooter.style.display = 'none'; // Nur beim Drucken sichtbar
        printFooter.innerHTML = `
            <p>Viel Erfolg beim Rechnen! 🌟 | Erstellt mit der Magische Zahlen App</p>
        `;

        // Füge Elemente zur Seite hinzu
        const container = document.querySelector('.container');
        const exercisesContainer = document.getElementById('exercises');
        
        container.insertBefore(printHeader, exercisesContainer);
        container.appendChild(printFooter);
    }

    bindAnswerInputs() {
        const answerInputs = document.querySelectorAll('.answer-input');
        answerInputs.forEach(input => {
            input.addEventListener('input', (e) => this.checkSingleAnswer(e.target));
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.checkSingleAnswer(e.target);
                }
            });
        });
    }

    checkSingleAnswer(input) {
        const userAnswer = parseInt(input.value);
        const correctAnswer = parseInt(input.dataset.answer);
        const exerciseItem = input.closest('.exercise-item');
        const feedbackIcon = exerciseItem.querySelector('.feedback-icon');
        const correctAnswerDiv = exerciseItem.querySelector('.correct-answer');
        
        if (input.value === '') {
            // Reset if empty
            exerciseItem.classList.remove('correct', 'incorrect');
            feedbackIcon.classList.remove('show');
            correctAnswerDiv.classList.remove('show');
            return;
        }
        
        if (userAnswer === correctAnswer) {
            exerciseItem.classList.remove('incorrect');
            exerciseItem.classList.add('correct');
            feedbackIcon.textContent = '✅';
            feedbackIcon.classList.add('show');
            correctAnswerDiv.classList.remove('show');
            this.playSuccessSound();
        } else {
            exerciseItem.classList.remove('correct');
            exerciseItem.classList.add('incorrect');
            feedbackIcon.textContent = '❌';
            feedbackIcon.classList.add('show');
            correctAnswerDiv.classList.add('show');
        }
        
        this.updateScoreFromInputs();
    }

    checkAllAnswers() {
        const answerInputs = document.querySelectorAll('.answer-input');
        let allAnswered = true;
        
        answerInputs.forEach(input => {
            if (input.value === '') {
                allAnswered = false;
                input.style.borderColor = '#ff6b6b';
                setTimeout(() => {
                    input.style.borderColor = '#ddd';
                }, 1000);
            } else {
                this.checkSingleAnswer(input);
            }
        });
        
        if (!allAnswered) {
            this.showMessage('Bitte beantworte alle Aufgaben! 📝', 'error');
            return;
        }
        
        const percentage = Math.round((this.correctAnswers / this.exercises.length) * 100);
        let message = '';
        
        if (percentage === 100) {
            message = `Perfekt! 🌟 Alle ${this.exercises.length} Aufgaben richtig! Du bist ein Mathe-Champion! 🏆`;
        } else if (percentage >= 80) {
            message = `Super gemacht! 🎉 ${this.correctAnswers} von ${this.exercises.length} Aufgaben richtig (${percentage}%)!`;
        } else if (percentage >= 60) {
            message = `Gut gemacht! 👍 ${this.correctAnswers} von ${this.exercises.length} Aufgaben richtig (${percentage}%). Weiter so!`;
        } else {
            message = `Nicht schlecht! 😊 ${this.correctAnswers} von ${this.exercises.length} Aufgaben richtig (${percentage}%). Übung macht den Meister!`;
        }
        
        this.showMessage(message, 'success');
    }

    updateScoreFromInputs() {
        const answerInputs = document.querySelectorAll('.answer-input');
        let correct = 0;
        let incorrect = 0;
        let answered = 0;
        
        answerInputs.forEach(input => {
            if (input.value !== '') {
                answered++;
                const userAnswer = parseInt(input.value);
                const correctAnswer = parseInt(input.dataset.answer);
                
                if (userAnswer === correctAnswer) {
                    correct++;
                } else {
                    incorrect++;
                }
            }
        });
        
        this.correctAnswers = correct;
        this.incorrectAnswers = incorrect;
        this.answeredCount = answered;
        this.updateScoreDisplay();
    }

    updateScoreDisplay() {
        document.getElementById('correctScore').textContent = this.correctAnswers;
        document.getElementById('incorrectScore').textContent = this.incorrectAnswers;
        
        const percentage = this.exercises.length > 0 ? 
            Math.round((this.answeredCount / this.exercises.length) * 100) : 0;
        document.getElementById('progressScore').textContent = `${percentage}%`;
    }

    playSuccessSound() {
        // Create a simple success sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            // Fallback if Web Audio API is not supported
            console.log('Success!');
        }
    }

    resetApp() {
        // Reset scores
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.answeredCount = 0;
        
        // Verstecke Aufgaben
        document.getElementById('exercises').style.display = 'none';
        
        // Hide check all button
        document.getElementById('checkAllBtn').style.display = 'none';
        
        // Entferne Print-Elemente
        const printHeader = document.querySelector('.print-header');
        const printFooter = document.querySelector('.print-footer');
        if (printHeader) printHeader.remove();
        if (printFooter) printFooter.remove();
        
        // Scroll zurück nach oben
        document.querySelector('.exercise-selection').scrollIntoView({ behavior: 'smooth' });
        
        // Verstecke Nachrichten
        document.getElementById('message').style.display = 'none';
        
        // Zeige Erfolgsnachricht
        setTimeout(() => {
            this.showMessage('Bereit für neue magische Zahlen! ✨', 'success');
        }, 500);
    }
}

// App initialisieren wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', () => {
    new MathApp();
});

// Kleine Animation für die Checkboxen
document.addEventListener('DOMContentLoaded', () => {
    const labels = document.querySelectorAll('.checkbox-label');
    labels.forEach((label, index) => {
        setTimeout(() => {
            label.style.opacity = '0';
            label.style.transform = 'translateY(20px)';
            label.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                label.style.opacity = '1';
                label.style.transform = 'translateY(0)';
            }, 100);
        }, index * 100);
    });
});
