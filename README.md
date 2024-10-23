# @spayd/core

[![NPM version](https://img.shields.io/npm/v/@spayd/core)](https://www.npmjs.com/package/@spayd/core)
[![License](https://img.shields.io/npm/l/@spayd/core)](https://github.com/asonnleitner/spayd/blob/main/LICENSE)

A TypeScript library for generating Short Payment Descriptor (SPAYD) strings, a standardized format for encoding payment
information into QR codes.

## What is SPAYD?

SPAYD (Short Payment Descriptor) is a standardized format for encoding payment information into QR codes. It was
developed by the Czech Banking Association and is widely used in Central European countries for initiating bank
transfers via QR codes.

## Installation

```bash
# npm
npm install @spayd/core

# yarn
yarn add @spayd/core

# pnpm
pnpm add @spayd/core
```

## Usage

```typescript
import { createShortPaymentDescriptor } from '@spayd/core'

// Create a payment descriptor
const spayd = createShortPaymentDescriptor({
  acc: 'CZ6508000000192000145399+GIBACZPX',
  am: '123.45',
  cc: 'CZK',
  msg: 'Payment for services',
  rf: '1234567890',
  rn: 'John Doe',
  dt: new Date('2024-12-31'),
  x: {
    vs: '1234567890', // Variable symbol (specific to Czech/Slovak payments)
    ss: '0987654321', // Specific symbol
    ks: '0308' // Constant symbol
  }
})

console.log(spayd)
// Output: SPD*1.0*ACC:CZ6508000000192000145399+GIBACZPX*AM:123.45*CC:CZK*MSG:Payment for services*RF:1234567890*RN:John Doe*DT:20241231*X-VS:1234567890*X-SS:0987654321*X-KS:0308
```

## API

### `createShortPaymentDescriptor(attributes: SpaydPaymentAttributes, transliterateParams?: boolean): string`

Creates a SPAYD string from the provided payment attributes.

#### Parameters

| Parameter             | Type                     | Description                                                           |
|-----------------------|--------------------------|-----------------------------------------------------------------------|
| `attributes`          | `SpaydPaymentAttributes` | Payment information object. See below for structure.                  |
| `transliterateParams` | `boolean`                | Optional. Whether to transliterate special characters in text fields. |

#### Returns

Returns a SPAYD-formatted string that can be encoded into a QR code.

#### Payment Attributes (`SpaydPaymentAttributes`)

| Attribute | Type       | Required | Description                                        | Format/Validation                                      |
|-----------|------------|----------|----------------------------------------------------|--------------------------------------------------------|
| `acc`     | `string`   | Yes      | Primary account number (IBAN + optional BIC/SWIFT) | `'CZ6508000000192000145399+GIBACZPX'` or IBAN only     |
| `altAcc`  | `string[]` | No       | Alternative account numbers                        | Same format as `acc`. Max 2 recommended.               |
| `am`      | `string`   | No       | Payment amount                                     | Decimal with 2 places (max 10 chars). e.g., `'123.45'` |
| `cc`      | `string`   | No       | Currency code                                      | ISO 4217 code (3 chars). e.g., `'CZK'`                 |
| `rf`      | `string`   | No       | Payment reference                                  | Max 16 digits. e.g., `'1234567890'`                    |
| `rn`      | `string`   | No       | Recipient name                                     | Max 35 chars. e.g., `'John Doe'`                       |
| `dt`      | `Date`     | No       | Due date                                           | JavaScript `Date` object                               |
| `pt`      | `string`   | No       | Payment type                                       | Max 3 chars. `'IP'` for immediate payment              |
| `msg`     | `string`   | No       | Message for recipient                              | Max 60 chars                                           |
| `nt`      | `'E'\|'P'` | No       | Notification type                                  | `'E'` for email, `'P'` for phone                       |
| `nta`     | `string`   | No       | Notification address                               | Email or phone number (max 320 chars)                  |

#### Extended Attributes (`x`)

Czech-specific payment attributes:

| Attribute | Type     | Description          | Format/Validation                |
|-----------|----------|----------------------|----------------------------------|
| `x.per`   | `string` | Payment retry period | 0-30 days. e.g., `'7'`           |
| `x.vs`    | `string` | Variable symbol      | Max 10 digits                    |
| `x.ss`    | `string` | Specific symbol      | Max 10 digits                    |
| `x.ks`    | `string` | Constant symbol      | Max 10 digits                    |
| `x.id`    | `string` | Payment identifier   | Max 20 chars                     |
| `x.url`   | `string` | Related URL          | Max 140 chars, valid HTTP(S) URL |

#### Validation

The library includes built-in validation for all fields:

- IBAN validation using `ibantools`
- Currency code validation against ISO 4217
- Length and format validation for all fields
- URL validation for x.url
- Notification format validation (email/phone)
