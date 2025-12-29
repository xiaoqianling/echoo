import { Show, Suspense } from "solid-js";
import { Router, Route, Navigate } from "@solidjs/router";
import "./index.css";
import { LoginPage } from "./apps/echoo/pages/LoginPage";
import { RegisterPage } from "./apps/echoo/pages/RegisterPage";
import { MessagesPage } from "./apps/echoo/pages/MessagesPage";
import { DashboardPage } from "./apps/echoo/pages/DashboardPage";
import TestPage from "./apps/echoo/pages/TestPage";
import { SettingsPage } from "./apps/echoo/pages/SettingsPage";
import { EchooLayout } from "./apps/echoo/components/EchooLayout";
import { BlogPage } from "./apps/blog/pages/BlogPage";
import { BlogLayout } from "./apps/blog/components/BlogLayout";
import { HomePage } from "./pages/HomePage";
import { authStore } from "./shared/stores/authStore";
import { routes } from "./lib/router";

const App = () => {
  const isAuthenticated = authStore.isAuthenticated;
  const isLoading = authStore.isLoading;

  if (isLoading) {
    return (
      <div class="flex justify-center items-center h-screen">Loading...</div>
    );
  }

  return (
    <Router children={routes} />
    // <Router>
    //   {/* Public routes */}
    //   <Route path="/login" component={LoginPage} />
    //   <Route path="/register" component={RegisterPage} />

    //   {/* Home Page - Root Route */}
    //   <Route path="/" component={HomePage} />

    //   {/* Protected routes */}
    //   {/* Echoo Platform Routes */}
    //   <Route path="/echoo" component={EchooLayout}>
    //     <Route path="" component={DashboardPage} />
    //     <Route path="messages" component={MessagesPage} />
    //     <Route path="test" component={TestPage} />
    //     <Route path="settings" component={SettingsPage} />
    //     <Route path="login" component={() => <Navigate href="/echoo" />} />
    //     <Route path="register" component={() => <Navigate href="/echoo" />} />
    //   </Route>

    //   {/* Blog Platform Routes */}
    //   <Route path="/blog" component={BlogLayout}>
    //     <Route path="" component={BlogPage} />
    //   </Route>

    //   {/* Redirect to home if authenticated, otherwise to login */}
    //   <Route path="*" component={() => !isAuthenticated ? <Navigate href="/login" /> : <Navigate href="/" />} />
    // </Router>
  );
};

export default App;
