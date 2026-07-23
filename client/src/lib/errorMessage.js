export const getErrorMessage = (error) => {
  // No response at all — network is down, backend unreachable, CORS issue, etc.
  if (!error.response) {
    if (error.code === 'ECONNABORTED') return 'Request timed out. Please try again.';
    return 'Unable to reach the server. Check your internet connection.';
  }

  const { status, data } = error.response;

  // Prefer the backend's specific message if it exists
  if (data?.message) return data.message;

  // Fallback by status code
  switch (status) {
    case 400: return 'That request was invalid. Please check your input.';
    case 401: return 'You need to log in to continue.';
    case 403: return "You don't have permission to do that.";
    case 404: return 'We couldn\'t find what you were looking for.';
    case 409: return 'This already exists.';
    case 429: return 'Too many requests. Please wait a moment and try again.';
    case 500: return 'Something went wrong on our end. Please try again.';
    default: return 'Something went wrong. Please try again.';
  }
};