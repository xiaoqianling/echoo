import { A } from '@solidjs/router';

export const BlogLayout = (props: { children?: any }) => {
  return (
    <div class="min-h-screen bg-gray-50">
      {/* Blog-specific Header */}
      <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div class="flex justify-between items-center max-w-7xl mx-auto">
          <div class="flex items-center space-x-4">
            <A href="/" class="text-2xl font-bold text-gray-800 flex items-center space-x-2">
              <span>🏠</span>
              <span>Home</span>
            </A>
            <span class="text-gray-400">/</span>
            <span class="text-xl font-semibold text-blue-600">Blog</span>
          </div>
          <nav class="flex items-center space-x-6">
            <A href="/blog" class="text-gray-600 hover:text-blue-600 font-medium">Home</A>
            <A href="/blog/posts" class="text-gray-600 hover:text-blue-600 font-medium">Posts</A>
            <A href="/blog/categories" class="text-gray-600 hover:text-blue-600 font-medium">Categories</A>
            <A href="/blog/tags" class="text-gray-600 hover:text-blue-600 font-medium">Tags</A>
          </nav>
        </div>
      </header>
      
      {/* Blog Content */}
      <main class="max-w-7xl mx-auto px-6 py-8">
        {props.children}
      </main>
      
      {/* Blog-specific Footer */}
      <footer class="bg-white shadow-inner border-t border-gray-200 mt-12 py-8">
        <div class="max-w-7xl mx-auto px-6 text-center text-gray-600">
          <p>© 2025 Blog Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
