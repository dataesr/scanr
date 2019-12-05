import React, { Component, Fragment } from 'react';
import Axios from 'axios';
import PropTypes from 'prop-types';

import { API_STRUCTURES_END_POINT } from '../../../config/config';
import getSelectKey from '../../../Utils/getSelectKey';

import Footer from '../../Shared/Footer/Footer';
import Header from '../../Shared/Header/Header';
import HeaderTitle from '../../Shared/Results/HeaderTitle/HeaderTitle';
import Portrait from './Sections/Portrait/Portrait';
import Network from './Sections/Network/Network';
import Evaluations from './Sections/Evaluations/Evaluations';
import Team from './Sections/Team/Team';
import Projects from '../Shared/Projects/Projects';
import Productions from '../Shared/Productions/Productions';
import Ecosystem from './Sections/Ecosystem/Ecosystem';
import Awards from './Sections/Awards/Awards';
import SimilarEntities from './Sections/SimilarEntities/SimilarEntities';
import LastEntityFocus from './Sections/LastEntityFocus/LastEntityFocus';
import Banner from '../../Shared/Banner/Banner';
import Loader from '../../Shared/LoadingSpinners/RouterSpinner';
import styles from '../../../style.scss';
// import DataSample from './dataSample.json';

/**
 * Entity
 * Url : ex: /entite/200711886U
 * Description : Correspond à une entité (structure)
 * Responsive : .
 * Accessible : .
 * Tests unitaires : .
*/
class Entity extends Component {
  state = {
    data: {},
    dataSupervisorOf: [],
    geoNear: [],
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    this.getData(id);
    this.getDataSupervisorOf(id);
    this.getNearStructures(id);
  }

  getNearStructures = (id) => {
    if (id) {
      const url = `${API_STRUCTURES_END_POINT}/near/${id}?distance=${10}`;
      Axios.get(url)
        .then((response) => {
          this.setState({ geoNear: response.data });
        });
    }
  }

  getDataSupervisorOf = (id) => {
    if (id) {
      const url = `${API_STRUCTURES_END_POINT}/search`;
      const obj = {
        pageSize: 4095,
        filters: {
          'institutions.structure.id': {
            type: 'MultiValueSearchFilter',
            op: 'all',
            values: [id],
          },
        },
      };
      Axios.post(url, obj)
        .then((response) => {
          const newData = response.data.results.map(item => item.value.id);
          this.setState({ dataSupervisorOf: newData });
        });
    }
  }

  getData(id) {
    // Récupéraion des données de l'entité
    const url = `${API_STRUCTURES_END_POINT}/structure/${id}`;
    Axios.get(url)
      .then((response) => {
        this.setState({ data: response.data });
        /* eslint-disable-next-line */
      }).catch(e => console.log('erreur=>', e));
  }

  handleChange = (sectionName) => {
    document.getElementById(sectionName).scrollIntoView(true);
    window.scrollBy({ top: -120, behavior: 'smooth' });
  };

  render() {
    if (!this.state.data) {
      return <Loader color={styles.entityColor} />;
    }
    return (
      <Fragment>
        <Header />

        <HeaderTitle
          language={this.props.language}
          label={getSelectKey(this.state.data, 'label', this.props.language, 'fr')}
          handleChangeForScroll={this.handleChange}
          idPage="Entity"
          id={this.state.data.id}
        />

        <div id="Portrait">
          <Portrait
            language={this.props.language}
            data={this.state.data}
            geoNear={this.state.geoNear}
            id={this.props.match.params.id}
          />
        </div>

        <div id="Evaluations">
          <Evaluations
            language={this.props.language}
            data={this.state.data}
            id={this.props.match.params.id}
          />
        </div>

        <div id="Network">
          <Network
            language={this.props.language}
            data={this.state.data}
            id={this.props.match.params.id}
          />
        </div>

        <div id="Team">
          <Team
            language={this.props.language}
            data={this.state.data}
            childs={this.state.dataSupervisorOf}
            id={this.props.match.params.id}
          />
        </div>

        <div id="Projects">
          <Projects
            language={this.props.language}
            match={this.props.match}
            childs={this.state.dataSupervisorOf}
          />
        </div>

        <Banner
          language={this.props.language}
          labelKey="Appear"
          cssClass="BannerDark"
          url=""
        />

        <div id="Productions">
          <Productions
            language={this.props.language}
            match={this.props.match}
            childs={this.state.dataSupervisorOf}
          />
        </div>

        <Banner
          language={this.props.language}
          labelKey="Appear"
          cssClass="BannerDeep"
          url=""
        />

        <div id="Ecosystem">
          <Ecosystem
            language={this.props.language}
            data={this.state.data.graph}
            id={this.props.match.params.id}
          />
        </div>

        <div id="Awards">
          <Awards
            language={this.props.language}
            data={this.state.data}
            id={this.props.match.params.id}
          />
        </div>

        <div id="SimilarEntities">
          <SimilarEntities
            language={this.props.language}
            data={this.state.data}
          />
        </div>

        {
          (this.state.lastFocus)
            ? (
              <div id="LastEntityFocus">
                <LastEntityFocus
                  language={this.props.language}
                  data={this.state.data}
                />
              </div>
            ) : null
        }

        <Banner
          language={this.props.language}
          labelKey="Appear"
          cssClass="BannerLight"
          url=""
        />

        <Footer />
      </Fragment>
    );
  }
}

export default Entity;

Entity.propTypes = {
  language: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
};
