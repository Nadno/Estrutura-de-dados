const _isPrototypeOf = Object.prototype.isPrototypeOf;

export const isPrototypeOf = <T extends new (...args: unknown[]) => unknown>(
  constructor: T,
  target: any,
): target is T => _isPrototypeOf.call(constructor.prototype, target);
