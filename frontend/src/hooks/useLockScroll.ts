import { useCallback } from "react";

let hasVal = false;

export const useLockScroll = () => {
  const getScrollbarWidth = useCallback(() => {
    if (hasVal) return;
    hasVal = true;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`);
  }, []);

  const lockScroll = useCallback(
    (lock: boolean) => {
      getScrollbarWidth();
      const currentCount = Number(
        document.documentElement.getAttribute("data-scroll-locked") ?? 0,
      );

      if (lock) {
        document.documentElement.setAttribute(
          "data-scroll-locked",
          (currentCount + 1).toString(),
        );
      } else {
        const newCount = currentCount - 1;
        if (newCount <= 0) {
          hasVal = false;
          document.documentElement.removeAttribute("data-scroll-locked");
        } else {
          document.documentElement.setAttribute(
            "data-scroll-locked",
            newCount.toString(),
          );
        }
      }
    },
    [getScrollbarWidth],
  );

  return { lockScroll };
};
