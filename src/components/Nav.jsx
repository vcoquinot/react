import React, { Component } from "react";
class Nav extends Component {
  state = {
    //DOM VIRTUEL
  };
  render() {
    return (
      <nav>
        <ul>
          {this.props.terms.map(term => (
            <li
              onClick={e => {
                console.log("click sur term", term.id);
              }}
              className="btn btn-secondary mr-1 mb-2"
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
