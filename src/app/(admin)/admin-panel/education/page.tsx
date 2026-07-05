import CrudManager from "@/components/admin/CrudManager";

export default function EducationAdminPage() {
  return (
    <CrudManager
      title="Education"
      endpoint="education"
      primaryKey="degree"
      secondaryKey="school"
      fields={[
        { name: "degree", label: "Degree", placeholder: "BS in Artificial Intelligence" },
        { name: "school", label: "School" },
        { name: "detail", label: "Detail", type: "textarea", placeholder: "GPA, scholarship…" },
        { name: "time", label: "Time", placeholder: "2022 - 2026 | Completed" },
        { name: "language", label: "Language", placeholder: "English (IELTS 6.5)" },
        { name: "priority", label: "Priority (sort order)", type: "number" },
      ]}
    />
  );
}
