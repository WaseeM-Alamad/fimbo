import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Modal from "../components/common/Modal/Modal";
import { AnimatePresence } from "framer-motion";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useLocation } from "react-router-dom";

type ModalOptions = {
  id: string;
  content: ReactNode;
  onClose?: () => void;
};

type ModalContextType = {
  showModal: (options: Omit<ModalOptions, "id">) => void;
  hideModal: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  // const { isAuthenticated } = useAuth();
  const isAuthenticated = true;
  const routeKey = `${pathname}:${isAuthenticated}`;
  const [modals, setModals] = useState<(ModalOptions & { openedAt: string })[]>(
    [],
  );
  const visibleModals = modals.filter((m) => m.openedAt === routeKey);
  const hasModals = visibleModals.length > 0;

  const showModal = useCallback(
    (options: Omit<ModalOptions, "id">) => {
      setModals((prev) => [
        ...prev,
        { id: crypto.randomUUID(), ...options, openedAt: routeKey },
      ]);
    },
    [routeKey],
  );

  const hideModal = useCallback(() => {
    modals.at(-1)?.onClose?.();
    setModals((prev) => prev.slice(1));
  }, [modals]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setModals((prev) => {
      const stale = prev.filter((m) => m.openedAt !== routeKey);
      if (stale.length === 0) return prev;
      requestAnimationFrame(() => {
        stale.forEach((m) => m.onClose?.());
      });
      return prev.filter((m) => m.openedAt === routeKey);
    });
  }, [routeKey]);

  const menuRef = useRef<HTMLDivElement>(null);
  useFocusTrap(menuRef, modals.length > 0);

  return (
    <ModalContext.Provider
      value={{
        showModal,
        hideModal,
      }}
    >
      {children}

      <div
        key={`overlay:${routeKey}`}
        className="overlay"
        style={hasModals ? { opacity: 1, pointerEvents: "auto" } : undefined}
        onClick={hideModal}
      />
      <AnimatePresence key={routeKey} presenceAffectsLayout={false}>
        {visibleModals.map((modal, index) => {
          return (
            <Modal key={modal.id} isOpen={index === 0} ref={menuRef}>
              {modal.content}
            </Modal>
          );
        })}
      </AnimatePresence>
    </ModalContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used inside ModalProvider");
  }

  return context;
}
