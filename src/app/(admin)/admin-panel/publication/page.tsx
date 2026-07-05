import CrudManager from "@/components/admin/CrudManager";

export default function PublicationAdminPage() {
  return (
    <CrudManager
      title="Publications"
      endpoint="publication"
      primaryKey="title"
      secondaryKey="desc"
      fields={[
        { name: "title", label: "Title" },
        { name: "desc", label: "Description / venue", type: "textarea" },
        { name: "href", label: "Link / DOI (optional)" },
        { name: "priority", label: "Priority (sort order)", type: "number" },
      ]}
    />
  );
}
