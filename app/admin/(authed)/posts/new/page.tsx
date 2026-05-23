import { PageHeader } from "../../../_components/page-header";
import { PostForm } from "../post-form";

export default function NewPostPage() {
  return (
    <>
      <PageHeader
        title="New journal post"
        breadcrumb={[{ label: "Posts", href: "/admin/posts" }, { label: "New" }]}
      />
      <div className="p-6 lg:p-10">
        <PostForm />
      </div>
    </>
  );
}
