import { PageHeader } from "../../../_components/page-header";
import { ShowcaseForm } from "../showcase-form";

export default function NewProjectPage() {
  return (
    <>
      <PageHeader
        title="New showcase project"
        breadcrumb={[{ label: "Showcase", href: "/admin/showcase" }, { label: "New" }]}
      />
      <div className="p-6 lg:p-10">
        <ShowcaseForm />
      </div>
    </>
  );
}
