import React, { Component } from "react";
class Nav extends Component {
  state = {};
  buttonClasses = selected => {
    const buttonClasses = selected
      ? "btn btn-warning mr-1 mb-2"
      : "btn btn-secondary mr-1 mb-2";
    return buttonClasses;
  };
  render() {
    return (
      <nav>
        <ul>
          {/* map sur les termes */}
          {this.props.terms.map(term => (
            <li
              //ajout événement au clic
              onClick={e => {
                console.log("click sur term", term.id);
                //référence à handleClickTerm de APP
                this.props.onClickTerm(e, term);
              }}
              className={this.buttonClasses(term.selected)}
              key={term.id}
            >
              {term.name}
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}

export default Nav;
