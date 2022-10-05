# Weak-Timer - *Safer timer functions that can be subject to garbage collection.*

There are two types of timer functions exposed on the WeakTimer class. One share the same names as standard timer functions. The only difference is that these timer functions return a "handle" that the caller must hold onto. If the handle is ever garbage collected - because the object holding them was GC'd or because it was intentionally deleted - then the timer itself is canceled cleanly and not be called. In this way, they are "weak." If the handle is lost, then the timer is cleaned up too. They are no longer held onto by the global scope.

The second class of functions have 'weak' in the name. These are doubly-weak. They return a "handle" just like before but they also maintain only a weak reference to the callback function itself. This means that if _either_ the handle or the callback function are GC'd that the timer is cleaned up. This allows for both the holder of the callback and the holder of the "handle" to determine the lifecycle of the timer.

## Usage

```js
import WeakTimer from 'weak-timer';
// coming soon
```

## API

```
WeakTimerHandle(id: Number, type: WeakTimerType)
```
```
WeakTimerHandle#clear(): void
```

### Single-Weak

```
WeakTimer.setTimeout(callback: Function, delay: Number): WeakTimerHandle
```
```
WeakTimer.setInterval(callback: Function, delay: Number): WeakTimerHandle
```
```
WeakTimer.requestAnimationFrame(callback: Function, delay: Number): WeakTimerHandle
```

### Doubly-Weak
```
WeakTimer.setWeakTimeout(callback: Function, delay: Number): WeakTimerHandle
```
```
WeakTimer.setWeakInterval(callback: Function, delay: Number): WeakTimerHandle
```
```
WeakTimer.requestWeakAnimationFrame(callback: Function): WeakTimerHandle
```
