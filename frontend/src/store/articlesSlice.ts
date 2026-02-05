/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/articlesSlice.ts
// src/store/articlesSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import directus, { Article, Schema } from '@/lib/directus';
import { readItems, Query } from '@directus/sdk';

interface ArticlesState {
  items: Article[];
  loading: boolean;
  error: string | null;
}

const initialState: ArticlesState = {
  items: [],
  loading: false,
  error: null,
};

// type maison pour simplifier
type DirectusListResponse<T> = {
  data?: T[];
  meta?: any;
};

// Note : le 3e générique de readItems est Query<Schema, 'articles'>
export const fetchArticles = createAsyncThunk<Article[]>(
  'articles/fetch',
  async () => {
const response = await fetch('/api/articles')

    const json = await response.json(); // <- ici tu récupères les données JSON

    console.log('data from API =>', json);

    // Directus renvoie { data: [...] }, donc on doit accéder à json.data
    return json?.data ?? [];
  //  const response = await fetch('/api/articles')as DirectusListResponse<Article>;
    /*const response = await directus.request(
      readItems<Schema, 'articles', Query<Schema, Article>>('articles', {
        fields: ['id', 'title', 'content','slug',  'date_created'],
        sort: ['-date_created'],
        limit: 50,
      })
    ) as DirectusListResponse<Article>;
    */
//console.log('response ==> ' , response.data)
    // readItems renvoie un objet { data?: Article[]; ... }
    //return response?.data ?? [];
  }
);

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Erreur inconnue';
      });
  },
});

export default articlesSlice.reducer;
