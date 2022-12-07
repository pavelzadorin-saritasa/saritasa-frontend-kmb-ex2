const SUFFIX_SEPARATOR = '-';

/**
 * Provides app version with optional suffix.
 * @param suffix Environment-related suffix for the app version.
 */
export function getAppVersion(suffix?: string): string {
  return applySuffixIfPresent(
    applySuffixIfPresent(process.env.NG_APP_VERSION, process.env.NG_APP_COMMIT),
    suffix,
  );
}

/**
 * Applies a provided suffix if it's present.
 * @param str Base string.
 * @param suffix Suffix.
 */
function applySuffixIfPresent(str: string | undefined, suffix?: string): string {
  if (str == null) {
    throw new Error('Seems like NG_APP_VERSION is undefined. \
Please make sure you\'ve provided a correct .env file that\'s specific to your environment');
  }
  return str.concat(suffix ? `${SUFFIX_SEPARATOR}${suffix}` : '');
}
