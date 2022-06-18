/**
 * If `target` is a class, a subclass is returned that binds all methods on its
 * instances to themselves.  Otherwise, binds all methods exposed on `target`,
 * including those that come from its prototype(s).
 */
export function protobind(target: any): any {
  // Support use of @protobind decorator
  if (typeof target === 'function') {
    class Autobound extends (target as ObjectConstructor) {
      constructor(...args: any[]) {
        super(...args);
        _autobind(this);
      }
    }
    return Autobound;
  }

  // Standard usage of protobind() function
  _autobind(target);
  return target;
}

/**
 * Autobinds all functions present in `source` to `target`, and walks up the
 * prototype chain of `source`.
 */
function _autobind(target: Object): void {
  const names = {};
  _fillBindablePropertyNames(target, names);

  for (const key of Object.keys(names)) {
    target[key] = _bind(target, target[key]);
  }
}

/**
 * Collect a flat set of all property names on `target` that should be bound,
 * by walking up its prototype chain.
 */
function _fillBindablePropertyNames(target: Object, names: Record<string, boolean>): void {
  for (const key of Object.getOwnPropertyNames(target)) {
    if (key === 'constructor') continue;
    if (typeof target[key] !== 'function') continue;
    names[key] = true;
  }
  const nextTarget = Object.getPrototypeOf(target);
  if (nextTarget && nextTarget !== Object.prototype) {
    _fillBindablePropertyNames(nextTarget, names);
  }
}

/**
 * Bind `method` to `target`, preserving any (enumerable) properties present on
 * `method`.
 */
function _bind<T extends Function>(target: Object, method: T): T {
  const bound = method.bind(target);
  for (const name in method) {
    bound[name] = method[name];
  }
  return bound;
}
