4eme‑annee‑projet
📂 Description

Application web pour la gestion automatisée des demandes de centres de vacances.
Les employés peuvent soumettre une demande, et l’administrateur gère les attributions, les campagnes, et génère des rapports (PDF/Excel).

🧰 Technologies utilisées

Frontend : React + Vite

Backend : Node.js + Express

Base de données : PostgreSQL

API : REST (JSON)

📥 Installation

Cloner le dépôt

git clone https://github.com/CHAHINDA/4eme-annee-projet.git
cd 4eme-annee-projet


Installer les dépendances

npm install


Configurer la base de données

Créer une base PostgreSQL nommée Marsa

Vérifier ton fichier .env à la racine du projet :

PORT=5000
DATABASE_URL=postgres://postgres:5432@localhost:5432/Marsa

▶️ Lancer l’application

Démarrer le backend (Node.js + Express)

node server.js


Le serveur API sera accessible sur http://localhost:5000

Il utilise la configuration de la base de données dans le .env

Démarrer le frontend (React + Vite)

npm run dev


Vite affichera l’URL de développement, généralement http://localhost:5173

L’application React communique automatiquement avec le backend

Accéder à l’application

Ouvrir le navigateur et aller sur l’URL affichée par Vite (http://localhost:5173)

🛠 Utilisation
Employés

Créer un compte ou se connecter

Soumettre une demande de séjour

Suivre le statut de leurs demandes

Administrateur

Gérer les utilisateurs et les campagnes

Valider ou refuser les demandes

Exporter les rapports (PDF/Excel)

Consulter l’historique et la liste des bénéficiaires
