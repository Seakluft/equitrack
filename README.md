# EquiTrack

EquiTrack est une application de suivi des cours d'équitation, spécialement conçue pour les cavaliers montant le samedi.

## Fonctionnalités

- **Calendrier du Samedi :** Affiche uniquement les samedis de la saison (Septembre à Juin).
- **Synchronisation Vacances Scolaires (Zone B) :** Cache automatiquement les samedis de vacances, tout en conservant le premier samedi après la fin des cours.
- **Suivi de Présence :** Marquez votre présence ou absence. Les séances d'absence sont grisées/barrées.
- **Personnalisation :** Ajoutez vos chevaux et choisissez la discipline pratiquée.
- **Statistiques Avancées :**
  - Nombre de séances par cheval et par discipline.
  - Estimation des calories brûlées.
  - Calcul du coût par séance basé sur la licence et le forfait.
- **Docker Ready :** Lancez l'application en une commande.

## Installation avec Docker

1. Assurez-vous d'avoir Docker et Docker Compose installés.
2. Clonez le dépôt :
   ```bash
   git clone https://github.com/Seakluft/equitrack.git
   cd equitrack
   ```
3. Lancez l'application :
   ```bash
   docker-compose up -d
   ```
4. Ouvrez votre navigateur sur `http://localhost:7654`.

## Développement

Pour lancer en mode développement :

```bash
npm install
npm run dev
```

## Technologies

- React 19 + TypeScript
- Vite
- CSS Modules (Thème "Equestrian Classic")
- API data.education.gouv.fr (Calendrier scolaire)
- Lucide React (Icones)
