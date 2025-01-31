export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  limit = 500
): T => {
  let lastCall = 0;

  return function (...args: Parameters<T>) {
    const now = Date.now();

    if (now - lastCall >= limit) {
      lastCall = now;
      func(...args);
    }
  } as T;
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay = 500
): T => {
  let timer: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  } as T;
};
