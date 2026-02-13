import { Header } from "../Header";
import { Sidebar } from "../Sidebar";
import { BannerNotifications } from "../BannerNotifications";
import "./styles.scss";

export const Layout = (props: { children?: any }) => {
  return (
    <div class="layout">
      <BannerNotifications />
      <Sidebar />
      <div class="layout-main">
        <Header />
        <main class="layout-content">{props.children}</main>
      </div>
    </div>
  );
};
