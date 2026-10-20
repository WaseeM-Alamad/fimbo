import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence } from "framer-motion";
import Tooltip from "../components/common/Tooltip/Tooltip";

const TooltipContext = createContext<null>(null);

const dirs = ["top", "bottom", "start", "end"] as const;
type TooltipDir = (typeof dirs)[number];

export type PointerPosition = { x: number; y: number };

type TooltipState = {
  id: string;
  anchor: Element;
  text: string;
  dir?: "top" | "bottom" | "start" | "end";
  noDelay?: boolean;
  follow?: boolean;
} | null;

type ShowOptions = {
  dir?: TooltipDir | null;
  noDelay?: boolean;
  follow?: boolean;
};

export function TooltipProvider({ children }: { children: ReactNode }) {
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const pointerRef = useRef<PointerPosition>({ x: 0, y: 0 });

  const showTooltip = useCallback(
    (
      id: string,
      target: Element,
      text: string,
      { dir = null, noDelay = false, follow = false }: ShowOptions = {},
    ) => {
      clearTimeout(tooltipTimeoutRef.current);

      tooltipTimeoutRef.current = setTimeout(
        () => {
          if (!document.body.contains(target)) return;

          setTooltip({
            id,
            anchor: target,
            text,
            ...(dir !== null ? { dir } : {}),
            noDelay,
            follow,
          });
        },
        noDelay ? 10 : 100,
      );
    },
    [],
  );

  const hideTooltip = useCallback((target: Element) => {
    clearTimeout(tooltipTimeoutRef.current);

    setTooltip((prev) => (prev?.anchor === target ? null : prev));
  }, []);

  const closeToolTip = useCallback(() => {
    clearTimeout(tooltipTimeoutRef.current);
    setTooltip(null);
  }, []);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
    };

    document.addEventListener("pointermove", handleMove, { passive: true });

    return () => document.removeEventListener("pointermove", handleMove);
  }, []);

  useEffect(() => {
    const handleDown = (e: PointerEvent) => {
      const type = e.pointerType;
      if (type === "touch" || tooltip?.follow) return;
      requestAnimationFrame(() => {
        closeToolTip();
      });
    };

    document.addEventListener("pointerdown", handleDown, true);

    return () => {
      document.removeEventListener("pointerdown", handleDown, true);
    };
  }, [closeToolTip, tooltip]);

  useEffect(() => {
    const handler = () => {
      closeToolTip();
    };

    window.addEventListener("blur", handler);

    return () => window.removeEventListener("blur", handler);
  }, [closeToolTip]);

  useEffect(() => {
    const handleEnter = (e: PointerEvent) => {
      if (!(e.target instanceof Element)) return;

      const hasTooltip = e.target.hasAttribute("data-tooltip");

      if (!hasTooltip) return;

      const target = e.target;

      const text = target.getAttribute("data-tooltip");
      if (!text) return;

      const targetDir = target.getAttribute("data-tp-pos");
      const dir = (dirs as readonly string[]).includes(targetDir ?? "")
        ? (targetDir as TooltipDir)
        : null;

      const noDelay = target.getAttribute("data-tp-no-delay") === "true";

      const follow =
        target.hasAttribute("data-tooltip-follow") && e.pointerType !== "touch";

      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;

      showTooltip(crypto.randomUUID(), target, text, { dir, noDelay, follow });
    };

    const handleLeave = (e: PointerEvent) => {
      if (!(e.target instanceof Element)) return;

      const hasTooltip = e.target.hasAttribute("data-tooltip");
      if (!hasTooltip) return;
      const target = e.target;

      hideTooltip(target);
    };

    document.addEventListener("pointerenter", handleEnter, true);
    document.addEventListener("pointerleave", handleLeave, true);

    return () => {
      document.removeEventListener("pointerenter", handleEnter, true);
      document.removeEventListener("pointerleave", handleLeave, true);
    };
  }, [showTooltip, hideTooltip]);

  return (
    <TooltipContext.Provider value={null}>
      {children}

      <AnimatePresence presenceAffectsLayout={false}>
        {tooltip && (
          <Tooltip
            key={tooltip.id}
            anchorEl={tooltip.anchor}
            text={tooltip.text}
            dir={tooltip.dir}
            follow={tooltip.follow}
            pointerRef={pointerRef}
          />
        )}
      </AnimatePresence>
    </TooltipContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTooltip() {
  const context = useContext(TooltipContext);

  if (!context) {
    throw new Error("useTooltip must be used inside TooltipProvider");
  }

  return context;
}
