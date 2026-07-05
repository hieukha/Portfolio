import CrudManager from "@/components/admin/CrudManager";

export default function BlogAdminPage() {
  return (
    <CrudManager
      title="Blog"
      endpoint="blog"
      primaryKey="title"
      secondaryKey="tags"
      fields={[
        { name: "title", label: "Title" },
        { name: "image", label: "Cover image URL (optional)" },
        { name: "tags", label: "Tags", type: "list", placeholder: "AI, RAG, LLM" },
        {
          name: "content",
          label: "Content (Markdown supported)",
          type: "textarea",
          placeholder: "Write your post...",
        },
      ]}
    />
  );
}
