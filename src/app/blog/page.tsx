import FeaturedPost from "@/components/featured-post";
import { getAllPosts } from "@/lib/queries";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Blog(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const currentPage = searchParams?.page
    ? parseInt(searchParams.page as string, 10)
    : 1;
  const postPerPage = 10;
  const searchTerm =
    typeof searchParams.search === "string" ? searchParams.search : "";
  const categories = parseInt(searchParams.categories as string) || 0;

  const { posts, totalPages } = await getAllPosts(
    currentPage,
    postPerPage,
    searchTerm,
    categories
  );

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">
            Blog
          </h1>
          <p className="text-xl text-muted-foreground">
            A blog built using Headless WordPress.
          </p>
        </div>
      </div>
      <hr className="my-8" />
      {posts?.length ? (
        <div className="grid gap-10 sm:grid-cols-2">
          {posts.map((post, index) => (
            <FeaturedPost key={post.id} post={post} index={index} />
          ))}
        </div>
      ) : (
        <p>No posts published.</p>
      )}
    </div>
  );
}
