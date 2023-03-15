// Get the current date and time
function getCurrentDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const time = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
  return { date, time };
}

// Display the current date and time
function displayDateTime() {
  const { date, time } = getCurrentDateTime();
  document.getElementById('time').textContent = time;
  document.title = `${date} | My College`;
  setTimeout(displayDateTime, 1000);
}

// Get the current weather for a given location
async function getCurrentWeather(location) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=94e96cc86d4be9891bedd82d600ff902
  `;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const icon = data.weather[0].icon;
    return { temp, desc, icon };
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Display the current weather in Fahrenheit
async function displayWeather() {
  const weatherDiv = document.getElementById('weather');
  const location = 'Oregon'; 
  const weather = await getCurrentWeather(location);
  if (weather) {
    const tempFahrenheit = (weather.temp * 9/5) + 32;
    const { desc, icon } = weather;
    const html = `
      <div class="temp">${tempFahrenheit.toFixed(1)}°F</div>
      <div class="desc">${desc}</div>
      <img src="https://openweathermap.org/img/w/${icon}.png" alt="${desc}">
    `;
    weatherDiv.innerHTML = html;
  } else {
    weatherDiv.textContent = 'Unable to get weather data';
  }
}

function displayCalendar() {
  const calendarDiv = document.getElementById('calendar');
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  let html = '';

  // Add empty cells before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    html += `<div class="empty"></div>`;
  }

  // Add cells for each day of the month
  for (let i = 1; i <= daysInMonth; i++) {
    html += `<div class="day">${i}</div>`;
  }

  calendarDiv.innerHTML = html;
}

function addTask() {
  const taskInput = document.getElementById('task-input');
  const taskText = taskInput.value.trim();
  if (taskText) {
    const taskList = document.getElementById('task-list');
    const taskItem = document.createElement('li');
    taskItem.textContent = taskText;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', function() {
      taskList.removeChild(taskItem);
    });
    taskItem.appendChild(deleteBtn);
    taskList.appendChild(taskItem);
    taskInput.value = '';
  }
}


const saveButton = document.getElementById('save-btn');
  const textArea = document.querySelector('.notes textarea');

  saveButton.addEventListener('click', () => {
    const textToSave = textArea.value;
    const filename = 'my_notes.txt';

    // Create a new Blob object with the text content
    const blob = new Blob([textToSave], {type: 'text/plain'});

    // Create a new anchor element to trigger the download
    const anchor = document.createElement('a');
    anchor.download = filename;
    anchor.href = window.URL.createObjectURL(blob);
    anchor.style.display = 'none';
    document.body.appendChild(anchor);

    // Trigger the download
    anchor.click();

    // Clean up
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(anchor.href);
  });

// Initialize the app
function init() {
  displayDateTime();
  displayWeather();
  displayCalendar();
  const addTaskBtn = document.getElementById('add-task-btn');
  addTaskBtn.addEventListener('click', addTask);
  const taskInput = document.getElementById('task-input');
  taskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      addTask();
    }
  });
}

init();

