export function getExpTimeStamp(second: number) {
  const currentTime = Date.now();
  const secondsIntoMilliseconds = second * 1000;
  const expTime = currentTime + secondsIntoMilliseconds;
  return Math.floor(expTime / 1000);
}
