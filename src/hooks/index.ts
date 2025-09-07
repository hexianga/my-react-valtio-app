import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { useSnapshot } from 'valtio';
import { useRequest } from 'ahooks';
import { appState, actions } from '../store';
import { captureError } from '../utils/sentry';

/**
 * 使用应用状态
 * 返回应用状态的快照
 */
export const useAppState = () => {
  return useSnapshot(appState);
};

/**
 * 使用主题
 * 返回当前主题和切换主题的函数
 */
export const useTheme = () => {
  const { theme } = useAppState();
  
  return {
    theme,
    toggleTheme: actions.toggleTheme,
    setTheme: actions.setTheme,
  };
};

/**
 * 使用认证状态
 * 返回认证状态和用户信息
 */
export const useAuth = () => {
  const { user, isAuthenticated } = useAppState();
  
  return {
    user,
    isAuthenticated,
    setUser: actions.setUser,
    clearUser: actions.clearUser,
  };
};

/**
 * 使用本地存储
 * @param key 存储键名
 * @param defaultValue 默认值
 */
export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};

/**
 * 使用防抖
 * @param value 需要防抖的值
 * @param delay 延迟时间（毫秒）
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * 使用节流
 * @param callback 回调函数
 * @param delay 延迟时间（毫秒）
 */
export const useThrottle = (callback: Function, delay: number) => {
  const lastRun = useRef(Date.now());

  return useCallback((...args: any[]) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
};

/**
 * 使用点击外部
 * @param ref 要监听的元素引用
 * @param handler 点击外部时的处理函数
 */
export const useClickOutside = (ref: RefObject<HTMLElement>, handler: () => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

/**
 * 使用键盘快捷键
 * @param key 按键
 * @param callback 回调函数
 * @param modifiers 修饰键
 */
export const useKeyPress = (
  key: string,
  callback: () => void,
  modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {}
) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === key.toLowerCase()) {
        const { ctrl, shift, alt } = modifiers;
        
        if (ctrl && !event.ctrlKey) return;
        if (shift && !event.shiftKey) return;
        if (alt && !event.altKey) return;
        
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [key, callback, modifiers]);
};

/**
 * 使用网络状态
 * 返回网络连接状态
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

/**
 * 使用窗口尺寸
 * 返回窗口的宽度和高度
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

/**
 * 使用滚动位置
 * @param element 要监听的元素
 */
export const useScrollPosition = (element?: HTMLElement | null) => {
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const targetElement = element || window;

    const handleScroll = () => {
      if (targetElement === window) {
        setScrollPosition({
          x: window.pageXOffset,
          y: window.pageYOffset,
        });
      } else if (targetElement instanceof HTMLElement) {
        setScrollPosition({
          x: targetElement.scrollLeft,
          y: targetElement.scrollTop,
        });
      }
    };

    targetElement.addEventListener('scroll', handleScroll);
    return () => targetElement.removeEventListener('scroll', handleScroll);
  }, [element]);

  return scrollPosition;
};

/**
 * 使用异步请求（带错误处理）
 * @param service 请求服务函数
 * @param options 请求选项
 */
export const useAsyncRequest = <TData, TParams extends any[]>(
  service: (...args: TParams) => Promise<TData>,
  options?: {
    manual?: boolean;
    onSuccess?: (data: TData, params: TParams) => void;
    onError?: (error: Error, params: TParams) => void;
  }
) => {
  return useRequest(service, {
    ...options,
    onError: (error, params) => {
      // 自动捕获错误到 Sentry
      captureError(error, { params });
      options?.onError?.(error, params);
    },
  });
};
