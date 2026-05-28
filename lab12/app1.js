// =========================
// TO-DO LIST
// =========================

// Крок 2. Змінні та завантаження даних
const form = document.querySelector('#todo-form');
const input = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Крок 3. Створення функції відображення завдань (рендеринг)
function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = task.text;

        if (task.completed) {
            li.classList.add('completed');
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Видалити';
        deleteBtn.classList.add('delete-btn');

        deleteBtn.dataset.index = index;
        li.dataset.index = index;

        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// Крок 4. Додавання нового завдання
form.addEventListener('submit', function (e) {
    e.preventDefault(); 

    const taskText = input.value.trim();

    if (taskText !== '') {
        tasks.push({
            text: taskText,
            completed: false
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
        input.value = '';
        renderTasks();
    }
});

// Крок 5. Обробка кліків по списку (делегування подій)
taskList.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-btn')) {
        const index = e.target.dataset.index;
        tasks.splice(index, 1);
    } else {
        const li = e.target.closest('li');
        if (li) {
            const index = li.dataset.index;
            tasks[index].completed = !tasks[index].completed;
        }
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
});

renderTasks();

// =========================
// ДОДАТКОВЕ ЗАВДАННЯ 3. НОТАТКИ   1
// =========================

const noteForm = document.querySelector('#note-form');
const noteInput = document.querySelector('#note-input');
const notesList = document.querySelector('#notes-list');

let notes = JSON.parse(localStorage.getItem('notes')) || [];

// Функція відображення нотаток
function renderNotes() {
    notesList.innerHTML = '';

    notes.forEach((note, index) => {
        const card = document.createElement('div');
        card.classList.add('note-card');

        const text = document.createElement('p');
        text.classList.add('note-text');
        text.textContent = note.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Видалити';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.dataset.index = index;

        card.appendChild(text);
        card.appendChild(deleteBtn);
        notesList.appendChild(card);
    });
}

// Додавання нової нотатки
noteForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const noteText = noteInput.value.trim();

    if (noteText !== '') {
        notes.push({
            text: noteText
        });

        localStorage.setItem('notes', JSON.stringify(notes));
        noteInput.value = '';
        renderNotes();
    }
});

// Видалення нотатки
notesList.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-btn')) {
        const index = e.target.dataset.index;
        notes.splice(index, 1);

        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotes();
    }
});

renderNotes();

// =========================
// ДОДАТКОВЕ ЗАВДАННЯ 9. СЛАЙДЕР
// =========================

const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('#prev-btn');
const nextBtn = document.querySelector('#next-btn');

let currentSlide = 0;

// Функція показу активного зображення
function showSlide(index) {
    slides.forEach((slide) => {
        slide.classList.remove('active');
    });

    slides[index].classList.add('active');
}

// Кнопка "Вперед"
nextBtn.addEventListener('click', function () {
    currentSlide++;

    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }

    showSlide(currentSlide);
});

// Кнопка "Назад"
prevBtn.addEventListener('click', function () {
    currentSlide--;

    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }

    showSlide(currentSlide);
});

// Автоматичне перемикання кожні 3 секунди
setInterval(function () {
    currentSlide++;

    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }

    showSlide(currentSlide);
}, 3000);

// =========================
// ДОДАТКОВЕ ЗАВДАННЯ 12. POMODORO
// =========================

const timerDisplay = document.querySelector('#timer-display');
const startTimerBtn = document.querySelector('#start-timer');
const pauseTimerBtn = document.querySelector('#pause-timer');
const resetTimerBtn = document.querySelector('#reset-timer');
const timerMessage = document.querySelector('#timer-message');

let totalSeconds = 25 * 60;
let timerInterval = null;

// Функція для форматування часу у ХВ:СЕК
function updateTimerDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
}

// Кнопка "Старт"
startTimerBtn.addEventListener('click', function () {
    if (timerInterval !== null) {
        return;
    }

    timerMessage.textContent = '';

    timerInterval = setInterval(function () {
        totalSeconds--;
        updateTimerDisplay();

        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            timerMessage.textContent = 'Час відпочити!';
            alert('Час відпочити!');
        }
    }, 1000);
});

// Кнопка "Пауза"
pauseTimerBtn.addEventListener('click', function () {
    clearInterval(timerInterval);
    timerInterval = null;
});

// Кнопка "Скидання"
resetTimerBtn.addEventListener('click', function () {
    clearInterval(timerInterval);
    timerInterval = null;
    totalSeconds = 25 * 60;
    timerMessage.textContent = '';
    updateTimerDisplay();
});

updateTimerDisplay();