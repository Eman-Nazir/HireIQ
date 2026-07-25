
const MIN_LENGTH = 100;
const MIN_WORD_COUNT = 15;
const MAX_SINGLE_CHAR_RATIO = 0.4;
const MIN_COMMON_WORD_RATIO = 0.1;
const MAX_MASHED_WORD_RATIO = 0.15;

const COMMON_ENGLISH_WORDS = new Set([
  'the', 'and', 'or', 'to', 'of', 'in', 'for', 'with', 'a', 'an', 'is', 'are',
  'will', 'we', 'you', 'your', 'our', 'this', 'that', 'as', 'on', 'at', 'be',
  'have', 'has', 'experience', 'team', 'work', 'role', 'skills', 'years',
  'ability', 'strong', 'candidate', 'looking', 'required', 'preferred',
  'responsibilities', 'requirements', 'knowledge', 'communication', 'management',
]);

export const textQualityReport = (text) => {
  const trimmed = (text || '').trim();

  if (trimmed.length < MIN_LENGTH) {
    return { valid: false, reason: 'too_short' };
  }

  const words = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length < MIN_WORD_COUNT) {
    return { valid: false, reason: 'too_few_words' };
  }

  const uniqueWords = new Set(words);
  if (uniqueWords.size < MIN_WORD_COUNT * 0.5) {
    return { valid: false, reason: 'repetitive' };
  }

  const charCounts = {};
  const charsOnly = trimmed.toLowerCase().replace(/\s/g, '');
  for (const char of charsOnly) {
    charCounts[char] = (charCounts[char] || 0) + 1;
  }
  if (charsOnly.length === 0) {
  return { valid: false, reason: 'too_short' };
}
const maxCharRatio = Math.max(...Object.values(charCounts)) / charsOnly.length;

  if (maxCharRatio > MAX_SINGLE_CHAR_RATIO) {
    return { valid: false, reason: 'character_spam' };
  }

  const cleanWords = words.map((w) => w.replace(/[^a-z]/g, ''));
  const commonWordCount = cleanWords.filter((w) => COMMON_ENGLISH_WORDS.has(w)).length;
  if (commonWordCount / words.length < MIN_COMMON_WORD_RATIO) {
    return { valid: false, reason: 'not_recognizable_text' };
  }

  const mashedWordCount = words.filter((w) => /[a-z]/.test(w) && /[0-9]/.test(w)).length;
  if (mashedWordCount / words.length > MAX_MASHED_WORD_RATIO) {
    return { valid: false, reason: 'keyboard_mashing' };
  }

  return { valid: true, reason: null };
};

export const isValidJobDescription = (text) => textQualityReport(text).valid;

export const REASON_MESSAGES = {
  too_short: `Please provide at least ${MIN_LENGTH} characters.`,
  too_few_words: `Please provide at least ${MIN_WORD_COUNT} words of real detail.`,
  repetitive: 'This text looks repetitive — please paste the actual job description.',
  character_spam: 'This text doesn\'t look like a real job description.',
  not_recognizable_text: 'This doesn\'t look like a real job description. Please paste an actual job posting.',
  keyboard_mashing: 'This doesn\'t look like a real job description. Please paste an actual job posting.',
};

export const JD_MIN_LENGTH = MIN_LENGTH;