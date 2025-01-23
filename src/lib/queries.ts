import { Post, Category, Author, MediaObject } from "@/lib/types";

const baseUrl = process.env.WORDPRESS_URL;

const revalidateTime: number = 3600;

export async function getCategories(): Promise<Category[]> {
  const endpoint = `${baseUrl}/wp-json/wp/v2/categories`;

  const res = await fetch(endpoint);
  const data = await res.json();
  return data;
}

export async function getAllPosts(
  pageNumber: number = 1,
  perPage = 10,
  searchTerm: string = "",
  categories: number = 0
): Promise<{
  posts: Post[];
  totalPages: number;
}> {
  const params = new URLSearchParams({
    per_page: perPage.toString(),
    page: pageNumber.toString(),
    search: searchTerm,
  });

  if (categories !== 0) {
    params.set("categories", categories.toString());
  }

  const endpoint = `${baseUrl}/wp-json/wp/v2/posts?${params.toString()}`;
  console.log(endpoint);

  const res = await fetch(endpoint, {
    next: {
      revalidate: revalidateTime,
    },
  });

  const posts = await res.json();

  const totalPages = parseInt(res.headers.get("X-WP-TotalPages") ?? "1");

  return { posts, totalPages };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const endpoint = `${baseUrl}/wp-json/wp/v2/posts?slug=${slug}`;

  const res = await fetch(endpoint, {
    next: {
      revalidate: revalidateTime,
    },
  });

  const post = await res.json();

  return post[0];
}

export async function getAuthorById(id: number): Promise<Author | null> {
  const endpoint = `${baseUrl}/wp-json/wp/v2/users/${id}`;

  const res = await fetch(endpoint);

  const author = await res.json();

  return author;
}

export async function getCategoriesById(
  ids: number[]
): Promise<Category[] | null> {
  const endpoint = `${baseUrl}/wp-json/wp/v2/categories?include=${ids.join(
    ","
  )}`;

  const res = await fetch(endpoint);

  const categories = await res.json();

  return categories;
}

export async function getFeaturedMediaById(
  id: number
): Promise<MediaObject | null> {
  const endpoint = `${baseUrl}/wp-json/wp/v2/media/${id}`;

  const res = await fetch(endpoint);

  const featured_media = await res.json();

  return featured_media;
}
