"use client";

import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { ModalShell } from "./ModalShell";
import { TopBarButton } from "./TopBarButton";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmationModalProps) => {
  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={WarningCircle}
      maxWidthClass="max-w-[440px]"
      footer={
        <>
          <TopBarButton variant="secondary" type="button" onClick={onClose}>
            {cancelText}
          </TopBarButton>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex h-10 items-center rounded-xl bg-error px-5 font-manrope text-[14px] font-bold text-on-error shadow-sm transition-all hover:bg-error/90 active:scale-[0.98]"
          >
            {confirmText}
          </button>
        </>
      }
    >
      <p className="font-manrope text-[14px] font-medium leading-relaxed text-on-surface-variant">
        {message}
      </p>
    </ModalShell>
  );
};
