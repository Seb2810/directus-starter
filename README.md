## Installer Directus
## Option A : en local avec npx
```js
npx create-directus-project my-directus-app
cd my-directus-app
npm run start
```

Par défaut, Directus va démarrer sur http://localhost:8055.
Tu pourras configurer un utilisateur admin au premier lancement.

## Option B : via Docker

Si tu préfères Docker :
```js
version: "3"
services:
  directus:
    image: directus/directus:latest
    ports:
      - 8055:8055
    environment:
      KEY: "my-super-secret-key"
      SECRET: "my-super-secret-secret"
      ADMIN_EMAIL: "admin@example.com"
      ADMIN_PASSWORD: "password"
      DB_CLIENT: "sqlite3"
      DB_FILENAME: "/data/database.sqlite"
    volumes:
      - ./directus-data:/data

```

Puis :
```js
docker-compose up -d
```

## 2. Créer une collection dans Directus

Dans l’interface admin (http://localhost:8055/admin), crée une collection (par ex. articles) avec des champs (title, content, image, etc.).

## 3. Installer Next.js

Dans un nouveau dossier :
```js
npx create-next-app my-next-app
cd my-next-app
```

## 4. Consommer l’API de Directus dans Next.js
Installer le SDK officiel Directus
```js
npm install @directus/sdk
```
Créer un client Directus (lib/directus.js)

```js
import { createDirectus, rest } from '@directus/sdk';

const directus = createDirectus('http://localhost:8055').with(rest());

export default directus;
```
Exemple : récupérer des articles (pages/index.js)

```js
import directus from '../lib/directus';

export default async function Home() {
  const articles = await directus.items('articles').readByQuery({
    fields: ['id', 'title', 'content'],
  });

  return (
    <main>
      <h1>Articles</h1>
      <ul>
        {articles.data.map((article) => (
          <li key={article.id}>
            <h2>{article.title}</h2>
            <p>{article.content}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

```

## Node version

Directus ne supporte que Node.js 18.17 à 18.x (pas 20.x, pas 22.x pour l’instant).

si version > 20.x alors :

Télécharge NVM pour Windows :
👉 nvm-windows

(prends le fichier nvm-setup.exe).

Installe-le, puis ouvre un nouveau terminal PowerShell ou CMD.

Installe la version recommandée par Directus

Installe la version recommandée par Directus :

```js
nvm install 18.18.2
nvm use 18.18.2
```

Vérifie ta version :
```js
node -v
npm -v
```

Relance la commande :
```js
npx create-directus-project my-directus-app
```
