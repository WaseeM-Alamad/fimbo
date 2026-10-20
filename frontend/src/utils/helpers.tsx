import type { Placement } from "@floating-ui/react";
import i18n from "../i18n";
import { getDir } from "./supportedLanguages";
import type { CSSProperties } from "react";

export const tempKillTransition = (className: string) => {
  if (!className.trim()) return;
  const body = document.body;
  body.classList.add(className);
  void body.offsetWidth;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      body.classList.remove(className);
    });
  });
};

export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function highlightMatch(text: string, search: string): React.ReactNode {
  const term = search.trim();
  if (!term) return text;
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="search-highlight">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export function toLogicalTransformOrigin(
  origin: string | CSSProperties["transformOrigin"],
) {
  const { language } = i18n;
  const dir = getDir(language);

  if (dir !== "rtl" || !origin) return origin;
  return origin
    .toString()
    .replace(/\bleft\b/, "__RIGHT__")
    .replace(/\bright\b/, "left")
    .replace("__RIGHT__", "right");
}

export function toLogicalPlacement(
  origin: Placement | undefined,
): Placement | undefined {
  const { language } = i18n;
  const dir = getDir(language);
  if (dir !== "rtl" || !origin) return origin;
  return origin
    .replace(/\bleft\b/, "__RIGHT__")
    .replace(/\bright\b/, "left")
    .replace("__RIGHT__", "right") as Placement;
}
