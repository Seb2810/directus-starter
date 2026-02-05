// src/lib/directus.ts
import { createDirectus, rest } from '@directus/sdk';

export type Article = {
  id: string;
  title: string;
  content: string;
  slug: string;
  date_created: string;
};

export type Schema = {
  articles: Article[];
};

export const directus = createDirectus<Schema>('http://localhost:8056').with(rest());

export default directus;


