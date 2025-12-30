import { Show, onMount, createSignal } from "solid-js";
import { Router } from "@solidjs/router";
import "./index.css";
import { authStore, initializeAuth } from "./shared/stores/authStore";
import { routes } from "./lib/router";

const App = () => {
  const [isInitializing, setIsInitializing] = createSignal(true);

  onMount(async () => {
    await initializeAuth();
    setIsInitializing(false);
  });

  return (
    <Show
      when={!isInitializing()}
      fallback={
        <div class="flex justify-center items-center h-screen bg-gray-100">
          <div class="text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Initializing...</p>
          </div>
        </div>
      }
    >
      <Router children={routes} />
    </Show>
  );
};

export default App;
