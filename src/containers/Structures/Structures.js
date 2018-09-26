/* Composants externes */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
/* Config */
import {
  API_BOUCHON,
  API_DATA,
  PAGE,
  PER_PAGE,
} from '../../config/config';

/* Composants internes */
import axios from '../../axios';
import Aux from '../../hoc/Aux';
import Structure from './Structure/Structure';
import StructureList from './StructureList/StructureList';

/* CSS */
// import classes from './Structures.css';

class Structures extends Component {
  state = {
    structures: [],
    structureSelected: null,
    pagination:
    {
      n_page: PAGE,
      n_hits: 0,
    },
  }

  componentDidMount() {
    // Récupération des structures initiales (API)
    const p = {
      init: true,
      pagination: false,
    };
    this.axiosCall(p);
  }// /componentDidMount()

  componentDidUpdate(prevProps) {
    // Récupération des structures sur MAJ searchBar (API)
    if (this.props.searchText !== prevProps.searchText) {
      const p = {
        init: true,
        pagination: false,
      };
      this.axiosCall(p);
    }
  }// /componentDidUpdate()

  returnButtonHandler = () => {
    // Suppression de la stucture sélectionnée du state
    const newState = { ...this.state };
    newState.structureSelected = null;

    this.setState(newState);
  }

  nextContentButtonHandler() {
    const p = {
      init: false,
      pagination: true,
    };
    this.axiosCall(p);
  }

  axiosCall(p) {
    // Appel de l'API
    let page;
    if (p.pagination) {
      page = this.state.pagination.n_page + 1;
    } else {
      page = PAGE;
    }

    if (API_BOUCHON) {
      const response = API_DATA;
      const newState = { ...this.state };
      if (p.init) {
        newState.structures = response.data;
      } else {
        Array.prototype.push.apply(newState.structures, response.data);
      }

      newState.pagination.n_hits = response.n_hits;
      if (p.pagination) {
        newState.pagination.n_page++;
      } else {
        newState.pagination.n_page = 1;
      }
      newState.structureSelected = null;

      this.setState(newState);

      // MAJ du header
      this.props.nStructures(response.n_hits);
    } else {
      const url = `structures/?query=${this.props.searchText}&page=${page}&per_page=${PER_PAGE}`;
      axios.get(url)
        .then(
          (response) => {
            const newStructures = [...this.state.structures];
            Array.prototype.push.apply(newStructures, response.data.data);

            const newPagination = { ...this.state.pagination };
            newPagination.n_hits = response.data.n_hits;
            if (p.pagination) {
              newPagination.n_page++;
            } else {
              newPagination.n_page = 1;
            }
            let structureSelected = null;
            console.log(this.props.match.params)
            if (this.props.match.params.length > 0) {
              const esrId = parseInt(this.props.match.params.number, 10);
              structureSelected = newStructures.find(structure => structure.esr_id === esrId);
            }
            this.setState({
              structures: newStructures,
              pagination: newPagination,
              structureSelected
            });

            // MAJ du header
            this.props.nStructures(response.data.n_hits);
          },
        );// /then
    }
  }// /axiosCall()


  render() {
    let content = 'Pas de structure !';
    let btNextContent = null;

    if (this.state.structureSelected) {
      content = (
        <Structure
          structure={this.state.structureSelected}
          returnButton={this.returnButtonHandler}
        />
      );
    } else if (this.state.structures) {
      content = (
        <StructureList
          structuresList={this.state.structures}
        />
      );

      const nPagesMax = Math.ceil(this.state.pagination.n_hits / PER_PAGE);
      if (this.state.pagination.n_page < nPagesMax) {
        btNextContent = (
          <button
            type="button"
            onClick={() => this.nextContentButtonHandler()}
            className="button is-dark is-medium is-fullwidth is-rounded"
          >
            Charger la suite
          </button>
        );
      }
    }

    return (
      <Aux>
        {content}
        <div className="container">
          <div className="column is-half is-offset-one-quarter">
            {btNextContent}
          </div>
        </div>
      </Aux>
    );
  }// /render()
}


export default Structures;

Structures.propTypes = {
  searchText: PropTypes.string.isRequired,
  nStructures: PropTypes.func.isRequired,
};
