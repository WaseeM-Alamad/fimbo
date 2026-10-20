import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { AnimatePresence } from "framer-motion";
import Menu from "../components/common/Menu/Menu";
import type { Placement, VirtualElement } from "@floating-ui/react";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useLocation } from "react-router-dom";

type MenuOptions = {
  content: ReactNode;
  target: Element | VirtualElement;
  placement?: Placement;
  transformOrigin?: CSSProperties["transformOrigin"];
  width?: string | null;
  onClose?: () => void;
  onOpen?: () => void;
};

type MenuContextType = {
  showMenu: (options: MenuOptions) => void;
  hideMenu: () => void;
};

const MenuContext = createContext<MenuContextType | null>(null);

export function MenuProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  // const { isAuthenticated } = useAuth();
  const isAuthenticated = true;
  const routeKey = `${pathname}:${isAuthenticated}`;
  const [data, setData] = useState<(MenuOptions & { openedAt: string }) | null>(
    null,
  );
  const menuRef = useRef<HTMLDivElement | null>(null);
  const targetElRef = useRef<HTMLElement | null>(null);
  const menuIdRef = useRef(0);
  const [menuId, setMenuId] = useState(0);
  const isOpen = !!data && data.openedAt === routeKey;

  const hideMenu = useCallback(() => {
    if (targetElRef.current) {
      targetElRef.current.dataset.open = "closed";
    }
    setData((prev) => {
      requestAnimationFrame(() => {
        if (prev?.onClose) {
          prev.onClose();
        }
      });
      return null;
    });
  }, []);

  const showMenu = useCallback(
    (options: MenuOptions) => {
      setData((prev) => {
        const isSameTarget =
          prev?.target === options.target && prev.openedAt === routeKey;

        if (isSameTarget) {
          if (targetElRef.current) targetElRef.current.dataset.open = "closed";
          requestAnimationFrame(() => {
            prev?.onClose?.();
          });
          return null;
        }

        if (targetElRef.current) {
          targetElRef.current.dataset.open = "closed";
        }

        targetElRef.current =
          options.target instanceof Element
            ? (options.target as HTMLElement)
            : null;

        if (targetElRef.current) {
          targetElRef.current.dataset.open = "open";
        }

        menuIdRef.current += 1;
        setMenuId(menuIdRef.current);

        requestAnimationFrame(() => {
          options.onOpen?.();
        });
        return { ...options, openedAt: routeKey };
      });
    },
    [routeKey],
  );

  useEffect(() => {
    setData((prev) => {
      if (!prev || prev.openedAt === routeKey) return prev;
      if (targetElRef.current) targetElRef.current.dataset.open = "closed";
      requestAnimationFrame(() => {
        prev.onClose?.();
      });
      return null;
    });
  }, [routeKey]);

  useEffect(() => {
    const handler = (e: PointerEvent) => {
      const target = e.target as HTMLElement;

      if (
        (data?.target instanceof Element && data.target.contains(target)) ||
        data?.target === target
      )
        return;

      hideMenu();
    };

    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [data, hideMenu]);

  useFocusTrap(menuRef, !!data);

  const contextValue = { showMenu, hideMenu };

  return (
    <MenuContext.Provider value={contextValue}>
      {children}

      <AnimatePresence key={routeKey} presenceAffectsLayout={false}>
        {isOpen && (
          <Menu
            key={menuId}
            menuRef={menuRef}
            anchorEl={data.target}
            content={data.content}
            placement={data.placement}
            width={data.width}
            transformOrigin={data.transformOrigin}
          />
        )}
      </AnimatePresence>
    </MenuContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMenu() {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error("useMenu must be used inside MenuProvider");
  }

  return context;
}
