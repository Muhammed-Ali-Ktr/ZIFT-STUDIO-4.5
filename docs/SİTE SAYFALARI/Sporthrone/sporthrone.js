// ============================================
// SPORTHRONE - Main JavaScript
// ============================================

// ============================================
// EXERCISE DATABASE
// ============================================

const exerciseDatabase = {
    temel: [
        { id: 'mekik', name: 'Mekik', unit: 'tekrar', muscle: 'core' },
        { id: 'crunch', name: 'Crunch', unit: 'tekrar', muscle: 'core' },
        { id: 'sinav', name: 'Şınav', unit: 'tekrar', muscle: 'chest' },
        { id: 'barfiks', name: 'Barfiks', unit: 'tekrar', muscle: 'back' },
        { id: 'chinup', name: 'Chin-up', unit: 'tekrar', muscle: 'arms' },
        { id: 'plank', name: 'Plank (sn)', unit: 'saniye', muscle: 'core' },
        { id: 'sideplank', name: 'Side Plank (sn)', unit: 'saniye', muscle: 'core' },
        { id: 'superman', name: 'Superman', unit: 'tekrar', muscle: 'back' }
    ],
    altvucut: [
        { id: 'squat', name: 'Squat', unit: 'tekrar', muscle: 'legs' },
        { id: 'jumpsquat', name: 'Jump Squat', unit: 'tekrar', muscle: 'legs' },
        { id: 'lunge', name: 'Lunge', unit: 'tekrar', muscle: 'legs' },
        { id: 'walkinglunge', name: 'Walking Lunge', unit: 'tekrar', muscle: 'legs' },
        { id: 'wallsit', name: 'Wall Sit (sn)', unit: 'saniye', muscle: 'legs' },
        { id: 'calfraise', name: 'Calf Raise', unit: 'tekrar', muscle: 'legs' },
        { id: 'glutebridge', name: 'Glute Bridge', unit: 'tekrar', muscle: 'legs' },
        { id: 'stepup', name: 'Step-up', unit: 'tekrar', muscle: 'legs' }
    ],
    ustvucut: [
        { id: 'dips', name: 'Dips', unit: 'tekrar', muscle: 'chest' },
        { id: 'diamondpushup', name: 'Diamond Push-up', unit: 'tekrar', muscle: 'chest' },
        { id: 'widepushup', name: 'Wide Push-up', unit: 'tekrar', muscle: 'chest' },
        { id: 'pikepushup', name: 'Pike Push-up', unit: 'tekrar', muscle: 'chest' },
        { id: 'archerpushup', name: 'Archer Push-up', unit: 'tekrar', muscle: 'chest' },
        { id: 'handstandpushup', name: 'Handstand Push-up', unit: 'tekrar', muscle: 'chest' },
        { id: 'australianpullup', name: 'Australian Pull-up', unit: 'tekrar', muscle: 'back' }
    ],
    karincore: [
        { id: 'legraise', name: 'Leg Raise', unit: 'tekrar', muscle: 'core' },
        { id: 'hanginglegraise', name: 'Hanging Leg Raise', unit: 'tekrar', muscle: 'core' },
        { id: 'bicyclecrunch', name: 'Bicycle Crunch', unit: 'tekrar', muscle: 'core' },
        { id: 'russiantwist', name: 'Russian Twist', unit: 'tekrar', muscle: 'core' },
        { id: 'mountainclimber', name: 'Mountain Climber', unit: 'tekrar', muscle: 'core' },
        { id: 'flutterkick', name: 'Flutter Kick', unit: 'tekrar', muscle: 'core' },
        { id: 'vup', name: 'V-up', unit: 'tekrar', muscle: 'core' },
        { id: 'hollowbodyhold', name: 'Hollow Body Hold (sn)', unit: 'saniye', muscle: 'core' }
    ],
    kardiyo: [
        { id: 'burpee', name: 'Burpee', unit: 'tekrar', muscle: 'core' },
        { id: 'jumpingjack', name: 'Jumping Jack', unit: 'tekrar', muscle: 'legs' },
        { id: 'highknees', name: 'High Knees', unit: 'tekrar', muscle: 'legs' },
        { id: 'skaterjump', name: 'Skater Jump', unit: 'tekrar', muscle: 'legs' },
        { id: 'boxjump', name: 'Box Jump', unit: 'tekrar', muscle: 'legs' }
    ]
};

// ============================================
// STATE MANAGEMENT
// ============================================

let appState = {
    selectedDate: null,
    activeExercises: [],
    workoutData: {},
    userLevel: 1,
    totalXP: 0,
    currentTheme: 'dark',
    waterGlasses: 0,
    streakCount: 0,
    focusMode: false,
    focusExercise: null
};

// ============================================
// LEVEL SYSTEM
// ============================================

const LEVELS = [
    { level: 1, name: 'Çaylak', xpRequired: 0, color: '#808080' },
    { level: 2, name: 'Acemi', xpRequired: 100, color: '#00ff88' },
    { level: 3, name: 'Savaşçı', xpRequired: 300, color: '#00ccff' },
    { level: 4, name: 'Uzman', xpRequired: 600, color: '#ff0088' },
    { level: 5, name: 'Master', xpRequired: 1000, color: '#ffaa00' },
    { level: 6, name: 'Efsane', xpRequired: 1500, color: '#9d4edd' },
    { level: 7, name: 'Titan', xpRequired: 2500, color: '#ff006e' }
];

function calculateLevel(xp) {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (xp >= LEVELS[i].xpRequired) {
            return LEVELS[i];
        }
    }
    return LEVELS[0];
}

function getNextLevel(currentLevel) {
    const nextIndex = LEVELS.findIndex(l => l.level === currentLevel.level) + 1;
    return nextIndex < LEVELS.length ? LEVELS[nextIndex] : null;
}

// ============================================
// LOCAL STORAGE
// ============================================

function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Veri kaydedilemedi:', e);
    }
}

function loadFromLocalStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        console.error('Veri yüklenemedi:', e);
        return defaultValue;
    }
}

// ============================================
// INITIALIZATION
// ============================================

function initializeApp() {
    // Load saved data
    appState.workoutData = loadFromLocalStorage('workoutData', {});
    appState.activeExercises = loadFromLocalStorage('activeExercises', getDefaultActiveExercises());
    appState.totalXP = loadFromLocalStorage('totalXP', 0);
    appState.currentTheme = loadFromLocalStorage('theme', 'dark');
    appState.streakCount = calculateStreak();
    
    // Set theme
    document.body.setAttribute('data-theme', appState.currentTheme);
    
    // Set today's date
    const today = new Date();
    appState.selectedDate = formatDate(today);
    document.getElementById('selectedDate').value = appState.selectedDate;
    
    // Calculate level
    const levelInfo = calculateLevel(appState.totalXP);
    appState.userLevel = levelInfo.level;
    
    // Initialize UI
    renderActiveExercises();
    renderExercisePool();
    updateStats();
    updateLevelDisplay();
    updateWeeklyChart();
    updateBodyMap();
    loadDailyData();
    
    // Attach event listeners
    attachEventListeners();
}

function getDefaultActiveExercises() {
    // Start with 6 basic exercises
    return [
        exerciseDatabase.temel[0], // Mekik
        exerciseDatabase.temel[2], // Şınav
        exerciseDatabase.temel[5], // Plank
        exerciseDatabase.altvucut[0], // Squat
        exerciseDatabase.karincore[2], // Bicycle Crunch
        exerciseDatabase.kardiyo[0] // Burpee
    ];
}

// ============================================
// DATE UTILITIES
// ============================================

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function parseDate(dateString) {
    return new Date(dateString + 'T00:00:00');
}

function getDayName(dateString) {
    const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    const date = parseDate(dateString);
    return days[date.getDay()];
}

function getWeekDates() {
    const dates = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(formatDate(date));
    }
    return dates;
}

// ============================================
// STREAK CALCULATION
// ============================================

function calculateStreak() {
    const workoutData = loadFromLocalStorage('workoutData', {});
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = formatDate(date);
        
        if (workoutData[dateString] && Object.keys(workoutData[dateString].exercises || {}).length > 0) {
            streak++;
        } else {
            break;
        }
    }
    
    return streak;
}

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderActiveExercises() {
    const container = document.getElementById('activeExerciseList');
    
    if (appState.activeExercises.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">💪</div>
                <div class="empty-state-text">
                    Henüz egzersiz eklemediniz.<br>
                    Sağdaki havuzdan egzersiz ekleyin!
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = appState.activeExercises.map((exercise, index) => `
        <div class="exercise-item" data-exercise-id="${exercise.id}" style="animation-delay: ${index * 0.05}s">
            <div class="exercise-info">
                <div class="exercise-name">${exercise.name}</div>
                <div class="exercise-category">${getCategoryName(exercise)}</div>
            </div>
            <div class="exercise-input-group">
                <input 
                    type="number" 
                    class="exercise-input" 
                    data-exercise-id="${exercise.id}"
                    placeholder="0"
                    min="0"
                    step="${exercise.unit === 'saniye' ? '5' : '1'}"
                >
                <span class="input-unit">${exercise.unit}</span>
                <button class="btn-remove" onclick="removeExercise('${exercise.id}')">×</button>
            </div>
        </div>
    `).join('');
}

function getCategoryName(exercise) {
    for (const [category, exercises] of Object.entries(exerciseDatabase)) {
        if (exercises.some(e => e.id === exercise.id)) {
            const categoryNames = {
                temel: 'Temel',
                altvucut: 'Alt Vücut',
                ustvucut: 'Üst Vücut',
                karincore: 'Karın & Core',
                kardiyo: 'Kardiyo'
            };
            return categoryNames[category] || category;
        }
    }
    return 'Diğer';
}

function renderExercisePool() {
    // Render category tabs
    const tabsContainer = document.getElementById('categoryTabs');
    const categoryNames = {
        temel: 'Temel',
        altvucut: 'Alt Vücut',
        ustvucut: 'Üst Vücut',
        karincore: 'Karın & Core',
        kardiyo: 'Kardiyo'
    };
    
    tabsContainer.innerHTML = Object.keys(exerciseDatabase).map((category, index) => `
        <button class="category-tab ${index === 0 ? 'active' : ''}" data-category="${category}">
            ${categoryNames[category]}
        </button>
    `).join('');
    
    // Render first category by default
    renderPoolCategory('temel');
    
    // Add click listeners to tabs
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            renderPoolCategory(e.target.dataset.category);
        });
    });
}

function renderPoolCategory(category) {
    const container = document.getElementById('exercisePoolList');
    const activeIds = appState.activeExercises.map(e => e.id);
    const availableExercises = exerciseDatabase[category].filter(e => !activeIds.includes(e.id));
    
    if (availableExercises.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">✅</div>
                <div class="empty-state-text">
                    Bu kategorideki tüm egzersizler aktif!
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = availableExercises.map(exercise => `
        <div class="pool-item" onclick="addExerciseFromPool('${exercise.id}', '${category}')">
            <span class="pool-item-name">${exercise.name}</span>
            <button class="btn-add-pool">+</button>
        </div>
    `).join('');
}

// ============================================
// EXERCISE MANAGEMENT
// ============================================

function addExerciseFromPool(exerciseId, category) {
    const exercise = exerciseDatabase[category].find(e => e.id === exerciseId);
    if (!exercise) return;
    
    appState.activeExercises.push(exercise);
    saveToLocalStorage('activeExercises', appState.activeExercises);
    
    renderActiveExercises();
    renderExercisePool();
    loadDailyData(); // Reload inputs
    
    showToast(`${exercise.name} eklendi!`, 'success');
}

function removeExercise(exerciseId) {
    appState.activeExercises = appState.activeExercises.filter(e => e.id !== exerciseId);
    saveToLocalStorage('activeExercises', appState.activeExercises);
    
    renderActiveExercises();
    renderExercisePool();
    
    showToast('Egzersiz kaldırıldı!', 'warning');
}

// ============================================
// WORKOUT SAVE
// ============================================

function saveWorkout() {
    const dateKey = appState.selectedDate;
    const exercises = {};
    let totalReps = 0;
    let totalSeconds = 0;
    let hasData = false;
    
    appState.activeExercises.forEach(exercise => {
        const input = document.querySelector(`.exercise-input[data-exercise-id="${exercise.id}"]`);
        const value = parseInt(input.value) || 0;
        
        if (value > 0) {
            exercises[exercise.id] = {
                name: exercise.name,
                value: value,
                unit: exercise.unit,
                muscle: exercise.muscle
            };
            
            if (exercise.unit === 'saniye') {
                totalSeconds += value;
            } else {
                totalReps += value;
            }
            
            hasData = true;
        }
    });
    
    if (!hasData) {
        showToast('Lütfen en az bir egzersiz değeri girin!', 'warning');
        return;
    }
    
    // Get running data
    const runKm = appState.workoutData[dateKey]?.runKm || 0;
    
    // Calculate XP
    const earnedXP = Math.floor((totalReps + totalSeconds) / 10) + Math.floor(runKm * 10);
    
    // Save workout
    if (!appState.workoutData[dateKey]) {
        appState.workoutData[dateKey] = {};
    }
    
    appState.workoutData[dateKey].exercises = exercises;
    appState.workoutData[dateKey].totalReps = totalReps;
    appState.workoutData[dateKey].totalSeconds = totalSeconds;
    appState.workoutData[dateKey].xp = earnedXP;
    appState.workoutData[dateKey].timestamp = new Date().toISOString();
    
    // Update total XP
    appState.totalXP = calculateTotalXP();
    
    // Save to localStorage
    saveToLocalStorage('workoutData', appState.workoutData);
    saveToLocalStorage('totalXP', appState.totalXP);
    
    // Update UI
    updateStats();
    updateLevelDisplay();
    updateWeeklyChart();
    updateBodyMap();
    appState.streakCount = calculateStreak();
    document.getElementById('streakCount').textContent = appState.streakCount;
    
    // Show success
    showToast('🎉 Antrenman kaydedildi! +' + earnedXP + ' XP', 'success');
    createConfetti();
    
    // Vibrate if available
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
}

function calculateTotalXP() {
    let total = 0;
    Object.values(appState.workoutData).forEach(day => {
        total += day.xp || 0;
    });
    return total;
}

// ============================================
// STATS UPDATE
// ============================================

function updateStats() {
    const dateKey = appState.selectedDate;
    const dayData = appState.workoutData[dateKey];
    
    if (dayData && dayData.exercises) {
        document.getElementById('totalReps').textContent = dayData.totalReps || 0;
        document.getElementById('totalSeconds').textContent = dayData.totalSeconds || 0;
        
        // Find most performed exercise
        let maxExercise = null;
        let maxValue = 0;
        
        Object.entries(dayData.exercises).forEach(([id, data]) => {
            if (data.value > maxValue) {
                maxValue = data.value;
                maxExercise = data.name;
            }
        });
        
        document.getElementById('topExercise').textContent = maxExercise || '-';
    } else {
        document.getElementById('totalReps').textContent = '0';
        document.getElementById('totalSeconds').textContent = '0';
        document.getElementById('topExercise').textContent = '-';
    }
    
    document.getElementById('totalXp').textContent = appState.totalXP;
}

function updateLevelDisplay() {
    const levelInfo = calculateLevel(appState.totalXP);
    const nextLevel = getNextLevel(levelInfo);
    
    document.getElementById('userLevel').textContent = levelInfo.level;
    
    if (nextLevel) {
        const currentXP = appState.totalXP - levelInfo.xpRequired;
        const neededXP = nextLevel.xpRequired - levelInfo.xpRequired;
        const progress = (currentXP / neededXP) * 100;
        
        document.getElementById('xpProgress').style.width = progress + '%';
        document.getElementById('currentXp').textContent = currentXP;
        document.getElementById('nextLevelXp').textContent = neededXP;
    } else {
        document.getElementById('xpProgress').style.width = '100%';
        document.getElementById('currentXp').textContent = 'MAX';
        document.getElementById('nextLevelXp').textContent = 'MAX';
    }
}

// ============================================
// WEEKLY CHART
// ============================================

function updateWeeklyChart() {
    const container = document.getElementById('weeklyChart');
    const weekDates = getWeekDates();
    const today = formatDate(new Date());
    
    let maxKm = 1;
    weekDates.forEach(date => {
        const dayData = appState.workoutData[date];
        if (dayData && dayData.runKm > maxKm) {
            maxKm = dayData.runKm;
        }
    });
    
    container.innerHTML = weekDates.map(date => {
        const dayData = appState.workoutData[date];
        const km = dayData?.runKm || 0;
        const height = maxKm > 0 ? (km / maxKm) * 100 : 0;
        const isToday = date === today;
        
        return `
            <div class="chart-bar">
                <div class="bar-container">
                    <div class="bar-fill" style="height: ${height}%">
                        ${km > 0 ? `<span class="bar-value">${km} km</span>` : ''}
                    </div>
                </div>
                <div class="bar-label ${isToday ? 'today' : ''}">${getDayName(date)}</div>
            </div>
        `;
    }).join('');
}

// ============================================
// BODY MAP
// ============================================

function updateBodyMap() {
    const dateKey = appState.selectedDate;
    const dayData = appState.workoutData[dateKey];
    
    // Reset all body parts
    document.querySelectorAll('.body-part').forEach(part => {
        part.classList.remove('active-core', 'active-arms', 'active-legs', 'active-chest', 'active-back');
    });
    
    if (!dayData || !dayData.exercises) {
        document.getElementById('focusMuscle').textContent = '-';
        document.getElementById('focusCount').textContent = '0';
        return;
    }
    
    // Calculate muscle usage
    const muscleCount = {
        core: 0,
        arms: 0,
        legs: 0,
        chest: 0,
        back: 0
    };
    
    Object.values(dayData.exercises).forEach(exercise => {
        const muscle = exercise.muscle || 'core';
        muscleCount[muscle] += exercise.value;
    });
    
    // Find most worked muscle
    let maxMuscle = 'core';
    let maxCount = 0;
    
    Object.entries(muscleCount).forEach(([muscle, count]) => {
        if (count > maxCount) {
            maxCount = count;
            maxMuscle = muscle;
        }
        
        // Activate body parts
        if (count > 0) {
            document.querySelectorAll(`.body-part[data-muscle="${muscle}"]`).forEach(part => {
                part.classList.add(`active-${muscle}`);
            });
        }
    });
    
    // Update focus display
    const muscleNames = {
        core: 'Karın & Core',
        arms: 'Kollar',
        legs: 'Bacaklar',
        chest: 'Göğüs',
        back: 'Sırt'
    };
    
    document.getElementById('focusMuscle').textContent = muscleNames[maxMuscle] || '-';
    document.getElementById('focusCount').textContent = maxCount;
}

// ============================================
// RUNNING TRACKER
// ============================================

function addRunningKm() {
    const input = document.getElementById('runKmInput');
    const km = parseFloat(input.value) || 0;
    
    if (km <= 0) {
        showToast('Lütfen geçerli bir KM değeri girin!', 'warning');
        return;
    }
    
    const dateKey = appState.selectedDate;
    
    if (!appState.workoutData[dateKey]) {
        appState.workoutData[dateKey] = {};
    }
    
    appState.workoutData[dateKey].runKm = (appState.workoutData[dateKey].runKm || 0) + km;
    
    // Calculate XP for running
    const earnedXP = Math.floor(km * 10);
    appState.workoutData[dateKey].xp = (appState.workoutData[dateKey].xp || 0) + earnedXP;
    
    // Update total XP
    appState.totalXP = calculateTotalXP();
    
    // Save
    saveToLocalStorage('workoutData', appState.workoutData);
    saveToLocalStorage('totalXP', appState.totalXP);
    
    // Update UI
    updateRunningDisplay();
    updateWeeklyChart();
    updateLevelDisplay();
    
    input.value = '';
    
    showToast(`✅ ${km} km eklendi! +${earnedXP} XP`, 'success');
}

function updateRunningDisplay() {
    const dateKey = appState.selectedDate;
    const dayData = appState.workoutData[dateKey];
    const todayKm = dayData?.runKm || 0;
    
    document.getElementById('todayKm').textContent = todayKm.toFixed(1);
    
    // Calculate weekly total
    const weekDates = getWeekDates();
    let weeklyKm = 0;
    weekDates.forEach(date => {
        const data = appState.workoutData[date];
        weeklyKm += data?.runKm || 0;
    });
    
    document.getElementById('weeklyKm').textContent = weeklyKm.toFixed(1);
    
    // Animate runner
    const maxKm = 10; // Max KM for full progress
    const progress = Math.min((todayKm / maxKm) * 100, 100);
    
    document.getElementById('runProgressBar').style.width = progress + '%';
    document.getElementById('runnerIcon').style.left = progress + '%';
}

// ============================================
// HYDRATION TRACKER
// ============================================

function addWaterGlass() {
    const dateKey = appState.selectedDate;
    
    if (!appState.workoutData[dateKey]) {
        appState.workoutData[dateKey] = {};
    }
    
    const currentWater = appState.workoutData[dateKey].water || 0;
    
    if (currentWater >= 8) {
        showToast('🎉 Günlük su hedefinize ulaştınız!', 'success');
        return;
    }
    
    appState.workoutData[dateKey].water = currentWater + 1;
    saveToLocalStorage('workoutData', appState.workoutData);
    
    updateWaterDisplay();
    showToast('💧 Bardak eklendi!', 'success');
}

function resetWater() {
    const dateKey = appState.selectedDate;
    
    if (!appState.workoutData[dateKey]) {
        appState.workoutData[dateKey] = {};
    }
    
    appState.workoutData[dateKey].water = 0;
    saveToLocalStorage('workoutData', appState.workoutData);
    
    updateWaterDisplay();
    showToast('Su takibi sıfırlandı!', 'warning');
}

function updateWaterDisplay() {
    const dateKey = appState.selectedDate;
    const dayData = appState.workoutData[dateKey];
    const waterCount = dayData?.water || 0;
    
    const percentage = (waterCount / 8) * 100;
    document.getElementById('waterFill').style.height = percentage + '%';
    document.getElementById('waterLabel').textContent = `${waterCount} / 8`;
}

// ============================================
// DAILY DATA LOAD
// ============================================

function loadDailyData() {
    const dateKey = appState.selectedDate;
    const dayData = appState.workoutData[dateKey];
    
    // Load exercise values
    appState.activeExercises.forEach(exercise => {
        const input = document.querySelector(`.exercise-input[data-exercise-id="${exercise.id}"]`);
        if (input) {
            const savedValue = dayData?.exercises?.[exercise.id]?.value || 0;
            input.value = savedValue > 0 ? savedValue : '';
        }
    });
    
    // Update displays
    updateStats();
    updateRunningDisplay();
    updateWaterDisplay();
    updateBodyMap();
}

// ============================================
// DATE NAVIGATION
// ============================================

function changeDate(days) {
    const currentDate = parseDate(appState.selectedDate);
    currentDate.setDate(currentDate.getDate() + days);
    appState.selectedDate = formatDate(currentDate);
    document.getElementById('selectedDate').value = appState.selectedDate;
    loadDailyData();
    updateWeeklyChart();
}

function goToToday() {
    const today = new Date();
    appState.selectedDate = formatDate(today);
    document.getElementById('selectedDate').value = appState.selectedDate;
    loadDailyData();
    updateWeeklyChart();
    showToast('📅 Bugüne döndünüz!', 'success');
}

// ============================================
// FOCUS MODE
// ============================================

function toggleFocusMode() {
    appState.focusMode = !appState.focusMode;
    
    if (appState.focusMode) {
        document.body.classList.add('focus-mode');
        document.getElementById('focusOverlay').classList.add('active');
        
        // Randomly focus on one exercise
        const exercises = document.querySelectorAll('.exercise-item');
        if (exercises.length > 0) {
            const randomIndex = Math.floor(Math.random() * exercises.length);
            exercises[randomIndex].classList.add('focus-active');
            
            // Vibrate
            if (navigator.vibrate) {
                navigator.vibrate(200);
            }
        }
        
        showToast('🎯 Focus Mode Aktif!', 'success');
    } else {
        document.body.classList.remove('focus-mode');
        document.getElementById('focusOverlay').classList.remove('active');
        document.querySelectorAll('.exercise-item').forEach(item => {
            item.classList.remove('focus-active');
        });
        
        showToast('Focus Mode Kapatıldı', 'warning');
    }
}

// ============================================
// THEME TOGGLE
// ============================================

function toggleTheme() {
    appState.currentTheme = appState.currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', appState.currentTheme);
    saveToLocalStorage('theme', appState.currentTheme);
}

// ============================================
// TOAST NOTIFICATION
// ============================================

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================
// CONFETTI ANIMATION
// ============================================

function createConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#00ff88', '#ff0088', '#00ccff', '#ffaa00'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            
            container.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }, i * 30);
    }
}

// ============================================
// DATA EXPORT & IMPORT
// ============================================

function exportData() {
    const data = {
        workoutData: appState.workoutData,
        activeExercises: appState.activeExercises,
        totalXP: appState.totalXP,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `sporthrone_backup_${formatDate(new Date())}.json`;
    link.click();
    
    showToast('📥 Veriler yedeklendi!', 'success');
}

function importData() {
    document.getElementById('fileInput').click();
}

function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.workoutData) appState.workoutData = data.workoutData;
            if (data.activeExercises) appState.activeExercises = data.activeExercises;
            if (data.totalXP) appState.totalXP = data.totalXP;
            
            saveToLocalStorage('workoutData', appState.workoutData);
            saveToLocalStorage('activeExercises', appState.activeExercises);
            saveToLocalStorage('totalXP', appState.totalXP);
            
            initializeApp();
            showToast('✅ Veriler yüklendi!', 'success');
        } catch (err) {
            showToast('❌ Geçersiz dosya formatı!', 'error');
        }
    };
    reader.readAsText(file);
}

function resetAllData() {
    if (!confirm('Tüm verileri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!')) {
        return;
    }
    
    localStorage.clear();
    location.reload();
}

// ============================================
// EVENT LISTENERS
// ============================================

function attachEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Date navigation
    document.getElementById('prevDay').addEventListener('click', () => changeDate(-1));
    document.getElementById('nextDay').addEventListener('click', () => changeDate(1));
    document.getElementById('todayBtn').addEventListener('click', goToToday);
    document.getElementById('selectedDate').addEventListener('change', (e) => {
        appState.selectedDate = e.target.value;
        loadDailyData();
        updateWeeklyChart();
    });
    
    // Save workout
    document.getElementById('saveWorkout').addEventListener('click', saveWorkout);
    
    // Running
    document.getElementById('addKmBtn').addEventListener('click', addRunningKm);
    document.getElementById('runKmInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addRunningKm();
    });
    
    // Hydration
    document.getElementById('addWaterBtn').addEventListener('click', addWaterGlass);
    document.getElementById('resetWaterBtn').addEventListener('click', resetWater);
    
    // Focus mode
    document.getElementById('toggleFocusMode').addEventListener('click', toggleFocusMode);
    document.getElementById('focusOverlay').addEventListener('click', toggleFocusMode);
    
    // Tools
    document.getElementById('exportDataBtn').addEventListener('click', exportData);
    document.getElementById('importDataBtn').addEventListener('click', importData);
    document.getElementById('resetAllBtn').addEventListener('click', resetAllData);
    document.getElementById('fileInput').addEventListener('change', handleFileImport);
}

// ============================================
// START APPLICATION
// ============================================

document.addEventListener('DOMContentLoaded', initializeApp);