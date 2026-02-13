import { BannerNotifications } from "@components/BannerNotifications";
import { Header } from "@components/Header";
import { Sidebar } from "@components/Sidebar";
import { VimHelpModal } from "./VimHelpModal";
import "../layout.scss";

export const EchooLayout = (props: { children?: any }) => {
  return (
    <div class="echoo-layout">
      <BannerNotifications />
      <Header />
      <div class="layout-body">
        <Sidebar />
        <main class="layout-main">{props.children}</main>
      </div>
      <VimHelpModal />
    </div>
  );
};
