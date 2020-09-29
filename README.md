# HarpejjiTabs

Ce projet porte sur la réalisation d'une application web (SPA/PWA?) permettant d'éditer des tablatures pour un nouvel instrument de musique dérivé de la guitare et du clavier: *l'harpejji*.

## Contexte

L'*harpejji* est un instrument de musique développé au début du XXIe siècle par Tim Meeks. Il s'agit d'un instrument électroacoustique construit comme une guitare mais se jouant comme un clavier (cf https://www.marcodi.com/ pour plus de détails).

[![Video: exemple de  harpejji](pics/video_preview.png)](http://www.youtube.com/watch?v=mCOFwpK_NKM "Harpejji et melodion - Black Orpheus")

Une communauté est en train de se former autour de l'instrument (notamment via le [forum](https://www.marcodi.com/pages/harpejji-hangout) dédié) et des échanges se mettent en place autour de sa technique de jeu.

Dans ce contexte, le besoin se fait sentir de développer des moyens simples de communiquer autour des doigtés pour les gammes, accords et autres motifs (voir par exemple http://www.matthieuamiguet.ch/blog/harpejji-jazz-voicings-2)

## Diagrammes d'accord

L'idée de ce projet est de développer un éditeur de tablatures similaires à des [diagrammes d'accords](https://blog.myguitare.com/accord-guitare/comment-lire-un-diagramme-accord) de guitare, mais adapté aux besoins spécifiques de l'harpejji. Les différences suivantes sont en particulier à prendre en compte:

- Le nombre élevé de cordes (jusqu'à 24 suivant les modèles) fait qu'on ne représentera que des petites parties de la touche (aka *fretboard*).
- Le marquage en blanche et noires similaire à un piano doit être représenté, avec un symbole particulier pour localiser les *do*.
- Sur un diagramme de guitare, le sillet est en haut (donc les frettes numérotées de haut en bas) alors que pour l'harpejji il est plus logique de mettre le sillet en bas (et donc de numéroter les frettes de bas en haut).

Exemples de tablatures à générer:

![Harpejji Cm7 fingering](http://www.matthieuamiguet.ch/media/misc/harpejji_tabs/cm7.svg) ![Harpejji F7 fingering](http://www.matthieuamiguet.ch/media/misc/harpejji_tabs/f7.svg) ![Harpejji Bbmaj7 fingering](http://www.matthieuamiguet.ch/media/misc/harpejji_tabs/bbmaj7_2.svg) ![Harpejji Ebmaj7 fingering](http://www.matthieuamiguet.ch/media/misc/harpejji_tabs/ebmaj7.svg)

![Harpejji Am7b5 fingering](http://www.matthieuamiguet.ch/media/misc/harpejji_tabs/am7b5.svg) ![Harpejji D7 fingering](http://www.matthieuamiguet.ch/media/misc/harpejji_tabs/d7.svg) ![Harpejji Gm7 fingering](http://www.matthieuamiguet.ch/media/misc/harpejji_tabs/gm7_2.svg)

## Fonctionnalités attendues

Au minimum

- Possibilité de choisir le nombre de cordes et de frettes à représenter et l'emplacement sur la touche (y.c. en cours d'édition d'un diagramme)
- Possibilité de placer/déplacer/supprimer des pastilles de différentes couleurs sur les cases, avec ou sans chiffre (ou éventuellement un autre contenu) à l'intérieur
- Intégration d'un titre au diagramme
- Possibilité de sauvegarder des diagrammes pour les recharger plus tard (local storage / importation+exportation vers le système de fichiers / stockage sur serveur / stockage cloud / ... ?)
- Possibilité de récupérer le diagramme dans un format image (svg, jpg, ...?) pour l'intégrer dans un autre document
- L'éditeur devra être utilisable sur téléphone comme sur *desktop*.

Éventuellement

- Jouer la note correspondante lors du placement d'une pastille (doit rester optionnel!)
- Ajouter une indication d'un numéro de corde et/ou de frette si désiré
- Possibilité de *transposer* un diagramme (décalage de *n* frettes et/ou cordes)
- Fonctionnement *offline*
- Possibilité d'organiser ses tablatures pour les consulter facilement
- Possibilité de partager les tablatures avec d'autres utilisateurs (format d'importation/exportation ou serveur de partage?)

## Prototype

Un prototype de classe en python permettant de générer des tablatures en svg est disponible dans le répertoire `py_proto`.

## Technique

- On préférera une architecture n'impliquant pas le stockage de données utilisateurs sur un serveur. Idéalement, un simple hébergement statique devrait suffire.
- Idéalement le projet sera basé sur *vue.js*.
- Le code sera publié sous licence libre.
