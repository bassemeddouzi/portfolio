# Guide de Configuration PostgreSQL

Ce guide vous explique comment configurer PostgreSQL pour votre portfolio.

## 📋 Prérequis

1. **PostgreSQL installé** sur votre machine
2. **Node.js et npm** installés
3. Les packages npm installés (`npm install`)

## 🔧 Étape 1 : Installer PostgreSQL

### Windows
1. Téléchargez PostgreSQL depuis : https://www.postgresql.org/download/windows/
2. Installez PostgreSQL (notez le mot de passe du superutilisateur `postgres`)
3. PostgreSQL sera installé par défaut sur le port `5432`

### Vérifier l'installation
Ouvrez PowerShell et testez :
```powershell
psql --version
```

## 🔧 Étape 2 : Créer la base de données

### Option A : Via pgAdmin (Interface graphique)
1. Ouvrez **pgAdmin** (installé avec PostgreSQL)
2. Connectez-vous au serveur PostgreSQL
3. Clic droit sur "Databases" → "Create" → "Database"
4. Nom : `portfolio_db`
5. Cliquez sur "Save"

### Option B : Via ligne de commande
Ouvrez PowerShell et exécutez :
```powershell
# Se connecter à PostgreSQL (remplacez 'votre_mot_de_passe' par votre mot de passe)
psql -U postgres

# Dans le prompt PostgreSQL, exécutez :
CREATE DATABASE portfolio_db;

# Quitter
\q
```

## 🔧 Étape 3 : Configurer les variables d'environnement

1. **Créez un fichier `.env`** à la racine du projet (copiez `env.example`)

2. **Modifiez le fichier `.env`** avec vos informations :

```env
# Base de données PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio_db
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_postgres

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=changez-ceci-par-une-cle-secrete-longue-et-aleatoire-en-production

# Node Environment
NODE_ENV=development
```

⚠️ **Important** :
- Remplacez `votre_mot_de_passe_postgres` par le mot de passe que vous avez défini lors de l'installation
- Pour `NEXTAUTH_SECRET`, générez une clé aléatoire (vous pouvez utiliser : `openssl rand -base64 32`)

## 🔧 Étape 4 : Initialiser la base de données

1. **Démarrez votre serveur Next.js** :
```powershell
npm run dev
```

2. **Visitez l'endpoint d'initialisation** dans votre navigateur :
```
http://localhost:3000/api/init
```

3. Vous devriez voir un message de succès indiquant que la base de données a été initialisée.

## ✅ Vérifier que tout fonctionne

### Test de connexion
1. Ouvrez votre navigateur
2. Allez sur `http://localhost:3000`
3. Le site devrait se charger sans erreurs de base de données

### Test de l'admin
1. Allez sur `http://localhost:3000/admin/login`
2. Connectez-vous avec :
   - **Email** : `admin@example.com`
   - **Password** : `admin123`

## 🐛 Dépannage

### Erreur : "Please install pg package manually"
✅ **Solution** : Le package `pg` est déjà dans `package.json`. Exécutez :
```powershell
npm install
```

### Erreur : "password authentication failed"
✅ **Solution** : Vérifiez que le mot de passe dans `.env` correspond au mot de passe PostgreSQL.

### Erreur : "database does not exist"
✅ **Solution** : Créez la base de données `portfolio_db` (voir Étape 2).

### Erreur : "connection refused"
✅ **Solution** : 
- Vérifiez que PostgreSQL est démarré
- Vérifiez que le port `5432` est correct dans `.env`
- Vérifiez que `DB_HOST=localhost` est correct

### Tester la connexion manuellement
```powershell
# Testez la connexion PostgreSQL
psql -U postgres -d portfolio_db -h localhost
```

Si cela fonctionne, votre configuration est correcte.

## 📝 Structure de la base de données

Après l'initialisation, les tables suivantes seront créées :
- `users` - Utilisateurs admin
- `abouts` - Informations à propos
- `skills` - Compétences
- `experiences` - Expérience professionnelle
- `projects` - Projets

## 🔒 Sécurité

⚠️ **Important pour la production** :
- Ne commitez JAMAIS le fichier `.env` dans Git
- Changez le mot de passe admin par défaut
- Utilisez une clé `NEXTAUTH_SECRET` forte et unique
- Configurez un utilisateur PostgreSQL dédié (pas `postgres`)

## 📚 Ressources

- Documentation PostgreSQL : https://www.postgresql.org/docs/
- Documentation Sequelize : https://sequelize.org/

