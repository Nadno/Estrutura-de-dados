import { Stack } from '../data-structures/stack';

const MIN_BASE_VALUE = 2,
  MAX_BASE_VALUE = 36;

export const BASE_CONVERTER_DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';

export const baseConverter = (target: number, base = 10) => {
  if (base < MIN_BASE_VALUE || base > MAX_BASE_VALUE)
    throw new Error(
      `The base argument must be between ${MIN_BASE_VALUE} and ${MAX_BASE_VALUE}`,
    );

  const remStack = new Stack<number>();

  for (let number = target; number > 0; number = Math.floor(number / base)) {
    const rem = Math.floor(number % base);
    remStack.push(rem);
  }

  let result = '';

  while (!remStack.isEmpty) {
    result += BASE_CONVERTER_DIGITS.charAt(remStack.pop());
  }

  return result;
};
