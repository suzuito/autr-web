

export function min<T>(arr: Array<T>, fn: (v: T) => any = v => v): number {
  let j = -1;
  for (let i = 0; i < arr.length; i++) {
    if (j < 0) {
      j = i;
      continue;
    }
    if (fn(arr[i]) < fn(arr[j])) {
      j = i;
    }
  }
  return j;
}

export function max<T>(arr: Array<T>, fn: (v: T) => any = v => v): number {
  let j = -1;
  for (let i = 0; i < arr.length; i++) {
    if (j < 0) {
      j = i;
      continue;
    }
    if (fn(arr[i]) > fn(arr[j])) {
      j = i;
    }
  }
  return j;
}
