import { useCallback, useEffect, useRef, useState } from "react";

interface UseHoverPopoverResult {
  anchorElement: HTMLElement | null;
  isOpen: boolean;

  openPopover(element: HTMLElement): void;
  closePopover(): void;
  scheduleClose(): void;
  clearCloseTimer(): void;
}

export function useHoverPopover(closeDelayMs = 200): UseHoverPopoverResult {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  const closeTimerRef = useRef<number | null>(null);

  const clearCloseTimer = useCallback((): void => {
    if (closeTimerRef.current === null) {
      return;
    }

    window.clearTimeout(closeTimerRef.current);

    closeTimerRef.current = null;
  }, []);

  const openPopover = useCallback(
    (element: HTMLElement): void => {
      clearCloseTimer();
      setAnchorElement(element);
    },
    [clearCloseTimer],
  );

  const closePopover = useCallback((): void => {
    clearCloseTimer();
    setAnchorElement(null);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback((): void => {
    clearCloseTimer();

    closeTimerRef.current = window.setTimeout(() => {
      setAnchorElement(null);
      closeTimerRef.current = null;
    }, closeDelayMs);
  }, [clearCloseTimer, closeDelayMs]);

  useEffect(() => {
    return () => {
      clearCloseTimer();
    };
  }, [clearCloseTimer]);

  return {
    anchorElement,
    isOpen: anchorElement !== null,

    openPopover,
    closePopover,
    scheduleClose,
    clearCloseTimer,
  };
}
