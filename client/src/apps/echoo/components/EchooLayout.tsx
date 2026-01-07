import { BannerNotifications } from "../../../shared/components/BannerNotifications";
import { Header } from "../../../shared/components/Header";
import { Sidebar } from "../../../shared/components/Sidebar";

export const EchooLayout = (props: { children?: any }) => {
  return (
    <div class="flex h-screen bg-gray-50">
      <BannerNotifications />
      <Sidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main class="flex-1 overflow-y-auto p-6">{props.children}</main>
      </div>
    </div>
  );
};
