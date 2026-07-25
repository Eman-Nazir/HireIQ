import { z } from 'zod';
import { isValidJobDescription, textQualityReport, REASON_MESSAGES, JD_MIN_LENGTH } from '../utils/textQuality.js';

export const jobDescriptionSchema = z.object({
  jobDescription: z
    .string()
    .trim()
    .min(JD_MIN_LENGTH, `Job description must be at least ${JD_MIN_LENGTH} characters`)
    .optional(),
}).superRefine((data, ctx) => {
  if (data.jobDescription && !isValidJobDescription(data.jobDescription)) {
    const { reason } = textQualityReport(data.jobDescription);
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: REASON_MESSAGES[reason] || 'Invalid job description',
      path: ['jobDescription'],
    });
  }
});