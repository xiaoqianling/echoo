export const BlogPage = () => {
  return (
    <div class="w-full">
      <div class="flex flex-col gap-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Blog Platform</h1>
          <p class="text-gray-600">Welcome to the Blog Platform - a mock expansion platform built with micro-frontend architecture.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Blog Posts Section */}
          <div class="md:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Latest Posts</h2>
            <div class="flex flex-col gap-4">
              <div class="border-b border-gray-200 pb-4">
                <h3 class="text-lg font-medium text-gray-800 mb-1">Blog Post Title 1</h3>
                <p class="text-gray-600 text-sm mb-2">Author: John Doe | Date: 2025-12-29</p>
                <p class="text-gray-700">This is a sample blog post content. In a real implementation, this would be dynamically loaded from the backend.</p>
              </div>
              
              <div class="border-b border-gray-200 pb-4">
                <h3 class="text-lg font-medium text-gray-800 mb-1">Blog Post Title 2</h3>
                <p class="text-gray-600 text-sm mb-2">Author: Jane Smith | Date: 2025-12-28</p>
                <p class="text-gray-700">This is another sample blog post content. The blog platform supports multiple authors and categories.</p>
              </div>
              
              <div>
                <h3 class="text-lg font-medium text-gray-800 mb-1">Blog Post Title 3</h3>
                <p class="text-gray-600 text-sm mb-2">Author: Mike Johnson | Date: 2025-12-27</p>
                <p class="text-gray-700">This is the third sample blog post. The micro-frontend architecture allows for easy extension of the platform.</p>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Categories</h2>
            <ul class="space-y-2">
              <li class="flex items-center space-x-2">
                <span class="text-blue-500">📝</span>
                <span class="text-gray-700">Technology</span>
              </li>
              <li class="flex items-center space-x-2">
                <span class="text-green-500">🌱</span>
                <span class="text-gray-700">Lifestyle</span>
              </li>
              <li class="flex items-center space-x-2">
                <span class="text-purple-500">💼</span>
                <span class="text-gray-700">Business</span>
              </li>
              <li class="flex items-center space-x-2">
                <span class="text-red-500">🎨</span>
                <span class="text-gray-700">Creativity</span>
              </li>
            </ul>
            
            <div class="mt-8">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">Popular Tags</h2>
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">#solidjs</span>
                <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">#microfrontend</span>
                <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">#blogging</span>
                <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">#technology</span>
                <span class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">#frontend</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Create Post Button */}
        <div class="flex justify-end">
          <button class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            + Create New Post
          </button>
        </div>
      </div>
    </div>
  );
};
