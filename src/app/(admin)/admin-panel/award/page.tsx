import CrudManager from "@/components/admin/CrudManager";

export default function AwardAdminPage() {
  return (
    <CrudManager
      title="Awards"
      endpoint="award"
      primaryKey="title"
      secondaryKey="time"
      fields={[
        { name: "title", label: "Title" },
        { name: "desc", label: "Description", type: "textarea" },
        { name: "time", label: "Time", placeholder: "Nov 2025" },
        { name: "priority", label: "Priority (sort order)", type: "number" },
      ]}
    />
  );
}
