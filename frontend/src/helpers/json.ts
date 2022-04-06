export function encode(object: any): string {
  return JSON.stringify(object)
}

export function decode(string: string): any {
  return JSON.parse(string)
}

export default { encode, decode }
