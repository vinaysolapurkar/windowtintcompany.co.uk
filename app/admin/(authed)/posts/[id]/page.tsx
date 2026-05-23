import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "../../../_components/page-header";
import { PostForm } from "../post-form";

export default async function EditPostPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  if (id === "new") return null;
  const post = await db.post.findUnique({ where: { id } });
  if (!post) notFound();
  return (
    <>
      <PageHeader
        title={post.title}
        breadcrumb={[
          { label: "Posts", href: "/admin/posts" },
          { label: post.title },
        ]}
      />
      <div className="p-6 lg:p-10">
        <PostForm
          post={{
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            coverImage: post.coverImage,
            category: post.category,
            tags: post.tags,
            published: post.published,
            featured: post.featured,
          }}
        />
      </div>
    </>
  );
}
