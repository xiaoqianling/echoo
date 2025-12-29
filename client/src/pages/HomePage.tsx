import { A } from '@solidjs/router';

export const HomePage = () => {
  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-gray-800 mb-4">Welcome to Echoo Platform</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          A unified platform with micro-frontend architecture, connecting multiple services and applications.
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Echoo Platform Card */}
        <div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-200">
          <div class="text-center mb-6">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-blue-600 text-4xl">📢</span>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Echoo</h2>
            <p class="text-gray-600">Real-time notification and messaging system</p>
          </div>
          <p class="text-gray-700 mb-6">
            Send and receive real-time messages, manage notifications, and test your integration with our powerful API.
          </p>
          <div class="flex justify-center">
            <A 
              href="/echoo" 
              class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Enter Echoo
            </A>
          </div>
        </div>
        
        {/* Blog Platform Card */}
        <div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-200">
          <div class="text-center mb-6">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-green-600 text-4xl">📝</span>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Blog</h2>
            <p class="text-gray-600">Modern blogging platform</p>
          </div>
          <p class="text-gray-700 mb-6">
            Create and manage blog posts, categorize content, and engage with your audience on our feature-rich blogging platform.
          </p>
          <div class="flex justify-center">
            <A 
              href="/blog" 
              class="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Enter Blog
            </A>
          </div>
        </div>
      </div>
      
      <div class="mt-12 text-gray-500 text-sm">
        Built with SolidJS and Micro-frontend Architecture
      </div>
    </div>
  );
};
