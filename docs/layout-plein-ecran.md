# Layout plein écran sans scroll (affichage second écran)

`AlmanaxCalendar` ([components/almanax/almanax-calendar.tsx](../components/almanax/almanax-calendar.tsx))
est pensé pour être affiché sur un second écran (type wallboard) : tout le
contenu doit tenir dans la hauteur de la fenêtre, sans jamais scroller,
quel que soit le nombre de semaines du mois affiché (5 ou 6).

Ce comportement **ne s'applique qu'à partir du breakpoint `md`**. En
dessous, le composant bascule sur une liste verticale simple
([almanax-day-list.tsx](../components/almanax/almanax-day-list.tsx)) qui
scrolle normalement — voir la section [Petits écrans](#petits-écrans-en-dessous-de-md)
en bas de page. Tout ce qui suit décrit uniquement le comportement
`md:` et plus.

`h-svh` seul ne suffit pas. C'est une chaîne de règles, du conteneur
racine jusqu'à chaque case, qui produit cet effet.

## La chaîne, étape par étape

**1. `md:h-svh` — fixe le budget total**
Sur le conteneur racine, uniquement à partir de `md`. En dessous de
`md`, aucune hauteur n'est imposée : le conteneur prend la somme des
hauteurs de son contenu, comme une page normale (c'est voulu, voir plus
bas).

**2. `md:overflow-hidden` — interdit le scroll, autorise le rognage**
C'est cette règle qui empêche réellement le scroll. Sans elle, si le
contenu dépasse `h-svh`, le navigateur affiche une scrollbar. Avec elle,
le surplus est simplement coupé : le pire cas devient "du contenu rogné",
jamais un scroll.

**3. `flex flex-col` + `min-h-0` — empile verticalement, autorise le rétrécissement**
Le conteneur (et son wrapper interne `max-w-6xl`) est un flex column :
en-tête, offrande du jour, grille, footer, empilés. `min-h-0` est
indispensable ici : par défaut, un enfant flex refuse de rétrécir sous la
hauteur de son contenu (`min-height: auto` implicite). Sans ce
`min-h-0`, l'étape 5 ci-dessous ne pourrait jamais se comprimer.

**4. `shrink-0` sur les sections à taille fixe**
En-tête, offrande du jour, ligne des jours de la semaine, footer : "ne
rétrécis jamais, garde ta taille naturelle". Ce sont les seules parties
dont la hauteur est dictée par leur contenu.

**5. `flex-1 min-h-0` sur la zone calendrier**
"Prends tout l'espace restant" une fois les sections `shrink-0`
déduites — et encore un `min-h-0` pour pouvoir vraiment se comprimer
plutôt que déborder.

**6. `gridTemplateRows: repeat(weekCount, minmax(0, 1fr))` — répartit l'espace restant**
La grille des cases utilise `minmax(0, 1fr)` et non `1fr` tout court.
`1fr` seul a un plancher implicite égal à la hauteur du contenu de la
ligne (`auto`) — c'est l'équivalent CSS Grid du `min-height: auto` en
flexbox. Le `0` dans `minmax(0, 1fr)` supprime ce plancher, exactement
comme `min-h-0` le fait pour flexbox. `weekCount` (5 ou 6) est calculé
dynamiquement selon le mois affiché.

**7. `h-full` sur chaque case**
([components/almanax/almanax-day-cell.tsx](../components/almanax/almanax-day-cell.tsx))
remplit la hauteur que l'étape 6 lui a attribuée, avec `overflow-hidden`
en sécurité si une ligne devient trop courte pour son contenu.

## Le principe général (réutilisable)

Pour qu'un layout tienne dans une hauteur fixe sans scroll :

1. Fixer la hauteur en un seul endroit (`h-svh` sur le conteneur racine).
2. `overflow-hidden` sur ce même conteneur.
3. Chaque niveau flex intermédiaire a besoin de `min-h-0` sur les
   éléments qui doivent pouvoir rétrécir (`flex-1 min-h-0`), sinon le
   plancher `min-height: auto` remonte et casse toute la chaîne.
4. Idem côté CSS Grid : `minmax(0, 1fr)` et non `1fr` seul.
5. Les sections à taille fixe (en-têtes, footers, libellés) doivent être
   explicitement `shrink-0` pour ne pas se faire écraser par le `flex-1`.

Le piège le plus fréquent : oublier un seul `min-h-0` (ou `minmax(0, …)`)
quelque part dans la chaîne. Le contenu de cet élément retrouve alors sa
taille naturelle, pousse tout le reste, et le scroll (ou le débordement)
revient — souvent uniquement visible sur un mois à 6 semaines, ce qui le
rend facile à manquer en test rapide.

## Petits écrans (en dessous de `md`)

La grille kiosk (icône, nom, quantité, actions dans une case de ~50px de
large sur mobile) n'est pas adaptable en dessous d'une certaine largeur —
plutôt que de la comprimer jusqu'à l'illisible, `AlmanaxCalendar` rend
deux présentations distinctes et bascule entre elles en CSS pur
(`hidden md:flex` / `md:hidden`), pas de détection JS de la largeur
d'écran :

- **`md:` et plus** — la grille kiosk plein écran décrite ci-dessus.
- **En dessous de `md`** — [`AlmanaxDayList`](../components/almanax/almanax-day-list.tsx),
  une liste verticale d'une ligne par jour (icône, nom, quantité, kamas,
  statut préparé/fait). Le scroll de page normal est autorisé — aucune
  des règles `min-h-0`/`overflow-hidden` ci-dessus ne s'applique côté
  mobile. Le détail du bonus n'est pas affiché en ligne : cliquer sur une
  ligne ouvre la même modale ([almanax-day-dialog.tsx](../components/almanax/almanax-day-dialog.tsx))
  que la grille kiosk.

Les deux présentations partagent le même état (mois courant, statuts,
nombre de personnages) porté par `AlmanaxCalendar` — seule la partie
présentation change entre `AlmanaxTopBar` + grille/`AlmanaxDayCell` et
`AlmanaxTopBar` + `AlmanaxDayList`.
