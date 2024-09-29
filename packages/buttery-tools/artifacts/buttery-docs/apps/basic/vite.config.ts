import mdx from "@mdx-js/rollup";
import { vitePlugin as remix } from "@remix-run/dev";
import rehypeShiki from "@shikijs/rehype";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";

import { vitePlugin as butteryTools } from "@buttery/tools/docs/vite";

export default defineConfig({
  optimizeDeps: { exclude: ["fsevents"] },
  plugins: [
    // Inspect(),
    butteryTools({ root: import.meta.dirname }),
    // for some reason the mdx plugin needs to go here???
    // @ts-expect-error I dunno something strange TODO: check into this
    {
      enforce: "pre",
      ...mdx({
        include: "**/*.(md|mdx)",
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              headingProperties: {
                className: "heading"
              }
            }
          ],
          [
            // @ts-expect-error This is a mismatch from the type-system
            rehypeShiki,
            {
              theme: "dark-plus"
            }
          ]
        ]
      })
    }
    // remix({
    //   future: {
    //     v3_fetcherPersist: true,
    //     v3_relativeSplatPath: true,
    //     v3_throwAbortReason: true
    //   }
    // })
  ]
});
