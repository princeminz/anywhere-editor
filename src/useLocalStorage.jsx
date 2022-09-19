import React, { useState } from "react";

export default function useLocalStorage(keyName, defaultValue) {
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      const value = window.localStorage.getItem(window.location.href+keyName);

      if (value) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem(window.location.href+keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });

  const setValue = (newValue) => {
    try {
      window.localStorage.setItem(window.location.href+keyName, JSON.stringify(newValue));
    } catch (err) {
      // handle error
    }
    setStoredValue(newValue);
  };

  return [storedValue, setValue];
}
