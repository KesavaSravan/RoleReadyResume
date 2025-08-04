# LLM Resume Builder 🚀

A full-stack AI-powered resume tailoring application. This app takes a user's existing resume and a target job description, and uses an LLM (via Groq API) to rewrite, optimize, and perfectly format a tailored, ATS-friendly resume.

## Features ✨
- **AI Optimization:** Automatically rewrites experience and summary sections to match job description keywords.
- **ATS-Friendly Formatting:** Outputs a clean, single-page, A4-styled Markdown resume natively in the browser.
- **Editable Output:** Users can directly edit the generated Markdown before downloading.
- **Instant PDF Export:** Precise DOM-to-PDF rendering using `html2pdf.js` to ensure the downloaded resume looks exactly like the preview.
- **Backend Logging:** Tracks AI requests, generated outputs, and API errors in a local file.

## Tech Stack 🛠️
- **Frontend:** React, Vite, `react-markdown`
- **Backend:** Node.js, Express, Axios
- **AI Integration:** Groq API (Llama 3.3 70B Versatile)

---

## Getting Started

### Prerequisites
- Node.js installed
- A [Groq API Key](https://console.groq.com/keys)

### Backend Setup
1. Navigate to the backend directory:
   \`\`\`bash
   cd backend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Create a `.env` file in the `backend/` directory:
   \`\`\`env
   GROQ_API_KEY=your_groq_api_key_here
   PORT=3001
   \`\`\`
4. Start the backend development server:
   \`\`\`bash
   npm run dev
   \`\`\`

### Frontend Setup
1. Navigate to the frontend directory:
   \`\`\`bash
   cd frontend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Create a `.env` file in the `frontend/` directory connecting it to your backend:
   \`\`\`env
   VITE_BACKEND_URL=http://localhost:3001
   \`\`\`
4. Start the frontend development server:
   \`\`\`bash
   npm run dev
   \`\`\`

---

## Project Structure 📁

- `/frontend` - React Vite application containing the UI, Markdown Viewer, and PDF exporter.
- `/backend` - Express API handling interactions with the Groq LLM API and maintaining logs.
