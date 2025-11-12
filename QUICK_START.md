# 🚀 Démarrage Rapide - PostgreSQL

## Checklist rapide

### ✅ 1. PostgreSQL installé ?
```powershell
psql --version
```
Si non installé : https://www.postgresql.org/download/windows/

### ✅ 2. Base de données créée ?
```powershell
psql -U postgres
# Dans PostgreSQL :
CREATE DATABASE portfolio_db;
\q
```

### ✅ 3. Fichier .env créé ?
Copiez `env.example` vers `.env` et modifiez :
```env
DB_PASSWORD=votre_mot_de_passe_postgres
NEXTAUTH_SECRET=une-cle-secrete-longue-et-aleatoire
```

### ✅ 4. Packages installés ?
```powershell
npm install
```

### ✅ 5. Test de connexion
```powershell
npm run test:db
```

### ✅ 6. Initialiser la base de données
1. Démarrez le serveur : `npm run dev`
2. Visitez : http://localhost:3000/api/init

### ✅ 7. C'est prêt !
- Site : http://localhost:3000
- Admin : http://localhost:3000/admin/login
  - Email : `admin@example.com`
  - Password : `admin123`

## 🆘 Problème ?

Voir le guide complet : `SETUP_POSTGRESQL.md`

