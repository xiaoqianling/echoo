import { Show, onMount, createSignal, onCleanup } from "solid-js";
import { Router } from "@solidjs/router";
import { authStore, initializeAuth } from "@stores/authStore";
import { useTheme } from "@stores/themeStore"; // Import theme store
import { routes } from "@/lib/router";
import { ToastContainer } from "@components/toast";
import { AemeathBackground } from "@rei-design/solid";

const App = () => {
  const [isInitializing, setIsInitializing] = createSignal(true);
  // Initialize theme effect
  const { theme } = useTheme();

  const handleGlobalClick = (e: MouseEvent) => {
    // Interactive Heart Effect - Only for Aemeath theme
    if (theme() !== "aemeath") return;

    const heart = document.createElement("div");
    heart.className = "click-heart";
    heart.style.left = `${e.clientX}px`;
    heart.style.top = `${e.clientY}px`;

    // Random rotation for more natural feel
    const rotation = Math.random() * 60 - 30;
    heart.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

    // Set color (Fixed to Aemeath style since it's exclusive)
    const color = "#ff6b8b";

    heart.innerHTML = `
      <svg viewBox="0 0 24 24" fill="${color}" width="20" height="20">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    `;

    document.body.appendChild(heart);

    // Remove after animation
    setTimeout(() => {
      heart.remove();
    }, 1000);
  };

  onMount(async () => {
    await initializeAuth();
    setIsInitializing(false);
    document.addEventListener("click", handleGlobalClick);
  });

  onCleanup(() => {
    document.removeEventListener("click", handleGlobalClick);
  });

  return (
    <>
      <ToastContainer />
      <Show when={theme() === "aemeath"}>
        <AemeathBackground />
      </Show>
      <Show
        when={!isInitializing()}
        fallback={
          <div class="app-loading">
            <div class="loading-content">
              <div class="spinner"></div>
              <p>Initializing...</p>
            </div>
          </div>
        }
      >
        <Router children={routes} />
      </Show>
    </>
  );
};

export default App;
