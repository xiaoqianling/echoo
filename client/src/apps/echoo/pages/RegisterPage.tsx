import { createSignal } from "solid-js";
import { authStore } from "../../../shared/stores/authStore";
import { toast } from "../../../shared/stores/toast";
import { A } from "@solidjs/router";

export const RegisterPage = () => {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [name, setName] = createSignal("");
  const [error, setError] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await authStore.register(email(), password(), name());
      toast.success("注册成功！");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "注册失败";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="flex justify-center items-center min-h-screen bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
          Register for Echoo
        </h2>

        {error() && (
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error()}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              required
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              required
            />
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              required
              minLength={6}
            />
            <p class="text-xs text-gray-500 mt-1">
              Password must be at least 6 characters
            </p>
          </div>

          <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
            disabled={isLoading()}
          >
            {isLoading() ? "Registering..." : "Register"}
          </button>
        </form>

        <div class="mt-4 text-center">
          <p class="text-gray-600">
            Already have an account?{" "}
            <A
              href="/echoo/login"
              class="text-blue-600 hover:text-blue-800 font-medium"
            >
              Login here
            </A>
          </p>
        </div>
      </div>
    </div>
  );
};
