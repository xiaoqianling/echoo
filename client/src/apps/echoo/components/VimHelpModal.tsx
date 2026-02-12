import { createSignal, onCleanup, onMount, Show } from "solid-js";
import "./VimHelpModal.scss";

export const VimHelpModal = () => {
  const [isOpen, setIsOpen] = createSignal(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    // Only toggle if not in an input
    const activeElement = document.activeElement;
    if (
      activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement ||
      activeElement?.isContentEditable
    ) {
      return;
    }

    if (e.key === "?" && e.shiftKey) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
    } else if (e.key === "Escape" && isOpen()) {
      setIsOpen(false);
    }
  };

  onMount(() => {
    window.addEventListener("keydown", handleKeyDown);
  });

  onCleanup(() => {
    window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <Show when={isOpen()}>
      <div class="vim-help-overlay" onClick={() => setIsOpen(false)}>
        <div class="vim-help-modal" onClick={(e) => e.stopPropagation()}>
          <div class="modal-header">
            <h3>Keyboard Shortcuts</h3>
            <button class="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div class="modal-content">
            <div class="shortcut-group">
              <h4>Navigation</h4>
              <div class="shortcut-item">
                <kbd>j</kbd> <span>Move Down</span>
              </div>
              <div class="shortcut-item">
                <kbd>k</kbd> <span>Move Up</span>
              </div>
            </div>
            <div class="shortcut-group">
              <h4>Actions</h4>
              <div class="shortcut-item">
                <kbd>Enter</kbd> <span>Select / Open</span>
              </div>
              <div class="shortcut-item">
                <kbd>x</kbd> <span>Delete / Archive</span>
              </div>
              <div class="shortcut-item">
                <kbd>Esc</kbd> <span>Clear Selection / Close</span>
              </div>
            </div>
             <div class="shortcut-group">
              <h4>General</h4>
              <div class="shortcut-item">
                <kbd>?</kbd> <span>Toggle Help</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
};
