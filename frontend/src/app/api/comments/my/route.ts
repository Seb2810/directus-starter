import { NextResponse } from "next/server";

export async function GET(req: Request,
  
) {
  try {

    /*si commentaires scrollés
    const includeMeta = req.query.withMeta === "1";
     const metaParam = includeMeta ? "&meta=filter_count" : "";
     const directusUrl =
  `http://localhost:8056/items/comments` +
  `?filter[author][_eq]=${userId}` +
  `&fields=id,content,date_created,article.title` +
  `&page=${page}` +
  `&limit=${limit}` +
  metaParam;
*/
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const page = searchParams.get("page")?? "1";
    const limit = searchParams.get("limit")?? "10";

    console.log("👉--userId from my " , userId);
    console.log("👉--page  from my " , page);
    console.log("👉--limit from my " , page);

    if (!userId) {
      return NextResponse.json(
        { error: "userId manquant" },
        { status: 400 }
      );
    }
   const directusUrl =
      `http://localhost:8056/items/comments` +
      `?filter[author][_eq]=${userId}` +
      `&fields=id,content,date_created,article.title` +
      `&page=${page}` +
      `&limit=${limit}` +
      `&meta=*`; // 🟢 IMPORTANT POUR OBTENIR page_count

    console.log("➡️ Directus URL :", directusUrl);

    const authHeader = req.headers.get("authorization") || "";

    const directusRes = await fetch(directusUrl,
     // `http://localhost:8056/items/comments?filter[author][_eq]=${userId}&fields=id,content,date_created,article.title`,
    //  `http://localhost:8056/items/comments?[author][_eq]=${userId}&fields=id,content,date_created,article.title&page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      }
    );

    const text = await directusRes.text(); // toujours du texte brut
    console.log("🔍 Directus répond :", text);

    return new NextResponse(text, {
      status: directusRes.status, // renvoie 200 / 401 / 403 / etc. exactement
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("❌ Erreur API /comments/my :", err);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}