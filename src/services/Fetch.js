class Fetch {
  constructor(url_basis) {
    this.url_basis = url_basis;
    this.token = "";
    this.id = "43";
    this.login = "vcoquinot";
    this.pwd = "vcoquinot";
  }
  getToken(success, failure) {
    fetch(this.url_basis + "rest/session/token/")
      .then(function(response) {
        if (response.status !== 200) {
          console.log(
            "Erreur (même si le server a répondu)- statut : " + response.status
          );
          failure(response.status);
          return;
        }
        response.text().then(function(data) {
          // Ca roule, le serveur a répondu et il a bien
          // renvoyé une chaine de caractère qui correspond à un token
          console.log("Dans getToken - token: ", data);
          success(data);
        });
      })
      .catch(error => {
        console.log("Erreur 'catchée' sur la promesse  ", error);
        failure(error);
      });
  }
  getTerms = (success, failure) => {
    try {
      fetch(this.url_basis + "memo/themes/", {
        credentials: "same-origin",
        method: "GET",
        headers: {
          "Content-Type": "application/hal+json",
          "X-CSRF-Token": this.token,
          Authorization: "Basic " + btoa(this.login + ":" + this.pwd) // btoa = encodage en base 64
        }
      }).then(function(response) {
        if (response.status !== 200) {
          // Il y a un problème, le statut de la réponse n'est pas le bon
          console.error("Erreur - statut : " + response.status);
          failure(response.status);
        } else {
          // Ca roule... mais encore faut-il que la
          // réponse soit dans le bon format
          response.json().then(function(data) {
            console.log("terms : ", data);
            //on ajoute aux termes une propriété "selected"
            //à chaque élément du tableau data  (donc parcours du tableau)
            for (const term of data) {
              term.selected = false;
            }
            // On appelle le callback
            success(data);
          });
        }
      });
    } catch (error) {
      console.error("Erreur : " + error);
      failure(error);
    }
  };
  //récupération des cartes d'un terme
  createReqCards = (termNumber, callbackSuccess, callbackFailed) => {
    // création de la requête
    console.log("Dans createReqCards de coopernet");
    console.log("token : ", this.token);
    const req_cards = new XMLHttpRequest();
    req_cards.onload = () => {
      // passage de la requête en paramètre, sinon, c'est this (coopernet qui serait utilisé)
      this.getCards(req_cards, termNumber, callbackSuccess, callbackFailed);
    };
    // Fait appel au "end-point créé dans le module drupal memo"
    // Pour régler le problème de cache, j'ai ajouté le paramètre "time" à la
    // requête get cf : https://drupal.stackexchange.com/questions/222467/drupal-8-caches-rest-api-calls/222482
    req_cards.open(
      "GET",
      this.url_basis +
        "memo/list_cartes_term/" +
        this.id +
        "/" +
        termNumber +
        "&_format=json&time=" +
        Math.floor(Math.random() * 10000),
      true
    );
    req_cards.setRequestHeader(
      "Authorization",
      "Basic " + btoa(this.login + ":" + this.pwd)
    );
    req_cards.send(null);
  };
  getCards = (req, termNumber, callbackSuccess, callbackFailed) => {
    console.log("Dans getCards de coopernet");
    // On teste directement le status de notre instance de XMLHttpRequest
    if (req.status === 200) {
      // Tout baigne, voici le contenu du token
      let jsonResponse = JSON.parse(req.responseText);
      // ajout de la propriété show_reponse à chaque carte
      console.log("Date renvoyées par getCards", jsonResponse);
      jsonResponse.forEach(function(element) {
        element.cartes.forEach(function(ele) {
          ele.show_reponse = false;
        });
      });
      //On remet les colonnes dans l'ordre (par id) grâce à sort
      function compare(a, b) {
        if (a.id < b.id) {
          return -1;
        }
        if (a.id > b.id) {
          return 1;
        }
        return 0;
      }
      jsonResponse.sort(compare);

      callbackSuccess(jsonResponse, termNumber);
    } else {
      // On y est pas encore, voici le statut actuel
      console.log("Pb getCards - Statut : ", req.status, req.statusText);
    }
  };

  createReqEditCard = (card, themeid, callbackSuccess, callbackFailed) => {
    console.log("Dans createReqEditCard de fetch");
    //Destructuring
    //comme dans l'objet card
    const { id, question, reponse, colonne } = card;

    // création de la requête
    // utilisation de fetch
    //this.url_serveur : propriété de fetch
    //tout est spécifié par api avec laquelle on communique
    //format hal_json propre à drupal
    fetch(this.url_basis + "node/" + id + "?_format=hal_json", {
      // permet d'accepter les cookies ?
      credentials: "same-origin",
      method: "PATCH",
      headers: {
        "Content-Type": "application/hal+json",
        //permet identification
        "X-CSRF-Token": this.token,
        Authorization: "Basic " + btoa(this.login + ":" + this.pwd) // btoa = encodage en base 64
      },
      //Json transformé en string
      body: JSON.stringify({
        //type de cntenu carte
        _links: {
          type: {
            href: this.url_basis + "rest/type/node/carte"
          }
        },
        title: [
          {
            value: question
          }
        ],
        field_carte_question: [
          {
            value: question
          }
        ],
        field_carte_reponse: [
          {
            value: reponse
          }
        ],
        //relation carte et élément de taxonomie Drupal
        field_carte_colonne: [
          {
            //nom du champs drupal et id
            target_id: colonne,
            url: "/taxonomy/term/" + colonne
          }
        ],
        field_carte_thematique: [
          {
            target_id: themeid,
            url: "/taxonomy/term/" + themeid
          }
        ],
        type: [
          {
            target_id: "carte"
          }
        ]
      })
    })
      //si la réponse st au format Json
      .then(response => response.json())
      //je récupère la data
      .then(data => {
        console.log("data reçues :", data);
        //si j'ai bien de la data pas vide
        if (data) {
          //Modification de la carte sur le serveur directement
          //themeid : refresh de toutes les cartes => term (ex:css)
          callbackSuccess(themeid);
        } else {
          callbackFailed("Erreur de login ou de mot de passe");
        }
      });
  };
}

export default Fetch;
