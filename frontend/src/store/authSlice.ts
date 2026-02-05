/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

async function refreshAccessToken() {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) {
    console.warn("Aucun refresh token trouvé");
    return null;
  }

  try {
    const res = await fetch('http://localhost:8056/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh }),
    });

    if (!res.ok) {
      console.error("Échec du rafraîchissement du token", await res.text());
      return null;
    }

    const data = await res.json();

    console.log('data refreshAccessToken ' , data)

    const newToken = data.data?.access_token;
    const newRefresh = data.data?.refresh_token;

    localStorage.setItem('access_token', newToken);

    if (newRefresh) 
      localStorage.setItem('refresh_token', newRefresh);
      console.log("🔄 Nouveau token Directus obtenu !");
      //return newToken;
  
const userRes = await fetch('http://localhost:8056/users/me', {
      headers: { Authorization: `Bearer ${newRefresh}` }
    });

    const userData = await userRes.json();

return {
      access_token: newToken,
      refresh_token: newRefresh,
      user: userData.data
    };

  } catch (error) {
    console.error("Erreur lors du refresh du token :", error);
  }

  return null;
}
//thunk refresh token

export const refreshUserSession = createAsyncThunk(
  'auth/refreshUserSession',

   async (_, { rejectWithValue }) => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return rejectWithValue('No refresh token');

    const res = await fetch('http://localhost:8056/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) return rejectWithValue("Refresh failed");

    const data = await res.json();

    const newAccess = data.data?.access_token;
    const newRefresh = data.data?.refresh_token;

    localStorage.setItem('access_token', newAccess);
    if (newRefresh)
      localStorage.setItem('refresh_token', newRefresh);

    const userRes = await fetch('http://localhost:8056/users/me', {
      headers: { Authorization: `Bearer ${newAccess}` }
    });

    const userData = await userRes.json();

    return {
      access_token: newAccess,
      refresh_token: newRefresh,
      user: userData.data
    };
 /* async (_, { rejectWithValue }) => {
    const newToken = await refreshAccessToken();

    if (!newToken) return rejectWithValue('Impossible de rafraîchir le token');

    console.log('refresh by slice not working...')

    const res = await fetch('http://localhost:8056/users/me', {
      headers: { Authorization: `Bearer ${newToken}` },
    });

    if (!res.ok) return rejectWithValue('Erreur lors de la récupération utilisateur');

    const userData = await res.json();
    localStorage.setItem('user', JSON.stringify(userData.data));

    return { access_token: newToken, user: userData.data };

     */
  }
   
);


// 🔹 Connexion utilisateur
export const loginUser = createAsyncThunk<
  { access_token: string; user: User },
  { email: string; password: string }
>('auth/loginUser', async ({ email, password }) => {
  const res = await fetch('http://localhost:8056/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('Erreur de connexion');

  const data = await res.json();
  console.log('data returned after login : ' , data)
 

  // Récupérer les infos de l’utilisateur depuis Directus
  const userRes = await fetch('http://localhost:8056/users/me', {
    headers: { Authorization: `Bearer ${data.data.access_token}` },
  });

  const userData = await userRes.json();

  console.log('userData : ' , userData)
  
    const userId =  userData.data?.id;

    const asscessToken = data.data?.access_token;
  const refreshToken = data.data?.refresh_token;

   console.log('data access token : ' , asscessToken)
  console.log('data refresh_token : ' , refreshToken)

  console.log('userId after login : ' , userId)

  //localStorage.setItem("asscessToken", asscessToken);
localStorage.setItem("userId", userId);
 localStorage.setItem('access_token', asscessToken);
  localStorage.setItem('refresh_token', refreshToken);
  localStorage.setItem('user', JSON.stringify(userData.data));

console.log('data token ===>' , data.data.access_token)

  return { access_token: asscessToken, user: userData.data };
});

// 🔹 Déconnexion
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
    localStorage.removeItem('userId');
      localStorage.removeItem('refresh_token');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    restoreSession: (state) => {
      const token = localStorage.getItem('access_token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Erreur de connexion';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(refreshUserSession.fulfilled, (state, action) => {
      state.token = action.payload.access_token;
      state.user = action.payload.user;
      state.error = null;
      })
      .addCase(refreshUserSession.rejected, (state, action) => {
        state.error = action.payload as string;
      });

        },
      });

export const { restoreSession } = authSlice.actions;
export default authSlice.reducer;
