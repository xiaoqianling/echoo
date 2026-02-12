import { createSignal } from "solid-js";
import { authStore } from "../../../shared/stores/authStore";
import { toast } from "../../../shared/stores/toast";
import { A } from "@solidjs/router";
import "./auth.scss";

export const LoginPage = () => {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await authStore.login(email(), password());
      toast.success("登录成功！");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "登录失败";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="auth-container">
      <div class="auth-card">
        <h2 class="auth-title">Login to Echoo</h2>

        {error() && <div class="auth-error">{error()}</div>}

        <form onSubmit={handleSubmit}>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input
              type="email"
              class="form-input"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input
              type="password"
              class="form-input"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              required
            />
          </div>

          <button type="submit" class="submit-btn" disabled={isLoading()}>
            {isLoading() ? "Logging in..." : "Login"}
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Don't have an account? <A href="/echoo/register">Register here</A>
          </p>
        </div>
      </div>
    </div>
  );
};
