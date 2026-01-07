import { For } from 'solid-js';
import { notificationsStore } from '../../stores/notificationsStore';
import { ToastNotification } from '../ToastNotification';
import './styles.scss';

export const BannerNotifications = () => {
  const unreadNotifications = () => 
    notificationsStore.notifications.filter(notification => !notification.read);

  const handleClose = (id: string) => {
    notificationsStore.markAsRead(id);
  };

  return (
    <div class="banner-notifications">
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