'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { createUser } from '@/store/signupSlice';

export default function SignUp() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.signup
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
    const [ firstName, setFirstName] = useState('');
      const [ lastName, setLastName] = useState('');





  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(createUser({ email, password ,firstName,lastName }));
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-semibold mb-4 text-center">
       SignUp
      </h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}

 
        <form onSubmit={handleSubmit}>

          <input
            type="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="firstName"
            className="w-full border rounded p-2 mb-2"
          />


           <input
            type="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="lastName"
            className="w-full border rounded p-2 mb-2"
          />


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
      
    </div>
  );
}
