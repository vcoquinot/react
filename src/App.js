import React, { Component } from "react";
import "./App.css";
import Nav from "./components/Nav";
import Column from "./components/Column";
import Fetch from "./services/Fetch";

class App extends Component {
  state = {
    //ADN de ce que je veux afficher
    terms: [],
    columns: [],
    //objet vide
    editingCard: false
  };
  // Nouvelle propriété de ma classe
  fetch = {};

  componentDidMount = () => {
    this.fetch = new Fetch("http://www.coopernet.fr/");
    //On va chercher le token avec en paramètre les deux call backs
    this.fetch.getToken(this.successToken, this.failureToken);
  };

  //Empêche le reload de toute la page par défaut
  //bouton envoyer
  handleSubmit = event => {
    console.log("Dans handleSubmit");
    //charge pas la page
    event.preventDefault();
    //copie du state
    const copyState = { ...this.state };
    //On remet à false editingCard (plus de changement en cours donc je cache le formulaire)
    copyState.editingCard = false;
    //Récupération des infos concernant la carte en cours d'édition
    //destructuring
    const { columnIndex, cardIndex } = this.state.editingCard;
    const card = this.state.columns[columnIndex].cartes[cardIndex];
    // Chercher l'index du terme dans le tableau de termes qui a pour propriété selected à true
    const termIndex = this.state.terms.findIndex(
      term => term.selected === true
    );
    //sauvegarde des données sur le serveur
    //fetch est une propriété de app
    this.fetch.createReqEditCard(
      card,
      // je sais un peu...
      this.state.terms[termIndex].id,
      this.successEditCard,
      this.failureEditCard
    );

    this.setState(copyState);
  };

  successEditCard = () => {
    console.log("Dans successEditcard");
  };

  failureEditCard = () => {
    console.log("Dans failureEditcard");
  };

  handleChangeQuestionReponse = (event, questionReponse) => {
    console.log('"Dans handleChangeQuestionReponse ');
    //copie du state
    const copyState = { ...this.state };
    //destructuring
    const { columnIndex, cardIndex } = this.state.editingCard;
    //modification de la copie du state
    //je récupère la valeur de ce qui a été à l'origine de mon événement
    copyState.columns[columnIndex].cartes[cardIndex][questionReponse] =
      event.target.value;
    this.setState(copyState);
  };

  //Affichage du formulaire
  dumpForm = () => {
    if (this.state.editingCard) {
      console.log("affichage formulaire");
      //destructuring object
      const { columnIndex, cardIndex } = this.state.editingCard;
      return (
        <form action="" onSubmit={this.handleSubmit}>
          {/* htmlfor pour lier le label au input */}
          <label htmlFor="question">
            Question
            {/* valeur de la question */}
            <input
              value={this.state.columns[columnIndex].cartes[cardIndex].question}
              onChange={e => {
                this.handleChangeQuestionReponse(e, "question");
              }}
              type="text"
              id="question"
            />
          </label>
          <label htmlFor="reponse">
            Réponse
            <input
              value={this.state.columns[columnIndex].cartes[cardIndex].reponse}
              onChange={e => {
                this.handleChangeQuestionReponse(e, "reponse");
              }}
              type="text"
              id="reponse"
            />
          </label>
          <input type="submit" value="Envoyer" />
        </form>
      );
    } else {
      console.log("pas de formulaire");
    }
  };

  // En cas de succès de getToken
  successToken = data => {
    console.log("Dans successToken");
    console.log("Data : ", data);
    // On stocke le token au bon endroit
    this.fetch.token = data;
    //récupération des terms avec deux callbacks
    this.fetch.getTerms(this.successTerms, this.failureTerms);
  };

  failureToken = error => {
    console.log("Dans failureToken");
    console.log("Erreur attrapée: ", error);
  };

  // En cas de succès de getToken
  successTerms = data => {
    console.log("Dans successTerms");
    console.log("Data : ", data);
    //copie du state , passage par valeurs
    const copyState = { ...this.state };
    //Modification de la copie du state
    copyState.terms = data;
    //comparaison de la copyState et de this.state
    this.setState(copyState);
  };

  failureTerms = error => {
    console.log("Dans failureTerms");
    console.log("Erreur attrapée: ", error);
  };

  //bouton modifier
  handleEditCard = (e, columnIndex, cardIndex) => {
    console.log("Dans handleEditCard");
    // console.log("Index de la colonne", columnIndex);
    // console.log("Index de la carte", columnCard);

    //Copie du state
    const copyState = { ...this.state };
    //Modification de la copie du state
    copyState.editingCard = {
      columnIndex: columnIndex,
      cardIndex: cardIndex
    };

    //comparaison
    this.setState(copyState);
  };

  handleClickTerm = (e, term) => {
    console.log("Dans handleClickTerm");
    //Modification de la propriété "selected" du term concerné
    //copie du state
    const copyState = { ...this.state };

    //recherche de l'index du term
    const indexTerm = copyState.terms.indexOf(term);
    //On donne la valeur false à tous les term.selected
    //pour qu'ils soient selected un par un
    for (const term of copyState.terms) {
      term.selected = false;
    }

    //modification de la copie du term en utilisant l'index
    copyState.terms[indexTerm].selected = true;
    //copyState.terms[0].selected = true;

    //appel de la méthode qui récupère les cartes
    this.fetch.createReqCards(term.id, this.successCards, this.failureCards);

    //changement du state
    this.setState(copyState);
  };

  successCards = data => {
    console.log("Dans successCards");
    //clone du state
    const copyState = { ...this.state };
    //affectation des datas à la propriété columns
    //comparaisonde la copie du state et du state pour faire update
    //update via le setState
    copyState.columns = data;
    this.setState(copyState);
    //this.setState(prevState => (prevState.columns = data));
    console.log("state après la mise à jour ", this.state);
  };

  failureCards = () => {
    console.log("Dans failureCards");
  };

  render() {
    return (
      <div className="App">
        <header>
          <h1>Memo</h1>
          {/*appel du component na avec les bons paramètres*/}
          <Nav onClickTerm={this.handleClickTerm} terms={this.state.terms} />
        </header>
        <main className="container-fluid">
          <div className="row">
            {/* ajout du formulaire */}
            {this.dumpForm()};
            {this.state.columns.map(column => {
              return (
                <Column
                  onClickEditCard={this.handleEditCard}
                  key={column.id}
                  column={column}
                  columnIndex={this.state.columns.indexOf(column)}
                />
              );
            })}
          </div>
          <article>{/* <h3>Question</h3>
            <p>Réponse</p> */}</article>
        </main>
      </div>
    );
  }
}

export default App;
