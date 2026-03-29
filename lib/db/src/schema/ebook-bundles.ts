import { pgTable, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ebookBundlesTable = pgTable("ebook_bundles", {
  id: text("id").primaryKey(),
  ebookTitle: text("ebook_title").notNull(),
  authorName: text("author_name").notNull(),
  brandName: text("brand_name").notNull(),
  designTheme: text("design_theme").notNull(),
  selectedLangs: jsonb("selected_langs").notNull().$type<string[]>(),
  languageCount: integer("language_count").notNull(),
  htmlFiles: jsonb("html_files").notNull().$type<Record<string, string>>(),
  coverImageBase64: text("cover_image_base64"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEbookBundleSchema = createInsertSchema(ebookBundlesTable).omit({
  createdAt: true,
});

export type InsertEbookBundle = z.infer<typeof insertEbookBundleSchema>;
export type EbookBundle = typeof ebookBundlesTable.$inferSelect;
