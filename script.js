const grid = document.getElementById('calendarGrid');
const monthTitle = document.getElementById('monthTitle');
const slotsWrapper = document.getElementById('slotsWrapper');
const slotsList = document.getElementById('slotsList');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

// Current state (Today is Feb 16, 2026)
const today = new Date(2026, 1, 16);
let currentView = new Date(2026, 1, 1);

// Constraints: Allow Feb (1) to May (4)
const minMonth = 1;
const maxMonth = 4;

function renderCalendar() {
    grid.innerHTML = '';
    const year = currentView.getFullYear();
    const month = currentView.getMonth();

    // Update Header Text
    monthTitle.innerText = currentView.toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase();

    // Reset slots UI when changing months
    if (slotsWrapper) slotsWrapper.classList.add('d-none');

    // Alignment: Monday-start calculation
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    let offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    // 1. Spacers for alignment
    for (let i = 0; i < offset; i++) {
        const spacer = document.createElement('div');
        spacer.className = 'col';
        spacer.innerHTML = `<div class="day-card spacer"></div>`;
        grid.appendChild(spacer);
    }

    // 2. Date Cards
    for (let day = 1; day <= totalDays; day++) {
        const col = document.createElement('div');
        col.className = 'col';

        const thisDate = new Date(year, month, day);
        // Disable past dates before Feb 16
        const isPast = thisDate < new Date(2026, 1, 16).setHours(0, 0, 0, 0);

        // Check if this card should be active (selected)
        const isActive = (day === 16 && month === 1);

        col.innerHTML = `
            <div class="day-card ${isPast ? 'past' : ''} ${isActive ? 'active' : ''}" 
                 onclick="handleDateSelection(this, ${day}, ${month}, ${year})">
                ${day}
            </div>`;
        grid.appendChild(col);
    }
}

// Navigation Logic for 3-Month Window
nextBtn.addEventListener('click', () => {
    if (currentView.getMonth() < maxMonth) {
        currentView.setMonth(currentView.getMonth() + 1);
        renderCalendar();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentView.getMonth() > minMonth) {
        currentView.setMonth(currentView.getMonth() - 1);
        renderCalendar();
    }
});

// Global function for date selection
window.handleDateSelection = function (el, d, m, y) {
    if (el.classList.contains('past')) return;

    // Check if the clicked date is already active
    if (el.classList.contains('active')) {
        el.classList.remove('active');
        slotsWrapper.classList.add('d-none');
        return;
    }

    // UI Toggle: Activate selected date
    document.querySelectorAll('.day-card').forEach(c => c.classList.remove('active'));
    el.classList.add('active');

    // Update the Label for the selected date
    const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    document.getElementById('activeDateLabel').innerText = `${months[m]} ${d}, ${y}`;

    // Show the slots section
    slotsWrapper.classList.remove('d-none');

    // Inject Booking Slots UI
    slotsList.innerHTML = `
        <div class="slot-row border-bottom border-secondary py-4 d-flex justify-content-between align-items-center">
            <div>
                <span class="text-white fw-bold d-block"><i class="far fa-clock me-2 text-gold"></i> 10:00 AM – 11:00 AM</span>
                <small class="text-white-50 text-uppercase">2 Spaces Available</small>
            </div>
            <button class="btn btn-outline-gold px-4 py-2 fw-bold" onclick="openBookingModal('10:00 AM – 11:00 AM', ${d}, ${m}, ${y})">BOOK APPOINTMENT</button>
        </div>
        <div class="slot-row border-bottom border-secondary py-4 d-flex justify-content-between align-items-center">
            <div>
                <span class="text-white fw-bold d-block"><i class="far fa-clock me-2 text-gold"></i> 2:00 PM – 3:00 PM</span>
                <small class="text-white-50 text-uppercase">1 Space Available</small>
            </div>
            <button class="btn btn-outline-gold px-4 py-2 fw-bold" onclick="openBookingModal('2:00 PM – 3:00 PM', ${d}, ${m}, ${y})">BOOK APPOINTMENT</button>
        </div>
    `;
};

// Open Modal and Populate Data
window.openBookingModal = function (timeSlot, d, m, y) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dateString = `${months[m]} ${d}, ${y}`;

    // Update Modal Content
    document.getElementById('modalDateDisplay').innerText = `${dateString} at ${timeSlot}`;

    // Show Modal
    const modalEl = document.getElementById('bookingModal');
    let myModal = bootstrap.Modal.getInstance(modalEl);
    if (!myModal) {
        myModal = new bootstrap.Modal(modalEl);
    }
    myModal.show();
};

// Initial Render
renderCalendar();

/* =========================================
   SCROLL TO TOP FUNCTIONALITY
   ========================================= */
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

// Monitor scrolling
window.addEventListener('scroll', () => {
    // Show button when scrolled down more than 100px (approx navbar height)
    if (window.scrollY > 100) {
        scrollToTopBtn.classList.add('show-scroll');
    } else {
        scrollToTopBtn.classList.remove('show-scroll');
    }
});

// Scroll to top on click
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});