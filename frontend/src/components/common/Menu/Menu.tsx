import {
  useFloating,
  offset,
  shift,
  autoUpdate,
  type Placement,
  type VirtualElement,
  flip,
} from "@floating-ui/react";
import { motion } from "framer-motion";
import "./Menu.scss";
import {
  useLayoutEffect,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  toLogicalPlacement,
  toLogicalTransformOrigin,
} from "../../../utils/helpers";
import { useMenu } from "../../../context/FloatingMenuContext";

const FloatingMenu = ({
  anchorEl,
  menuRef,
  content,
  placement = "bottom",
  transformOrigin = "center",
  width = "14rem",
  close,
  pin = false,
  zIndex = "110",
}: {
  anchorEl: Element | VirtualElement;
  menuRef: React.RefObject<HTMLDivElement | null>;
  content: ReactNode;
  placement?: Placement;
  transformOrigin: CSSProperties["transformOrigin"];
  width?: string | null;
  close?: () => void;
  pin?: boolean;
  zIndex?: string | undefined;
}) => {
  const { hideMenu } = useMenu();
  const { refs, floatingStyles } = useFloating({
    placement: toLogicalPlacement(placement),
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      shift({ padding: 10, crossAxis: !pin, mainAxis: true }),
      flip(),
    ],
  });

  useLayoutEffect(() => {
    refs.setPositionReference(anchorEl);
  }, [anchorEl, refs]);

  const handleKeydown = (e: KeyboardEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.key !== "Escape") return;
    close?.();
    hideMenu();
  };

  return (
    <div
      tabIndex={0}
      ref={(node) => {
        menuRef.current = node;
        refs.setFloating(node);
      }}
      style={{ ...floatingStyles, zIndex: zIndex }}
      onKeyDown={handleKeydown}
      className={pin ? "floating-menu-pinned" : undefined}
    >
      <motion.div
        data-floating-menu-root
        className="floating-menu"
        initial={{
          opacity: 0,
          transform: "scale(.97)",
          willChange: "none",
          transformOrigin: toLogicalTransformOrigin(transformOrigin),
        }}
        animate={{
          opacity: 1,
          transform: "scale(1)",
        }}
        exit={{
          opacity: 0,
          transform: "scale(.97)",
          pointerEvents: "none",
        }}
        transition={{
          transform: {
            type: "spring",
            stiffness: 1100,
            damping: 50,
            mass: 1,
          },
          opacity: { duration: 0.15 },
        }}
        style={width ? { minWidth: width } : undefined}
      >
        {content}
      </motion.div>
    </div>
  );
};

export default FloatingMenu;
