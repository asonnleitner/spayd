import { describe, expect, it } from 'vitest'
import { createShortPaymentDescriptor } from '../src/spayd'

describe('createShortPaymentDescriptor()', () => {
  it('calculates correctly an official example on qr-platba.cz/pro-vyvojare/specifikace-formatu/', () => {
    const spayd = createShortPaymentDescriptor({
      acc: 'CZ2806000000000168540115',
      am: '450.00',
      cc: 'CZK',
      msg: 'PLATBA ZA ZBOZI',
      x: {
        vs: '1234567890',
      },
    })

    const allOf = 'SPD*1.0*ACC:CZ2806000000000168540115*AM:450.00*CC:CZK*MSG:PLATBA ZA ZBOZI*X-VS:1234567890'.split('*')

    expect(spayd.split('*')).toEqual(expect.arrayContaining(allOf))
  })

  it('is able to use all documented descriptors', () => {
    const spayd = createShortPaymentDescriptor({
      acc: 'CZ5855000000001265098001+RZBCCZPP',
      altAcc: ['CZ5855000000001265098001+RZBCCZPP', 'CZ5855000000001265098001'],
      am: '480.55',
      cc: 'CZK',
      rf: '1234567890123456',
      rn: 'PETR DVORAK',
      dt: new Date(2018, 3, 20),
      pt: 'P2P',
      msg: 'Payment for some stuff',
      crc32: 'B51BE0B4',
      x: {
        per: '7',
        vs: '1234567890',
        ks: '1234567890',
        id: '1234567890',
      },
    }, true)

    const allOf = 'SPD*1.0*ACC:CZ5855000000001265098001+RZBCCZPP*ALT-ACC:CZ5855000000001265098001+RZBCCZPP,CZ5855000000001265098001*AM:480.55*CC:CZK*CRC32:B51BE0B4*DT:20180420*MSG:PAYMENT FOR SOME STUFF*PT:P2P*RF:1234567890123456*RN:PETR DVORAK*X-ID:1234567890*X-KS:1234567890*X-PER:7*X-VS:1234567890'.split('*')

    expect(spayd.split('*')).toEqual(expect.arrayContaining(allOf))
  })

  it('throws an exception when the amount is separated by comma', () => {
    try {
      createShortPaymentDescriptor({
        acc: 'CZ2806000000000168540115',
        am: '450,00',
        cc: 'CZK',
        msg: 'PLATBA ZA ZBOZI',
        x: {
          vs: '1234567890',
        },
      })
    }
    catch (err: any) {
      expect(err.message).toBe('Invalid value for attribute AM: 450,00')
    }
  })
})
