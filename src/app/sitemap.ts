import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/queries";

const baseUrl = process.env.WORDPRESS_URL;

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const mainUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    // {
    //   url: `${baseUrl}/about`,
    //   lastModified: new Date(),
    //   changeFrequency: "monthly",
    //   priority: 0.8,
    // },
    // {
    //   url: `${baseUrl}/contact`,
    //   lastModified: new Date(),
    //   changeFrequency: "monthly",
    //   priority: 0.8,
    // },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  const postUrls: MetadataRoute.Sitemap = [];

  let pageNumber = 1;
  const perPage = 100;

  while (true) {
    const posts = await getAllPosts(pageNumber, perPage);

    const batchPostUrls = posts.posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.modified),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

    postUrls.push(...batchPostUrls);

    if (posts.totalPages <= pageNumber) {
      break;
    }

    pageNumber++;
  }

  return [...mainUrls, ...postUrls];
}
