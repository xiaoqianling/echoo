import { For, createSignal } from 'solid-js';
import { notificationsStore } from '../stores/notificationsStore';
import { Message } from '../types';

interface ToastNotificationProps {
  id: string;
  message: Message;
  onClose: () => void;
}

export const ToastNotification = (props: ToastNotificationProps) => {
  const [el, setEl] = createSignal<HTMLDivElement | null>(null);

  return (
    <div
      ref={setEl}
      class="bg-white text-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 ease-out hover:shadow-xl max-w-md w-full"
      style={{ animation: 'slideInRight 0.3s ease-out forwards' }}
    >
      <div class="p-4">
        <div class="flex items-start space-x-4">
          <div class="flex-shrink-0 mt-1">
            <span class="text-xl text-blue-500">🔔</span>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-base">New Message</h3>
            <p class="text-gray-600 mt-1">{props.message.title}</p>
            {props.message.short && (
              <p class="text-sm text-gray-500 mt-1 line-clamp-2">{props.message.short}</p>
            )}
          </div>
          <div class="flex-shrink-0 ml-2">
            <button
              onClick={() => {
                const element = el();
                if (element) {
                  element.style.animation = 'slideOutRight 0.3s ease-in forwards';
                  setTimeout(() => {
                    props.onClose();
                  }, 300);
                } else {
                  props.onClose();
                }
              }}
              class="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-md transition-colors"
            >
              <span class="sr-only">Close</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BannerNotifications = () => {
  const unreadNotifications = () => 
    notificationsStore.notifications.filter(notification => !notification.read);

  const handleClose = (id: string) => {
    notificationsStore.markAsRead(id);
  };

  return (
    <div class="fixed top-4 right-4 z-50 space-y-4">
      <For each={unreadNotifications()}>
        {notification => (
          <ToastNotification
            id={notification.id}
            message={notification.message}
            onClose={() => handleClose(notification.id)}
          />
        )}
      </For>
    </div>
  );
};
