import { isValidJobDescription, textQualityReport } from '../src/utils/textQuality.js';

describe('textQuality: isValidJobDescription', () => {
  it('rejects empty input', () => {
    expect(isValidJobDescription('')).toBe(false);
  });

  it('rejects trivially short input', () => {
    expect(isValidJobDescription('...')).toBe(false);
  });

  it('rejects repeated single-character spam (no spaces)', () => {
    const spam = 'n'.repeat(120);
    expect(isValidJobDescription(spam)).toBe(false);
  });

  it('rejects the exact same word repeated many times', () => {
    const spam = Array(20).fill('nnnnn').join(' ');
    expect(isValidJobDescription(spam)).toBe(false);
  });

  it('rejects keyboard-mashing gibberish', () => {
    const gibberish = 'rnr d fekf6n hykdngy vkn yffknm tlnf td,fn t,mefn ktw,g5dnr3 ,fnk 3tm,rfnk3';
    expect(isValidJobDescription(gibberish)).toBe(false);
  });

  it('accepts a real job description', () => {
    const realJD = `We are looking for a MERN Stack Developer to join our engineering team.
      Responsibilities include building REST APIs with Node.js and Express, designing
      MongoDB schemas, and developing React interfaces. Requirements: 2+ years experience
      with JavaScript, strong communication skills, and familiarity with Git.`;
    expect(isValidJobDescription(realJD)).toBe(true);
  });

  it('reports "too_few_words" for one long spammed word', () => {
    expect(textQualityReport('n'.repeat(120)).reason).toBe('too_few_words');
  });

  it('reports "repetitive" for the same word repeated many times', () => {
    const spam = Array(20).fill('nnnnn').join(' ');
    expect(textQualityReport(spam).reason).toBe('repetitive');
  });

  it('reports "character_spam" for many unique words still dominated by one letter', () => {
    const words = Array.from({ length: 20 }, (_, i) => 'nnnn' + String.fromCharCode(97 + i));
    const spam = words.join(' ');
    expect(textQualityReport(spam).reason).toBe('character_spam');
  });
});