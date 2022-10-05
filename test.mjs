import WeakTimer from './index.mjs';

const case1 = () => {
  let callback = console.log.bind(console, 'callback 1');
  let handle = WeakTimer.setTimeout(callback, 1000);
  handle = null;
};


const case2 = () => {
  let i = 1;
  let t = {
    test: (...args) => {
      console.log(...args, i++);
    }
  };

  const handle = WeakTimer.setWeakInterval(t.test, 1000, 'ping');

  setTimeout(() => {
    console.log('>> delete it', handle);
    t = null;
    gc();
  }, 3100);

  return handle;
};

//case1();
//console.log('After GC 1');
//gc();
const h = case2();
gc();
console.log('After GC 2');
