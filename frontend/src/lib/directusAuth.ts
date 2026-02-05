/**
 * Rafraîchit un token Directus expiré
 * @param refreshToken le refresh_token stocké en local
 * @returns un nouvel access_token (ou null si échec)
 */
export async function refreshDirectusToken(refreshToken: string) {
  console.log('refreshToken from helper ' , refreshToken)
  try {
    if (!refreshToken) {
      throw new Error("Aucun refresh token fourni");
    }

    // 🔁 Appel à l’API Directus pour rafraîchir le token
    const res = await fetch('http://localhost:8056/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'   },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    console.log("🔥 Réponse Directus refresh =", res);

    if (!res.ok) {
      const err = await res.text();
      console.error("Erreur lors du rafraîchissement du token :", err);
      return null;
    }

    const data = await res.json();

    console.log('data from helper : ' , data)
   console.log('data.refresh_token  from helper : ' , data.data?.refresh_token)
   console.log('data expire  from helper : ' , data.data?.expires)
    /*const newAccessToken = data.data?.access_token;
    const newRefreshToken = data.data?.refresh_token;
*/
    const newAccessToken = data.data?.access_token;
    const newRefreshToken = data.data?.refresh_token;

    console.log('newAccessToken ' ,newAccessToken)
        console.log('newRefreshToken ' ,newRefreshToken)

    if (!newAccessToken) {
      throw new Error("Le nouveau token n’a pas été renvoyé par Directus");
    }

    console.log("🔁 Nouveau token généré :", newAccessToken);

    // 🔙 Retourne les deux tokens, pour éventuellement mettre à jour le localStorage
    return { access_token: newAccessToken, refresh_token: newRefreshToken };
  } catch (error) {
    console.error("❌ Erreur refreshDirectusToken :", error);
    return null;
  }
}



