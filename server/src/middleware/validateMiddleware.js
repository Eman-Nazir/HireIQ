import { errorResponse } from '../utils/apiResponse.js';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const message = (result.error.issues ?? result.error.errors ?? [])
      .map((e) => e.message)
      .join(', ') || "This doesn't look like a real job description.";
    return errorResponse(res, 400, message);
  }
  req.body = result.data;
  next();
};