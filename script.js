const API_BASE = "http://localhost:3000/api";
let calendar;

// Initialize the Calendar UI
document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: { left: 'prev,next today', center: 'title', right: '' }
    });
    calendar.render();
});

// Switch between Login and Signup
function toggleAuth() {
    document.getElementById('login-box').classList.toggle('hidden');
    document.getElementById('signup-box').classList.toggle('hidden');
}

// Signup Function
async function handleSignup() {
    const name = document.getElementById('reg-name').value;
    const age = document.getElementById('reg-age').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-pass').value;

    const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age, email, password })
    });
    const data = await res.json();
    alert(data.message);
    if (res.ok) toggleAuth();
}

// Login Function
async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-pass').value;

    const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
        document.getElementById('auth-card').classList.add('hidden');
        document.getElementById('tracker-card').classList.remove('hidden');
        document.getElementById('user-greeting').innerText = `Welcome, ${data.user.name}!`;
    } else {
        alert(data.message);
    }
}

// Core Tracker Logic
function calculateCycles() {
    const startInput = document.getElementById('cycle-start-date').value;
    const duration = parseInt(document.getElementById('period-duration').value) || 5;
    
    if (!startInput) return alert("Please select a date");

    const startDate = new Date(startInput);

    const getISODate = (baseDate, daysToAdd) => {
        const d = new Date(baseDate);
        d.setDate(d.getDate() + daysToAdd);
        return d.toISOString().split('T')[0];
    };

    // Update Text Results
    document.getElementById('next-period-date').innerText = new Date(getISODate(startDate, 28)).toLocaleDateString();
    document.getElementById('cycle-results').classList.remove('hidden');

    // Update Calendar Events
    calendar.removeAllEvents();

    // 1. Predicted Period (Highlights the number of bleeding days)
    calendar.addEvent({
        title: 'Predicted Period',
        start: getISODate(startDate, 28),
        end: getISODate(startDate, 28 + duration),
        color: '#E91E63'
    });

    // 2. Ovulation Day
    calendar.addEvent({
        title: 'Ovulation Day',
        start: getISODate(startDate, 13),
        color: '#FFD1DC',
        textColor: '#C2185B'
    });

    calendar.gotoDate(getISODate(startDate, 28));
}