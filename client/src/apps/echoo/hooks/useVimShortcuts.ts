import { createSignal, onCleanup, onMount, createEffect, Accessor } from "solid-js";

interface UseVimShortcutsOptions {
  itemsLength: Accessor<number>;
  initialIndex?: number;
  onEnter?: (index: number) => void;
  onDelete?: (index: number) => void;
  onEscape?: () => void;
  enabled?: Accessor<boolean>;
}

export function useVimShortcuts(options: UseVimShortcutsOptions) {
  const [selectedIndex, setSelectedIndex] = createSignal(options.initialIndex ?? -1);
  const [isVimModeActive, setIsVimModeActive] = createSignal(true);

  const handleKeyDown = (e: KeyboardEvent) => {
    // Disable if focus is on an input or textarea
    const activeElement = document.activeElement;
    const isInputActive =
      activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement ||
      activeElement?.isContentEditable;

    if (isInputActive && e.key !== "Escape") {
      return;
    }

    if (options.enabled && !options.enabled()) {
        return;
    }

    // Ignore if modifier keys are pressed (except Shift)
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    switch (e.key) {
      case "j":
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = prev + 1;
          return next >= options.itemsLength() ? 0 : next;
        });
        break;
      case "k":
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = prev - 1;
          return next < 0 ? options.itemsLength() - 1 : next;
        });
        break;
      case "x":
        if (options.onDelete && selectedIndex() !== -1) {
          e.preventDefault();
          options.onDelete(selectedIndex());
        }
        break;
      case "Enter":
        if (options.onEnter && selectedIndex() !== -1) {
          e.preventDefault();
          options.onEnter(selectedIndex());
        }
        break;
      case "Escape":
        e.preventDefault();
        if (isInputActive && activeElement instanceof HTMLElement) {
          activeElement.blur();
        } else {
          setSelectedIndex(-1);
          options.onEscape?.();
        }
        break;
    }
  };

  onMount(() => {
    window.addEventListener("keydown", handleKeyDown);
  });

  onCleanup(() => {
    window.removeEventListener("keydown", handleKeyDown);
  });

  // Reset index if items length changes and index is out of bounds
  createEffect(() => {
      const len = options.itemsLength();
      if (selectedIndex() >= len) {
          setSelectedIndex(len > 0 ? len - 1 : -1);
      }
  });

  return {
    selectedIndex,
    setSelectedIndex,
    isVimModeActive
  };
}
