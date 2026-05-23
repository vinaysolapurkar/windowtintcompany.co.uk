import { PageHeader } from "../../../_components/page-header";
import { ServiceForm } from "../service-form";

export default function NewServicePage() {
  return (
    <>
      <PageHeader
        title="New service"
        breadcrumb={[{ label: "Services", href: "/admin/services" }, { label: "New" }]}
      />
      <div className="p-6 lg:p-10">
        <ServiceForm />
      </div>
    </>
  );
}
