/**
 * Escapes the payment string value in a correct way
 * @param str - string to be escaped
 * @param normalize - normalize the string before escaping
 */
export function encodeChars(str: string, normalize = false): string {
  if (normalize)
    str = str.toUpperCase().normalize('NFD').replace(/[\u0300-\u036F]/g, '')

  let result = ''

  for (let i = 0; i < str.length; i++) {
    // escape non-ascii characters
    if (str.charCodeAt(i) > 127) {
      result += encodeURIComponent(str.charAt(i))
    }
    else {
      if (str.charAt(i) === '*') {
        // star is a special character for the SPAYD format
        result += '%2A'
      }
      else if (str.charAt(i) === '+') {
        // plus is a special character for URL encode
        result += '%2B'
      }
      else if (str.charAt(i) === '%') {
        // percent is an escape character
        result += '%25'
      }
      else {
        // ascii characters may be used as expected
        result += str.charAt(i)
      }
    }
  }

  return result
}

/**
 * Formats the date to yyyyMMdd
 * @param date - date to be formatted
 */
export function formatDate(date: Date): string {
  return [
    date.getFullYear().toString().padStart(4, '0'),
    (date.getMonth() + 1).toString().padStart(2, '0'),
    date.getDate().toString().padStart(2, '0'),
  ].join('')
}
