import { A } from "@solidjs/router";
import "../styles.scss";

export const BlogLayout = (props: { children?: any }) => {
  return (
    <div class="blog-layout">
      {/* Blog-specific Header */}
      <header class="blog-header">
        <div class="header-content">
          <div class="brand">
            <A href="/" class="home-link">
              <span>🏠</span>
              <span>Home</span>
            </A>
            <span class="separator">/</span>
            <span class="app-name">Blog</span>
          </div>
          <nav class="nav-links">
            <A href="/blog">Home</A>
            <A href="/blog/posts">Posts</A>
            <A href="/blog/categories">Categories</A>
            <A href="/blog/tags">Tags</A>
          </nav>
        </div>
      </header>

      {/* Blog Content */}
      <main class="blog-main">{props.children}</main>

      {/* Blog-specific Footer */}
      <footer class="blog-footer">
        <div class="footer-content">
          <p>© 2025 Blog Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
