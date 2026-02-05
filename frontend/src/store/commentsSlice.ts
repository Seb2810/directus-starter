/* eslint-disable @typescript-eslint/no-unused-vars */
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
}

const initialState: CommentsState = {
  items: [],
  loading: false,
  error: null,
};

// 🔹 Récupérer les commentaires d’un article
export const fetchComments = createAsyncThunk<Comment[], string>(
  'comments/fetch',
  async (articleId: string) => {
   
    console.log('🛰️ Fetching /api/comments/' + articleId);
  
    const res = await fetch(`/api/comments/${articleId}`);
  
    if (!res.ok) throw new Error('Erreur lors du chargement des commentaires');

    const data = await res.json();

    console.log('📦 Received from API:', data);
    
    return data;
  }
);

// 🔹 Envoyer un nouveau commentaire
export const postComment = createAsyncThunk<
  void,
  { articleId: string; content: string; token: string ,authorId:string }
>('comments/post', async ({ articleId, content, token ,authorId }) => {
  console.log('comment envoyé depuis le slice comment ' , articleId, content, token ,'/==author id ' , authorId)
  const refreshToken = localStorage.getItem('refresh_token')
  const testSend = JSON.stringify({ content, article: articleId, 'access_token': token ,authorId, 'refresh_token' :refreshToken })
  console.log('testSend :: ', testSend )
  const res = await fetch('/api/comments/new', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, article: articleId, 'access_token': token ,authorId, 'refresh_token' :refreshToken })
  });
  if (!res.ok) throw new Error('Erreur lors de l’envoi du commentaire');
});

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Erreur inconnue';
      })
      .addCase(postComment.fulfilled, (state) => {
        // après envoi, on ne modifie pas tout de suite, on laisse fetchComments rafraîchir
      });
  },
});

export default commentsSlice.reducer;
