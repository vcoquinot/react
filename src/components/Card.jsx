import React, { Component } from "react";

class Card extends Component {
  state = {};
  //modification carte ( persistence d ela modif au moment du refresh)
  componentDidUpdate(prevProps) {
    //Solution abandonnée car étrangement l'ancienne props est toujours égale à la nouvelle
    //À creuser!!
    // console.log("Dans componentDidUpdate");
    // console.log("Anciennes props", prevProps.card);
    // console.log("Nouvelles props", this.props.card);
    // // Utilisation classique (comparer les props) :
    // if (
    //   this.props.card.question !== prevProps.card.question ||
    //   this.props.card.reponse !== prevProps.card.reponse
    // ) {
    //   console.log("question ou réponse modifiée");
    // }
  }
  render() {
    return (
      <article>
        <h3>{this.props.card.question}</h3>
        <p>{this.props.card.reponse}</p>
        <button
          // quand click, on appelle this.props onclickEditCard avec ses paramètres
          // l'événement et l'objet card
          //paramètre card déjà passé dans column
          onClick={e => {
            this.props.onClickEditCard(
              e,
              this.props.columnIndex,
              this.props.cardIndex
            );
          }}
        >
          Modifier
        </button>
      </article>
    );
  }
}

export default Card;
