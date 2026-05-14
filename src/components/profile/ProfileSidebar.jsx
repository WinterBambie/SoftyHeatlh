import { memo } from "react";
import SectionTab from "../ui/SectionTab";

const ProfileSidebar = memo(function ProfileSidebar({
  name,
  subtitle,
  tabs,
  activeTab,
  onTabChange,
  cardStyle,
  avatarBg      = "#E8F0FE",
  avatarContent,
  primaryColor  = "#0A76D8",
  textColor     = "var(--textcolor)",
  mutedColor    = "#666",
}) {
  return (
    <div style={{ ...cardStyle, padding: "0.75rem" }}>
      {/* Avatar + nombre */}
      <div style={{
        textAlign: "center",
        padding: "1rem 0.5rem 1.25rem",
        borderBottom: "1px solid var(--bordercolor)",
        marginBottom: "0.5rem",
      }}>
        <div style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: avatarBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 0.5rem",
        }}>
          {avatarContent}
        </div>
        <p style={{ margin: 0, fontWeight: 500, fontSize: "13px", color: textColor }}>
          {name}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: "11px", color: mutedColor }}>
          {subtitle}
        </p>
      </div>

      {/* Tabs */}
      {tabs.map((t) => (
        <SectionTab
          key={t.key}
          icon={t.icon}
          label={t.label}
          active={activeTab === t.key}
          onClick={() => onTabChange(t.key)}
          primaryColor={primaryColor}
          textColor={textColor}
        />
      ))}
    </div>
  );
});

export default ProfileSidebar;