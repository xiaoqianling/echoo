import { createSignal } from "solid-js";
import { Message } from "@echoo/api-types";
import "./styles.scss";

interface ToastNotificationProps {
  id: string;
  message: Message;
  onClose: () => void;
}

const BellIcon = () => (
  <svg
    class="toast-notification-icon-symbol"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);

export const ToastNotification = (props: ToastNotificationProps) => {
  const [el, setEl] = createSignal<HTMLDivElement | null>(null);

  return (
    <div ref={setEl} class="toast-notification">
      <div class="toast-notification-content">
        <div class="toast-notification-header">
          <div class="toast-notification-icon">
            <BellIcon />
          </div>
          <div class="toast-notification-body">
            <h3 class="toast-notification-title">New Message</h3>
            <p class="toast-notification-message">{props.message.title}</p>
            {props.message.short && (
              <p class="toast-notification-short">{props.message.short}</p>
            )}
          </div>
          <div class="toast-notification-close">
            <button
              onClick={() => {
                const element = el();
                if (element) {
                  element.classList.add("toast-notification-closing");
                  setTimeout(() => {
                    props.onClose();
                  }, 300);
                } else {
                  props.onClose();
                }
              }}
              class="toast-notification-close-button"
              aria-label="Close"
            >
              <svg
                class="toast-notification-close-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
