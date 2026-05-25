export const getApiErrorMessage = (error, fallbackMessage) => {
  const data = error.response?.data;

  if (!data) {
    return fallbackMessage;
  }

  if (data.errors && typeof data.errors === 'object') {
    const firstFieldErrors = Object.values(data.errors).find((fieldErrors) => fieldErrors?.length);
    if (firstFieldErrors?.[0]) {
      return firstFieldErrors[0];
    }
  }

  if (data.message) {
    return data.message;
  }

  if (data.error) {
    return data.error;
  }

  return fallbackMessage;
};
