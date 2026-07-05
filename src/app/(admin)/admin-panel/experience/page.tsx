import CrudManager from "@/components/admin/CrudManager";

export default function ExperienceAdminPage() {
  return (
    <CrudManager
      title="Experience"
      endpoint="experience"
      primaryKey="role"
      secondaryKey="company"
      fields={[
        { name: "role", label: "Role", placeholder: "AI Intern" },
        { name: "company", label: "Company" },
        { name: "time", label: "Time", placeholder: "Mar 2026 - Jun 2026" },
        { name: "desc", label: "Description", type: "textarea" },
        { name: "priority", label: "Priority (sort order)", type: "number" },
      ]}
    />
  );
}
