import { onMount, createSignal, Show } from "solid-js";
import { A } from "@solidjs/router";
import { apiService } from "@services/api";
import "./landing.scss";

interface Stats {
  userCount: number;
  orgCount: number;
  messageCount: number;
}

export const LandingPage = () => {
  const [stats, setStats] = createSignal<Stats | null>(null);

  onMount(async () => {
    try {
      const data = await apiService.getStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }

    // Scroll Observer for animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll(".scroll-section").forEach((el) => {
      observer.observe(el);
    });
  });

  return (
    <div class="landing-page">
      {/* Section 1: Hero */}
      <section class="scroll-section hero-section">
        <div class="content-wrapper">
          <h1 class="hero-title">
            <span class="gradient-text">Echoo</span>
            <br />
            Your Unified Notification Center
          </h1>
          <p class="hero-subtitle">
            Seamlessly push messages from any source to your devices. 
            Real-time, reliable, and developer-friendly.
          </p>
          <div class="cta-group">
            <A href="/echoo/dashboard" class="btn btn-primary">
              Go to Dashboard
            </A>
            <A href="https://github.com/your-repo/echoo" target="_blank" class="btn btn-outline">
              View on GitHub
            </A>
          </div>
        </div>
        <div class="scroll-indicator">
          <span>Scroll Down</span>
          <div class="arrow">↓</div>
        </div>
      </section>

      {/* Section 2: Value Proposition */}
      <section class="scroll-section value-section">
        <div class="content-wrapper">
          <h2 class="section-title">Why Echoo?</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="icon">🚀</div>
              <h3>Instant Delivery</h3>
              <p>Push notifications arrive in milliseconds via WebSocket.</p>
            </div>
            <div class="feature-card">
              <div class="icon">🔌</div>
              <h3>Simple API</h3>
              <p>One simple HTTP request to send messages from anywhere.</p>
            </div>
            <div class="feature-card">
              <div class="icon">🛡️</div>
              <h3>Secure & Private</h3>
              <p>End-to-end encryption and strict access controls.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Stats */}
      <section class="scroll-section stats-section">
        <div class="content-wrapper">
          <h2 class="section-title">Growing Fast</h2>
          <div class="stats-container">
            <div class="stat-item">
              <span class="stat-number">
                {stats()?.userCount || "-"}
              </span>
              <span class="stat-label">Users</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">
                {stats()?.orgCount || "-"}
              </span>
              <span class="stat-label">Organizations</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">
                {stats()?.messageCount || "-"}
              </span>
              <span class="stat-label">Messages Delivered</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Call to Action */}
      <section class="scroll-section cta-section">
        <div class="content-wrapper">
          <h2 class="section-title">Ready to get started?</h2>
          <p class="cta-text">
            Join the community and start streamlining your notifications today.
          </p>
          <A href="/echoo/register" class="btn btn-large btn-primary">
            Create Free Account
          </A>
        </div>
        <footer class="landing-footer">
          <p>© 2024 Echoo. All rights reserved.</p>
        </footer>
      </section>
    </div>
  );
};
