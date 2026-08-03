# Instructions pour Claude

- Ne jamais lancer `npm run dev`, `npm run build`, ou tout serveur de développement de ce projet.
- Ne jamais utiliser chromium/chromium-cli ou un navigateur headless pour tester l'application.
- L'utilisateur s'occupe lui-même de lancer et de tester l'application.
- N'effectue ces actions que si l'utilisateur le demande explicitement dans sa requête.

`npm run lint` et `npm run typecheck` restent autorisés pour vérifier le code.

## Layout de l'Almanax

`AlmanaxCalendar` est destiné à un affichage second écran : tout doit
tenir dans la hauteur de la fenêtre, sans scroll, y compris sur un mois à
6 semaines. Voir [docs/layout-plein-ecran.md](docs/layout-plein-ecran.md)
pour le détail de la technique (chaîne `h-svh` → `overflow-hidden` →
`flex-1 min-h-0` → `minmax(0, 1fr)`) avant de toucher au layout de
`components/almanax/almanax-calendar.tsx` ou `almanax-day-cell.tsx` :
il suffit d'oublier un `min-h-0` pour réintroduire le scroll.
