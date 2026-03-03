const API_BASE = "http://localhost:3000/api";

function toggleAuth() {
    document.getElementById('login-box').classList.toggle('hidden');
    document.getElementById('signup-box').classList.toggle('hidden');
}

// --- API FETCH: SIGNUP ---
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

// --- API FETCH: LOGIN ---
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

// --- CALCULATION LOGIC ---
function calculateCycles() {
    const startInput = document.getElementById('cycle-start-date').value;
    if (!startInput) return alert("Please select a date");

    const startDate = new Date(startInput);

    const formatDate = (date, daysToAdd) => {
        const d = new Date(date);
        d.setDate(d.getDate() + daysToAdd);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Predictions (Based on average 28-day cycle)
    document.getElementById('next-period-date').innerText = formatDate(startDate, 28);
    
    document.getElementById('follicular-info').innerText = `Days 1-13\n(${formatDate(startDate, 0)} - ${formatDate(startDate, 12)})`;
    document.getElementById('ovulation-info').innerText = `Day 14\n(${formatDate(startDate, 13)})`;
    document.getElementById('luteal-info').innerText = `Days 15-28\n(${formatDate(startDate, 14)} - ${formatDate(startDate, 27)})`;

    document.getElementById('cycle-results').classList.remove('hidden');
}