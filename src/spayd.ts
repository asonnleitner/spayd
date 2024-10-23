import type { SpaydPaymentAttributes } from './types'
import { isValidIBAN } from 'ibantools'
import { NOTIFICATION_TYPE_EMAIL, NOTIFICATION_TYPE_PHONE, PROTOCOL_VERSION } from './constants'
import { SpaydAttribute } from './spayd-attribute'
import { encodeChars, formatDate } from './utils'

export function createShortPaymentDescriptor(attributes: SpaydPaymentAttributes, transliterateParams?: boolean): string {
  const header = `SPD*${PROTOCOL_VERSION}`
  const attrs: SpaydAttribute<any>[] = []

  // Bank account
  if (attributes.acc != null) {
    attrs.push(new SpaydAttribute('ACC', attributes.acc, (value) => {
      const [iban, bic] = value.split('+')
      return (iban && bic) ? isValidIBAN(iban) : isValidIBAN(value)
    }))
  }

  // Alternative bank accounts
  if (attributes.altAcc != null && attributes.altAcc.length > 0) {
    attrs.push(new SpaydAttribute('ALT-ACC', attributes.altAcc.join(','), value =>
      value.split(',').every((acc) => {
        const [iban, bic] = acc.split('+')
        return (iban && bic) ? isValidIBAN(iban) : isValidIBAN(acc)
      })))
  }

  // Amount
  if (attributes.am != null)
    attrs.push(new SpaydAttribute('AM', attributes.am, /^[1-9]\d*(\.\d\d)?$/))

  // Currency
  if (attributes.cc != null)
    attrs.push(new SpaydAttribute('CC', attributes.cc.toUpperCase(), /^ADP|AED|AFA|AFN|ALK|ALL|AMD|ANG|AOA|AOK|AON|AOR|ARA|ARL|ARM|ARP|ARS|ATS|AUD|AWG|AZM|AZN|BAD|BAM|BAN|BBD|BDT|BEC|BEF|BEL|BGL|BGM|BGN|BGO|BHD|BIF|BMD|BND|BOB|BOL|BOP|BOV|BRB|BRC|BRE|BRL|BRN|BRR|BRZ|BSD|BTN|BUK|BWP|BYB|BYN|BYR|BZD|CAD|CDF|CHE|CHF|CHW|CLE|CLF|CLP|CNH|CNX|CNY|COP|COU|CRC|CSD|CSK|CUC|CUP|CVE|CYP|CZK|DDM|DEM|DJF|DKK|DOP|DZD|ECS|ECV|EEK|EGP|ERN|ESA|ESB|ESP|ETB|EUR|FIM|FJD|FKP|FRF|GBP|GEK|GEL|GHC|GHS|GIP|GMD|GNF|GNS|GQE|GRD|GTQ|GWE|GWP|GYD|HKD|HNL|HRD|HRK|HTG|HUF|IDR|IEP|ILP|ILR|ILS|INR|IQD|IRR|ISJ|ISK|ITL|JMD|JOD|JPY|KES|KGS|KHR|KMF|KPW|KRH|KRO|KRW|KWD|KYD|KZT|LAK|LBP|LKR|LRD|LSL|LTL|LTT|LUC|LUF|LUL|LVL|LVR|LYD|MAD|MAF|MCF|MDC|MDL|MGA|MGF|MKD|MKN|MLF|MMK|MNT|MOP|MRO|MRU|MTL|MTP|MUR|MVP|MVR|MWK|MXN|MXP|MXV|MYR|MZE|MZM|MZN|NAD|NGN|NIC|NIO|NLG|NOK|NPR|NZD|OMR|PAB|PEI|PEN|PES|PGK|PHP|PKR|PLN|PLZ|PTE|PYG|QAR|RHD|ROL|RON|RSD|RUB|RUR|RWF|SAR|SBD|SCR|SDD|SDG|SDP|SEK|SGD|SHP|SIT|SKK|SLL|SOS|SRD|SRG|SSP|STD|STN|SUR|SVC|SYP|SZL|THB|TJR|TJS|TMM|TMT|TND|TOP|TPE|TRL|TRY|TTD|TWD|TZS|UAH|UAK|UGS|UGX|USD|USN|USS|UYI|UYP|UYU|UYW|UZS|VEB|VEF|VES|VND|VNN|VUV|WST|XAF|XAG|XAU|XBA|XBB|XBC|XBD|XCD|XDR|XEU|XFO|XFU|XOF|XPD|XPF|XPT|XRE|XSU|XTS|XUA|XXX|YDD|YER|YUD|YUM|YUN|YUR|ZAL|ZAR|ZMK|ZMW|ZRN|ZRZ|ZWD|ZWL|ZWR$/))

  // Sender reference
  if (attributes.rf != null)
    attrs.push(new SpaydAttribute('RF', attributes.rf, /^\d{1,16}$/))

  // Recipient name
  if (attributes.rn != null) {
    attributes.rn = transliterateParams ? encodeChars(attributes.rn, transliterateParams) : encodeChars(attributes.rn)
    attrs.push(new SpaydAttribute('RN', attributes.rn, /^[^*]{1,35}$/))
  }

  // Date
  if (attributes.dt != null)
    attrs.push(new SpaydAttribute('DT', formatDate(attributes.dt), () => attributes.dt instanceof Date))

  // Payment type
  if (attributes.pt != null)
    attrs.push(new SpaydAttribute('PT', attributes.pt, /^[^*]{1,3}$/))

  // Message
  if (attributes.msg != null) {
    attributes.msg = transliterateParams ? encodeChars(attributes.msg, transliterateParams) : encodeChars(attributes.msg)
    attrs.push(new SpaydAttribute('MSG', attributes.msg, /^[^*]{1,60}$/))
  }

  // CRC32
  if (attributes.crc32 != null)
    attrs.push(new SpaydAttribute('CRC32', attributes.crc32, /^[A-F0-9]{8}$/))

  // Notification type
  if (attributes.nt != null)
    attrs.push(new SpaydAttribute('NT', attributes.nt, /^[EP]$/))

  // Notification value
  if (attributes.nta != null) {
    const pattern = attributes.nt === NOTIFICATION_TYPE_EMAIL ? /^[^*]{1,64}@[^*]{1,255}$/ : attributes.nt === NOTIFICATION_TYPE_PHONE ? /^[+0-9]{1,14}$/ : /$/

    attrs.push(new SpaydAttribute('NTA', attributes.nta, (value) => {
      return pattern.test(value) && [NOTIFICATION_TYPE_PHONE, NOTIFICATION_TYPE_EMAIL].includes(attributes.nt as any)
    }))
  }

  // Extended attributes
  if (attributes.x != null) {
    // The number of days to attempt to re-execute an unsuccessful payment
    // (e.g. due to unavailable funds in the senders account).
    if (attributes.x.per != null)
      attrs.push(new SpaydAttribute('X-PER', attributes.x.per, /^(30|[12]?\d)$/))

    // Variable symbol
    if (attributes.x.vs != null)
      attrs.push(new SpaydAttribute('X-VS', attributes.x.vs, /^[1-9]\d{0,9}$/))

    // Specific symbol
    if (attributes.x.ss != null)
      attrs.push(new SpaydAttribute('X-SS', attributes.x.ss, /^[1-9]\d{0,9}$/))

    // Constant symbol
    if (attributes.x.ks != null)
      attrs.push(new SpaydAttribute('X-KS', attributes.x.ks, /^[1-9]\d{0,9}$/))

    // Payment ID
    if (attributes.x.id != null)
      attrs.push(new SpaydAttribute('X-ID', attributes.x.id, /^[^*]{1,20}$/))

    // URL
    if (attributes.x.url != null) {
      attributes.x.url = transliterateParams ? encodeChars(attributes.x.url, transliterateParams) : encodeChars(attributes.x.url)
      attrs.push(new SpaydAttribute('X-URL', attributes.x.url, (value) => {
        try {
          const url = new URL(value)
          return url.protocol === 'http:' || url.protocol === 'https:'
        }
        catch {
          return false
        }
      }))
    }
  }

  return [header, ...attrs.map(attr => attr.toString())].join('*')
}
