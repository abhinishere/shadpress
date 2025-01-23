export type Category = {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: "category";
  parent: number;
};

export type Post = {
  id: number;
  title: {
    rendered: string;
  };
  slug: string;
  date: string;
  modified: string;
  content: {
    rendered: string;
  };
  type: string;
  status: string;
  excerpt: {
    rendered: string;
  };
  author: number;
  categories: number[];
  featured_media: number;
};

type AvatarUrls = {
  24: string;
  48: string;
  96: string;
};

export type Author = {
  id: number;
  name: string;
  slug: string;
  link: string;
  avatar_urls: AvatarUrls;
};

type MediaDetailsSizes = {
  file: string;
  width: number;
  height: number;
  filesize?: number;
  mime_type: string;
  source_url: string;
};

type MediaDetails = {
  file: string;
  filesize?: number;
  height: number;
  width: number;
  sizes?: {
    [key: string]: MediaDetailsSizes;
  };
};

export type MediaObject = {
  alt_text?: string;
  author: number;
  caption: { rendered: string };
  date: string;
  date_gmt: string;
  description: { rendered: string };
  featured_media?: number;
  id: number;
  link: string;
  media_details?: MediaDetails;
  media_type: string;
  mime_type: string;
  modified: string;
  modified_gmt: string;
  post?: number | null;
  slug: string;
  source_url: string;
  status: string;
  title: { rendered: string };
  type: string;
};
