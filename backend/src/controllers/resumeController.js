const { tailorResumeWithGroq, generateBasicTailoredResume, refineResumeWithGroq, scoreResumeWithGroq, generateCoverLetterWithGroq } = require('../services/resumeService');

const tailorResume = async (req, res) => {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
        return res.status(400).json({ error: 'Resume and job description are required.' });
    }

    try {
        let tailoredResume;
        let scoreData;
        const API_PROVIDER = process.env.API_PROVIDER || 'groq';

        switch (API_PROVIDER.toLowerCase()) {
            case 'groq':
                tailoredResume = await tailorResumeWithGroq(resumeText, jobDescription);
                scoreData = await scoreResumeWithGroq(tailoredResume, jobDescription);
                break;
            default:
                // Fallback to a simple template-based approach if no API is available
                tailoredResume = generateBasicTailoredResume(resumeText, jobDescription);
                scoreData = { score: 75, summary: 'Used fallback optimization', strengths: ['Followed template'], missingKeywords: [] };
        }

        res.json({ output: tailoredResume, scoreData });
    } catch (error) {
        console.error('API Error:', error);

        // Fallback to basic tailoring if API fails
        const fallbackResume = generateBasicTailoredResume(resumeText, jobDescription);
        res.json({
            output: fallbackResume,
            scoreData: { score: 75, summary: 'Used fallback optimization due to API error', strengths: [], missingKeywords: [] },
            warning: 'Used fallback method due to API error'
        });
    }
};

const refineResume = async (req, res) => {
    const { currentResume, instruction } = req.body;

    if (!currentResume || !instruction) {
        return res.status(400).json({ error: 'Current resume and instruction are required.' });
    }

    try {
        const refinedResume = await refineResumeWithGroq(currentResume, instruction);
        res.json({ output: refinedResume });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to refine resume due to API error.' });
    }
};

const scoreResume = async (req, res) => {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
        return res.status(400).json({ error: 'Resume and job description are required.' });
    }

    try {
        const scoreData = await scoreResumeWithGroq(resumeText, jobDescription);
        res.json(scoreData);
    } catch (error) {
        console.error('Score API Error:', error);
        res.status(500).json({ error: 'Failed to score resume due to API error.', score: 0, missingKeywords: [] });
    }
};

const generateCoverLetter = async (req, res) => {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
        return res.status(400).json({ error: 'Resume and job description are required.' });
    }

    try {
        const coverLetter = await generateCoverLetterWithGroq(resumeText, jobDescription);
        res.json({ output: coverLetter });
    } catch (error) {
        console.error('Cover Letter API Error:', error);
        res.status(500).json({ error: 'Failed to generate cover letter.' });
    }
};

module.exports = {
    tailorResume,
    refineResume,
    scoreResume,
    generateCoverLetter
};
