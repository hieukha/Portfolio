import CrudManager from "@/components/admin/CrudManager";

export default function ProjectAdminPage() {
  return (
    <CrudManager
      title="Projects"
      endpoint="project"
      primaryKey="name"
      secondaryKey="desc"
      fields={[
        { name: "name", label: "Project name" },
        { name: "desc", label: "Description", type: "textarea" },
        { name: "tech", label: "Tech stack", type: "list", placeholder: "Whisper, FastAPI, Gemini" },
        { name: "repo", label: "GitHub URL", placeholder: "https://github.com/..." },
        { name: "live", label: "Live URL (optional)" },
        { name: "image", label: "Image URL (optional)" },
        {
          name: "tone",
          label: "Gradient (fallback when no image)",
          placeholder: "from-blue-500 to-cyan-400",
        },
        { name: "priority", label: "Priority (sort order)", type: "number" },
      ]}
    />
  );
}
