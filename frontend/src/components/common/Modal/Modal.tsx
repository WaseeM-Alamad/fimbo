import { type KeyboardEvent, type ReactNode, type Ref } from "react";
import "./Modal.scss";
import { motion } from "framer-motion";
import { useModal } from "../../../context/ModalContext";

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  ref: Ref<HTMLDivElement>;
}

function Modal({ children, isOpen, ref }: ModalProps) {
  const { hideModal } = useModal();

  const handleKeydown = (e: KeyboardEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.key !== "Escape") return;
    hideModal();
  };

  return (
    <motion.div
      onKeyDown={handleKeydown}
      tabIndex={1}
      ref={ref}
      initial={{
        transform: "translate(-50%, -40%) scale(0.95)",
        opacity: 0,
      }}
      animate={{
        transform: isOpen
          ? "translate(-50%, -40%) scale(1)"
          : "translate(-50%, -40%) scale(0.95)",
        opacity: isOpen ? 1 : 0,
      }}
      exit={{
        transform: "translate(-50%, -40%) scale(0.95)",
        opacity: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 40,
        mass: 1.05,
      }}
      className="modal"
    >
      {children}
    </motion.div>
  );
}

export default Modal;
