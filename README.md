# LLM RoleReadyResume 🚀

A full-stack, AI-powered toolkit designed to supercharge job applications. RoleReadyResume takes your existing resume and a target job description, and utilizes an LLM (via Groq API) to perfectly tailor, re-write, and format a highly optimized, ATS-friendly resume.

## Features ✨
- **AI Optimization:** Automatically tailors the experience and summary sections to match the job description keywords and demands.
- **Micro-Refinements:** Interactively ask the AI to rewrite or tweak specific bullet points and sections via a prompt.
- **ATS Scoring & Feedback:** Dynamically scores your resume against the job description and outputs missing critical keywords to help you improve.
- **Cover Letter Generation:** Seamlessly generates a 1-page professional cover letter formatted and dedicated specifically to the targeted job.
- **Smart Parsing & Hyperlink Support:** Robust backend document parsers natively preserve embedded URLs from both PDFs and DOCX files to ensure no external links or portfolio links are lost during the upload ingestion.
- **ATS-Friendly Formatting:** Outputs a cleanly styled Markdown resume natively in the browser.
- **Instant Export:** Precise DOM-to-PDF rendering to ensure the downloaded resume looks exactly like the preview.
- **Vercel native Deployment:** Ships with a single integrated `vercel.json` configuration for hosting both the high-performance Vite frontend and the serverless Express backend.

## Interactive API Documentation 📖
The Express backend includes fully interactive **Swagger UI** generated documentation to test endpoints directly.
- **Route:** `/api/docs`
- Contains interfaces for POST requests parsing files, scoring algorithms, and refining instructions natively!

## Tech Stack 🛠️
- **Frontend:** React, Vite, `react-markdown`
- **Backend:** Node.js, Express, Axios, `swagger-ui-express`, `pdf-parse`, `mammoth`
- **AI Integration:** Groq API (Llama 3.3 70B Versatile)

---

## Getting Started

### Prerequisites
- Node.js installed
- A [Groq API Key](https://console.groq.com/keys)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory:
   ```env
   VITE_GROQ_API_KEY=your_groq_api_key_here
   PORT=3001
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` directory connecting it to your backend:
   ```env
   VITE_BACKEND_URL=http://localhost:3001
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## Vercel Deployment 🚀
Deploying RoleReadyResume is simple because it leverages a single `vercel.json` routing topology for monorepo setups. 
- Link the project root explicitly to Vercel. 
- Ensure you set up the Environment Variable `VITE_GROQ_API_KEY` within the Vercel dashboard. 
- Leave `VITE_BACKEND_URL` empty in production so Vercel natively routes React API calls relatively to the backend through its proxy.

---

## Project Structure 📁

- `/frontend` - React Vite application containing the aesthetic UI, markdown renderer, PDF logic, and frontend hooks.
- `/backend` - Express API handling Groq AI prompt engineering, document extraction engines, and Swagger GUI docs.
- `vercel.json` - Single source of truth logic mapping the deployment environments.
