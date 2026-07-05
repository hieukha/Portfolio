import CrudManager from "@/components/admin/CrudManager";

export default function SkillAdminPage() {
  return (
    <CrudManager
      title="Skills"
      endpoint="skill"
      primaryKey="name"
      secondaryKey="category"
      fields={[
        { name: "name", label: "Skill name", placeholder: "PyTorch" },
        {
          name: "category",
          label: "Category",
          placeholder: "language | ai/ml | backend | database | tools | other",
        },
        { name: "priority", label: "Priority (sort order)", type: "number" },
      ]}
    />
  );
}
