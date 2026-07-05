import SingletonForm from "@/components/admin/SingletonForm";

export default function AboutAdminPage() {
  return (
    <SingletonForm
      title="About"
      endpoint="about"
      fields={[
        { name: "desc", label: "About paragraph", type: "textarea" },
        { name: "email", label: "Email" },
        { name: "phone", label: "Phone" },
        { name: "location", label: "Location" },
      ]}
    />
  );
}
