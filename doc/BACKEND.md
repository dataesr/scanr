---
title: "scanR data layer documentation"
authors: "A2_4"
date: "06-01-2020"
---

# scanR data layer documentation.

## 1. Introduction.

scanR est une application web permettant d'explorer la recherche et l'innovation française. Plus précisément, il s'agit d'une combinaison de quatre moteurs de recherche respectivement construit en indexant des données structurées et semi-structurées relatives à quatre types d'objets:
  - des organisations accueillant, favorisant ou finançant de la R&D (ci-après structures ou organisations),
  - des financements ou des projets de recherche,
  - des productions scientifiques (brevets, publications, thèses),
  - des auteurs de productions scientifiques.

L'application globale se décompose en trois couches principales.

  1. le front-office, chargé de produire une interface utilisateur à l'application. Elle est intégralement gérée et dévellopée par le département d'outil d'aide à la décision du ministère de l'enseignement supérieur de la recherche et de l'innovation.

  2. le back-office, chargée d'indexer les données dans un moteur de recherche et de fournir des api pour le requètage du moteur pour une servir l'application front-office. Ce service est opéré intégralement par le préstataire du ministère, le groupe SWORD.

  3. dataESR, l'application chargée de collecter les données, de les transformer, de les enrichir, de les corriger et de les exposer. Cette couche, plus générale que les deux autres exclusivement dévolue à scanR, est décrite plus en détail dans le présent document.


## 2. Architecture générale.

L'application est segmentée en plusieurs services conteneurisés et stocke les données sur une instance mongoDB.
Chaque micro-service a une responsabilité limité à son propre périmètre et la défaillance d'un service ne provoque pas la destruction de toute l'application. Néanmoins, certains services interconnectés peuvent ne pas être complètement opérationnel si un service dépendant est indisponible.
Chaque service peut avoir une ou plusieurs missions parmis les suivantes:
  - Collecte de données,
  - Transformation de données,
  - Enrichissement de données,
  - Exposition API de données,
  - Export de données,
  - Interface utilisateur,
  - Reverse proxy.

Aucune donnée stocké par l'application


### 2.1 Base de données.

L'application stocke l'intégralité de ses données sur une instance mongoDB. Cette instance peut être distante ou installée sur la même machine (comme c'est le cas sur notre serveur). La configuration de connexion à cette instance mongoDB se fait grâce au fichier .env des services qui l'utilisent. Chaque service, s'il a besoin de stocker des données, est responsable d'une ou plusieurs collection auxquelles il est le seul à pouvoir accéder. Il propose si nécessaire des API pour que d'autres processus ou d'autres services puisse modifier ou lire ses données. La base de donnée n'est donc pas directement accessible depuis l'extérieur.

### 2.2 Services de l'application.

L'application comporte 13 services qui sont détaillées dans la partie 3 de ce document:
  - nginx -- reverse proxy pour les autres applications
  - geocoder --  Permet le geocodage d'adresses
  - persons -- Gère les personnes/auteurs
  - organizations -- Gère les organisations
  - publications -- Gère les publications
  - patents -- Gère les brevets/inventions
  - projects -- Gère les projets/financements
  - rnsr-fetcher --
  - sirene-fetcher
  - ui -- Interface utilisateur d'administration de données et monitoring
  - filebeat -- ETL pour les logs des applications
  - metricbeat -- ETL pour les metriques des applications
  - elasticsearch -- stockage et API pour les logs et les métriques



### 2.3 Technologies utilisées.

Python, avec [flask](https://flask.palletsprojects.com/en/1.1.x/) pour les services web, [celery](http://www.celeryproject.org/) pour les services asyncrones. Les API utilisent le framework [EVE](http://docs.python-eve.org/en/stable/) pour exposer les données de façon 'RESTful'.

Docker et docker-compose sont utilisées pour construire les applications dans des conteneurs.

ReactJS pour les interfaces utilisateur.

Elasticsearch stock et les métriques d'utilisation et les logs des applications fourni par Metricbeat et Filebeat


### 2.3 Instructions de lancement des services

L'application dans son ensemble peut être lancé via un fichier docker-compose.yml sur une seule machine avec la commande ```docker-compose up -d```. Un serveur nginx faisant office de reverse-proxy est lancé également, permettant à tous les services d'être accessible sur le port 80 (et/ou 443) d'une machine.


## 3. Description des services.

### 3.1 RNSR fetcher
[*Github*](http://https://github.com/dataesr/RNSR), [*Docker*](http://https://hub.docker.com/repository/docker/dataesr/rnsr-fetcher), [*Swagger*](http://185.161.45.213/fetchers/rnsr/doc)

- *Stockage de données*: NON
- *Acces mongo*: NON
- *Missions*: Collecte de données, Exposition API de données
- *Dépendances interne*: aucune
- *Dépendances externe*: Base de donnée du RNSR.
- *Fonctionnalité(s)*:
  - Expose les données du RNSR en JSON

Ce service récupère les données des structures de recherche du Répertoire National des structures de recherche (RNSR ci-après) directement via une connexion à la base de donnée RNSR. Cette connexion passe par un tunnel SSH mis en place par la DNE entre le serveur applicatif et le serveur du RNSR. La connexion est sécurisé par identifiant et mot de passe coté RNSR.

Le service récupère toute les données d'intéret pour scanR. Cela comprend les méta données de base des structures (label, identifiants, adresse), ainsi que ses liens à d'autres organisations (tutelles, prédécesseurs, parents) et ses responsables.

<details>
  <summary>Voir le modèle de données complet</summary>

  ```json
  TODO
  {
    "id": {
      "type": "string",
      "description": "Identifiant RNSR de la structure de recherche",
      "regex": "^([0-9]{9}[A-Z]{1})$"
    },
    "description": {
      "type": "string",
      "description": "Description d'une structure de recherche."
    },
    "website": {
      "type": "string",
      "description": "Une URL du site web de la structure"
    },
    "type": {
      "type": "string",
      "description": "Secteur de la structure (toujours Structure de recherche ici)",
      "traitement": "Dérivé du code_nature suivant un mapping propre à #dataesr"
    },
    "level": {
      "type": "string",
      "description": "Type de structure",
      "traitement": "Dérivé du code_nature suivant un mapping propre à #dataesr"
    },
    "input_address": {
      "type": "string",
      "description": "Adresse de la structure",
      "traitement": null
    },
    "name": {
      "type": "string",
      "description": "Nom de la structure",
      "traitement": null
    },
    "dates": {
      "type": "object",
      "object": {
        "start_date": {
          "description": "Date de début de la structure",
          "traitement": "Les années de début des données sources sont remplacées une date (1 jan)"
        },
        "end_date": {
          "description": "Date de fin de la structure",
          "traitement": "Les années de début des données sources sont remplacées une date (31 déc)"
        }
      }
    },
    "email": {
      "type": "string",
      "description": "Mail de contact de la structure",
    },
    "phone": {
      "type": "string",
      "description": "Téléphone de contact de la structure",
      "traitement": null
    },
    "code_numbers": {
      "type": "list",
      "schema": {
        "type": "string",
        "description": "Label numéro d'une structure"
      }
    },
    "rnsr_domains": {
      "type": "list",
      "schema": {
        "type": "string",
        "description": "Domains de recherche des structures provenant des domaines scientifiques"
      }
    },
    "rnsr_themes": {
      "type": "list",
      "schema": {
        "type": "string",
        "description": "Domains de recherche des structures provenant des domaines d'application"
      }
    },
    "panels": {
      "type": "list",
      "schema": {
        "type": "object",
        "schema": {
          "code": {
            "type": "string",
            "description": "Code de panel ERC"
          },
          "end_date": {
            "type": "datetime",
            "description": "Panel ERC n'est plus associé à la structure depuis..."
          },
          "start_date": {
            "type": "datetime",
            "description": "Panel ERC associé à la structure depuis..."
          }
        }
        }
    },
    "leaders": {
      "type": "list",
      "description": "Dirigeants de la structure",
      "schema": {
        "type": "object",
        "schema": {
          "rnsr_key": {
            "type": "string",
            "description": "Identifiant du leader dans le RNSR"
          },
          "end_date": {
            "type": "datetime",
            "description": "Début d'exercice du leader"
          },
          "start_date": {
            "type": "datetime",
            "description": "Fin d'exercice du leader"
          },
          "role": {
            "type": "datetime",
            "description": "Role dans la structure"
          }
        }
      }
    },
    "predecessors": {
      "type": "list",
      "description": "Prédécesseur de la structure",
      "schema": {
        "type": "object",
        "schema": {
          "succession_type": {
            "type": "string",
            "description": "Type de succession"
          },
          "succession_date": {
            "type": "datetime",
            "description": "Date à laquelle s'est passé la succession"
          },
          "id": {
            "type": "string",
            "regex": "^([0-9]{9}[A-Z]{1})$",
            "description": "Identifiant RNSR du prédécesseur"
          }
        }
        }
    },
    "parents": {
      "type": "list",
      "description": "Parents de la structure",
      "schema": {
        "type": "object",
        "schema": {
          "id": {
            "type": "string",
            "regex": "^([0-9]{9}[A-Z]{1})$",
            "description": "Identifiant RNSR du parent"
          },
          "start_date": {
            "type": "datetime",
            "description": "Début de la relation"
          },
          "end_date": {
            "type": "datetime",
            "description": "Fin de la relation"
          },
          "exclusive": {
            "type": "boolean",
            "description": "true si la relation est exclusive"
          }
        }
      }
    },
    "supervisors": {
      "type": "list",
      "description": "Tutelles de la structure",
      "schema": {
        "type": "object",
        "schema": {
          "rnsr_key": {
            "type": "string",
            "description": "Identifiant RNSR de la tutelle"
          },
          "start_date": {
            "type": "datetime",
            "description": "Début de la relation"
          },
          "end_date": {
            "type": "datetime",
            "description": "Fin de la relation"
          },
          "supervision_type": {
            "type": "string",
            "description": "Type de supervision"
          },
          "name": {
            "type": "string",
            "description": "Nom de la tutelle"
          }
        }
      }
    },
    "doctoral_schools": {
      "type": "list",
      "description": "Ecole doctorales rattachées à la structure",
      "schema": {
        "type": "object",
        "schema": {
          "id": {
            "type": "string",
            "description": "Identifiant du l'école doctorale"
          },
          "end_date": {
            "type": "datetime",
            "description": "Fin de la relation"
          },
          "start_date": {
            "type": "datetime",
            "description": "Début de la relation"
          }
        }
      }
    }
  }
  ```
</details>
<br/>

Certaines données sont nettoyées avant l'exposition par l'API. Des dates sont réconciliées pour dédoublonner au maximum les entrée dans la base. Les adresses sont nettoyées.

L'application expose plusieurs routes permettant de récupérer des informations sur les structures de recherche, dans un format JSON adéquat pour l'application #dataesr. Des routes permettent également de récupérer les données pour une mise en forme CSV pour les jeux RNSR opendata. Pour plus de détails sur l'utilisation de l'API, rendez-vous sur la [documentation swagger](http://185.161.45.213/fetchers/rnsr/doc)


### 3.2 Sirene fetcher

[*Github*](http://https://github.com/dataesr/sirene), [*Docker*](http://https://hub.docker.com/repository/docker/dataesr/sirene-fetcher), [*Swagger*](http://185.161.45.213/fetchers/sirene/doc)

- *Stockage de données*: NON
- *Acces mongo*: NON
- *Missions*: Collecte de données, Transformation de données, Exposition API de données
- *Dépendances interne*: aucune
- *Dépendances externe*: API SIRENE.
- *Fonctionnalité(s)*:
  - Expose les données du répertoire SIRENE en JSON


Ce service récupère les données des organisations présentes dans le répertoire Sirene via l'[API](https://api.insee.fr/) mise en place par l'insee.

Le service récupère toute les données d'intéret pour scanR. Cela comprend les méta données de base des structures (label, identifiants, adresse), ainsi que des codes et libellés de nomenclatures (ie. catégories juridiques, code APE). Le modèle est détaillé ci-après.

<details>
  <summary>Voir le modèle de donnée complets</summary>

  ```json
  {
  	"siren": {
  		"description": "Numéro d'identification siren",
  		"type": "string",
  		"regex": "^([0-9]{9})$"
  	},
  	"siren": {
  		"description": "Numéro d'identification siret (siret du siège au niveau du siren)",
  		"type": "string",
  		"regex": "^([0-9]{14})$"
  	},
  	"dates": {
  		"type": "dict",
  		"schema": {
  			"start_date": {
  				"type": "datetime",
          "description": "Date de début de l'organisation",
  			},
  			"end_date": {
  				"description": "Closing date",
  				"type": "datetime",
          "description": "Date de fin de l'organisation",
  			}
  		}
  	},
  	"level": {
  		"type": "string",
      "description": "Type de la structure",
      "traitement": "Dérivé du code de catégorie juridique suivant un mapping propre à #dataesr"
  	},
  	"type": {
  		"type": "string",
      "description": "Secteur de la structure",
      "traitement": "Dérivé du code de catégorie juridique suivant un mapping propre à #dataesr"
  	},
  	"name": {
  		"type": "dict",
  		"schema": {
  			"label": {
  				"description": "Nom de la structure",
  				"type": "string"
  			},
  			"acronym": {
  				"description": "Acronyme de la structure",
  				"type": "string"
  			}
  		}
  	},
  	"human_ressources": {
  		"type": "dict",
  		"schema": {
  			"employees_slice": {
  				"description": "Code de tranche d'effectif",
  				"type": "string"
  			},
  			"date": {
  				"description": "Date de validité de la tranche d'effectif",
  				"type": "string"
  			}
  		}
  	},
  	"aliasses": {
  		"type": "list",
  		"schema": {
  			"type": "string",
        "description":"Autres (anciens) nom et dénominations de la structure",
  		}
  	},
  	"input_address": {
      "description": "Adresse de la structure",
  		"type": "string"
  	},
  	"city_code": {
  		"type": "string",
      "description": "Code commune de la structure"
  	},
  	"category": {
  		"type": "string",
      "description": "Catégorie de la structure dans SIRENE (PME, ETI, GE, TPE)"
  	},
  	"headquarter": {
  		"type": "boolean",
      "description": "true si le siret est un siège"
  	},
  	"legal_category": {
  		"type": "string",
      "description": "Code de catégorie juridique de la structure"
  	},
  	"naf_code": {
  			"type": "string",
        "description": "Code APE de la structure"
  	}
  }
  ```
</details>
<br/>


Les données sont transformées dans une format plus 'lisible' et adéquat pour l'application #dataesr. Un mapping des type d'organisme est fait afin de coller à la nomenclature des types d'organisations de #dataesr.

L'application expose plusieurs routes permettant de récupérer des informations sur les organisations présentes dans le répertoire sirene, dans un format JSON adequat pour l'application #dataesr. Pour plus de détails, voir la [documentation swagger](http://185.161.45.213/fetchers/sirene/doc)


### 3.3 Geocoder
Voir sur: [*Github Repos*](http://https://github.com/dataesr/geocoder), [*Docker image*](http://https://hub.docker.com/repository/docker/dataesr/geocoder), [*Documentation*](http://185.161.45.213/geocode/doc)
- *Stockage de données*: NON
- *Acces mongo*: NON
- *Missions*: Collecte de données, Transformation de données, Exposition API de données
- *Dépendances interne*: aucune
- *Dépendances externe*: adresses.gouv.fr, openstreetmap.
- *Fonctionnalité(s)*:
  - Géocode une adresse d'entrée et renvoi une adresse complète et propre avec coordonnées (si trouvées).

Ce service expose une API de géocodage, qui utilise les services de adresse.gouv.fr et d'openstreetmap afin de géocoder une adresse postale. Elle renvoie une adresse géocodée dans le format adresse de #dataesr. Les champs renvoyé sont un mapping des champs revoyés par les adresse.gouv.fr et/ou openstreetmap.

<details>
  <summary>Voir le modèle de donnée complets</summary>

  ```json
  {
    "input_address": {
      "type": "string",
      "description": "Adresse renseignée dans le champs 'location' de l'API par l'utilisateur"
    },
    "housenumber": {
      "type": "string",
      "description": "Numéro de rue",
    },
    "street": {
      "type": "string",
      "description": "Nome de la voie",
    },
    "post_code": {
      "type": "string",
      "description": "Code postal",
    },
    "city_code": {
      "type": "string",
      "description": "Code commune -- seulement pour les adresses françaises et comme provider adress.data.gouv.fr"
    },
    "city": {
      "type": "string",
      "description": "Ville",
    },
    "country": {
      "type": "string",
      "description": "Pays -- France par default avec provider adress.data.gouv.fr",
    },
    "geocoded": {
      "type": "boolean",
      "description": "Un booléen -- True si le géocodage est un succès",
    },
    "score": {
      "type": "numeric",
      "description": "Score du géocodeur",
    },
    "precision": {
      "type": "string",
      "description": "Précision du résultat -- housenumber, street etc.",
    },
    "provider": {
      "type": "string",
      "description": "Fournisseur du service",
    },
    "coordinates": {
      "type": "object",
      "schema": {
        "lat": {
          "type": "numeric",
          "description": "latitude"
        },
        "lon": {
          "type": "numeric",
          "description": "longitude"
        }
      }
    }
  }
  ```
</details>
<br/>


### 3.4 Organisations

Voir sur [*Github*](http://https://github.com/dataesr/organizations), [*Docker*](http://https://hub.docker.com/repository/docker/dataesr/organizations), [*Swagger*](http://185.161.45.213/organizations/doc)

- *Stockage de données*: OUI
- *Acces mongo*: OUI
- *Missions*: Collecte de données, Transformation de données, Exposition API de données, Export de données
- *Dépendances interne*: aucune.
- *Dépendances externe*: Persons, Geocoder, Datastore.

Application dédiée aux organisations dans #dataesr. Elle est en charge:
1. du workflow de mise à jour automatique des documents liées aux organisations,
2. de l'exposition d'une API pour les données des organisations, et pour des fonction (notamment de matching d'organisation)
3. de l'export de ces données en une version compatible avec l'application scanR,

#### 3.4.1 Workflow de mise à jour et traitement des données.

La mise à jour d'un document relatif à une orgnanisation se fait avec le point d'entré *_update* qui prend un identifiant comme paramètre. Si une seule source de donnée est identifiée pour cette organisation, la mise à jour est simplifiée et les logiques de traitement métier permettent une mise à jour sans conflit (par exemple, le code de catégorie juridique pour une organisation n'ayant qu'un sirene sera mis à jour directement avec les données sirene). Les données précédentes seront conservés avec une date de fin correspondante à la date de la mise à jour. Ainsi, on peut garder un hstorique des changements opérés sur la base source. Si plusieurs source fournissent des données pour la même orgnaisation, une gestion de conflit existe. Elle peut être soit automatique (par exemple, le secteur fourni par sirene est systematiquement préféré à celui fourni par grid) soit marquée comme conflictuelle grace aux champs `status`. Une intervention est alors nécéssaire de la part d'un administrateur de donnée (les addresses des deux sources ne coincident pas. Faut-il en privilégier une ? Faut-il garder la deuxième comme addresse secondaire ?). Ces opération peuvent être faite via l'interface utilisateur ou directement via l'API.

Des traitements sont appliqués et modifient les données source dans certains cas.
Lorsque c'est possible, un effort est fait pour dédoublonner certaines liste (par exemple si une organisation a deux fois une tutelle identique avec des dates successives, une jointure est faite entre les deux elements).
Les addresses sont géocodées grâce à l'application Geocoder mais l'addresse brut est conservée.
Enfin, certains champs avec relations à d'autre structures ou à des personnes sont automatiquement rattaché l'objet correspondant dans #dataesr, lorsque cette opération est possible. Pour les `leaders` l'application utilise le point d'entré *_match* de l'application Persons afin de retrouver l'identifiant idref du leader. Les données bruts de la source sont conservées.
Ces opérations permettent ensuite à scanR de proposer une navigation fluide entre ses propres objets et d'aggréger ces données pour des visualisations plus éclairantes.

Ces processus de mise à jour peuvent également et opérés en 'batch', et lancées depuis l'interface utilisateur. Par example, 'Raffaraichir RNSR' provoque un update de toutes les organizations ayant un identifiant RNSR et ajoute les nouvelles structures.
La même chose peut etre fait avec SIRENE et GRID.



#### 3.4.2 APIs et export

Cette application expose une API RESTful de la collection 'organizations' qui est un ensemble de documents représentant des organisations. Le modèle de donnée retenu pour ces documents permet de gérer à la fois un historique des données et des conflits liés à la mise à jour de source que l'application n'a pas pu résoudre avec les règles métiers établies. Il appartient aux administrateurs des données de venir régler les conflits dans l'interface utilisateur, ou via des scripts utilisant l'API. Cette API permet toutes les opérations CRUD à savoir le GET, POST, PATCH et DELETE.

<details>
  <summary>Voir le modèle de donnée complets</summary>

  ```json
  {
    "id": {
      "type": "string",
      "description": "Identifiant"
    },
    "status": {
      "type": "string",
      "description": "status of the organizations"
    },
    "bce": {
      "type": "string",
      "description": "Identifiant UAI de la BCE"
    },
    "grid": {
      "type": "string",
      "description": "Identifiant dans la Base GRID.ac"
    },
    "rnsr": {
      "type": "string",
      "description": "Identifiant dans le RNSR"
    },
    "ed": {
      "type": "string",
      "description": "Identifiant d'école doctorale"
    },
    "sirene": {
      "type": "string",
      "description": "Identifiant Sirene"
    },
    "headquarter": {
      "type": "string",
      "description": "Est-ce un siège ? (complété uniquement pour les organisations ayant un sirene)"
    },
    "dataesr": {
      "type": "string",
      "description": "Identifiant dataesr pour les organisation non présentes dans une base source"
    },
    "rnsr_key": {
      "type": "string",
      "description": "Identifiant d'institution dans le RNSR, permet le matching de tutelles"
    },
    "active": {
      "type": "boolean",
      "description": "true si l'organisation est active?"
    },
    "foreign": {
      "type": "boolean",
      "description": "true si l'organisation est étrangère"
    },
    "types": {
      "description": "Liste de secteur",
      "type": "list",
      "schema": {
        "type": "string",
        "description": "Secteur de l'organisation"
      }
    },
    "forbidden_types": {
      "description": "Liste de secteurs non autorisés pour une structure",
      "type": "list",
      "schema": {
        "type": "string"
      }
    },
    "dates": {
      "description": "Dates de début et fin d'une structure. ",
      "type": "list",
      "schema": {
        "type": "object",
        "schema": {
          "start_date": {
            "type": "datetime",
            "description": "Date de début de la structure"
          },
          "end_date": {
            "type": "datetime",
            "description": "Date de fin de la structure"
          },
          "status": {
            "type": "string",
            "description": "Status de la donnée permettant la gestion de conflit"
          }
        }
      }
    },
    "comment": {
      "type": "string",
      "description": "Commentaire admin sur l'organisation"
    },
    "names": {
      "type": "list",
      "description": "Noms (fr, en) de l'organisations",
      "schema": {
        "type": "object",
        "schema": {
          "start_date": {
            "type": "datetime",
            "description": "Date de début de validité du nom"
          },
          "end_date": {
            "type": "datetime",
            "description": "Date de fin de validité du nom"
          },
          "status": {
            "type": "string",
            "description": "Status de la donnée permettant la gestion de conflit"
          },
          "name_fr": {
            "type": "string",
            "description": "Nom français de la structure"
          },
          "name_en": {
            "type": "string",
            "description": "Nom anglais de la structure"
          },
          "acronym_fr": {
            "type": "string",
            "description": "Acronyme français de la structure"
          },
          "acronym_en": {
            "type": "string",
            "description": "Acronyme anglais de la structure"
          },
        }
      }
    },
    "descriptions": {
      "description": "Descriptions (fr, en)",
      "type": "list",
      "schema": {
        "type": "object",
        "schema": {
          "start_date": {
            "type": "datetime",
            "description": "Date de début de validité de la description"
          },
          "end_date": {
            "type": "datetime",
            "description": "Date de fin de validité de la description"
          },
          "status": {
            "type": "string",
            "description": "Status de la donnée permettant la gestion de conflit"
          },
          "description_fr": {
            "type": "string",
            "description": "Description françaiss de la structure"
          },
          "description_en": {
            "type": "string",
            "description": "Description anglaise de la structure"
          }
        }
      }
    },
    "addresses": {
      "description": "Adresse de l'organisation",
      "type": "list",
      "schema": "address"
    },
    "alias": {
      "description": "Regroupe tousles nom, acronymes et identifiant de l'organisation",
      "type": "list",
      "schema": {
        "type": "string"
      }
    },
    "keywords_en": {
      "type": "list",
      "description": "Une liste de mot clés anglais",
      "schema": {
          "type": "string"
      }
    },
    "keywords_fr": {
      "type": "list",
      "description": "Une liste de mot clés français",
      "schema": {
        "type": "string"
      }
    },
    "code_numbers": {
      "type": "list",
      "description": "Une liste de label numéros. Uniquement pour les structures de recherche",
      "schema": {
        "type": "string"
      }
    },
    "logo": {
      "type": "string",
      "description": "Url du logo de l'organisation"
    },
    "legal_category": {
      "type": "list",
      "description": "Catégorie Juridique de l'organisation",
      "schema": {
        "type": "dict",
        "schema": {
          "value": {
            "type": "string",
            "description": "Code de catégorie juridique"
          },
          "status": {
            "type": "string",
            "description": "Status de la donnée permettant la gestion de conflit"
          }
        }
      }
    },
    "websites": {
      "type": "list",
      "schema": {
        "type": "object",
        "schema": {
          "url": {
            "description": "Site web de l'organisation",
            "type": "string",
          },
          "language": {
            "description": "Language du site web",
            "type": "string",
          },
          "status": {
            "type": "string",
            "description": "Status de la donnée permettant la gestion de conflit et les sites web secondaires"
          },
          "alive": {
            "type": "boolean",
            "description": "true if website has been tested alive"
          }
        }
      }
    },
    "website_check": {
      "type": "object",
      "description": "Dernière fois que l'existence d'un site à été recherché",
      "schema": {
        "checked": {
          "type": "boolean"
        },
        "last_check": {
          "type": "datetime"
        }
      }
    },
    "emails": {
      "type": "list",
      "description": "Emails de contact de l'organisation",
      "schema": {
        "type": "object",
        "schema": {
          "email": {
            "description": "Email de contact",
            "type": "string",
          },
          "status": {
            "type": "string",
            "description": "Status de la donnée permettant la gestion de conflit et les emails secondaires"
          }
        }
      }
    },
    "phones": {
      "type": "list",
      "description": "Numéro de téléphone de contact de l'organisation",
      "schema": {
        "type": "object",
        "schema": {
          "phone": {
            "description": "Téléphone",
            "type": "string",
          },
          "status": {
            "type": "string",
            "description": "Status de la donnée permettant la gestion de conflit et les téléphones secondaires"
          }
        }
      }
    },
    "social_medias": {
      "description": "Réseaux sociaux des organisations",
      "type": "list",
      "schema": {
        "type": "object",
        "schema": {
          "account": {
            "description": "Compte de l'organisation",
            "type": "string",
          },
          "social_media": {
            "description": "Réseau social",
            "type": "string",
          },
          "url": {
            "description": "Url de l'organisation sur le réseau social",
            "type": "string",
          },
          "language": {
            "description": "Language du réseau social",
            "type": "string",
          },
          "status": {
            "type": "string",
            "description": "Status de la donnée permettant la gestion de conflit et les réseaux sociaux secondaires"
          }
        }
      }
    },
    "thematics": {
        "description": "#dataESR domains",
        "type": "list",
        "schema": "thematics"
    },
    "badges": {
      "description": "Une liste permettant de marquer les organisations pour grouper le requêtage",
      "type":  "list",
      "schema": {
          "type": "string"
      }
    },
    "focus": {
      "description": "Une liste permettant de marquer les organisations pour grouper le requêtage",
      "type":  "list",
      "schema": {
          "type": "string"
      }
    },
    "panels": {
      "type": "list",
      "description": "Liste de panel ERC",
      "schema": {
        "type": "object",
        "schema": {
          "code": {
            "type": "string",
        },
        "status": {
          "type": "string",
          "description": "Status de la donnée permettant la gestion de conflit et les panels secondaires"
        },
        "start_date": {
          "type": "datetime"
        },
        "end_date": {
          "type": "datetime"
        }
      }
    }
    },
    "nace": {
      "type": "list",
      "schema": {
        "type": "dict",
        "schema": {
          "code": {
            "type": "string",
        },
        "status": {
          "type": "string",
          "description": "Status de la donnée permettant la gestion de conflit"
        }
    },
    "human_ressources": {
      "description": "Information sur les effectifs",
      "type": "list",
      "schema": {
        "type": "dict",
        "schema": {
          "num_employees": {
            "description": "Nombre d'employés",
            "type": "string",
          },
          "num_employees_slice": {
            "description": "Nombre d'employés (tranche d'effectif)",
            "type": "string",
          },
          "num_researchers": {
            "description": "Nombre de chercheurs",
            "type": "string",
          },
          "date": {
            "description": "Date de validité des données",
            "type": "datetime"
          }
        }
      }
    },
    "external_links": {
        "description": "Organizations's external link",
        "type": "list",
        "schema": {
            "type": "dict",
            "schema": {
                "url": {
                    "description": "External url describing the ressource",
                    "type": "string",
                },
                "type": {
                    "description": "Type of the external link",
                    "type": "string",
                },
                "language": {
                    "description": "Language of the website",
                    "type": "string",
                    "default": "fr"
                },
            }
        }
    },
    "external_ids": {
        "description": "Organizations's external ids",
        "type": "list",
        "schema": {
            "type": "dict",
            "schema": {
                "id": {
                    "description": "External id",
                    "type": "string",
                },
                "type": {
                    "description": "Type of the external link",
                    "type": "string",
                }
            }
        }
    },
    "evaluations": {
        "description": "Organizations's evaluations",
        "type": "list",
        "schema": {
            "type": "dict",
            "schema": {
                "evaluator": {
                    "description": "Entity that evaluated the Organization",
                    "type": "string",
                    "example": "HCERES"
                },
                "url": {
                    "description": "Url of the evaluation report",
                    "type": "string",
                    "example": "https://www.hceres.fr/content/ \
                        download/31935/488476/file/ \
                        C2018-EV-0673021V-DER-PUR180015254-019890-RF.pdf"
                },
                "year": {
                    "description": "Year of the avaluation",
                    "type": "string",
                    "example": "2017-2018"
                },
                "label": {
                    "description": "Label of the evaluation",
                    "type": "string",
                    "example": "Vague B"
                }
            }
        }
    },
    "leaders": {
        "type": "list",
        "description": "",
        "schema": {
            "type": "dict",
            "schema": {
                "id": {
                    "type": "string",
                },
                "href": {
                    "type": "string",
                },
                "identified": {
                    "type": "boolean"
                },
                "start_date": {
                    "type": "datetime"
                },
                "end_date": {
                    "type": "datetime"
                },
                "role": {
                    "type": "string"
                },
                "first_name": {
                    "type": "string"
                },
                "last_name": {
                    "type": "string"
                },
                "source_code": {
                    "type": "string"
                },
                "status": {
                    "description": "data status",
                    "type": "string",
                    "allowed": ["valid", "conflict"],
                    "example": "valid",
                }
              }
        }
    },
    "predecessors": {
        "type": "list",
        "description": "List of Organization's higher level relations",
        "schema": {
            "type": "dict",
            "schema": {
                "id": {
                    "type": "string",
                },
                "href": {
                    "type": "string",
                },
                "identified": {
                    "type": "boolean"
                },
                "source_code": {
                    "type": "string",
                },
                "name": {
                    "type": "string",
                },
                "succession_date": {
                    "type": "datetime"
                },
                "succession_type": {
                    "type": "string"
                },
                "status": {
                    "description": "Data status.",
                    "type": "string",
                    "allowed": ["valid", "conflict"],
                    "example": "valid",
                }
            }
        }
    },
    "supervisors": {
        "type": "list",
        "description": "List of Organization's higher level relations",
        "schema": {
            "type": "dict",
            "schema": {
                "id": {
                    "type": "string",
                },
                "href": {
                    "type": "string"
                },
                "start_date": {
                    "type": "datetime"
                },
                "end_date": {
                    "type": "datetime"
                },
                "supervision_type": {
                    "type": "string"
                },
                "source_code": {
                    "type": "string",
                },
                "identified": {
                    "type": "boolean"
                },
                "name": {
                    "type": "string",
                },
                "status": {
                    "description": "Activity status of the Organization",
                    "type": "string",
                    "allowed": ["valid", "conflict"],
                    "example": "valid",
                }
            }
        }
    },
    "parents": {
        "type": "list",
        "schema": {
            "type": "dict",
            "schema": {
                "start_date": {
                    "type": "datetime"
                },
                "end_date": {
                    "type": "datetime"
                },
                "id": {
                    "type": "string",
                },
                "href": {
                    "type": "string",
                },
                "identified": {
                    "type": "boolean"
                },
                "source_code": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "exclusive": {
                    "type": "boolean"
                },
                "status": {
                    "description": "Activity status of the Organization",
                    "type": "string",
                    "allowed": ["valid", "conflict"],
                    "example": "valid",
                    "required": true,
                }
            }
        }
    },
    "certifications": {
        "description": "",
        "type": "list",
        "schema": {
            "type": "dict",
            "schema": {
                "certification_name": {
                    "description": "",
                    "type": "string",
                },
                "certification_type": {
                    "description": "",
                    "type": "string",
                },
                "certification_start_date": {
                    "description": "",
                    "type": "datetime",
                },
                "certification_end_date": {
                    "description": "",
                    "type": "datetime",
                }
            }
        }
    },
    "prizes": {
        "description": "",
        "type": "list",
        "schema": {
            "type": "dict",
            "schema": {
                "prize_name": {
                    "description": "",
                    "type": "string"
                },
                "prize_institution": {
                    "description": "",
                    "type": "string"
                },
                "prize_url": {
                    "description": "",
                    "type": "string"
                },
                "prize_description": {
                    "description": "",
                    "type": "string"
                },
                "prize_date": {
                    "description": "",
                    "type": "datetime",
                },
                "prize_amount": {
                    "description": "",
                    "type": "float"
                },
            }
        }
    },
    "relations": {
        "type": "list",
        "description": "",
        "schema": {
            "type": "dict",
            "schema": {
                "id": {
                    "type": "string",
                },
                "href": {
                    "type": "string",
                },
                "identified": {
                    "type": "boolean"
                },
                "type": {
                    "type": "string",
                },
                "source_code": {
                    "type": "string",
                },
                "name": {
                    "type": "string",
                },
                "start_date": {
                    "type": "datetime"
                },
                "end_date": {
                    "type": "datetime"
                },
                "status": {
                    "description": "Activity status of the Organization",
                    "type": "string",
                    "allowed": ["valid", "conflict"],
                    "example": "valid",
                }
            }
        }
    }
  }
  ```
</details>
<br/>

L'application expose aussi une API de matching, permettant d'identifier un document de la collection organisation à partir d'un nom d'organisation. Cette API combine moteur de recherche, et règles métiers afin de fournir (ou de ne pas fournir) un matching le plus qualitatif possible.

Une collection scanR est egalement exposée. Cette dernière est une vue des données présente dans la collection 'organizations' exportée avec un modèle de donnée utilisable dans scanR. C'est cette dernière API est est appelé lorsque les administrateurs viennent récupérer les données pour les transférer à la couche scanR backend gérée par SWORD. L'export utilise certaines nomenclatures présentes dans l'application Datastore.


### 3. UI

[*Github Repos*](http://https://github.com/dataesr/nginx), [*Docker image*](http://https://hub.docker.com/repository/docker/dataesr/nginx)
- *Stockage de données*: NON
- *Acces mongo*: NON
- *Missions*: Interface utilisateurs, Interface monitoring, Enrichissement de données
- *Dépendances interne*: Organisations, Persons, Publications, Patents, Projects, Datastore, Elasticsearch.
- *Dépendances externe*: aucune.

Interface utilisateur de l'application. Permet l'intervention sur certaines données afin de les enrichir ou de les corriger manuellement. Actuellement, l'intervention est possible principalement sur les organisations. Les autres corrections manuelles sont remontées à l'API via fichiers et scripts. Cette interface permet aussi de rechercher et d'explorer les données, de voir les données de monitoring et de log, de voir la documentation swagger des API et de lancer des tâches asyncrones.


### Elasticsearch, Filebeat, Metricbeat

Ces trois process sont chargés de la récupération et du stockage de métriques et de logs concernant l'application.


### Nginx

- [*Github Repos*](http://https://github.com/dataesr/nginx)
- [*Docker image*](http://https://hub.docker.com/repository/docker/dataesr/nginx)
- *Stockage de données*: NON
- *Acces mongo*: NON
- *Mission*: Reverse proxy
- *Dépendances interne*: aucune.
- *Dépendances externe*: aucune.

Ce service sert de reverse proxy à toute l'application. Il écoute le port 80 de la machine sur laquelle est installée l'application et forward les requètes vers le bon service. Il expose ainsi tous les service API, et en aucun cas ne permet un interfaçage direct avec la base de données.

Une authentification BASIC est nécessaire afin d'accéder aux services et celle ci est géré directement par nginx. Si l'authentification est valide, nginx transmet les requètes aux services. Dans le cas contraire, il refuse les connexions.