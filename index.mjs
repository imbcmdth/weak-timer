import global from 'global';

const noop = () => {};

const setName = (type) => type === WeakTimer.TYPE_RAF ? `request${type}` : `set${type}`;
const clearName = (type) => type === WeakTimer.TYPE_RAF ? `cancel${type}` : `clear${type}`;
const regName = (type) => `_reg${type}`;

export class WeakTimerHandle {
  constructor(id, type) {
    this.id = id;
    this.type = type;
  }

  clear() {
    const clearFnName = clearName(this.type);
    return global[clearFnName](this.id);
  }
}

export class WeakTimer {
  static TYPE_TIMER = 'Timeout';
  static TYPE_INTERVAL = 'Interval';
  static TYPE_RAF = 'AnimationFrame';

  static _regTimeout = new FinalizationRegistry((id) => clearTimeout(id));
  static _regInterval = new FinalizationRegistry((id) => clearInterval(id));
  static _regAnimationFrame = new FinalizationRegistry((id) => cancelAnimationFrame(id));

  static makeHandle(callbackFn, delay, type) {
    const timerFn = global[setName(type)];
    const id = timerFn(callbackFn, delay);
    const handle = new WeakTimerHandle(id, type);
    WeakTimer[regName(type)].register(handle, id);

    return handle;
  }

  static makeWeakWrapper(callbackFn) {
    const fnWeak = new WeakRef(callbackFn);
    const wrapper = (...args) => {
      const orgFn = fnWeak.deref();

      if (typeof orgFn === 'function') {
        return orgFn(...args);
      }

      return wrapper.clear();
    };

    wrapper.clear = noop;

    return wrapper;
  }

  static setTimeout(callbackFn, delay) {
    return WeakTimer.makeHandle(callbackFn, delay, WeakTimer.TYPE_TIMER);
  }

  static setInterval(callbackFn, delay) {
    return WeakTimer.makeHandle(callbackFn, delay, WeakTimer.TYPE_INTERVAL);
  }

  static requestAnimationFrame(callbackFn) {
    return WeakTimer.makeHandle(callbackFn, undefined, WeakTimer.TYPE_RAF);
  }

  static setWeakTimeout(callbackFn, delay) {
    return WeakTimer.makeHandle(WeakTimer.makeWeakWrapper(callbackFn), delay, WeakTimer.TYPE_TIMER);
  }

  static setWeakInterval(callbackFn, delay) {
    const weakCallbackFn = WeakTimer.makeWeakWrapper(callbackFn);
    const handle = WeakTimer.makeHandle(weakCallbackFn, delay, WeakTimer.TYPE_INTERVAL);
    const id = handle.id;

    // Interval is unique in that it recurs so we need to clear the interval if
    // the callback is garbage collected
    weakCallbackFn.clear = () => clearInterval(id);

    return handle;
  }

  static requestWeakAnimationFrame(callbackFn) {
    return WeakTimer.makeHandle(WeakTimer.makeWeakWrapper(callbackFn), undefined, WeakTimer.TYPE_RAF);
  }
}

export default WeakTimer;
