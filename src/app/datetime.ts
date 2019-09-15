export function newDateTimeFromInput(
  date: string, // YYYY-MM-DD
  time: string, // HH:mm
): Date {
  const tmp1 = date.split('-').map(v => parseInt(v, 10));
  tmp1[1] -= 1;
  const tmp2 = time.split(':').map(v => parseInt(v, 10));
  return new Date(tmp1[0], tmp1[1], tmp1[2], tmp2[0], tmp2[1]);
}

