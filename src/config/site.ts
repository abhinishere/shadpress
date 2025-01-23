import { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "ShadPress",
  description:
    "An open source application built using the new router, server components and everything new in Next.js 13.",
  url: `${process.env.WORDPRESS_URL}`,
  links: {
    twitter: "https://twitter.com/",
    github: "https://github.com/",
  },
};
