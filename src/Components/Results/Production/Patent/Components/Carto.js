import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage } from 'react-intl';
import { Map, GeoJSON } from 'react-leaflet';
import moment from 'moment';
import 'moment/locale/fr';

import worldGeoJSON from './custom.geo.json';
import {
  EP, EA, AP, WO,
} from '../../../../../config/config';

import classes from './Carto.scss';

/**
 * Cartographie
 * Url : /cartographie<br/>
 * Description : Gestions de la carte<br/>
 * Responsive : . <br/>
 * Accessible : . <br/>
 * Tests unitaires : . <br/>.
*/
class Carto extends Component {
  state = {
    existEP: false,
    existEA: false,
    existAP: false,
    existWO: false,
  };

  componentDidMount() {
    const existEP = this.props.data.find(el => el.country === 'EP');
    const existEA = this.props.data.find(el => el.country === 'EA');
    const existAP = this.props.data.find(el => el.country === 'AP');
    const existWO = this.props.data.find(el => el.country === 'WO');

    this.setState({
      existEP, existEA, existAP, existWO,
    });
  }

  onEachFeature = (feature: Object, layer: Object) => {
    const currentCountry = feature.properties.iso_a2;
    let patentDate = null;
    let numPatent = null;

    // Est-ce que le pays appartient à un groupe ?
    //  EP demande de brevet européen
    //  EA demande de brevet eurasien
    //  AP ARIPO : ORGANISATION RÉGIONALE AFRICAINE DE LA PROPRIÉTÉ INTELLECTUELLE
    //  WO demande internationale selon le PCT (patent cooperation treaty)
    let gradient = 100;
    if (this.state.existEP) {
      if (EP.includes(currentCountry)) {
        gradient -= 25;
      }
    }
    if (this.state.existEA) {
      if (EA.includes(currentCountry)) {
        gradient -= 25;
      }
    }
    if (this.state.existAP) {
      if (AP.includes(currentCountry)) {
        gradient -= 25;
      }
    }
    if (this.state.existWO) {
      if (WO.includes(currentCountry)) {
        gradient -= 25;
      }
    }

    layer.setStyle({ fillColor: classes[`productionbrevets${gradient}Color`] });

    // Recherche du pays
    if (this.props.data.find((el) => {
      if (el.country === currentCountry) {
        patentDate = el.url;
        numPatent = el.id || null;
        return true;
      }
      return false;
    })) {
      // Si trouvé, on colore la pays
      layer.setStyle({ fillColor: classes.productionbrevetsColor });
    }

    // Formatage de la date en fonction de la langue choisie
    let dateFormated = null;
    if (patentDate) {
      if (this.props.language === 'fr') {
        dateFormated = moment(patentDate).format('DD/MM/YYYY');
      } else {
        dateFormated = moment(patentDate).format('YYYY/MM/DD');
      }
    }

    // Ajout de la popup su chaque pays
    const popupContent = ` <Popup><pre>${feature.properties.name}<hr />${numPatent || ''}<br />${(dateFormated || '')}</pre></Popup>`;
    layer.bindPopup(popupContent);
  };

  render() {
    return (
      <div className={classes.Carto}>
        <h3 className={classes.Title}>
          <FormattedHTMLMessage id="Patent.Carto.title" />
        </h3>
        <p className={classes.SubTitle}>
          <span className={classes.Bullet} />
          <FormattedHTMLMessage id="Patent.Carto.depot" />
        </p>
        <Map
          className={classes.MapBox}
          center={[35, 5]}
          zoom={2}
          minZoom={2}
          zoomControl={false}
          maxZoom={7}
          attributionControl
          doubleClickZoom={false}
          scrollWheelZoom={false}
          dragging
          animate
          maxBounds={[[85, -180], [-85, 180]]}
          easeLinearity={0.35}
          style={{
            height: '60vh',
            color: 'black',
            backgroundColor: '#fff',
          }}
        >
          <GeoJSON
            data={worldGeoJSON}
            style={() => ({
              color: classes.scanrmiddlegreyColor,
              weight: 0.7,
              fillOpacity: 1,
            })}
            onEachFeature={this.onEachFeature}
          />
        </Map>
      </div>
    );
  }
}

export default Carto;

Carto.propTypes = {
  language: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
};
