import { BannerNotifications } from "../../../shared/components/BannerNotifications";
import { Header } from "../../../shared/components/Header";
import { Sidebar } from "../../../shared/components/Sidebar";
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
