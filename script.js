// Navigation scroll effect
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Mobile menu
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-links a');

function openMobileMenu() {
  mobileMenu.classList.add('open');
  mobileMenuOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  mobileMenuOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

mobileMenuBtn.addEventListener('click', openMobileMenu);
mobileMenuClose.addEventListener('click', closeMobileMenu);
mobileMenuOverlay.addEventListener('click', closeMobileMenu);
mobileMenuLinks.forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Scroll reveal animation
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// Sleep Calculator
const wakeTimeInput = document.getElementById('wake-time');
const calculateBtn = document.getElementById('calculate-btn');
const resultsContainer = document.getElementById('calculator-results');

function calculateBedtimes() {
  const wakeTime = wakeTimeInput.value;
  const [hours, minutes] = wakeTime.split(':').map(Number);
  
  const wakeDate = new Date();
  wakeDate.setHours(hours, minutes, 0, 0);
  
  const cycles = [6, 5, 4]; // 9h, 7.5h, 6h of sleep
  const fallAsleepTime = 15; // minutes
  
  const times = cycles.map(cycle => {
    const sleepMinutes = cycle * 90 + fallAsleepTime;
    const bedtime = new Date(wakeDate.getTime() - sleepMinutes * 60000);
    return bedtime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  });
  
  resultsContainer.innerHTML = `
    <p class="calculator-results-label">Try going to bed at one of these times:</p>
    ${times.map((time, index) => `
      <div class="bedtime-option ${index === 0 ? 'recommended' : 'good'}">
        <div class="bedtime-time">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          <span>${time}</span>
        </div>
        <span class="bedtime-label">${index === 0 ? '9 hours (Recommended)' : index === 1 ? '7.5 hours (Good)' : '6 hours (Minimum)'}</span>
      </div>
    `).join('')}
    <p class="calculator-note">* Includes 15 minutes to fall asleep. Based on 90-minute sleep cycles.</p>
  `;
  resultsContainer.style.display = 'block';
}

calculateBtn.addEventListener('click', calculateBedtimes);

// Quiz
const quizQuestions = [
  {
    question: "What time do you usually go to bed on school nights?",
    options: ["Before 9 PM", "9-10 PM", "10-11 PM", "After 11 PM"],
    points: [3, 2, 1, 0]
  },
  {
    question: "How often do you use your phone within 30 minutes of bedtime?",
    options: ["Never", "Sometimes", "Often", "Always"],
    points: [3, 2, 1, 0]
  },
  {
    question: "How do you feel when you wake up most mornings?",
    options: ["Refreshed and alert", "Okay, but could be better", "Tired", "Exhausted"],
    points: [3, 2, 1, 0]
  },
  {
    question: "Do you have a consistent sleep schedule on weekends?",
    options: ["Yes, same as weekdays", "Within 1 hour difference", "2-3 hours different", "Completely different"],
    points: [3, 2, 1, 0]
  },
  {
    question: "How often do you consume caffeine after 3 PM?",
    options: ["Never", "Rarely", "Sometimes", "Daily"],
    points: [3, 2, 1, 0]
  }
];

let currentQuestion = 0;
let answers = [];

const quizContainer = document.getElementById('quiz-container');

function renderQuiz() {
  const q = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  
  quizContainer.innerHTML = `
    <div class="quiz-progress">
      <span class="quiz-progress-text">Question ${currentQuestion + 1} of ${quizQuestions.length}</span>
      <div class="quiz-progress-bar">
        <div class="quiz-progress-fill" style="width: ${progress}%"></div>
      </div>
    </div>
    <h3 class="quiz-question">${q.question}</h3>
    <div class="quiz-options">
      ${q.options.map((option, index) => `
        <button class="quiz-option ${answers[currentQuestion] === index ? 'selected' : ''}" data-index="${index}">
          ${option}
        </button>
      `).join('')}
    </div>
    <div class="quiz-nav">
      <button class="quiz-nav-btn prev" ${currentQuestion === 0 ? 'disabled' : ''}>Previous</button>
      <button class="quiz-nav-btn next" ${answers[currentQuestion] === undefined ? 'disabled' : ''}>
        ${currentQuestion === quizQuestions.length - 1 ? 'See Results' : 'Next'}
      </button>
    </div>
  `;
  
  // Add event listeners
  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => {
      answers[currentQuestion] = parseInt(btn.dataset.index);
      renderQuiz();
    });
  });
  
  document.querySelector('.quiz-nav-btn.prev').addEventListener('click', () => {
    if (currentQuestion > 0) {
      currentQuestion--;
      renderQuiz();
    }
  });
  
  document.querySelector('.quiz-nav-btn.next').addEventListener('click', () => {
    if (currentQuestion < quizQuestions.length - 1) {
      currentQuestion++;
      renderQuiz();
    } else {
      showResults();
    }
  });
}

function showResults() {
  const totalScore = answers.reduce((sum, answerIndex, qIndex) => {
    return sum + quizQuestions[qIndex].points[answerIndex];
  }, 0);
  
  const maxScore = quizQuestions.length * 3;
  const percentage = Math.round((totalScore / maxScore) * 100);
  
  let category, message, colorClass;
  if (percentage >= 80) {
    category = 'excellent';
    message = "Amazing! You have great sleep habits. Keep it up!";
  } else if (percentage >= 50) {
    category = 'good';
    message = "Good job! There's room for improvement, but you're on the right track.";
  } else {
    category = 'needs-work';
    message = "Your sleep habits need some work. Check out our tips to improve!";
  }
  
  quizContainer.innerHTML = `
    <div class="quiz-results">
      <div class="quiz-score-circle ${category}">
        <span class="quiz-score-number">${percentage}%</span>
        <span class="quiz-score-label">Score</span>
      </div>
      <h3>${category === 'excellent' ? 'Excellent!' : category === 'good' ? 'Good Progress!' : 'Room to Grow'}</h3>
      <p>${message}</p>
      <button class="quiz-restart">Take Quiz Again</button>
    </div>
  `;
  
  document.querySelector('.quiz-restart').addEventListener('click', () => {
    currentQuestion = 0;
    answers = [];
    renderQuiz();
  });
}

// Initialize quiz
renderQuiz();

// Download Sleep Plan
const downloadBtn = document.getElementById('download-plan');
downloadBtn.addEventListener('click', () => {
  const content = `
╔══════════════════════════════════════════════════════════════╗
║           7-DAY SLEEP IMPROVEMENT CHALLENGE                  ║
║                     Sleep Smarter, Feel Better               ║
╚══════════════════════════════════════════════════════════════╝

Your journey to better sleep starts now! Complete one task each day.

DAY 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Task: Set a consistent bedtime and wake time
    Tip: Choose times that give you 8-9 hours of sleep
    Notes: ___________________________________________________

DAY 2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Task: Create a screen-free hour before bed
    Tip: Read, journal, or listen to calm music instead
    Notes: ___________________________________________________

DAY 3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Task: Optimize your sleep environment
    Tip: Dark, cool, and quiet is the goal
    Notes: ___________________________________________________

DAY 4
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Task: No caffeine after 3 PM
    Tip: Switch to water or herbal tea in the afternoon
    Notes: ___________________________________________________

DAY 5
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Task: Add 15 minutes of morning sunlight
    Tip: This helps regulate your body clock
    Notes: ___________________________________________________

DAY 6
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Task: Create a relaxing bedtime routine
    Tip: Same activities every night signal sleep time
    Notes: ___________________________________________________

DAY 7
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Task: Reflect on your week and plan ahead
    Tip: Keep what worked, adjust what didn't
    Notes: ___________________________________________________

═══════════════════════════════════════════════════════════════
DAILY SLEEP LOG
═══════════════════════════════════════════════════════════════

Day 1: Bedtime: _____ Wake time: _____ Hours: _____ Rating: /10
Day 2: Bedtime: _____ Wake time: _____ Hours: _____ Rating: /10
Day 3: Bedtime: _____ Wake time: _____ Hours: _____ Rating: /10
Day 4: Bedtime: _____ Wake time: _____ Hours: _____ Rating: /10
Day 5: Bedtime: _____ Wake time: _____ Hours: _____ Rating: /10
Day 6: Bedtime: _____ Wake time: _____ Hours: _____ Rating: /10
Day 7: Bedtime: _____ Wake time: _____ Hours: _____ Rating: /10

═══════════════════════════════════════════════════════════════
REFLECTION
═══════════════════════════════════════════════════════════════

What worked well this week?
_______________________________________________________________
_______________________________________________________________

What was challenging?
_______________________________________________________________
_______________________________________________________________

My sleep goal for next week:
_______________________________________________________________

═══════════════════════════════════════════════════════════════
Remember: Teens need 8-10 hours of sleep each night!

Visit sleepwise.com for more tips and tools.
Share your progress with #SleepWiseChallenge
═══════════════════════════════════════════════════════════════
  `.trim();
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '7-Day-Sleep-Challenge.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// Share functionality
const shareBtn = document.getElementById('share-btn');
shareBtn.addEventListener('click', async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'SleepWise - Teen Sleep Health',
        text: 'Check out this amazing resource for better sleep!',
        url: window.location.href
      });
    } catch (err) {
      console.log('Share cancelled');
    }
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  }
});

// Generate stars
const starsContainer = document.getElementById('stars-container');
for (let i = 0; i < 50; i++) {
  const star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  star.setAttribute('viewBox', '0 0 24 24');
  star.setAttribute('fill', 'currentColor');
  star.classList.add('star');
  star.style.top = `${Math.random() * 100}%`;
  star.style.left = `${Math.random() * 100}%`;
  star.style.width = `${Math.random() * 12 + 6}px`;
  star.style.height = `${Math.random() * 12 + 6}px`;
  star.style.animationDelay = `${Math.random() * 3}s`;
  star.style.opacity = Math.random() * 0.7 + 0.3;
  star.innerHTML = '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>';
  starsContainer.appendChild(star);
}
