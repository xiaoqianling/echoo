import { JSX, createSignal } from 'solid-js';

interface CreateOrganizationModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => Promise<void>;
}

export const CreateOrganizationModal = (props: CreateOrganizationModalProps): JSX.Element => {
  const { isOpen, isLoading, onClose, onSubmit } = props;
  const [organizationName, setOrganizationName] = createSignal('');
  const [organizationDescription, setOrganizationDescription] = createSignal('');
  const [nameError, setNameError] = createSignal('');

  // 表单验证
  const validateForm = () => {
    if (!organizationName().trim()) {
      setNameError('组织名称不能为空');
      return false;
    } else if (organizationName().trim().length < 1) {
      setNameError('组织名称长度不能少于1个字符');
      return false;
    } else if (organizationName().trim().length > 50) {
      setNameError('组织名称长度不能超过50个字符');
      return false;
    } else {
      setNameError('');
      return true;
    }
  };

  // 重置表单
  const resetForm = () => {
    setOrganizationName('');
    setOrganizationDescription('');
    setNameError('');
  };

  // 关闭模态框
  const handleClose = () => {
    onClose();
    resetForm();
  };

  // 提交表单
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(organizationName().trim(), organizationDescription().trim());
      handleClose();
    }
  };

  return (
    <Show when={isOpen}>
      <div class="modal-backdrop" style="display: flex;" onClick={handleClose}>
        <div class="modal-container" onClick={(e) => e.stopPropagation()}>
          <div class="modal-header">
            <h2 class="modal-title">创建组织</h2>
            <button
              class="modal-close-btn"
              onClick={handleClose}
              disabled={isLoading}
            >
              ×
            </button>
          </div>
          <div class="modal-body">
            <form onSubmit={handleSubmit}>
              <div class="form-group">
                <label class="form-label">组织名称 *</label>
                <input
                  type="text"
                  class={`form-input ${nameError() ? 'form-input--error' : ''}`}
                  placeholder="请输入组织名称（1-50个字符）"
                  value={organizationName()}
                  onInput={(e) => setOrganizationName(e.target.value)}
                  disabled={isLoading}
                />
                <Show when={nameError()}>
                  <span class="form-error-message">{nameError()}</span>
                </Show>
              </div>
              <div class="form-group">
                <label class="form-label">组织描述</label>
                <textarea
                  class="form-textarea"
                  placeholder="请输入组织描述（可选）"
                  rows={4}
                  value={organizationDescription()}
                  onInput={(e) => setOrganizationDescription(e.target.value)}
                  disabled={isLoading}
                ></textarea>
              </div>
              <div class="form-actions">
                <button
                  type="button"
                  class="modal-cancel-btn"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  取消
                </button>
                <button
                  type="submit"
                  class="modal-submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? '创建中...' : '创建组织'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Show>
  );
};