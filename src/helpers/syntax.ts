/**
 * Checks that argument is not null or undefined and returns the argument back
 */
export function ensure<S>(value: S | undefined | null, message?: string): S {
  if (value !== null && value !== undefined) {
    return value;
  }
  // Throw catch and rethrow - log error to console with stacktrace.
  try {
    const messageBase = message || "Validation failed";
    if (value === null) {
      throw new Error(messageBase + ": value must not be null");
    }
    if (value === undefined) {
      throw new Error(messageBase + ": value must not be undefined");
    }
    throw new Error(messageBase);
  } catch (ex) {
    console.error(ex);
    throw ex;
  }
}
