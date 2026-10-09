# Intégration avec l’application Idealy existante

Cette branche est une expérimentation d’interface indépendante. Elle ne remplace pas le dépôt original et n’embarque pas une deuxième implémentation du backend.

## Raccordements prévus

- **Chat et démarrage de mission** : remplacer la fonction de démonstration `startProject` par l’adaptateur vers le chat et l’orchestrateur existants. Les demandes conversationnelles courtes (salutations, petites questions) doivent suivre le chemin rapide, sans lancer toute l’escouade. Une demande de construction doit déclencher le workflow complet.
- **Canvas et fichiers** : garder XYFlow comme couche de visualisation interactive, puis relier les nœuds aux états de mission et au cycle de vie d’artefact/fichiers déjà géré par le dépôt d’origine.
- **Agents** : réutiliser Chief, Builder, Designer, Specialist et Reviewer, y compris leurs événements d’exécution réels. Les statuts d’attente visibles actuellement sont intentionnels.
- **Connecteurs** : le catalogue reprend les neuf définitions de `lib/idealy/connectors/catalog.ts` : Canva, GitHub, Google Drive, Vercel, Supabase, Figma, Notion, Slack et Stripe. Les états « configuré » ou « planifié » reflètent le catalogue d’origine ; dans ce dépôt isolé, aucune connexion n’est active. Les actions ne font que marquer localement les intégrations à raccorder. Réutiliser les véritables routes OAuth/serveur et les autorisations existantes.
- **Plans et Power** : les tarifs visibles sont repris de `config/pricing.ts` sur `feat/idealy-live-backend` : Découverte 0 € / 200 Power Points par mois, Pro 19 € par mois ou 190,80 € par an, Business 49 € par mois ou 490,80 € par an et Enterprise sur mesure. Les plafonds affichés sont respectivement 250, 3 500 et 7 000 Power Points. Les prix annuels sont présentés aussi en équivalent mensuel. Aucun paiement n’est déclenché dans cette branche.
- **Langue** : seul le français est activé. L’anglais et l’espagnol restent désactivés tant que tous les écrans et états ne possèdent pas de traductions complètes.
- **Authentification et onboarding** : lors de la fusion, conserver les écrans d’accueil, d’inscription et de collecte initiale du profil qui sont déjà dans le dépôt d’origine.

## Interactions de la maquette

- `Ctrl/⌘ + K` ouvre la palette de commandes ; flèches haut/bas puis Entrée permettent de naviguer.
- `Ctrl/⌘ + J` ouvre un nouveau projet.
- Les salutations et questions identifiées restent sur la voie conversationnelle et ne déclenchent pas les agents. La réponse de salutation visible est une démonstration locale ; aucune IA n’est appelée.
- `/` place le curseur dans la recherche de connecteurs (hors champ de saisie).
- Les nœuds du canvas se déplacent et peuvent être reliés ; cette édition reste locale à la session.
- Thème clair/sombre, filtres de connecteurs, onglets de canvas et notifications sont interactifs.

## Ce qui n’est pas encore connecté

Le dépôt n’affirme pas que la génération IA, les agents, la sauvegarde de projet, OAuth, les événements de notification ou la facturation sont actifs. Les petits messages de démonstration le précisent. Le travail suivant est le raccordement progressif de cette interface aux contrats et services déjà présents dans Idealy, pas leur réécriture.
