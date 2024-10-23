import type { NOTIFICATION_TYPE_EMAIL, NOTIFICATION_TYPE_PHONE } from './constants'

export interface SpaydPaymentAttributes {
  /**
   * Counterparty identification, which is composed of two components separated by a `+` sign
   * These components are:
   *    - account number in IBAN format
   *    - bank identification in SWIFT format according to ISO 9362. (optional)
   *
   * @example 'CZ6508000000192000145399+GIBACZPX'
   * @example 'CZ6508000000192000145399' (IBAN)
   */
  acc: string

  /**
   * A list of alternative accounts to the default account given by the {@link acc} value.
   * The individual records have the same format as the {@link acc} field.
   * Client applications can use this list to display the choice of which account to send the payment to,
   * e.g. to optimise the amount of transfer fees.
   *
   * It is not recommended to insert more than 2 alternative account numbers in the field in order to maintain
   * acceptable data density on the QR code media.
   *
   * @example ['CZ6508000000192000145399+GIBACZPX', 'CZ6508000000192000145399']
   */
  altAcc?: string[]

  /**
   * Payment amount.
   * Decimal number with 2 decimal places, separated by a dot.
   *
   * Max 10 characters e.g. '9999999.99'
   *
   * @example '123.45'
   */
  am?: string

  /**
   * Currency of payment.
   * ISO 4217 currency code.
   *
   * Exactly 3 characters.
   *
   * @example 'CZK'
   */
  cc?: string

  /**
   * Payment identifier for the recipient.
   *
   * Max 16 characters.
   *
   * @example '1234567890123456'
   */
  rf?: string

  /**
   * Name of recipient.
   *
   * Max 35 characters.
   *
   * @example 'John Doe'
   */
  rn?: string

  /**
   * Due date of payment.
   *
   * @example new Date(2018, 3, 20)
   */
  dt?: Date

  /**
   * Payment type.
   * The value "IP" indicates a request to execute a payment order in the form of an immediate payment, if this is
   * possible at the bank in question.
   *
   * Max 3 characters.
   *
   * @example 'P2P'
   */
  pt?: string

  /**
   * Message to the recipient.
   *
   * Max 60 characters.
   *
   * @example 'Payment for some stuff'
   */
  msg?: string

  /**
   * Checksum.
   * The value is created by adding the CRC32 string without the CRC32 value and converting this numeric value to
   * hexadecimal notation.
   *
   * Principle of CRC32 calculation (to ensure the uniqueness of the representation for CRC32 calculation):
   *    - All attributes except the CRC32 attribute are used
   *    - A canonical string is constructed by taking the header ("SPD*1.0*"), sorting the other attributes by key and
   *      secondarily by value, encoding them in this order into a string according to the specification, and thus
   *      forming the basis for the CRC32 calculation
   *
   * The result is converted to hexadecimal
   *
   * Exactly 8 characters.
   * Allowed characters: 0-9, A-F
   *
   * @example 'B51BE0B4'
   */
  crc32?: string

  /**
   * Identification of the channel for sending the notification to the payment issuer.
   *
   * Note: Sending of notifications is governed by the terms and conditions of the individual banks, however, it
   * is recommended to send at the time of blocking of funds in the payer's account.
   *
   * One of the following values:
   *   - 'E' - email address
   *   - 'P' - phone number
   *
   * @example 'E'
   */
  nt?: typeof NOTIFICATION_TYPE_EMAIL | typeof NOTIFICATION_TYPE_PHONE

  /**
   * Phone number in international or local format or email address.
   *
   * Max 320 characters.
   *
   * @example '+420123456789'
   */
  nta?: string

  /**
   * Extended attributes for payment transactions within the Czech Republic
   */
  x?: {
    /**
     * The number of days to attempt to re-execute an unsuccessful payment (e.g. due to unavailable funds in the remitter's account).
     *
     * Max 2 characters.
     * Min value: 0
     * Max value: 30
     *
     * @example '7'
     */
    per?: string

    /**
     * Variable symbol.
     *
     * Max 10 characters.
     *
     * @example '1234567890'
     */
    vs?: string

    /**
     * Specific symbol.
     *
     * Max 10 characters.
     *
     * @example '1234567890'
     */
    ss?: string

    /**
     * Constant symbol.
     *
     * Max 10 characters.
     *
     * @example '1234567890'
     */
    ks?: string

    /**
     * The payment identifier on the payer side. This is an internal ID, the use and interpretation of which depends
     * on the bank of the payer.
     *
     * It can be used, for example, to identify an e-commerce payment or for statistical or marketing purposes.
     *
     * Max 20 characters.
     *
     * @example 'ABCDEFGHIJ1234567890'
     */
    id?: string

    /**
     * URLs that can be used for your own use.
     *
     * Max 140 characters.
     *
     * @example 'https://example.com'
     */
    url?: string
  }
}
