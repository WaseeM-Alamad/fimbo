import {
  useFloating,
  flip,
  shift,
  autoUpdate,
  arrow,
  offset,
} from "@floating-ui/react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import "./Tooltip.scss";
import { isRTL } from "../../../utils/supportedLanguages";

type dirTyp = "top" | "bottom" | "start" | "end" | null | undefined;

const FOLLOW_OFFSET_BOTTOM = 16;
const FOLLOW_OFFSET_TOP = 6;
const FOLLOW_EASE = 0.35;

const Tooltip = ({
  anchorEl,
  text: main,
  dir,
  follow = false,
  pointerRef,
}: {
  anchorEl: Element;
  text: string;
  dir?: dirTyp;
  follow?: boolean;
  pointerRef?: { current: { x: number; y: number } };
}) => {
  const isRTLDir = isRTL();
  const isFollowing = follow && !!pointerRef;

  const getPlacement = (dir: dirTyp) => {
    if (!dir) return "bottom";
    switch (dir) {
      case "top":
        return "top";
      case "bottom":
        return "bottom";
      case "start":
        return isRTLDir ? "right" : "left";
      case "end":
        return isRTLDir ? "left" : "right";
      default:
        return "bottom";
    }
  };

  const getResolvedDir = (placement: string): dirTyp => {
    const side = placement.split("-")[0];
    switch (side) {
      case "top":
        return "top";
      case "bottom":
        return "bottom";
      case "left":
        return isRTLDir ? "end" : "start";
      case "right":
        return isRTLDir ? "start" : "end";
      default:
        return undefined;
    }
  };

  const getXoffset = () => {
    switch (dir) {
      case "end":
        return isRTLDir ? "4%" : "-4%";
      case "start":
        return isRTLDir ? "-4%" : "4%";
      default:
        return 0;
    }
  };

  const getYoffset = () => {
    switch (dir) {
      case "top":
        return "5%";
      case "bottom":
        return "-5%";
      default:
        return 0;
    }
  };

  const xOffset = getXoffset();
  const yOffset = getYoffset();

  const [arrowEl, setArrowEl] = useState<HTMLSpanElement | null>(null);

  const smooth = useRef({ x: 0, y: 0 });

  const virtualRef = useMemo(
    () => ({
      getBoundingClientRect: () => {
        const { x, y } = smooth.current;
        return {
          x,
          y,
          top: y,
          left: x,
          bottom: y,
          right: x,
          width: 0,
          height: 0,
        };
      },
    }),
    [],
  );

  const { refs, floatingStyles, middlewareData, placement, update } =
    useFloating({
      placement: isFollowing ? "bottom-start" : getPlacement(dir),
      strategy: "fixed",
      whileElementsMounted: isFollowing ? undefined : autoUpdate,
      middleware: isFollowing
        ? [
            offset(({ placement }) => ({
              mainAxis: placement.startsWith("top")
                ? FOLLOW_OFFSET_TOP
                : FOLLOW_OFFSET_BOTTOM,
              crossAxis: 8,
            })),
            flip(),
            shift({ padding: 8 }),
          ]
        : [flip(), shift({ padding: 8 }), arrow({ element: arrowEl })],
    });

  useEffect(() => {
    refs.setReference(isFollowing ? virtualRef : anchorEl);
  }, [anchorEl, isFollowing, virtualRef, refs]);

  useEffect(() => {
    if (!isFollowing || !pointerRef) return;

    let frame = 0;

    const tick = () => {
      const target = pointerRef.current;
      const dx = target.x - smooth.current.x;
      const dy = target.y - smooth.current.y;

      if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
        smooth.current.x += dx * FOLLOW_EASE;
        smooth.current.y += dy * FOLLOW_EASE;
        update();
      }

      frame = requestAnimationFrame(tick);
    };

    update();
    tick();

    return () => cancelAnimationFrame(frame);
  }, [isFollowing, pointerRef, update]);

  useEffect(() => {
    if (!isFollowing || !pointerRef) return;

    smooth.current.x = pointerRef.current.x;
    smooth.current.y = pointerRef.current.y;

    let frame = 0;

    const tick = () => {
      const target = pointerRef.current;
      const dx = target.x - smooth.current.x;
      const dy = target.y - smooth.current.y;

      if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
        smooth.current.x += dx * FOLLOW_EASE;
        smooth.current.y += dy * FOLLOW_EASE;
        update();
      }

      frame = requestAnimationFrame(tick);
    };

    update();
    tick();

    return () => cancelAnimationFrame(frame);
  }, [isFollowing, pointerRef, update]);

  const resolvedDir = getResolvedDir(placement);
  const showPointer = !!dir && !isFollowing;

  const getText = () => {
    const match = main.match(/^\$__(\S+)\s+(.*)$/);

    const title = match?.[1].replaceAll(".", " ");
    const text = match?.[2];

    if (!title?.trim()) {
      return { title: "", text: main };
    }

    return { title, text };
  };

  const { title, text } = getText();

  return (
    <div
      ref={(node) => {
        refs.setFloating(node);
      }}
      style={{
        ...floatingStyles,
        width: "fit-content",
        zIndex: 3000,
        pointerEvents: isFollowing ? "none" : undefined,
      }}
      className={showPointer ? `has-pointer` : "has-no-pointer"}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.99, x: xOffset, y: yOffset }}
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, scale: 0.99, x: xOffset, y: yOffset }}
        transition={{ ease: [0.17, 0.67, 0.3, 1.33], duration: 0.4 }}
        data-tp-pointer={isFollowing ? "none" : (resolvedDir ?? "none")}
        style={
          {
            "--arrow-x":
              middlewareData.arrow?.x != null
                ? `${middlewareData.arrow.x}px`
                : undefined,
            "--arrow-y":
              middlewareData.arrow?.y != null
                ? `${middlewareData.arrow.y}px`
                : undefined,
          } as React.CSSProperties
        }
        className="tooltip"
      >
        <div className="tooltip__category">{title}</div>
        <span dir="auto">{text}</span>
        {!isFollowing && (
          <span ref={setArrowEl} className="tooltip__arrow-anchor" />
        )}
      </motion.div>
    </div>
  );
};

export default Tooltip;
