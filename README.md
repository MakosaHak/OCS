# Old Ciceron Student — Annuaire de Promotion

Cette application est une PWA (Progressive Web App) conçue pour permettre aux anciens élèves de se retrouver et de partager ce qu'ils sont devenus.

## 🚀 Configuration Supabase

1. Créez un projet sur [Supabase](https://supabase.com).
2. Exécutez le script SQL se trouvant dans `supabase/schema.sql` dans l'éditeur SQL de votre projet Supabase.
3. Allez dans **Storage**, et créez un bucket public nommé `profiles`. Assurez-vous que l'accès public est activé pour les fichiers.
4. Récupérez vos clés API dans **Project Settings > API**.

## 🛠️ Installation Locale

1. Clonez ce dépôt.
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Créez un fichier `.env` à la racine (copiez `.env.example`) et remplissez vos informations :
   ```env
   VITE_SUPABASE_URL=votre_url_supabase
   VITE_SUPABASE_ANON_KEY=votre_cle_anon
   VITE_ADMIN_PASSWORD=votre_mot_de_passe_admin
   ```
4. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

## 📱 PWA

L'application est installable sur smartphone. Une fois déployée sur un serveur HTTPS (Netlify, Vercel), ouvrez l'URL sur votre téléphone et choisissez "Ajouter à l'écran d'accueil".

## 🎨 Charte Graphique

- **Vert Forêt** (#1A6B4A) : Identité et boutons
- **Or / Ambre** (#F5A623) : Actions principales
- **Playfair Display** : Titres et Prestige
- **DM Sans** : Lisibilité et Modernité
