/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useEffect, useState } from 'react';
import { refreshDirectusToken } from '@/lib/directusAuth';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { refreshUserSession, restoreSession } from '@/store/authSlice';
import Pagination from '@/components/Pagination';



interface Comment {
  id: number;
  content: string;
  date_created: string;
  article: {
    title: string;
  };
}
// ===================================================
//   WRAPPER fetch + Refresh Automatique
// ===================================================
//async function fetchWithRefresh(url: string, options: RequestInit = {} ) {
async function fetchWithRefresh(url: string, options: RequestInit = {} , dispatch :any  ) {
  const token = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  console.log('***token ' , token);
  console.log('**refreshToken ' , refreshToken);

  options.headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  let res = await fetch(url, options);

  console.log('fetchWithRefresh test authorisation statut ' , res)
  // 🔎 Si token expiré
  if (res.status === 401 && refreshToken) {
    console.log("🔄 Token expiré → tentative de refresh...");

const result = await dispatch(refreshUserSession());

console.log('result ' , result)
    const newTokens = result.payload;


    //const newTokens = await refreshDirectusToken(refreshToken);

console.log('newTokens generé par refreshDirectusToken == ' , newTokens)

   // if (!newTokens) {
     if (refreshUserSession.rejected.match(result)) {
      console.log("❌ Refresh impossible ");
      //localStorage.removeItem("access_token");
      //localStorage.removeItem("refresh_token");

     // localStorage.clear();
    window.location.href = "/login";
    //reload des access_token  et refresh_token via la page login par restoreSession 
    return res;
 
    }

    // 🔄 MAJ du localStorage
    localStorage.setItem("access_token", newTokens.access_token);
    //Property 'access_token' does not exist on type '{ token: any; refresh_token: any; }'.ts(2339)
    if (newTokens.refresh_token)
      localStorage.setItem("refresh_token", newTokens.refresh_token);

    // 🔄 MAJ des headers
    options.headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${newTokens.access_token}`,
    };

    // 🔄 Rejouer la requête
    res = await fetch(url, options);
  }

  return res;
}

// ===================================================
//   PAGE : Mes commentaires
// ===================================================
export default function MyCommentsPage() {
 // const [comments, setComments] = useState([]);
 const [comments, setComments] = useState<Comment[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const dispatch = useDispatch<AppDispatch>()
 const [editingId, setEditingId] = useState<string | null>(null);
 const [editContent, setEditContent] = useState('');

 const [pageCount, setPageCount] = useState(1);
 const [page, setPage] = useState(1);

 const limit = 2; // nombre d'items par page
  // 🔵 CHARGER LES COMMENTAIRES
  async function loadComments() {
    
    setLoading(true);

const userId = localStorage.getItem("userId")!;
const token = localStorage.getItem("access_token")!;

console.log('userId ' , userId)
console.log('token assess ' , token)

const res = await fetchWithRefresh(`/api/comments/my?userId=${userId}&page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` }
  } , dispatch);

    if (!res.ok) {
      setError("Impossible de charger vos commentaires.");
      setLoading(false);
      return;
    }

    const data = await res.json();

console.log('✅ data pagination = ', data)
console.log('✅ data pagination pg= ', data?.meta?.total_count )
const total = data?.meta?.total_count ?? 0;
const pageCount = Math.ceil(total / limit);
    setComments(data?.data || []);
    setLoading(false);
     // 🟢 PAGINATION
  setPageCount(pageCount || 1);
  }

  useEffect(() => {
    loadComments();
  }, [page]);

  // 🔵 SUPPRESSION
  async function deleteComment(id: string) {
    if (!confirm("Supprimer ce commentaire ?")) return;

    const res = await fetchWithRefresh(`/api/comments/delete/${id}`, {
      method: "DELETE",
    } ,dispatch);

    if (!res.ok) {
      alert("Erreur lors de la suppression.");
      return;
    }

    loadComments();
  }

  // 🔵 MIS À JOUR
  async function updateComment(id: string) {
    const res = await fetchWithRefresh(`/api/comments/update/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editContent }),
    }, dispatch);

    if (!res.ok) {
      alert("Erreur lors de la mise à jour.");
      return;
    }

    setEditingId(null);
    loadComments();
  }

  // 🔧 Génère une liste de pages avec troncature
function generatePageNumbers(current: number, total: number) {
  const pages = [];

  if (total <= 7) {
    // Peu de pages → tout afficher
    for (let i = 1; i <= total; i++) pages.push(i);
   // console.log('--pages  ' , pages)
    return pages;
  }

  // Toujours afficher : 1, la dernière, la page courante + voisins
  const visible = new Set<number>();
  visible.add(1);
  visible.add(total);
  visible.add(current);
  visible.add(current - 1);
  visible.add(current + 1);
  console.log('visible 0' ,visible)
  const result = [];
  let last = 0;

  for (let i = 1; i <= total; i++) {
    if (visible.has(i)) {
      
      console.log('visible ' ,visible)

      console.log('result1 ' ,result)
      
    if (last && i - last > 1) result.push("...");
        
      console.log('result ' ,result)
      console.log('last ' ,last)
      
      result.push(i);

      last = i;
    }
  }

  return result;
}


 // if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="wrapper">
  <div className="max-w-3xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-semibold mb-6 text-center">Mes Commentaires</h1>

   {loading &&
        <div className="flex justify-center py-10">
         <p>Chargement...</p>
        </div>
}


      {comments.length === 0   ? (
        <p className="text-gray-500 text-center">Aucun commentaire posté.</p>
      ) : (
       !loading && comments.map((c: any) => (
          <div key={c.id} className="border-b py-3">
            
            {editingId === c.id ? (
              <>
                <textarea
                  className="w-full border p-2"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />

                <button 
                  className="bg-green-600 text-white px-3 py-1 rounded mr-2 mt-2"
                  onClick={() => updateComment(c.id)}
                >
                  Enregistrer
                </button>

                <button
                  className="bg-gray-400 text-white px-3 py-1 rounded mt-2"
                  onClick={() => setEditingId(null)}
                >
                  Annuler
                </button>
              </>
            ) : (
              <>
                <p>{c.content}</p>
                <small className="text-gray-500">
                  Article : <strong>{c.article?.title ?? "Inconnu"}</strong>
                </small>

                <div className="flex gap-3 mt-2">
                  <button
                    className="text-blue-600 underline"
                    onClick={() => {
                      setEditingId(c.id);
                      setEditContent(c.content);
                    }}
                  >
                    Modifier
                  </button>

                  <button
                    className="text-red-600 underline"
                    onClick={() => deleteComment(c.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </>
            )}

          </div>
        ))
    

   )}


{/*  

<div className="mt-6 flex items-center justify-between">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-40"
        >
          ⬅️ Précédent
        </button>
<span>
          Page {page} / {pageCount}
        </span>

        <button
          disabled={page >= pageCount}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-40"
        >
          Suivant ➡️
        </button>


  <div className="flex gap-2 flex-wrap justify-center">
    {generatePageNumbers(page, pageCount).map((p, idx) =>
      p === "..." ? (
        <span key={idx} className="px-2 text-gray-500">
          ...
        </span>
      ) : (
        <button
          key={idx}
          onClick={() => typeof p === "number" && setPage(p)}
          className={`px-3 py-1 rounded ${
            page === p
              ? "bg-blue-600 text-white font-semibold"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {p}
        </button>
      )
    )}
  </div>


      </div>
    </div>

  */}


  </div>
  <Pagination page={page} setPage={setPage} total={pageCount} />
    </div>
  );
}