import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "../../../_components/page-header";
import { ServiceForm } from "../service-form";

export default async function EditServicePage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  if (id === "new") return null;
  const service = await db.service.findUnique({ where: { id } });
  if (!service) notFound();
  return (
    <>
      <PageHeader
        title={service.name}
        breadcrumb={[{ label: "Services", href: "/admin/services" }, { label: service.name }]}
      />
      <div className="p-6 lg:p-10">
        <ServiceForm
          service={{
            id: service.id,
            slug: service.slug,
            name: service.name,
            tagline: service.tagline,
            shortDesc: service.shortDesc,
            description: service.description,
            icon: service.icon,
            features: service.features,
            vlt: service.vlt,
            uvBlock: service.uvBlock,
            heatReject: service.heatReject,
            order: service.order,
            active: service.active,
          }}
        />
      </div>
    </>
  );
}
