'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { loginUser, logoutUser, restoreSession } from '@/store/authSlice';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, loading, error, token } = useSelector(
    (state: RootState) => state.auth
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  useEffect(() => {
    if (token) router.push('/articles');
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(loginUser({ email, password }));
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Connexion
      </h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      {user ? (
        <div className="text-center">
          <p>Bienvenue {user.first_name} !</p>
          <button
            onClick={() => dispatch(logoutUser())}
            className="bg-red-500 text-white px-4 py-2 rounded mt-4"
          >
            Se déconnecter
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border rounded p-2 mb-2"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full border rounded p-2 mb-4"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      )}
    </div>
  );
}
