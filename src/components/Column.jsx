import React, { Component } from "react";
import Card from "./Card";

class Column extends Component {
  state = {};
  render() {
    return (
      <section className="col-md-3">
        <h2>{this.props.column.name}</h2>
        {this.props.column.cartes.map(card => {
          return (
            <Card
              onClickEditCard={this.props.onClickEditCard}
              key={card.id}
              card={card}
              columnIndex={this.props.columnIndex}
              cardIndex={this.props.column.cartes.indexOf(card)}
            />
          );
        })}
      </section>
    );
  }
}

export default Column;
