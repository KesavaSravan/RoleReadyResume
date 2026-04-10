const axios = require('axios');
const fs = require('fs');
const path = require('path');

function validateInputs(resumeText = '', jobDescription = '', instruction = '') {
  if (resumeText && resumeText.length > 15000) {
    throw new Error('Resume text exceeds 15,000 character limit.');
  }
  if (jobDescription && jobDescription.length > 10000) {
    throw new Error('Job description exceeds 10,000 character limit.');
  }
  if (instruction && instruction.length > 500) {
    throw new Error('Instruction exceeds 500 character limit.');
  }
  
  const maliciousPattern = /ignore previous instructions/i;
  if ((resumeText && maliciousPattern.test(resumeText)) ||
      (jobDescription && maliciousPattern.test(jobDescription)) ||
      (instruction && maliciousPattern.test(instruction))) {
    throw new Error('Invalid input detected. Prompt injection patterns are not allowed.');
  }
}

function writeLog(type, content) {
  const logPath = path.join(__dirname, '../../resume.log');
  const timestamp = new Date().toISOString();
  const logEntry = `\n[${timestamp}] [${type}]\n${typeof content === 'object' ? JSON.stringify(content, null, 2) : content}\n----------------------------------------\n`;
  fs.appendFile(logPath, logEntry, (err) => {
    if (err) console.error('Failed to write log:', err);
  });
}

async function tailorResumeWithGroq(resumeText, jobDescription) {
  validateInputs(resumeText, jobDescription);
  
  const prompt = `You are an expert ATS resume writer. Your task is to extract, rewrite, and format a highly optimized, tailored resume.

CRITICAL INSTRUCTIONS:
1. Extract ALL contact information (Name, Email, Phone, Location, LinkedIn, Portfolio/GitHub) from the Candidate Resume and format it exactly at the very top.
2. The Name MUST be formatted as an H1 markdown element (\`# First Last\`).
3. Below the name, list the contact details separated by a bullet or pipe (\`•\` or \`|\`).
4. Improve the summary, skills, and experience sections to strongly align with the Job Description keywords and requirements. Use strong action verbs and quantify achievements.
5. Do NOT invent experience or skills the candidate doesn't have.
6. Provide ONLY the finalized resume in markdown format. DO NOT provide any conversational filler like "Here is the summary" or "Note: this resume has been improved".
7. Do NOT include any markdown code blocks (e.g., do not wrap the response in \`\`\`markdown \`\`\`). Just output the raw markdown text.

--- Job Description ---
${jobDescription}

--- Candidate Resume ---
${resumeText}`;

  writeLog('REQUEST_PROMPT', prompt);
  console.log('--- Generating new resume via Groq API ---');

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are an expert resume writer.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4096
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const generatedResume = response.data.choices[0].message.content;
    writeLog('RESPONSE_SUCCESS', generatedResume);
    console.log('✅ Successfully generated tailored resume');
    return generatedResume;
  } catch (error) {
    writeLog('ERROR', error.response?.data || error.message);
    console.error('❌ Groq API Error:', error.response?.data || error.message);
    throw error;
  }
}

function extractKeywords(text) {
  // Simple keyword extraction (you can make this more sophisticated)
  const commonKeywords = [
    'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker',
    'Git', 'Agile', 'Scrum', 'Leadership', 'Communication', 'Problem Solving',
    'Project Management', 'Data Analysis', 'Machine Learning', 'API',
    'Database', 'Frontend', 'Backend', 'Full Stack', 'DevOps'
  ];

  return commonKeywords.filter(keyword =>
    text.toLowerCase().includes(keyword.toLowerCase())
  );
}

function generateBasicTailoredResume(resumeText, jobDescription) {
  // Extract key skills and keywords from job description
  const jobKeywords = extractKeywords(jobDescription);

  return `# TAILORED RESUME

## PROFESSIONAL SUMMARY
${resumeText.split('\n').slice(0, 3).join('\n')}

**Key Highlights:**
- Experienced professional with relevant background
- Strong alignment with required qualifications
- Proven track record in ${jobKeywords.slice(0, 3).join(', ')}

## ENHANCED SKILLS
Based on the job requirements, here are the most relevant skills:
${jobKeywords.map(skill => `• ${skill}`).join('\n')}

## OPTIMIZED EXPERIENCE
${resumeText}

---
**Note:** This resume has been optimized for the following key requirements:
${jobKeywords.slice(0, 5).map(keyword => `• ${keyword}`).join('\n')}

## RECOMMENDATIONS:
1. Highlight specific achievements with quantifiable results
2. Include relevant certifications mentioned in the job posting
3. Customize the professional summary for each application
4. Use action verbs that match the job description language

---
*Resume optimized for ATS compatibility and keyword matching*`;
}

async function refineResumeWithGroq(currentResume, instruction) {
  validateInputs(currentResume, '', instruction);

  const prompt = `You are an expert ATS resume writer. I am going to provide you with a currently drafted resume, and a specific user instruction on how to change it.

CRITICAL INSTRUCTIONS:
1. Apply the user's specific instruction to the resume. 
2. Retain the exact same markdown formatting as the original draft (H1 for name, bullets for contact info, H2 for sections, etc.) unless the user's instruction explicitly asks you to change the format.
3. Do NOT invent experience or skills the candidate doesn't have.
4. Provide ONLY the finalized, updated resume in markdown format. DO NOT provide any conversational filler.
5. Do NOT include any markdown code blocks (e.g., do not wrap the response in \`\`\`markdown \`\`\`). Just output the raw markdown text.

--- User Instruction/Refinement ---
${instruction}

--- Current Resume Draft ---
${currentResume}`;

  writeLog('REFINE_PROMPT', prompt);
  console.log('--- Refining resume via Groq API ---');

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are an expert resume writer.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4096
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const generatedResume = response.data.choices[0].message.content;
    writeLog('REFINE_SUCCESS', generatedResume);
    console.log('✅ Successfully refined resume');
    return generatedResume;
  } catch (error) {
    writeLog('ERROR', error.response?.data || error.message);
    console.error('❌ Groq API Error:', error.response?.data || error.message);
    throw error;
  }
}

async function scoreResumeWithGroq(resumeText, jobDescription) {
  validateInputs(resumeText, jobDescription);

  const prompt = `You are an expert ATS (Applicant Tracking System) algorithm.
I will provide a Candidate Resume and a Target Job Description.
You must analyze how well the resume matches the job description and return ONLY a valid JSON object with the following exact structure (no markdown blocks or other text):

{
  "score": <a number between 0 and 100 representing the match percentage>,
  "summary": "<a one-line summary of the candidate's fit>",
  "strengths": [
    "<strength 1>",
    "<strength 2>"
  ],
  "missingKeywords": [
    "<keyword 1 that the job requires but candidate is missing>",
    "<keyword 2>",
    "<keyword 3>"
  ]
}

--- Job Description ---
${jobDescription}

--- Candidate Resume ---
${resumeText}`;

  writeLog('SCORE_PROMPT', prompt);
  console.log('--- Scoring resume via Groq API ---');

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a JSON-only API that outputs ATS scores.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1, // Low temperature for consistent JSON output
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const resultText = response.data.choices[0].message.content;
    writeLog('SCORE_SUCCESS', resultText);
    return JSON.parse(resultText);
  } catch (error) {
    writeLog('SCORE_ERROR', error.response?.data || error.message);
    console.error('❌ Groq API Score Error:', error.response?.data || error.message);
    throw error;
  }
}

async function generateCoverLetterWithGroq(resumeText, jobDescription) {
  validateInputs(resumeText, jobDescription);

  const prompt = `You are an expert executive career coach and resume writer.
I will provide a Candidate Resume and a Target Job Description. 
You must write a highly professional, compelling, and tailored 1-page Cover Letter for this candidate applying to this specific job.

CRITICAL INSTRUCTIONS:
1. Extract the candidate's name and contact info and place it at the top.
2. Address the letter professionally (e.g. "Dear Hiring Manager," or use the company name if applicable).
3. The body should be 3-4 paragraphs highlighting how the candidate's specific past experiences perfectly align with the core requirements of the job.
4. Output ONLY the finalized cover letter in Markdown format.

--- Job Description ---
${jobDescription}

--- Candidate Resume ---
${resumeText}`;

  writeLog('COVER_LETTER_PROMPT', prompt);
  console.log('--- Generating Cover Letter via Groq API ---');

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are an expert career coach.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const generatedCL = response.data.choices[0].message.content;
    writeLog('COVER_LETTER_SUCCESS', generatedCL);
    console.log('✅ Successfully generated Cover Letter');
    return generatedCL;
  } catch (error) {
    writeLog('COVER_LETTER_ERROR', error.response?.data || error.message);
    console.error('❌ Groq API Cover Letter Error:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  tailorResumeWithGroq,
  generateBasicTailoredResume,
  refineResumeWithGroq,
  scoreResumeWithGroq,
  generateCoverLetterWithGroq
};
