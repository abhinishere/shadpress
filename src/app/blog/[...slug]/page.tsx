import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import {
  getAuthorById,
  getCategoriesById,
  getFeaturedMediaById,
  getPostBySlug,
} from "@/lib/queries";
import parser, { DOMNode, Element } from "html-react-parser";
import Image from "next/image";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: post?.title.rendered,
    description: post?.excerpt.rendered,
    openGraph: {
      images: ["open-graph.jpg", ...previousImages],
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const mapping: Record<string, string> = {
    h1: "mt-2 scroll-m-20 text-4xl font-bold tracking-tight",
    h2: "mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0",
    h3: "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
    h4: "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
    h5: "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
    h6: "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
    a: "font-medium underline underline-offset-4",
    p: "leading-7 [&:not(:first-child)]:mt-6",
    ul: "my-6 ml-6 list-disc",
    ol: "my-6 ml-6 list-decimal",
    li: "mt-2",
    blockquote: "mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground",
    img: "rounded-md border",
    hr: "my-4 md:my-8",
    table: "w-full",
    tr: "m-0 border-t p-0 even:bg-muted",
    th: "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
    td: "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
    pre: "mb-4 mt-6 overflow-x-auto rounded-lg border bg-black py-4",
    code: "relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-sm",
  };

  const replace = (domNode: DOMNode, index: number): DOMNode | null => {
    if (domNode.type === "tag" && "name" in domNode) {
      const element = domNode as Element;
      const className = mapping[element.name];

      if (className && element.attribs) {
        element.attribs.class = className;
      }

      return element;
    }

    return null;
  };

  const post = await getPostBySlug((await params).slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  const featuredMedia =
    post.featured_media === 0
      ? null
      : await getFeaturedMediaById(post.featured_media);

  const author = await getAuthorById(post.author);

  console.log(author);

  const categories = await getCategoriesById(post.categories);

  const formattedDate = new Date(post.date);
  const date = formattedDate.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="container relative max-w-3xl py-6 lg:py-10">
      <Link
        href="/blog"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-[-200px] top-14 hidden xl:inline-flex"
        )}
      >
        <Icons.chevronLeft className="mr-2 h-4 w-4" />
        See all posts
      </Link>
      <div>
        {post.date && (
          <time
            dateTime={post.date}
            className="block text-sm text-muted-foreground"
          >
            Published on {formatDate(post.date)}
          </time>
        )}
        <h1
          className="mt-2 inline-block font-heading text-4xl leading-tight lg:text-5xl"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        ></h1>
        <div className="mt-4">
          {author ? (
            <Link
              key={author.id}
              href={`/author/${author.slug}`}
              className="flex items-center space-x-2 text-sm"
            >
              <Image
                src={author.avatar_urls[48]}
                alt={author.name}
                width={42}
                height={42}
                className="rounded-full bg-white"
              />
              <div className="flex-1 text-left leading-tight">
                <p className="font-medium">{author.name}</p>
                <p className="text-[12px] text-muted-foreground">
                  @{author.slug}
                </p>
              </div>
            </Link>
          ) : null}
        </div>
      </div>
      {featuredMedia && (
        <Image
          src={featuredMedia.source_url}
          alt={post.title.rendered}
          width={720}
          height={405}
          className="my-8 rounded-md border bg-muted transition-colors"
          priority
        />
      )}
      <div>{parser(post.content.rendered, { replace: replace })}</div>
      <hr className="mt-12" />
      <div className="flex justify-center py-6 lg:py-10">
        <Link href="/blog" className={cn(buttonVariants({ variant: "ghost" }))}>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          See all posts
        </Link>
      </div>
    </article>
  );
}
