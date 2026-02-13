import { A } from "@solidjs/router";
import "./home.scss";

export const HomePage = () => {
  return (
    <div class="home-page">
      <div class="hero-section">
        <h1>Welcome to Echoo Platform</h1>
        <p>
          A unified platform with micro-frontend architecture, connecting
          multiple services and applications.
        </p>
      </div>

      <div class="cards-grid">
        {/* Echoo Platform Card */}
        <div class="app-card">
          <div class="card-header">
            <div class="icon-wrapper echoo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon echoo"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 8a6 6 0 0 0-6-6 6 6 0 0 0-6 6c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <h2>Echoo</h2>
            <p>Real-time notification and messaging system</p>
          </div>
          <p class="description">
            Send and receive real-time messages, manage notifications, and test
            your integration with our powerful API.
          </p>
          <div class="actions">
            <A href="/echoo" class="enter-btn echoo">
              Enter Echoo
            </A>
          </div>
        </div>

        {/* Blog Platform Card */}
        <div class="app-card">
          <div class="card-header">
            <div class="icon-wrapper blog">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon blog"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <h2>Blog</h2>
            <p>Modern blogging platform</p>
          </div>
          <p class="description">
            Create and manage blog posts, categorize content, and engage with
            your audience on our feature-rich blogging platform.
          </p>
          <div class="actions">
            <A href="/blog" class="enter-btn blog">
              Enter Blog
            </A>
          </div>
        </div>
      </div>

      <div class="footer-info">
        Built with SolidJS and Micro-frontend Architecture
      </div>
    </div>
  );
};
