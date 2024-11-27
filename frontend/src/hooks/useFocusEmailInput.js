import { useEffect, useRef } from "react";

export function useFocusEmailInput() {
  const emailInputRef = useRef(null);

  useEffect(() => {
    emailInputRef.current.focus();
  }, []);

  return emailInputRef;
}
