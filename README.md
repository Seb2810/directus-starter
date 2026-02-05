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

## Node version et installation de Directus

Directus ne supporte que Node.js 18.17 à 18.x (pas 20.x, pas 22.x pour l’instant).

si version > 20.x alors :
 2 Solutions : 
 1. utilser  NVM pour Windows mais cette solution peut poser problème (nvm-setup.exe) voir ci-dessous pour resolution dans cette exemple tout etait bloqué après
 2. <ins>desinstaller et reinstaller node manuellement avec la version recommandée par Directus</ins>
 
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

si le probleme persiste sous Windows desinstaller MVN pour reinstaller la bonne version manuellement après

.Tapes pour désinstaller NVM sur Windows

## 1 .Désinstaller via le panneau de configuration

.Va dans : Panneau de configuration > Programmes > Programmes et fonctionnalités.

.Trouve NVM for Windows dans la liste.

.Cliques sur Désinstaller.

## 2.Supprimer le dossier d’installation de NVM

Par défaut, NVM s’installe ici :
```js
C:\Users\<TonNom>\AppData\Roaming\nvm
```

## 3 .Supprime ce dossier à la main s’il reste.

Supprimer les versions de Node installées via NVM

Elles se trouvent dans :
```js
C:\Users\<TonNom>\AppData\Roaming\nvm\v*
```

## 4 .Supprime les sous-dossiers v18.x, v20.x, etc.

Corriger les variables d’environnement

Clique droit sur Ce PC > Propriétés > Paramètres système avancés > Variables d’environnement.

## 5.Vérifie dans Path qu’il n’y a plus de lignes du type :
```js
C:\Users\<TonNom>\AppData\Roaming\nvm
C:\Users\<TonNom>\AppData\Roaming\nvm\v18.18.2
```

Supprime-les si présentes.

## 6.Vérifie aussi si une variable NVM_HOME ou NVM_SYMLINK existe → supprime-les.

Réinstaller Node.js normalement

Va sur le site officiel : Node.js Downloads
.

Télécharge Node.js 18.18.2 LTS (Windows installer .msi).

Installe-le (ça remet aussi npm correctement).

## Une fois directus intaller lancer l'installation de next.js


## 7.Vérifie :
```js
node -v
npm -v
```

## Installer Next.js


