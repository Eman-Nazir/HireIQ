import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite",
  // model: 'gemini-3.5-flash',
  //  model: 'gemini-2.5-flash',
  generationConfig: { responseMimeType: "application/json" },
});
// Helpers

const cleanJSON = (text) => {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};

const parseAIResponse = (text) => {
  try {
    return JSON.parse(cleanJSON(text));
  } catch (error) {
    console.error("JSON Parse Failed:", text);

    throw new Error("AI returned invalid JSON response. Please try again.");
  }
};

const handleAIError = (err) => {
  console.error("Gemini Error:", err);

  if (err.status === 429) {
    throw new Error(
      "AI rate limit reached. Please wait a moment and try again.",
    );
  }

  if (err.status === 503) {
    throw new Error("AI service is temporarily busy. Please try again.");
  }

  throw new Error(err.message || "AI service failed");
};

// Retry wrapper for temporary Gemini failures
const generateContentWithRetry = async (prompt, retries = 2) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      if (error.status === 503 && attempt < retries) {
        console.log(`Gemini retry ${attempt + 1}`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        continue;
      }
      handleAIError(error);
    }
  }
};

// Keep prompt size reasonable
const trimText = (text, maxLength = 30000) => {
  if (!text) return "";

  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength);
};

// ATS Resume Scoring

export const scoreResumeAgainstJD = async (resumeText, jobDescription) => {
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
    const text = await generateContentWithRetry(prompt);

    return parseAIResponse(text);
  } catch (error) {
    handleAIError(error);
  }
};

// Interview Questions Generator

export const generateInterviewQuestions = async (
  jobDescription,
  resumeText = "",
) => {
  const prompt = `
You are an expert interview coach.

First, check if the text below is a real, coherent job description (mentions a role, responsibilities, skills, or similar). If it is NOT — e.g. gibberish, random characters, or unrelated text — respond with exactly:
{ "isValid": false, "reason": "This doesn't look like a real job description." }

If it IS valid, generate 8 likely interview questions a candidate should prepare for, mixing technical and behavioral questions relevant to the role. For each, provide a concise SAMPLE ANSWER (3-5 sentences)${resumeText ? ", tailored to the candidate resume if helpful" : ""}.

Respond with exactly this shape when valid:
{ "isValid": true, "questions": [
  { "question": "...", "type": "technical", "suggestedAnswer": "..." },
  { "question": "...", "type": "behavioral", "suggestedAnswer": "..." }
] }

Return ONLY raw JSON. No markdown, no preamble.

JOB DESCRIPTION:
${jobDescription}

${resumeText ? `CANDIDATE RESUME:\n${resumeText}` : ""}
`;

  try {
    const text = await generateContentWithRetry(prompt);
    return parseAIResponse(text); // use your existing helper, which already has good error logging
  } catch (err) {
    handleAIError(err);
  }
};

export const classifyResumeText = async (text) => {
  const safeText = trimText(text, 8000); // resumes don't need much context for this check

  const prompt = `
You are a document classifier. Determine if the following text is an individual's PERSONAL RESUME or CV (i.e. it describes one specific person's own work experience, education history, and skills, typically with their name and contact details).

It is NOT a resume if it is: a guide, article, template, blog post, book, report about resumes/careers/scholarships, or any other document that talks ABOUT resumes/careers rather than BEING one person's resume.

Return ONLY raw JSON in this exact shape:
{ "isResume": true, "reason": "" }
or
{ "isResume": false, "reason": "brief explanation" }

TEXT:
${safeText}
`;

  try {
    const responseText = await generateContentWithRetry(prompt);
    return parseAIResponse(responseText);
  } catch (err) {
    handleAIError(err);
  }
};
