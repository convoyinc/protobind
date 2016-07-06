import * as _ from 'lodash';

interface Class {
  new(...args:any[]):Class;
}

/**
 * If `target` is a class, a subclass is returned that binds all methods on its
 * instances to themselves.  Otherwise, binds all methods exposed on `target`,
 * including those that come from its prototype(s).
 */
function protobind(target:any):any {
  if (_.isFunction(target)) {
    class Autobound extends (<Class>target) {
      constructor(...args:any[]) {
        super(...args);
        _autobind(this);
      }
    }
    return Autobound;
  } else {
    _autobind(target);
    return target;
  }
}
export = protobind;

/**
 * Autobinds all functions present in `source` to `target`, and walks up the
 * prototype chain of `source`.
 */
function _autobind(target:{}):void {
  const names:{[key:string]:boolean} = {};
  _fillBindablePropertyNames(target, names);

  for (const key of _.keys(names)) {
    target[key] = _bind(target, target[key]);
  }
}

/**
 * Collect a flat set of all property names on `target` that should be bound,
 * by walking up its prototype chain.
 */
function _fillBindablePropertyNames(target:{}, names:{[key:string]:boolean}):void {
  for (const key of Object.getOwnPropertyNames(target)) {
    if (key === 'constructor') continue;
    if (!_.isFunction(target[key])) continue;
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
function _bind<T>(target:{}, method:T):T {
  const bound = (<any>method).bind(target);
  for (const name in method) {
    bound[name] = method[name];
  }
  return bound;
}
