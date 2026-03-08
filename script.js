const API_BASE = "https://flowstate-menstrual-tracker.onrender.com/api";
let calendar;

document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        height: 'auto',
        headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: 'today'
        }
    });
    calendar.render();
});

function toggleAuth() {
    document.getElementById('login-box').classList.toggle('hidden');
    document.getElementById('signup-box').classList.toggle('hidden');
}

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
        // Delay render to ensure container is visible
        setTimeout(() => calendar.render(), 100);
    } else {
        alert(data.message);
    }
}

function calculateCycles() {
    const startInput = document.getElementById('cycle-start-date').value;
    const duration = parseInt(document.getElementById('period-duration').value) || 5;
    
    if (!startInput) return alert("Please select a date");

    const startDate = new Date(startInput);

    const getFormattedDate = (baseDate, daysToAdd) => {
        const d = new Date(baseDate);
        d.setDate(d.getDate() + daysToAdd);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getISODate = (baseDate, daysToAdd) => {
        const d = new Date(baseDate);
        d.setDate(d.getDate() + daysToAdd);
        return d.toISOString().split('T')[0];
    };

    // 1. Populate Text Phase Results
    document.getElementById('next-period-date').innerText = getFormattedDate(startDate, 28);
    document.getElementById('follicular-info').innerText = `${getFormattedDate(startDate, 0)} - ${getFormattedDate(startDate, 12)}`;
    document.getElementById('ovulation-info').innerText = getFormattedDate(startDate, 13);
    document.getElementById('luteal-info').innerText = `${getFormattedDate(startDate, 14)} - ${getFormattedDate(startDate, 27)}`;
    
    document.getElementById('cycle-results').classList.remove('hidden');

    // 2. Update Calendar Events
    calendar.removeAllEvents();
    calendar.addEvent({ title: 'Predicted Period', start: getISODate(startDate, 28), end: getISODate(startDate, 28 + duration), color: '#E91E63' });
    calendar.addEvent({ title: 'Ovulation', start: getISODate(startDate, 13), color: '#FFD1DC', textColor: '#C2185B' });

    calendar.gotoDate(getISODate(startDate, 28));
}