import { db } from "@/lib/db";
import { PageHeader } from "../../_components/page-header";
import { MediaLibrary } from "./media-library";

export default async function MediaPage() {
  const assets = await db.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <PageHeader
        title="Media library"
        description="Upload images for posts, services and showcase projects. Paste the URL into the relevant editor."
      />
      <div className="p-6 lg:p-10">
        <MediaLibrary assets={assets} />
      </div>
    </>
  );
}
