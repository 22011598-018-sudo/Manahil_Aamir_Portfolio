// Vercel serverless function — "Ask Manahil AI" powered by the real Claude API.
//
// SETUP:
// 1. On vercel.com, open your project → Settings → Environment Variables
// 2. Add a variable named ANTHROPIC_API_KEY with your key from
//    https://console.anthropic.com
// 3. Redeploy. This endpoint will then be live at /api/chat
// 4. script.js already calls this endpoint (see sendMsg()).

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST' });
  }

  const { message } = req.body || {};
  if (!message) {
    return res.status(400).json({ error: 'Missing "message" in request body' });
  }

  const SYSTEM_PROMPT = `You are "Ask Manahil AI", a friendly assistant embedded on Manahil Aamir's
personal portfolio website. Answer visitor questions ONLY using the facts below.
If asked something outside this info, politely say you don't have that detail and
suggest contacting Manahil directly.

ABOUT: Final-year BS Software Engineering student, University of Gujrat, Pakistan
(2022-2026), CGPA 3.78/4.0. Mobile + full-stack developer focused on AI/SaaS.

PROJECTS:
- DineEase: AI-powered multi-tenant restaurant SaaS (React Native, Node.js,
  Express.js, Firebase). Top 46 Global Finalist, ICSDI 2026.
- Inventory Management System (C#, .NET WinForms, SQL Server)
- Art Gallery Management System (Java, SQL Server, JDBC)
- Pharmacy Management System (Java, MySQL, JDBC)
- Event Management System (Python, Tkinter, SQLite)
- Java internship projects at CodSoft (ATM sim, grade calculator, games)
- Character-based browser game (HTML5, CSS3, JS)
- Multiple React Native apps

SKILLS: React Native, JavaScript, Firebase, Expo, Node.js, Express.js, SQL Server,
MySQL, SQLite, HTML5, CSS3, React.js, Java, C#, Python, SQL, Git, GitHub, VS Code,
Android Studio, AI integration, SaaS architecture, multi-tenancy.

ACHIEVEMENTS: ICSDI 2026 Top 46 Global Finalist, Idea Rise Startup Challenge
Finalist, ISC Expo Finalist.

CONTACT: manahilaamir2012@email.com, linkedin.com/in/manahil-aamir,
github.com/22011598-018-sudo. Based in Gujrat, Punjab, Pakistan.

Keep answers short (2-4 sentences), warm, and specific.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();
    const reply = data?.content?.find(b => b.type === 'text')?.text
      || "Sorry, I couldn't generate a reply just now.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Claude API error:', err);
    return res.status(500).json({ error: 'Something went wrong talking to Claude.' });
  }
}
