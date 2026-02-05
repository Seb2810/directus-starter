/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';



interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}


interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};





// 🔹 Ajouter un nouvel User
export const createUser = createAsyncThunk<
  void,
  { email: string; password: string; firstName : string; lastName:string }

>('user/signup', async ({ email, password ,firstName,lastName}) => {
  console.log('data send: ' ,email, password ,firstName,lastName)
  const res = await fetch('/api/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password ,firstName,lastName }),
  });
  if (!res.ok) throw new Error('Erreur lors de l’envoi des ddonnées');

  const data = await res.json();
  console.log('res signup : ' , data)


});



const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
     
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Erreur inconnue';
      })
      .addCase(createUser.fulfilled, (state) => {
        // après envoi, on ne modifie pas tout de suite, on laisse fetchComments rafraîchir
      });
  },
});

export default signupSlice.reducer;
