import { createSignal, onMount, onCleanup, JSX } from 'solid-js';
import './styles.scss';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmVariant?: 'primary' | 'danger';
}

export const ConfirmDialog = (props: ConfirmDialogProps) => {
  const [dialogEl, setDialogEl] = createSignal<HTMLDivElement | null>(null);

  // 点击ESC键关闭弹窗
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) {
      props.onCancel();
    }
  };

  // 点击外部关闭弹窗
  const handleClickOutside = (e: MouseEvent) => {
    if (dialogEl() && !dialogEl()?.contains(e.target as Node) && props.isOpen) {
      props.onCancel();
    }
  };

  // 生命周期钩子，添加和移除事件监听器
  onMount(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
  });

  onCleanup(() => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('mousedown', handleClickOutside);
  });

  if (!props.isOpen) {
    return null;
  }

  return (
    <div class="confirm-dialog-overlay">
      <div class="confirm-dialog" ref={setDialogEl}>
        <div class="confirm-dialog-header">
          <h3 class="confirm-dialog-title">{props.title}</h3>
          <button 
            class="confirm-dialog-close" 
            onClick={props.onCancel}
            aria-label="Close"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="confirm-dialog-body">
          <p class="confirm-dialog-message">{props.message}</p>
        </div>
        <div class="confirm-dialog-footer">
          <button 
            class="confirm-dialog-button confirm-dialog-button--cancel"
            onClick={props.onCancel}
          >
            {props.cancelText || 'Cancel'}
          </button>
          <button 
            class={`confirm-dialog-button confirm-dialog-button--${props.confirmVariant || 'primary'}`}
            onClick={props.onConfirm}
          >
            {props.confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;