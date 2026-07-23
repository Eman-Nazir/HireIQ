import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-3.1-flash-lite',
  // model: 'gemini-3.5-flash',
  //  model: 'gemini-2.5-flash',
  generationConfig: { responseMimeType: 'application/json' },
});
// -----------------------------
// Helpers
// -----------------------------

const cleanJSON = (text) => {
  return text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
};


const parseAIResponse = (text) => {
  try {
    return JSON.parse(cleanJSON(text));
  } catch (error) {
    console.error('JSON Parse Failed:', text);

    throw new Error(
      'AI returned invalid JSON response. Please try again.'
    );
  }
};


const handleAIError = (err) => {
  console.error('Gemini Error:', err);


  if (err.status === 429) {
    throw new Error(
      'AI rate limit reached. Please wait a moment and try again.'
    );
  }


  if (err.status === 503) {
    throw new Error(
      'AI service is temporarily busy. Please try again.'
    );
  }


  throw new Error(
    err.message || 'AI service failed'
  );
};


// Retry wrapper for temporary Gemini failures
const generateContentWithRetry = async (
  prompt,
  retries = 2
) => {

  for (let attempt = 0; attempt <= retries; attempt++) {

    try {

      const result = await model.generateContent(prompt);

      return result.response.text();

    } catch (error) {

      if (
        error.status === 503 &&
        attempt < retries
      ) {

        console.log(
          `Gemini retry ${attempt + 1}`
        );

        await new Promise(
          resolve => setTimeout(resolve, 2000)
        );

        continue;
      }


      handleAIError(error);
    }
  }
};



// Keep prompt size reasonable
const trimText = (text, maxLength = 30000) => {

  if (!text) return '';

  if (text.length <= maxLength)
    return text;


  return text.substring(0, maxLength);
};



// -----------------------------
// ATS Resume Scoring
// -----------------------------

export const scoreResumeAgainstJD = async (
  resumeText,
  jobDescription
) => {

  const safeResume = trimText(resumeText);


  const prompt = `
You are an expert ATS resume analyzer.

Analyze the resume against the job description.

Return ONLY valid JSON.
No markdown.
No explanation.

Format:

{
 "atsScore": number,
 "matchedSkills": [],
 "missingSkills": [],
 "suggestions": [
   {
    "section": "",
    "suggestion": ""
   }
 ]
}


RESUME:
${safeResume}


JOB DESCRIPTION:
${jobDescription}
`;


  try {

    const text =
      await generateContentWithRetry(prompt);


    return parseAIResponse(text);


  } catch(error) {

    handleAIError(error);

  }
};



// -----------------------------
// Interview Questions Generator
// -----------------------------



export const generateInterviewQuestions = async (jobDescription, resumeText = '') => {
  const prompt = `
Based on this job description${resumeText ? ' and candidate resume' : ''}, generate 8 likely interview questions a candidate should prepare for. Mix technical and behavioral questions relevant to the role.

For each question, also provide a concise, well-structured SAMPLE ANSWER (3-5 sentences) that a strong candidate could give, tailored to the resume if provided.

Return ONLY a JSON array, no preamble, no markdown fences, in exactly this shape:
[
  { "question": "...", "type": "technical", "suggestedAnswer": "..." },
  { "question": "...", "type": "behavioral", "suggestedAnswer": "..." }
]

JOB DESCRIPTION:
${jobDescription}

${resumeText ? `CANDIDATE RESUME:\n${resumeText}` : ''}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(cleanJSON(text));
  } catch (err) {
    handleAIError(err);
  }
};