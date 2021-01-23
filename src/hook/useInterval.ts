import { useEffect, useRef } from 'react';

const useSetInterval = (callback: Function) => {
  const ref = useRef<Function>();

  useEffect(() => {
    ref.current = callback;
  });

  useEffect(() => {
    const cb = () => {
      ref.current?.();
    };
    const timer = setInterval(cb, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);
};

export default useSetInterval;

// 定时器
