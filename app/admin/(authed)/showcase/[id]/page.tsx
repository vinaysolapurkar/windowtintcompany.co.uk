import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "../../../_components/page-header";
import { ShowcaseForm } from "../showcase-form";

export default async function EditProjectPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  if (id === "new") return null;
  const project = await db.showcaseProject.findUnique({ where: { id } });
  if (!project) notFound();
  return (
    <>
      <PageHeader
        title={project.title}
        breadcrumb={[{ label: "Showcase", href: "/admin/showcase" }, { label: project.title }]}
      />
      <div className="p-6 lg:p-10">
        <ShowcaseForm
          project={{
            id: project.id,
            slug: project.slug,
            title: project.title,
            client: project.client,
            location: project.location,
            category: project.category,
            summary: project.summary,
            body: project.body,
            heroImage: project.heroImage,
            gallery: project.gallery,
            filmUsed: project.filmUsed,
            featured: project.featured,
            order: project.order,
          }}
        />
      </div>
    </>
  );
}
