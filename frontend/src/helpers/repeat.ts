export function repeat(count: number, callback: (index?: number) => void) {
  for (let i = 0; i < count; i++) {
    callback(i)
  }
}
