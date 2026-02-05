import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface Comment {
  id: string;
  content: string;
  date_created: string;
  author?: {
    first_name?: string;
    last_name?: string;
  };
  authorId?: string;
}

interface CommentsState {
  items: Comment[];
  loading: boolean;
  error: string | null;
  nextCursor: string | null;
  hasMore: boolean;
}

const initialState: CommentsState = {
  items: [],
  loading: false,
  error: null,
  nextCursor: null,
  hasMore: true,
};

// ✅ Fetch avec cursor
export const fetchComments = createAsyncThunk<
  { data: Comment[]; nextCursor: string | null },
  { articleId: string; cursor?: string | null }
>('comments/fetch', async ({ articleId, cursor }) => {
  const params = new URLSearchParams();
  params.append('limit', '10');
  if (cursor) params.append('cursor', cursor);

  const res = await fetch(`/api/comments/${articleId}?${params.toString()}`);

  if (!res.ok) throw new Error('Erreur lors du chargement');

  return await res.json();
});

// 🔹 Envoi commentaire (inchangé)
export const postComment = createAsyncThunk<
  void,
  { articleId: string; content: string; token: string; authorId: string }
>('comments/post', async ({ articleId, content, token, authorId }) => {
  const refreshToken = localStorage.getItem('refresh_token');

  const res = await fetch('/api/comments/new', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content,
      article: articleId,
      access_token: token,
      refresh_token: refreshToken,
      authorId,
    }),
  });

  if (!res.ok) throw new Error('Erreur envoi commentaire');
});

const scrollSlice = createSlice({
  name: 'scroll',
  initialState,
  reducers: {
    resetComments(state) {
      state.items = [];
      state.nextCursor = null;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(...action.payload.data);
        state.nextCursor = action.payload.nextCursor;
        state.hasMore = !!action.payload.nextCursor;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Erreur inconnue';
      });
  },
});

export const { resetComments } = scrollSlice.actions;
export default scrollSlice.reducer;
