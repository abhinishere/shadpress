import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { MediaObject, Post } from "@/lib/types";
import { getFeaturedMediaById } from "@/lib/queries";

type FeaturedPostProps = {
  post: Post;
  index: number;
};

export default async function FeaturedPost({ post, index }: FeaturedPostProps) {
  const featuredMedia =
    post.featured_media === 0
      ? null
      : await getFeaturedMediaById(post.featured_media);

  return (
    <article key={post.id} className="group relative flex flex-col space-y-2">
      {featuredMedia && (
        <Image
          src={
            featuredMedia.media_details?.sizes?.thumbnail?.source_url ||
            featuredMedia.source_url
          }
          alt={post.title.rendered}
          width={804}
          height={452}
          className="rounded-md border bg-muted transition-colors"
          priority={index <= 1}
        />
      )}
      <h2
        className="text-2xl font-extrabold"
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
      ></h2>
      {post.excerpt.rendered && (
        <div
          className="text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        ></div>
      )}
      {post.date && (
        <p className="text-sm text-muted-foreground">{formatDate(post.date)}</p>
      )}
      <Link href={`/blog/${post.slug}`} className="absolute inset-0">
        <span className="sr-only">View Article</span>
      </Link>
    </article>
  );
}
