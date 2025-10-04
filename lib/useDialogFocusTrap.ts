import { useCallback, useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';

type UseDialogFocusTrapOptions = {
  /**
   * Optional ref for the element that should receive focus when the dialog opens.
   */
  initialFocusRef?: RefObject<HTMLElement | null>;
};

const getFocusableElements = (container: HTMLElement) => {
  const focusable = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter(
    element =>
      !element.hasAttribute('disabled') &&
      element.getAttribute('aria-hidden') !== 'true' &&
      !element.hasAttribute('data-focus-guard')
  );

  return focusable;
};

export default function useDialogFocusTrap(
  isOpen: boolean,
  dialogRef: RefObject<HTMLElement | null>,
  options: UseDialogFocusTrapOptions = {}
) {
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const { initialFocusRef } = options;

  const focusFirstElement = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
      return;
    }

    const focusable = getFocusableElements(dialog);
    const first = focusable[0];

    if (first) {
      first.focus();
      return;
    }

    if (!dialog.hasAttribute('tabindex')) {
      dialog.setAttribute('tabindex', '-1');
    }
    dialog.focus();
  }, [dialogRef, initialFocusRef]);

  const focusLastElement = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    const focusable = getFocusableElements(dialog);
    const last = focusable[focusable.length - 1];

    if (last) {
      last.focus();
      return;
    }

    dialog.focus();
  }, [dialogRef]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    previouslyFocusedElement.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const frame = window.requestAnimationFrame(() => {
      focusFirstElement();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !dialogRef.current) {
        return;
      }

      const focusable = getFocusableElements(dialogRef.current);

      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const { activeElement } = document;

      if (event.shiftKey) {
        if (activeElement === first || activeElement === dialogRef.current) {
          event.preventDefault();
          last.focus();
        }
      } else if (activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [dialogRef, focusFirstElement, isOpen]);

  const handleFocusStart = useCallback(() => {
    focusLastElement();
  }, [focusLastElement]);

  const handleFocusEnd = useCallback(() => {
    focusFirstElement();
  }, [focusFirstElement]);

  return {
    onFocusStartGuard: handleFocusStart,
    onFocusEndGuard: handleFocusEnd,
  };
}
