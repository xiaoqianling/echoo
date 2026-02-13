import { JSX } from 'solid-js';

interface Member {
  id: string;
  name: string;
  role: "owner" | "admin" | "member";
  email: string;
  joinedAt: string;
}

interface MemberItemProps {
  member: Member;
  organizationRole: string;
  onRemoveMember: (memberId: string) => void;
  onPromoteMember: (memberId: string) => void;
  formatDate: (dateString: string) => string;
}

export const MemberItem = (props: MemberItemProps): JSX.Element => {
  const { member, organizationRole, onRemoveMember, onPromoteMember, formatDate } = props;

  return (
    <div class="member-item">
      <div class="member-info">
        <div class="member-name">{member.name}</div>
        <div class="member-email">{member.email}</div>
        <div class="member-joined">
          加入时间: {formatDate(member.joinedAt)}
        </div>
      </div>
      <div class="member-role">{member.role}</div>
      <div class="member-actions">
        {(organizationRole === "owner" ||
          organizationRole === "admin") &&
          member.role === "member" && (
            <button 
              class="member-action-btn"
              onClick={() => onRemoveMember(member.id)}
            >
              移除
            </button>
          )}
        {organizationRole === "owner" &&
          member.role === "member" && (
            <button 
              class="member-action-btn"
              onClick={() => onPromoteMember(member.id)}
            >
              设为管理员
            </button>
          )}
      </div>
    </div>
  );
};