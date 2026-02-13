import "../styles.scss";

export const BlogPage = () => {
  return (
    <div class="blog-page">
      <div class="welcome-card">
        <h1>Blog Platform</h1>
        <p>
          Welcome to the Blog Platform - a mock expansion platform built with
          micro-frontend architecture.
        </p>
      </div>

      <div class="content-grid">
        {/* Blog Posts Section */}
        <div class="posts-section">
          <h2>Latest Posts</h2>
          <div class="posts-list">
            <div class="post-item">
              <h3>Blog Post Title 1</h3>
              <p class="meta">Author: John Doe | Date: 2025-12-29</p>
              <p class="excerpt">
                This is a sample blog post content. In a real implementation,
                this would be dynamically loaded from the backend.
              </p>
            </div>

            <div class="post-item">
              <h3>Blog Post Title 2</h3>
              <p class="meta">Author: Jane Smith | Date: 2025-12-28</p>
              <p class="excerpt">
                This is another sample blog post content. The blog platform
                supports multiple authors and categories.
              </p>
            </div>

            <div class="post-item">
              <h3>Blog Post Title 3</h3>
              <p class="meta">Author: Mike Johnson | Date: 2025-12-27</p>
              <p class="excerpt">
                This is the third sample blog post. The micro-frontend
                architecture allows for easy extension of the platform.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div class="sidebar-section">
          <h2>Categories</h2>
          <ul class="categories-list">
            <li>
              <span class="icon tech">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
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
              </span>
              <span>Technology</span>
            </li>
            <li>
              <span class="icon life">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 2a10 10 0 0 0-10 10c0 5.52 4.48 10 10 10s10-4.48 10-10A10 10 0 0 0 12 2z" />
                  <path d="M8 12a4 4 0 0 1 4-4" />
                </svg>
              </span>
              <span>Lifestyle</span>
            </li>
            <li>
              <span class="icon biz">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </span>
              <span>Business</span>
            </li>
            <li>
              <span class="icon art">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="13.5" cy="6.5" r=".5" />
                  <circle cx="17.5" cy="10.5" r=".5" />
                  <circle cx="8.5" cy="7.5" r=".5" />
                  <circle cx="6.5" cy="12.5" r=".5" />
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.186 0 .385-.018.608-.051.78-.118 1.082-.792.812-1.398-.22-.49-.39-1.296.065-1.878.616-.789 1.32-1.282 2.37-1.345.867-.052 1.433-.666 1.76-1.125.467-.655.826-1.394 1.385-1.933.74-.714 1.15-1.077 1.55-2.27.143-.424.316-.62.45-1.05.51-1.65-.24-3.4-1.76-4.95-1.52-1.56-3.7-2-6-2h-1.2z" />
                </svg>
              </span>
              <span>Creativity</span>
            </li>
          </ul>

          <div class="tags-section">
            <h2>Popular Tags</h2>
            <div class="tags-cloud">
              <span class="tag blue">#solidjs</span>
              <span class="tag green">#microfrontend</span>
              <span class="tag purple">#blogging</span>
              <span class="tag yellow">#technology</span>
              <span class="tag red">#frontend</span>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Button */}
      <div class="actions">
        <button class="create-btn">+ Create New Post</button>
      </div>
    </div>
  );
};
