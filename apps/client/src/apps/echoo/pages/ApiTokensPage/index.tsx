import { createSignal, createResource, Show, For } from "solid-js";
import { apiService } from "@services/api";
import { toast } from "@stores/toast";
import { ConfirmDialog } from "@rei-design/solid";
import { ApiToken } from "@echoo/api-types";
import "./styles.scss";

export const ApiTokensPage = () => {
  const [tokens, { refetch }] = createResource(() => apiService.getApiTokens());
  
  // Create Modal State
  const [showCreateModal, setShowCreateModal] = createSignal(false);
  const [newTokenName, setNewTokenName] = createSignal("");
  const [createdToken, setCreatedToken] = createSignal<string | null>(null);

  // Delete Dialog State
  const [tokenToDelete, setTokenToDelete] = createSignal<ApiToken | null>(null);

  const handleCreate = async () => {
    if (!newTokenName().trim()) return;

    try {
      const result = await apiService.createApiToken(newTokenName());
      setCreatedToken(result.token);
      refetch();
      toast.success("Token created successfully");
    } catch (error) {
      // Error handled globally
    }
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewTokenName("");
    setCreatedToken(null);
  };

  const handleDelete = async () => {
    const token = tokenToDelete();
    if (!token) return;

    try {
      await apiService.deleteApiToken(token.id);
      toast.success("Token deleted successfully");
      refetch();
    } catch (error) {
      // Error handled globally
    } finally {
      setTokenToDelete(null);
    }
  };

  const copyToken = () => {
    const token = createdToken();
    if (token) {
      navigator.clipboard.writeText(token);
      toast.success("Token copied to clipboard");
    }
  };

  return (
    <div class="api-tokens-page">
      <div class="page-header">
        <h1>API Tokens</h1>
        <button class="generate-btn" onClick={() => setShowCreateModal(true)}>
          Generate New Token
        </button>
      </div>

      <div class="tokens-list">
        <Show when={!tokens.loading} fallback={<div>Loading...</div>}>
          <Show when={tokens() && tokens()!.length > 0} fallback={
            <div class="empty-state">No API tokens found. Create one to get started.</div>
          }>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Token Prefix</th>
                  <th>Usage Count</th>
                  <th>Created At</th>
                  <th>Last Used</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <For each={tokens()}>
                  {(token) => (
                    <tr>
                      <td>{token.name}</td>
                      <td><span class="token-prefix">{token.prefix}</span></td>
                      <td>{token.usageCount}</td>
                      <td>{new Date(token.createdAt).toLocaleDateString()}</td>
                      <td>{token.lastUsedAt ? new Date(token.lastUsedAt).toLocaleString() : '-'}</td>
                      <td>
                        <button 
                          class="delete-btn"
                          onClick={() => setTokenToDelete(token)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </Show>
        </Show>
      </div>

      {/* Create Modal */}
      <Show when={showCreateModal()}>
        <div class="modal-overlay" onClick={closeCreateModal}>
          <div class="modal-content" onClick={(e) => e.stopPropagation()}>
            <Show when={!createdToken()} fallback={
              <>
                <h2>Token Generated</h2>
                <p class="warning-text">Make sure to copy your personal access token now. You won't be able to see it again!</p>
                <div class="token-display">
                  <code>{createdToken()}</code>
                  <button class="copy-btn" onClick={copyToken}>Copy</button>
                </div>
                <div class="modal-actions">
                  <button class="confirm-btn" onClick={closeCreateModal}>Done</button>
                </div>
              </>
            }>
              <h2>Generate New Token</h2>
              <div class="form-group">
                <label>Token Name</label>
                <input 
                  type="text" 
                  value={newTokenName()} 
                  onInput={(e) => setNewTokenName(e.currentTarget.value)}
                  placeholder="e.g. CI/CD Pipeline"
                  autofocus
                />
              </div>
              <div class="modal-actions">
                <button class="cancel-btn" onClick={closeCreateModal}>Cancel</button>
                <button class="confirm-btn" onClick={handleCreate}>Generate</button>
              </div>
            </Show>
          </div>
        </div>
      </Show>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!tokenToDelete()}
        title="Delete API Token"
        message={`Are you sure you want to delete the token "${tokenToDelete()?.name}"? This action cannot be undone and any applications using this token will stop working.`}
        onConfirm={handleDelete}
        onCancel={() => setTokenToDelete(null)}
      />
    </div>
  );
};
