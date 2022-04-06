import { v4 } from 'uuid'
import { BigNumber } from 'ethers'

export function generate(): string {
  return v4()
}

export function encode(bigNumber: BigNumber): string {
  const hex = bigNumber.toHexString().replace('0x', '')
  return `${hex.substring(0, 8)}-${hex.substring(8, 4)}-${hex.substring(12, 4)}-${hex.substring(16, 4)}-${hex.substring(20)}`
}

export function decode(uuid: string): BigNumber {
  return BigNumber.from('0x' + uuid.replaceAll('-', ''))
}

export default {
  encode, decode, generate
}
