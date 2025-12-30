import { Show } from "solid-js";
import { Navigate } from "@solidjs/router";
import { authStore } from "../stores/authStore";

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
        <div class="flex justify-center items-center h-screen bg-gray-100">
          <div class="text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <Show
        when={requireAuth ? authStore.isAuthenticated : !authStore.isAuthenticated}
        fallback={<Navigate href={redirectTo} />}
      >
        {props.children}
      </Show>
    </Show>
  );
};