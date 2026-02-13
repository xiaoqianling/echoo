import { JSX } from 'solid-js';

interface Organization {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  role: "owner" | "admin" | "member";
  createdAt: string;
}

interface OrganizationCardProps {
  organization: Organization;
  isSelected: boolean;
  isDetailOpen: boolean;
  formatDate: (dateString: string) => string;
  onSelect: (org: Organization) => void;
  onViewDetail: (org: Organization) => void;
  onDelete: (orgId: string) => void;
}

export const OrganizationCard = (props: OrganizationCardProps): JSX.Element => {
  const { 
    organization, 
    isSelected, 
    isDetailOpen, 
    formatDate, 
    onSelect, 
    onViewDetail, 
    onDelete 
  } = props;

  return (
    <div
      class={`organization-card ${isSelected ? "active" : ""}`}
      onClick={() => onSelect(organization)}
    >
      <div class="organization-card-header">
        <h3 class="organization-card-name">{organization.name}</h3>
        <div class="organization-card-role">{organization.role}</div>
      </div>
      <p class="organization-card-description">{organization.description}</p>
      <div class="organization-card-footer">
        <div class="organization-card-meta">
          <span>{organization.memberCount} 成员</span>
          <span>{formatDate(organization.createdAt)}</span>
        </div>
        <Show when={!isDetailOpen}>
          <div class="organization-card-actions">
            <button
              class="organization-card-view-btn"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetail(organization);
              }}
            >
              查看详情
            </button>
            {organization.role === "owner" && (
              <button
                class="organization-card-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(organization.id);
                }}
              >
                解散
              </button>
            )}
          </div>
        </Show>
      </div>
    </div>
  );
};