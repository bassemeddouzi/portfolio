# Portfolio - Développeur Fullstack JavaScript

Portfolio moderne et responsive développé avec Next.js, TypeScript et Tailwind CSS, avec un dashboard d'administration complet pour gérer tout le contenu.

## 🚀 Technologies utilisées

- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **React Icons** - Bibliothèque d'icônes
- **NextAuth.js** - Authentification
- **Sequelize** - ORM pour PostgreSQL
- **PostgreSQL** - Base de données
- **bcryptjs** - Hashage des mots de passe

## 📋 Prérequis

- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

## 🛠️ Installation

1. Cloner le projet et installer les dépendances :
```bash
npm install
```

2. **Installer et configurer PostgreSQL** :
   - Installez PostgreSQL : https://www.postgresql.org/download/
   - Créez une base de données : `CREATE DATABASE portfolio_db;`
   - Voir le guide complet : `SETUP_POSTGRESQL.md` ou `QUICK_START.md`

3. **Créer le fichier `.env`** (copiez `env.example`) :
```env
# Base de données PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio_db
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_postgres

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=changez-ceci-par-une-cle-secrete-longue-et-aleatoire

# Node Environment
NODE_ENV=development
```

4. **Tester la connexion à la base de données** :
```bash
npm run test:db
```

5. **Initialiser la base de données** :
```bash
# Démarrez le serveur
npm run dev

# Puis visitez dans votre navigateur :
# http://localhost:3000/api/init
```

6. **Ouvrir le site** : [http://localhost:3000](http://localhost:3000)

## 🔐 Accès au Dashboard Admin

1. Accédez à [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Connectez-vous avec les identifiants par défaut :
   - **Email** : `admin@example.com`
   - **Password** : `admin123`

⚠️ **Important** : Changez ces identifiants après la première connexion pour des raisons de sécurité !

## 📊 Dashboard d'Administration

Le dashboard admin permet de gérer :
- **À propos** : Informations personnelles, description, statistiques
- **Compétences** : Ajouter, modifier, supprimer des compétences par catégorie
- **Expérience** : Gérer l'expérience professionnelle
- **Projets** : Gérer les projets avec technologies, liens GitHub et démo

## 📁 Structure du projet

```
Portfolio/
├── app/
│   ├── api/             # Routes API
│   │   ├── auth/        # Authentification NextAuth
│   │   ├── about/       # API À propos
│   │   ├── skills/      # API Compétences
│   │   ├── experiences/ # API Expérience
│   │   ├── projects/    # API Projets
│   │   └── init/        # Initialisation DB
│   ├── admin/           # Pages d'administration
│   │   ├── login/       # Page de connexion
│   │   ├── dashboard/   # Tableau de bord
│   │   ├── about/       # Gestion À propos
│   │   ├── skills/      # Gestion Compétences
│   │   ├── experiences/ # Gestion Expérience
│   │   └── projects/    # Gestion Projets
│   ├── globals.css      # Styles globaux
│   ├── layout.tsx       # Layout principal
│   └── page.tsx         # Page d'accueil
├── components/
│   ├── admin/           # Composants admin
│   │   └── AdminNavbar.tsx
│   ├── Navbar.tsx       # Navigation
│   ├── Hero.tsx         # Section hero
│   ├── About.tsx        # Section à propos
│   ├── Skills.tsx       # Section compétences
│   ├── Experience.tsx   # Section expérience
│   ├── Projects.tsx     # Section projets
│   ├── Contact.tsx      # Section contact
│   └── Footer.tsx        # Pied de page
├── lib/
│   ├── database.ts      # Configuration Sequelize
│   └── auth.ts          # Configuration NextAuth
├── models/              # Modèles Sequelize
│   ├── User.ts
│   ├── About.ts
│   ├── Skill.ts
│   ├── Experience.ts
│   ├── Project.ts
│   └── index.ts
├── middleware.ts        # Middleware de protection
└── public/              # Fichiers statiques
```

## 🎨 Personnalisation

### Via le Dashboard Admin (Recommandé)
Utilisez le dashboard d'administration pour modifier tout le contenu sans toucher au code :
1. Connectez-vous à `/admin/login`
2. Accédez aux différentes sections depuis le dashboard
3. Modifiez, ajoutez ou supprimez du contenu via les formulaires

### Via le Code
1. **Informations personnelles** : Modifiez les composants pour ajouter vos propres informations
2. **Projets** : Ajoutez vos projets dans `components/Projects.tsx`
3. **Expérience** : Mettez à jour votre expérience dans `components/Experience.tsx`
4. **Compétences** : Ajustez vos compétences dans `components/Skills.tsx`
5. **Liens sociaux** : Mettez à jour les liens dans les composants Hero et Footer

## 🚢 Déploiement

### Déploiement sur Vercel (Recommandé)

📖 **Guide complet de déploiement Vercel** : Voir [`VERCEL_DEPLOYMENT.md`](./VERCEL_DEPLOYMENT.md) pour les instructions détaillées étape par étape.

**Résumé rapide :**
1. Poussez votre code sur GitHub/GitLab/Bitbucket
2. Connectez votre repository à Vercel
3. Configurez une base de données PostgreSQL (Vercel Postgres recommandé)
4. Ajoutez les variables d'environnement dans Vercel
5. Déployez !

### Autres plateformes

Le projet peut également être déployé sur :
- **Netlify** - Voir [`DEPLOYMENT.md`](./DEPLOYMENT.md)
- **Railway** - Voir [`DEPLOYMENT.md`](./DEPLOYMENT.md)
- **AWS Amplify**
- Tout autre hébergeur supportant Node.js

## 🔒 Sécurité

- Les routes admin sont protégées par authentification
- Les mots de passe sont hashés avec bcrypt
- Les sessions utilisent JWT
- Validation des données côté serveur
- Protection CSRF via NextAuth

## 📝 Notes

- Tous les textes sont en français
- Le design est entièrement responsive
- Les animations sont optimisées pour les performances
- Le code suit les meilleures pratiques de sécurité
- Le dashboard admin permet de gérer tout le contenu sans modifier le code

## 🐛 Dépannage

### Problème de connexion à la base de données
- Vérifiez que PostgreSQL est démarré
- Vérifiez les variables d'environnement dans `.env`
- Testez la connexion : `npm run test:db`
- Testez manuellement : `psql -U postgres -d portfolio_db`

### Erreur "Please install pg package manually"
- Exécutez : `npm install`
- Redémarrez le serveur : `npm run dev`

### Erreur d'authentification
- Vérifiez que `NEXTAUTH_SECRET` est défini dans `.env`
- Assurez-vous que l'utilisateur admin existe (visitez `/api/init`)

### Les données ne s'affichent pas
- Vérifiez que les données existent en base de données
- Utilisez le dashboard admin pour ajouter du contenu

### Guides disponibles
- **Guide complet** : `SETUP_POSTGRESQL.md`
- **Démarrage rapide** : `QUICK_START.md`

## 📄 Licence

Ce projet est sous licence MIT.

