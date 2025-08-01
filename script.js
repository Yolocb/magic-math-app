class MathApp {
    constructor() {
        this.exercises = [];
        this.selectedTypes = [];
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.answeredCount = 0;
        this.currentGrade = 1;
        this.points = 0;
        this.stars = 0;
        this.currentTheme = 'standard';
        
        // Player data
        this.playerName = '';
        this.playerGrade = 1;
        this.playerAvatar = '';
        
        this.init();
    }

    init() {
        this.checkWelcomeScreen();
        this.loadTheme();
        this.bindEvents();
        this.updateCheckboxStyles();
        this.updateRadioStyles();
        this.loadExerciseOptions();
    }

    // Welcome Screen Management
    checkWelcomeScreen() {
        const playerData = this.loadPlayerData();
        if (playerData && playerData.name && playerData.grade && playerData.avatar) {
            // Player data exists, show main app
            this.playerName = playerData.name;
            this.playerGrade = playerData.grade;
            this.playerAvatar = playerData.avatar;
            this.showMainApp();
        } else {
            // No player data, show welcome screen
            this.showWelcomeScreen();
        }
    }

    showWelcomeScreen() {
        document.getElementById('welcomeScreen').style.display = 'block';
        document.getElementById('mainApp').style.display = 'none';
        this.bindWelcomeEvents();
    }

    showMainApp() {
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        this.updatePlayerDisplay();
        this.setGradeFromPlayerData();
        this.bindProfileEditEvents();
    }

    bindWelcomeEvents() {
        const nameInput = document.getElementById('playerName');
        const gradeButtons = document.querySelectorAll('.grade-btn');
        const avatarOptions = document.querySelectorAll('.avatar-option');
        const startButton = document.getElementById('startGameBtn');

        // Name input event
        nameInput.addEventListener('input', () => {
            this.validateWelcomeForm();
        });

        // Grade selection events
        gradeButtons.forEach(button => {
            button.addEventListener('click', () => {
                gradeButtons.forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
                this.playerGrade = parseInt(button.dataset.grade);
                this.validateWelcomeForm();
            });
        });

        // Avatar selection events
        avatarOptions.forEach(option => {
            option.addEventListener('click', () => {
                avatarOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.playerAvatar = option.dataset.avatar;
                this.validateWelcomeForm();
            });
        });

        // Start button event
        startButton.addEventListener('click', () => {
            this.startGame();
        });
    }

    bindProfileEditEvents() {
        const playerAvatar = document.getElementById('playerAvatarDisplay');
        const playerName = document.getElementById('playerNameDisplay');
        const playerGrade = document.getElementById('playerGradeDisplay');
        const profileModal = document.getElementById('profileEditModal');
        const closeModalBtn = document.getElementById('closeProfileModal');
        const saveProfileBtn = document.getElementById('saveProfileBtn');

        // Open modal when clicking on any player info element
        [playerAvatar, playerName, playerGrade].forEach(element => {
            element.addEventListener('click', () => {
                this.openProfileModal();
            });
        });

        // Close modal events
        closeModalBtn.addEventListener('click', () => {
            this.closeProfileModal();
        });

        // Close modal when clicking outside
        profileModal.addEventListener('click', (e) => {
            if (e.target === profileModal) {
                this.closeProfileModal();
            }
        });

        // Save profile button event
        saveProfileBtn.addEventListener('click', () => {
            this.saveProfile();
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && profileModal.style.display === 'flex') {
                this.closeProfileModal();
            }
        });
    }

    openProfileModal() {
        const profileModal = document.getElementById('profileEditModal');
        const nameInput = document.getElementById('editPlayerName');
        const gradeButtons = document.querySelectorAll('.profile-grade-btn');
        const avatarOptions = document.querySelectorAll('.profile-avatar-option');
        
        // Reset all selections
        gradeButtons.forEach(btn => btn.classList.remove('selected'));
        avatarOptions.forEach(opt => opt.classList.remove('selected'));
        
        // Set current values
        nameInput.value = this.playerName;
        
        // Set current grade
        const currentGradeBtn = document.querySelector(`.profile-grade-btn[data-grade="${this.playerGrade}"]`);
        if (currentGradeBtn) {
            currentGradeBtn.classList.add('selected');
        }
        
        // Set current avatar
        const currentAvatarOption = document.querySelector(`.profile-avatar-option[data-avatar="${this.playerAvatar}"]`);
        if (currentAvatarOption) {
            currentAvatarOption.classList.add('selected');
        }
        
        // Initialize temporary values
        this.tempPlayerName = this.playerName;
        this.tempPlayerGrade = this.playerGrade;
        this.tempPlayerAvatar = this.playerAvatar;
        
        // Bind events for this modal session
        this.bindProfileModalEvents();
        
        profileModal.style.display = 'flex';
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus on name input
        setTimeout(() => nameInput.focus(), 100);
    }

    bindProfileModalEvents() {
        const nameInput = document.getElementById('editPlayerName');
        const gradeButtons = document.querySelectorAll('.profile-grade-btn');
        const avatarOptions = document.querySelectorAll('.profile-avatar-option');

        // Name input event
        nameInput.addEventListener('input', () => {
            this.tempPlayerName = nameInput.value.trim();
            this.validateProfileChanges();
        });

        // Grade selection events
        gradeButtons.forEach(button => {
            button.addEventListener('click', () => {
                gradeButtons.forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
                this.tempPlayerGrade = parseInt(button.dataset.grade);
                this.validateProfileChanges();
            });
        });

        // Avatar selection events
        avatarOptions.forEach(option => {
            option.addEventListener('click', () => {
                avatarOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.tempPlayerAvatar = option.dataset.avatar;
                this.validateProfileChanges();
            });
        });
    }

    validateProfileChanges() {
        const saveProfileBtn = document.getElementById('saveProfileBtn');
        
        const hasChanges = this.tempPlayerName !== this.playerName ||
                          this.tempPlayerGrade !== this.playerGrade ||
                          this.tempPlayerAvatar !== this.playerAvatar;
        
        const isValid = this.tempPlayerName.length >= 2 &&
                       this.tempPlayerGrade &&
                       this.tempPlayerAvatar;
        
        const canSave = hasChanges && isValid;
        
        saveProfileBtn.disabled = !canSave;
        
        if (canSave) {
            saveProfileBtn.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
            saveProfileBtn.style.cursor = 'pointer';
        } else {
            saveProfileBtn.style.background = '#adb5bd';
            saveProfileBtn.style.cursor = 'not-allowed';
        }
    }

    closeProfileModal() {
        const profileModal = document.getElementById('profileEditModal');
        profileModal.style.display = 'none';
        
        // Restore body scroll
        document.body.style.overflow = 'auto';
        
        // Reset temporary values
        this.tempPlayerName = '';
        this.tempPlayerGrade = 1;
        this.tempPlayerAvatar = '';
    }

    saveProfile() {
        if (!this.tempPlayerName || this.tempPlayerName.length < 2 || !this.tempPlayerGrade || !this.tempPlayerAvatar) {
            return;
        }

        // Check what changed
        const nameChanged = this.tempPlayerName !== this.playerName;
        const gradeChanged = this.tempPlayerGrade !== this.playerGrade;
        const avatarChanged = this.tempPlayerAvatar !== this.playerAvatar;

        // Update player data
        this.playerName = this.tempPlayerName;
        this.playerGrade = this.tempPlayerGrade;
        this.playerAvatar = this.tempPlayerAvatar;
        
        // Update player data in localStorage
        this.savePlayerData({
            name: this.playerName,
            grade: this.playerGrade,
            avatar: this.playerAvatar
        });
        
        // Update display
        this.updatePlayerDisplay();
        
        // Update grade in exercise selection if changed
        if (gradeChanged) {
            this.setGradeFromPlayerData();
        }
        
        // Close modal
        this.closeProfileModal();
        
        // Show success message
        let changeMessages = [];
        if (nameChanged) changeMessages.push('Name');
        if (gradeChanged) changeMessages.push('Klasse');
        if (avatarChanged) changeMessages.push('Avatar');
        
        const changesText = changeMessages.join(', ');
        this.showMessage(`${changesText} erfolgreich geändert! 👤`, 'success');
    }

    validateWelcomeForm() {
        const nameInput = document.getElementById('playerName');
        const startButton = document.getElementById('startGameBtn');
        
        this.playerName = nameInput.value.trim();
        
        const isValid = this.playerName.length >= 2 && 
                       this.playerGrade && 
                       this.playerAvatar;
        
        startButton.disabled = !isValid;
        
        if (isValid) {
            startButton.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
            startButton.style.cursor = 'pointer';
        } else {
            startButton.style.background = '#adb5bd';
            startButton.style.cursor = 'not-allowed';
        }
    }

    startGame() {
        // Save player data
        this.savePlayerData({
            name: this.playerName,
            grade: this.playerGrade,
            avatar: this.playerAvatar
        });

        // Animate transition to main app
        const welcomeScreen = document.getElementById('welcomeScreen');
        welcomeScreen.style.animation = 'fadeOut 0.5s ease-out forwards';
        
        setTimeout(() => {
            this.showMainApp();
            const mainApp = document.getElementById('mainApp');
            mainApp.style.animation = 'fadeIn 0.5s ease-out';
        }, 500);
    }

    updatePlayerDisplay() {
        const avatarEmojis = {
            'cat': '🐱',
            'dog': '🐶',
            'fox': '🦊',
            'panda': '🐼',
            'unicorn': '🦄',
            'robot': '🤖',
            'lion': '🦁',
            'monkey': '🐵'
        };

        document.getElementById('playerAvatarDisplay').textContent = avatarEmojis[this.playerAvatar] || '🐱';
        document.getElementById('playerNameDisplay').textContent = this.playerName;
        document.getElementById('playerGradeDisplay').textContent = `${this.playerGrade}. Klasse`;
    }

    setGradeFromPlayerData() {
        // Set the grade radio button based on player data
        const gradeRadio = document.querySelector(`input[name="gradeLevel"][value="${this.playerGrade}"]`);
        if (gradeRadio) {
            gradeRadio.checked = true;
            this.currentGrade = this.playerGrade;
            this.loadExerciseOptions();
            this.updateRadioStyles();
        }
    }

    savePlayerData(data) {
        localStorage.setItem('mathAppPlayer', JSON.stringify(data));
    }

    loadPlayerData() {
        const data = localStorage.getItem('mathAppPlayer');
        return data ? JSON.parse(data) : null;
    }

    // Add method to reset player data (for testing or new player)
    resetPlayerData() {
        localStorage.removeItem('mathAppPlayer');
        location.reload();
    }

    bindEvents() {
        const generateBtn = document.getElementById('generateBtn');
        const newGameBtn = document.getElementById('newGameBtn');
        const printBtn = document.getElementById('printBtn');
        const gradeRadios = document.querySelectorAll('input[name="gradeLevel"]');

        generateBtn.addEventListener('click', () => this.generateExercises());
        newGameBtn.addEventListener('click', () => this.resetApp());
        printBtn.addEventListener('click', () => this.printExercises());
        
        // Belohnungssystem Event Listeners
        const closeRewardBtn = document.getElementById('closeRewardBtn');
        if (closeRewardBtn) {
            closeRewardBtn.addEventListener('click', () => this.closeRewardOverlay());
        }

        gradeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.currentGrade = parseInt(radio.value);
                this.loadExerciseOptions();
                this.updateRadioStyles();
            });
        });

        // Theme-Buttons Event Listeners
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const theme = e.currentTarget.dataset.theme;
                this.setTheme(theme);
            });
        });

        // Event delegation für dynamisch erstellte Checkboxen und Radio-Buttons
        document.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                this.updateCheckboxStyles();
            } else if (e.target.type === 'radio') {
                this.updateRadioStyles();
            }
        });
    }

    // Theme Management Methoden
    loadTheme() {
        // Lade gespeichertes Theme aus localStorage
        const savedTheme = localStorage.getItem('mathAppTheme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
        }
        this.applyTheme(this.currentTheme);
        this.updateThemeButtons();
    }

    setTheme(theme) {
        this.currentTheme = theme;
        this.applyTheme(theme);
        this.saveTheme(theme);
        this.updateThemeButtons();
        
        // Zeige Theme-Wechsel Nachricht
        const themeNames = {
            'standard': 'Standard',
            'girls': 'Mädchen',
            'pirates': 'Piraten',
            'space': 'Weltraum',
            'unicorn': 'Einhorn'
        };
        this.showMessage(`${themeNames[theme]}-Design aktiviert! 🎨`, 'success');
    }

    applyTheme(theme) {
        // Entferne alle Theme-Klassen
        document.body.classList.remove('theme-standard', 'theme-girls', 'theme-pirates', 'theme-space', 'theme-unicorn');
        
        // Füge neue Theme-Klasse hinzu (außer für Standard)
        if (theme !== 'standard') {
            document.body.classList.add(`theme-${theme}`);
        }

        // Theme-spezifische Icons und Anpassungen
        this.updateThemeSpecificElements(theme);
    }

    updateThemeSpecificElements(theme) {
        // Aktualisiere Konfetti-Icons basierend auf dem Theme
        const confetti = document.querySelector('.confetti');
        if (confetti) {
            let confettiIcons = [];
            
            switch (theme) {
                case 'girls':
                    confettiIcons = ['💖', '🌸', '🦄', '✨', '🌟', '💕', '🎀', '🌺'];
                    break;
                case 'pirates':
                    confettiIcons = ['🏴‍☠️', '⚓', '🗡️', '💰', '🦜', '💎', '🏴‍☠️', '⚓'];
                    break;
                case 'space':
                    confettiIcons = ['🚀', '🌟', '🪐', '👨‍🚀', '🛸', '⭐', '🌙', '✨'];
                    break;
                case 'unicorn':
                    confettiIcons = ['🦄', '🌈', '✨', '💖', '🌟', '💫', '🎀', '🌸'];
                    break;
                default:
                    confettiIcons = ['🎉', '⭐', '🎊', '✨', '🌟', '🎈', '🎁', '🏅'];
            }
            
            const confettiSpans = confetti.querySelectorAll('span');
            confettiSpans.forEach((span, index) => {
                if (confettiIcons[index]) {
                    span.textContent = confettiIcons[index];
                }
            });
        }

        // Aktualisiere Stern-Icons für verschiedene Themes
        const stars = document.querySelectorAll('.star');
        let starIcon = '⭐';
        
        switch (theme) {
            case 'girls':
                starIcon = '💖';
                break;
            case 'pirates':
                starIcon = '💰';
                break;
            case 'space':
                starIcon = '🌟';
                break;
            case 'unicorn':
                starIcon = '🦄';
                break;
        }
        
        stars.forEach(star => {
            star.textContent = starIcon;
        });
    }

    updateThemeButtons() {
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(button => {
            if (button.dataset.theme === this.currentTheme) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    saveTheme(theme) {
        localStorage.setItem('mathAppTheme', theme);
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

    loadExerciseOptions() {
        const exerciseOptions = document.getElementById('exerciseOptions');
        const exercisesByGrade = {
            1: [
                { id: 'halbieren', value: 'halbieren', icon: '➗', name: 'Halbieren' },
                { id: 'verdoppeln', value: 'verdoppeln', icon: '✖️', name: 'Verdoppeln' },
                { id: 'plusrechnen', value: 'plusrechnen', icon: '➕', name: 'Plusrechnen' },
                { id: 'minusrechnen', value: 'minusrechnen', icon: '➖', name: 'Minusrechnen' },
                { id: 'zahlenfolge', value: 'zahlenfolge', icon: '🔢', name: 'Zahlenfolgen' }
            ],
            2: [
                { id: 'plusrechnen', value: 'plusrechnen', icon: '➕', name: 'Plusrechnen' },
                { id: 'minusrechnen', value: 'minusrechnen', icon: '➖', name: 'Minusrechnen' },
                { id: 'einmaleins', value: 'einmaleins', icon: '✖️', name: 'Kleines Einmaleins' },
                { id: 'division', value: 'division', icon: '➗', name: 'Division mit Rest' },
                { id: 'zahlenraetsel', value: 'zahlenraetsel', icon: '🧩', name: 'Zahlenrätsel' },
                { id: 'zahlenfolge', value: 'zahlenfolge', icon: '🔢', name: 'Zahlenfolgen' }
            ],
            3: [
                { id: 'addition_uebertrag', value: 'addition_uebertrag', icon: '➕', name: 'Addition mit Übertrag' },
                { id: 'subtraktion_uebertrag', value: 'subtraktion_uebertrag', icon: '➖', name: 'Subtraktion mit Übertrag' },
                { id: 'multiplikation_zweistellig', value: 'multiplikation_zweistellig', icon: '✖️', name: 'Multiplikation zweistellig' },
                { id: 'textaufgaben', value: 'textaufgaben', icon: '📝', name: 'Textaufgaben' },
                { id: 'einheiten', value: 'einheiten', icon: '📏', name: 'Längen & Gewichte' },
                { id: 'einmaleins', value: 'einmaleins', icon: '🔢', name: 'Einmaleins' }
            ]
        };

        const options = exercisesByGrade[this.currentGrade];
        exerciseOptions.innerHTML = '';

        options.forEach(option => {
            const label = document.createElement('label');
            label.className = 'checkbox-label';
            label.innerHTML = `
                <input type="checkbox" id="${option.id}" value="${option.value}">
                <span class="checkmark">${option.icon}</span>
                ${option.name}
            `;
            exerciseOptions.appendChild(label);
        });

        // Styles für neue Checkboxen aktualisieren
        setTimeout(() => this.updateCheckboxStyles(), 100);
    }

    getSelectedTypes() {
        const checkboxes = document.querySelectorAll('#exerciseOptions input[type="checkbox"]:checked');
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
            answer: 0,
            hasMultipleInputs: false,
            answers: []
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
            case 'einmaleins':
                exercise = this.createEinmaleinsExercise(exercise);
                break;
            case 'division':
                exercise = this.createDivisionExercise(exercise);
                break;
            case 'zahlenraetsel':
                exercise = this.createZahlenraetselExercise(exercise);
                break;
            case 'addition_uebertrag':
                exercise = this.createAdditionUebertragExercise(exercise);
                break;
            case 'subtraktion_uebertrag':
                exercise = this.createSubtraktionUebertragExercise(exercise);
                break;
            case 'multiplikation_zweistellig':
                exercise = this.createMultiplikationZweistelligExercise(exercise);
                break;
            case 'textaufgaben':
                exercise = this.createTextaufgabenExercise(exercise);
                break;
            case 'einheiten':
                exercise = this.createEinheitenExercise(exercise);
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

    // Neue Übungstypen für 2. Klasse
    createEinmaleinsExercise(exercise) {
        // Kleines Einmaleins (1-10)
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        
        exercise.question = `${num1} × ${num2} = ___`;
        exercise.answer = num1 * num2;
        exercise.typeName = 'Kleines Einmaleins';
        
        return exercise;
    }

    createDivisionExercise(exercise) {
        // Division mit Rest
        const divisor = Math.floor(Math.random() * 8) + 2; // 2-9
        const quotient = Math.floor(Math.random() * 8) + 1; // 1-8
        const remainder = Math.floor(Math.random() * (divisor - 1)); // 0 bis divisor-1
        const dividend = (quotient * divisor) + remainder;
        
        exercise.question = `${dividend} ÷ ${divisor} = ___ Rest ___`;
        exercise.hasMultipleInputs = true;
        exercise.answers = [quotient, remainder];
        exercise.typeName = 'Division mit Rest';
        
        return exercise;
    }

    createZahlenraetselExercise(exercise) {
        // Zahlenrätsel mit logischem Denken
        const riddles = [
            {
                question: "Ich denke an eine Zahl. Sie ist größer als 10 und kleiner als 20, und durch 3 teilbar.",
                answer: [12, 15, 18],
                correctAnswer: Math.random() < 0.33 ? 12 : Math.random() < 0.5 ? 15 : 18
            },
            {
                question: "Ich denke an eine Zahl. Sie ist gerade, größer als 5 und kleiner als 15.",
                answer: [6, 8, 10, 12, 14],
                correctAnswer: [6, 8, 10, 12, 14][Math.floor(Math.random() * 5)]
            },
            {
                question: "Ich denke an eine Zahl. Wenn ich 7 dazuzähle, erhalte ich 15.",
                answer: [8],
                correctAnswer: 8
            },
            {
                question: "Ich denke an eine Zahl. Sie ist ungerade und liegt zwischen 20 und 30.",
                answer: [21, 23, 25, 27, 29],
                correctAnswer: [21, 23, 25, 27, 29][Math.floor(Math.random() * 5)]
            }
        ];
        
        const riddle = riddles[Math.floor(Math.random() * riddles.length)];
        exercise.question = riddle.question + " Welche Zahl ist es? ___";
        exercise.answer = riddle.correctAnswer;
        exercise.typeName = 'Zahlenrätsel';
        
        return exercise;
    }

    // Neue Übungstypen für 3. Klasse
    createAdditionUebertragExercise(exercise) {
        // Schriftliche Addition mit Übertrag
        const num1 = Math.floor(Math.random() * 90) + 10; // 10-99
        const num2 = Math.floor(Math.random() * 90) + 10; // 10-99
        
        // Stelle sicher, dass ein Übertrag stattfindet
        let adjustedNum2 = num2;
        if ((num1 % 10) + (num2 % 10) < 10) {
            adjustedNum2 = num2 + (10 - (num2 % 10)) + Math.floor(Math.random() * 5);
        }
        
        exercise.question = `${num1} + ${adjustedNum2} = ___`;
        exercise.answer = num1 + adjustedNum2;
        exercise.typeName = 'Addition mit Übertrag';
        
        return exercise;
    }

    createSubtraktionUebertragExercise(exercise) {
        // Schriftliche Subtraktion mit Übertrag
        const result = Math.floor(Math.random() * 50) + 10; // 10-59
        const subtrahend = Math.floor(Math.random() * 40) + 20; // 20-59
        const minuend = result + subtrahend;
        
        exercise.question = `${minuend} - ${subtrahend} = ___`;
        exercise.answer = result;
        exercise.typeName = 'Subtraktion mit Übertrag';
        
        return exercise;
    }

    createMultiplikationZweistelligExercise(exercise) {
        // Multiplikation zweistelliger Zahlen
        const num1 = Math.floor(Math.random() * 90) + 10; // 10-99
        const num2 = Math.floor(Math.random() * 9) + 2; // 2-10
        
        exercise.question = `${num1} × ${num2} = ___`;
        exercise.answer = num1 * num2;
        exercise.typeName = 'Multiplikation zweistellig';
        
        return exercise;
    }

    createTextaufgabenExercise(exercise) {
        // Einfache Textaufgaben mit Rechenweg
        const stories = [
            {
                text: "Anna hat 24 Sticker. Sie gibt 8 Sticker an ihre Freundin weiter. Wie viele Sticker hat Anna noch?",
                answer: 16,
                operation: "24 - 8"
            },
            {
                text: "In einer Schachtel sind 6 Reihen mit je 4 Bonbons. Wie viele Bonbons sind insgesamt in der Schachtel?",
                answer: 24,
                operation: "6 × 4"
            },
            {
                text: "Tom sammelt Münzen. Er hat 15 Münzen in einer Dose und 23 Münzen in einer anderen. Wie viele Münzen hat er insgesamt?",
                answer: 38,
                operation: "15 + 23"
            },
            {
                text: "Eine Packung enthält 48 Kekse. Die Familie isst 19 Kekse. Wie viele Kekse sind noch übrig?",
                answer: 29,
                operation: "48 - 19"
            }
        ];
        
        const story = stories[Math.floor(Math.random() * stories.length)];
        exercise.question = story.text + " ___";
        exercise.answer = story.answer;
        exercise.typeName = 'Textaufgabe';
        
        return exercise;
    }

    createEinheitenExercise(exercise) {
        // Einführung in Längen- und Gewichtseinheiten
        const unitProblems = [
            {
                question: "Wie viele cm sind 2 m und 30 cm?",
                answer: 230
            },
            {
                question: "Wie viele mm sind 5 cm?",
                answer: 50
            },
            {
                question: "Wie viele g sind 2 kg?",
                answer: 2000
            },
            {
                question: "Wie viele cm sind 1 m und 45 cm?",
                answer: 145
            },
            {
                question: "Wie viele g sind 3 kg und 500 g?",
                answer: 3500
            },
            {
                question: "Wie viele mm sind 12 cm?",
                answer: 120
            }
        ];
        
        const problem = unitProblems[Math.floor(Math.random() * unitProblems.length)];
        exercise.question = problem.question + " ___";
        exercise.answer = problem.answer;
        exercise.typeName = 'Längen & Gewichte';
        
        return exercise;
    }

    displayExercises() {
        const exercisesContainer = document.getElementById('exercises');
        const exerciseList = document.getElementById('exerciseList');
        const exerciseTitle = exercisesContainer.querySelector('h2');
        const checkAllBtn = document.getElementById('checkAllBtn');
        
        // Reset scores und Belohnungssystem
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.answeredCount = 0;
        this.points = 0;
        this.stars = 0;
        this.updateScoreDisplay();
        this.updateRewardSystem();
        
        // Aktualisiere die Überschrift mit der tatsächlichen Anzahl
        exerciseTitle.textContent = `Deine ${this.exercises.length} Aufgaben:`;
        
        exerciseList.innerHTML = '';
        
        this.exercises.forEach(exercise => {
            const exerciseDiv = document.createElement('div');
            exerciseDiv.className = 'exercise-item';
            exerciseDiv.dataset.exerciseId = exercise.number;
            
            let questionWithInput;
            let correctAnswerText;
            
            if (exercise.hasMultipleInputs) {
                // Für Aufgaben mit mehreren Eingabefeldern (z.B. Division mit Rest)
                let inputIndex = 0;
                questionWithInput = exercise.question.replace(/___/g, () => {
                    const input = `<input type="number" class="answer-input" data-answer="${exercise.answers[inputIndex]}" data-input-index="${inputIndex}" placeholder="">`;
                    inputIndex++;
                    return input;
                });
                correctAnswerText = `Richtige Antwort: ${exercise.answers.join(' Rest ')}`;
            } else {
                // Für normale Aufgaben mit einer Eingabe
                questionWithInput = exercise.question.replace('___', 
                    `<input type="number" class="answer-input" data-answer="${exercise.answer}" placeholder="">`
                );
                correctAnswerText = `Richtige Antwort: ${exercise.answer}`;
            }
            
            exerciseDiv.innerHTML = `
                <span class="exercise-number">${exercise.number}</span>
                <span class="exercise-type">${exercise.typeName}</span>
                <div class="exercise-question">${questionWithInput}</div>
                <span class="feedback-icon"></span>
                <div class="correct-answer">${correctAnswerText}</div>
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
        const exerciseItem = input.closest('.exercise-item');
        const allInputs = exerciseItem.querySelectorAll('.answer-input');
        const feedbackIcon = exerciseItem.querySelector('.feedback-icon');
        const correctAnswerDiv = exerciseItem.querySelector('.correct-answer');
        
        // Prüfe ob alle Eingabefelder in dieser Aufgabe ausgefüllt sind
        let allFilled = true;
        let allCorrect = true;
        
        allInputs.forEach(inputField => {
            if (inputField.value === '') {
                allFilled = false;
            } else {
                const userAnswer = parseInt(inputField.value);
                const correctAnswer = parseInt(inputField.dataset.answer);
                if (userAnswer !== correctAnswer) {
                    allCorrect = false;
                }
            }
        });
        
        if (!allFilled) {
            // Reset wenn nicht alle Felder ausgefüllt sind
            exerciseItem.classList.remove('correct', 'incorrect');
            feedbackIcon.classList.remove('show');
            correctAnswerDiv.classList.remove('show');
            return;
        }
        
        if (allCorrect) {
            exerciseItem.classList.remove('incorrect');
            exerciseItem.classList.add('correct');
            feedbackIcon.textContent = '✅';
            feedbackIcon.classList.add('show');
            correctAnswerDiv.classList.remove('show');
            this.playSuccessSound();
            this.addReward();
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
        const exerciseItems = document.querySelectorAll('.exercise-item');
        let correct = 0;
        let incorrect = 0;
        let answered = 0;
        
        exerciseItems.forEach(exerciseItem => {
            const allInputs = exerciseItem.querySelectorAll('.answer-input');
            let exerciseAnswered = true;
            let exerciseCorrect = true;
            
            // Prüfe ob alle Eingabefelder dieser Aufgabe ausgefüllt sind
            allInputs.forEach(input => {
                if (input.value === '') {
                    exerciseAnswered = false;
                } else {
                    const userAnswer = parseInt(input.value);
                    const correctAnswer = parseInt(input.dataset.answer);
                    if (userAnswer !== correctAnswer) {
                        exerciseCorrect = false;
                    }
                }
            });
            
            if (exerciseAnswered) {
                answered++;
                if (exerciseCorrect) {
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
        this.updateRewardSystem();
        this.checkForCompletion();
    }

    updateScoreDisplay() {
        document.getElementById('correctScore').textContent = this.correctAnswers;
        document.getElementById('incorrectScore').textContent = this.incorrectAnswers;
        
        const percentage = this.exercises.length > 0 ? 
            Math.round((this.answeredCount / this.exercises.length) * 100) : 0;
        document.getElementById('progressScore').textContent = `${percentage}%`;
    }

    // Belohnungssystem Methoden
    updateRewardSystem() {
        // Punkte aktualisieren
        document.getElementById('pointsScore').textContent = this.points;
        
        // Fortschrittsbalken aktualisieren
        const progressBar = document.getElementById('progressBar');
        const progressPercentage = this.exercises.length > 0 ? 
            (this.points / this.exercises.length) * 100 : 0;
        progressBar.style.width = `${progressPercentage}%`;
    }

    addReward() {
        // Punkt hinzufügen
        this.points++;
        
        // Stern hinzufügen
        this.addStar();
        
        // Motivationsnachricht nach 5 richtigen Antworten
        if (this.points > 0 && this.points % 5 === 0) {
            this.showMotivationPopup();
        }
        
        this.updateRewardSystem();
    }

    addStar() {
        const starContainer = document.getElementById('starContainer');
        const star = document.createElement('span');
        star.className = 'star';
        
        // Theme-spezifische Stern-Icons
        let starIcon = '⭐';
        switch (this.currentTheme) {
            case 'girls':
                starIcon = '💖';
                break;
            case 'pirates':
                starIcon = '💰';
                break;
            case 'space':
                starIcon = '🌟';
                break;
            case 'unicorn':
                starIcon = '🦄';
                break;
        }
        
        star.textContent = starIcon;
        starContainer.appendChild(star);
        this.stars++;
    }

    showMotivationPopup() {
        const motivationPopup = document.getElementById('motivationPopup');
        const motivationText = document.getElementById('motivationText');
        
        const motivationMessages = [
            'Super gemacht! 🌟',
            'Du bist großartig! 🎉',
            'Fantastisch! 🚀',
            'Weiter so! 💪',
            'Du rockst! 🎸',
            'Unglaublich! ✨',
            'Perfekt! 🏆',
            'Toll gemacht! 👏'
        ];
        
        const randomMessage = motivationMessages[Math.floor(Math.random() * motivationMessages.length)];
        motivationText.textContent = randomMessage;
        
        motivationPopup.style.display = 'block';
        
        // Popup nach 2 Sekunden automatisch verstecken
        setTimeout(() => {
            motivationPopup.style.display = 'none';
        }, 2000);
    }

    checkForCompletion() {
        // Prüfe ob alle Aufgaben beantwortet wurden
        if (this.answeredCount === this.exercises.length && this.exercises.length > 0) {
            setTimeout(() => {
                this.showRewardOverlay();
            }, 1000); // Kurze Verzögerung für bessere UX
        }
    }

    showRewardOverlay() {
        const rewardOverlay = document.getElementById('rewardOverlay');
        const rewardTitle = document.getElementById('rewardTitle');
        const rewardMessage = document.getElementById('rewardMessage');
        
        // Personalisierte Nachrichten basierend auf der Leistung
        const percentage = Math.round((this.correctAnswers / this.exercises.length) * 100);
        
        let title, message;
        
        if (percentage === 100) {
            title = 'Du bist ein Mathe-Meister! 🏆';
            message = `Perfekt! Du hast alle ${this.exercises.length} Aufgaben richtig gelöst und ${this.points} Punkte gesammelt! Du bist ein wahrer Champion!`;
        } else if (percentage >= 80) {
            title = 'Fantastische Leistung! 🌟';
            message = `Super! Du hast ${this.correctAnswers} von ${this.exercises.length} Aufgaben richtig gelöst und ${this.points} Punkte gesammelt! Das ist eine großartige Leistung!`;
        } else if (percentage >= 60) {
            title = 'Gut gemacht! 👍';
            message = `Toll! Du hast ${this.correctAnswers} von ${this.exercises.length} Aufgaben richtig gelöst und ${this.points} Punkte gesammelt! Weiter so!`;
        } else {
            title = 'Weiter üben! 💪';
            message = `Du hast ${this.correctAnswers} von ${this.exercises.length} Aufgaben richtig gelöst und ${this.points} Punkte gesammelt! Übung macht den Meister - probiere es nochmal!`;
        }
        
        rewardTitle.textContent = title;
        rewardMessage.textContent = message;
        
        rewardOverlay.style.display = 'flex';
    }

    closeRewardOverlay() {
        const rewardOverlay = document.getElementById('rewardOverlay');
        rewardOverlay.style.display = 'none';
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
        // Reset scores und Belohnungssystem
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.answeredCount = 0;
        this.points = 0;
        this.stars = 0;
        
        // Sterne-Container leeren
        const starContainer = document.getElementById('starContainer');
        if (starContainer) {
            starContainer.innerHTML = '';
        }
        
        // Belohnungs-Overlay verstecken
        this.closeRewardOverlay();
        
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
