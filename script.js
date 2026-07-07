// ============================================================
// Mobile menu toggle
// ============================================================
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const scrim = document.getElementById('scrim');

function closeMenu() {
  sidebar.classList.remove('mobile-open');
  scrim.classList.remove('show');
}

menuToggle?.addEventListener('click', () => {
  sidebar.classList.toggle('mobile-open');
  scrim.classList.toggle('show');
});
scrim?.addEventListener('click', closeMenu);
document.querySelectorAll('#sidebarNav a').forEach(a => a.addEventListener('click', closeMenu));

// ============================================================
// Active nav link on scroll
// ============================================================
const sections = document.querySelectorAll('.panel[id]');
const navLinks = document.querySelectorAll('#sidebarNav a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });

sections.forEach(sec => observer.observe(sec));

// ============================================================
// Project filters
// ============================================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const show = filter === 'all' || card.dataset.cat === filter;
      card.style.display = show ? 'grid' : 'none';
    });
  });
});

// ============================================================
// ASK MANAHIL AI
// Tries the real Claude-powered endpoint first (/api/chat, only
// live when deployed on Vercel with ANTHROPIC_API_KEY set).
// Falls back automatically to the offline FAQ bot below if that
// endpoint isn't available (local preview, GitHub Pages, Netlify
// static hosting, or if the API call fails for any reason) — so
// the widget always works, everywhere.
// ============================================================
const KB = {
  greeting: "Hi! I'm Ask Manahil AI 👋 I can tell you about Manahil's projects, skills, experience, resume or how to get in touch. What would you like to know?",
  projects: {
    dineease: "DineEase is Manahil's Final Year Project — an AI-powered, multi-tenant restaurant SaaS platform. Restaurant owners subscribe and get their own digital system with smart ordering, analytics and staff management. Built with React Native, Node.js, Express.js and Firebase. It was selected as a Top 46 Global Finalist at ICSDI 2026.",
    inventory: "The Inventory Management System is a full-featured desktop app for product tracking, stock alerts, purchase & sales modules and a reporting dashboard — built with C#, .NET WinForms and SQL Server.",
    gallery: "The Art Gallery Management System handles artwork catalogs, artist profiles, exhibitions and visitor records, built in Java with SQL Server and JDBC.",
    pharmacy: "The Pharmacy Management System covers medicine inventory, prescriptions, billing and expiry tracking — built with Java and MySQL.",
    event: "The Event Management System is a GUI app for scheduling, attendee tracking and event categories, built with Python and Tkinter with an SQLite database.",
    general: "Manahil has built 10+ real projects: DineEase (AI restaurant SaaS, ICSDI 2026 finalist), an Inventory Management System, Art Gallery Management System, Pharmacy Management System, Event Management System, several React Native apps, a browser game, and Java internship projects at CodSoft. Ask me about any specific one!"
  },
  skills: "Manahil works across: Mobile (React Native, Firebase, Expo), Backend (Node.js, Express.js, SQL Server, MySQL, SQLite), Web (HTML5, CSS3, React.js), Languages (Java, C#, Python, JavaScript, SQL), and AI/SaaS architecture including multi-tenancy and AI integration. Tools: Git, GitHub, VS Code, Android Studio, .NET.",
  resume: "You can download Manahil's resume from the Resume section of this site, or I can point you straight there — click 'Ask about resume' below or scroll to the Resume panel.",
  contact: "You can reach Manahil at manahilaamir2012@email.com, on LinkedIn (linkedin.com/in/manahil-aamir), or GitHub (github.com/22011598-018-sudo). She's based in Gujrat, Punjab, Pakistan and open to internships and full-time roles.",
  education: "Manahil is a final-year BS Software Engineering student at the University of Gujrat (2022–2026), CGPA 3.78/4.0. Before that, FSc Pre-Engineering with 1017/1100 and Matric Science with 1031/1100.",
  achievements: "Manahil's DineEase project was a Top 46 Global Finalist at ICSDI 2026. She's also been a finalist at the Idea Rise Startup Challenge and exhibited at ISC Expo.",
  fallback: "I'm a simple demo assistant for now, so I might not have an answer for that. Try asking about DineEase, her skills, resume, education, achievements, or how to contact her — or use the buttons above!"
};

function getBotReply(msg) {
  const m = msg.toLowerCase();
  if (m.includes('dineease') || m.includes('restaurant')) return KB.projects.dineease;
  if (m.includes('inventory')) return KB.projects.inventory;
  if (m.includes('gallery') || m.includes('art')) return KB.projects.gallery;
  if (m.includes('pharmacy') || m.includes('medicine')) return KB.projects.pharmacy;
  if (m.includes('event')) return KB.projects.event;
  if (m.includes('project')) return KB.projects.general;
  if (m.includes('skill') || m.includes('tech') || m.includes('stack')) return KB.skills;
  if (m.includes('resume') || m.includes('cv')) return KB.resume;
  if (m.includes('contact') || m.includes('email') || m.includes('reach') || m.includes('hire')) return KB.contact;
  if (m.includes('education') || m.includes('university') || m.includes('degree') || m.includes('cgpa')) return KB.education;
  if (m.includes('achiev') || m.includes('award') || m.includes('finalist') || m.includes('icsdi') || m.includes('idea rise') || m.includes('isc expo')) return KB.achievements;
  if (m.includes('hi') || m.includes('hello') || m.includes('hey')) return KB.greeting;
  return KB.fallback;
}

const aiFab = document.getElementById('aiFab');
const aiPanel = document.getElementById('aiPanel');
const aiClose = document.getElementById('aiClose');
const aiBody = document.getElementById('aiBody');
const aiInput = document.getElementById('aiInput');
const aiSend = document.getElementById('aiSend');
const aiSuggestions = document.getElementById('aiSuggestions');

let aiOpened = false;

function addMsg(text, who) {
  const div = document.createElement('div');
  div.className = `ai-msg ${who}`;
  div.textContent = text;
  aiBody.appendChild(div);
  aiBody.scrollTop = aiBody.scrollHeight;
}

function addTyping() {
  const div = document.createElement('div');
  div.className = 'ai-msg bot ai-typing';
  div.textContent = '…';
  aiBody.appendChild(div);
  aiBody.scrollTop = aiBody.scrollHeight;
  return div;
}

aiFab.addEventListener('click', () => {
  aiPanel.classList.add('open');
  if (!aiOpened) {
    addMsg(KB.greeting, 'bot');
    aiOpened = true;
  }
});

aiClose.addEventListener('click', () => aiPanel.classList.remove('open'));

function sendMsg(text) {
  if (!text.trim()) return;
  addMsg(text, 'user');
  aiInput.value = '';

  const typingEl = addTyping();

  fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text })
  })
    .then(r => {
      if (!r.ok) throw new Error('Bad response');
      return r.json();
    })
    .then(data => {
      typingEl.remove();
      addMsg(data.reply || getBotReply(text), 'bot');
    })
    .catch(() => {
      // /api/chat isn't live (e.g. static hosting, no API key set,
      // or a network error) — fall back to the offline FAQ bot.
      typingEl.remove();
      setTimeout(() => addMsg(getBotReply(text), 'bot'), 200);
    });
}

aiSend.addEventListener('click', () => sendMsg(aiInput.value));
aiInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMsg(aiInput.value); });

aiSuggestions.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  sendMsg(btn.textContent);
});