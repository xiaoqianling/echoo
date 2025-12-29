import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BannerNotifications } from './BannerNotification';

export const Layout = (props: { children?: any }) => {
  return (
    <div class="flex h-screen bg-gray-50">
      <BannerNotifications />
      <Sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main class="flex-1 overflow-y-auto p-6">
          {props.children}
        </main>
      </div>
    </div>
  );
};
