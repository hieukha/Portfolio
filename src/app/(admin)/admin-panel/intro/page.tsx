import SingletonForm from "@/components/admin/SingletonForm";

export default function IntroAdminPage() {
  return (
    <SingletonForm
      title="Intro / Hero"
      endpoint="intro"
      fields={[
        { name: "name", label: "Full name" },
        { name: "roles", label: "Typewriter roles", type: "list" },
        { name: "desc", label: "Short bio", type: "textarea" },
        { name: "image", label: "Avatar image URL" },
        { name: "cvFile", label: "CV / Resume URL" },
        { name: "github", label: "GitHub URL" },
        { name: "linkedin", label: "LinkedIn URL" },
        { name: "email", label: "Email" },
        { name: "phone", label: "Phone" },
      ]}
    />
  );
}
