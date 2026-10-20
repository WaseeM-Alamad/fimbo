import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const trapStack: symbol[] = [];

export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  isActive?: boolean,
) {
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isActive === false) return;
    const container = containerRef.current;
    if (!container) return;

    const token = Symbol("focus-trap");
    trapStack.push(token);
    const isTopmost = () => trapStack[trapStack.length - 1] === token;

    previouslyFocusedRef.current = document.activeElement as HTMLElement;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (isTopmost()) container.focus();
      }),
    );

    const getFocusable = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => el.offsetParent !== null);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !isTopmost()) return;

      const focusable = getFocusable();
      if (focusable.length === 0) {
        e.preventDefault();
        container.focus();
        return;
      }

      const active = document.activeElement as HTMLElement | null;
      const currentIndex = active ? focusable.indexOf(active) : -1;

      let nextIndex: number;
      if (e.shiftKey) {
        nextIndex = currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1;
      } else {
        nextIndex =
          currentIndex === -1 || currentIndex === focusable.length - 1
            ? 0
            : currentIndex + 1;
      }

      e.preventDefault();
      focusable[nextIndex].focus();
    };

    const handleFocusIn = (e: FocusEvent) => {
      if (!isTopmost()) return;
      const target = e.target as HTMLElement | null;
      if (target && container.contains(target)) return;
      const focusable = getFocusable();
      (focusable[0] ?? container).focus();
    };

    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("focusin", handleFocusIn);

      const wasTopmost = isTopmost();
      const index = trapStack.indexOf(token);
      if (index !== -1) trapStack.splice(index, 1);

      if (wasTopmost) previouslyFocusedRef.current?.focus();
    };
  }, [isActive, containerRef]);
}