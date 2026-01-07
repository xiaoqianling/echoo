import { Show } from "solid-js";
import { Navigate } from "@solidjs/router";
import "./styles.scss";
import { authStore } from "../../stores/authStore";

interface AuthGuardProps {
  children: any;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const AuthGuard = (props: AuthGuardProps) => {
  const requireAuth = props.requireAuth ?? true;
  const redirectTo = props.redirectTo ?? "/echoo/login";

  return (
    <Show
      when={authStore.isInitialized}
      fallback={
        <div class="auth-guard-loading">
          <div class="auth-guard-loading-container">
            <div class="auth-guard-loading-container-spinner"></div>
            <p class="auth-guard-loading-container-text">Loading...</p>
          </div>
        </div>
      }
    >
      <Show
        when={
          requireAuth ? authStore.isAuthenticated : !authStore.isAuthenticated
        }
        fallback={<Navigate href={redirectTo} />}
      >
        {props.children}
      </Show>
    </Show>
  );
};
