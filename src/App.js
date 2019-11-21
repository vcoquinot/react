import React, { Component } from "react";
import "./App.css";
import Nav from "./components/Nav";
import Fetch from "./services/Fetch";

class App extends Component {
  state = {
    //ADN de ce que je veux afficher
    terms: [],
    columns: []
  };
  // Nouvelle propriété de ma classe
  fetch = {};

  componentDidMount = () => {
    this.fetch = new Fetch("http://www.coopernet.fr/");
    //On va chercher le token avec en paramètre les deux call backs
    this.fetch.getToken(this.successToken, this.failureToken);
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

  handleClickTerm = (e, termId) => {
    console.log("Dans handleClickTerm");
    //appel de la méthode qui récupère les cartes
    this.fetch.createReqCards(termId, this.successCards, this.failureCards);
  };

  successCards = data => {
    console.log("Dans successCards");
    //clone du state
    const copyState = { ...this.state };
    //affectation des datas à la propriété columns
    copyState.columns = data;
    this.setState(copyState);
    //this.setState(prevState => (prevState.columns = data));
    console.log("state ", this.state);
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
      </div>
    );
  }
}

export default App;
