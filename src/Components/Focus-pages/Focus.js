import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';

// Composants
import Footer from '../Shared/Footer/Footer';
import Header from '../Shared/Header/Header-homePage';
// import LexiconPanel from '../../Shared/Lexicon/LexiconPanel';
import GraphComponent from '../Shared/GraphComponents/GraphComponents';
import HeaderTitle from '../Shared/HeaderTitle/HeaderTitle';
import LastFocus from '../Shared/LastFocus/LastFocus';
import getSelectKey from '../../Utils/getSelectKey';

import classes from './Focus.scss';

// const authorization = 'YWRtaW46ZGF0YUVTUjIwMTk=';

/**
 * Focus
 * Url : /focus/$id <br/>
 * Description : Page qui va charger GraphComponent <br/>
 * Responsive : . <br/>
 * Accessible : . <br/>
 * Tests unitaires : . <br/>.
*/

let params = '';

export default class FocusList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cData: [],
      error: false,
    };
  }


  componentDidMount() {
    const filename = `./Focus-data/${this.props.match.params.id}.json`;
    try {
      // eslint-disable-next-line
      params = require(`${filename}`);
    } catch (error) {
      return;
    }

    let componentsData = [];
    params.components.forEach((component, position) => {
      const queryField = component.queryField;
      const filters = {};
      let aggregations = {};
      filters[queryField] = {
        type: 'MultiValueSearchFilter',
        op: 'all',
        values: component.queryValue,
      };
      if (component.dataType === 'these') {
        filters.publicationDate = {
          type: 'DateRangeFilter',
          min: new Date(Date.UTC(2018, 1, 1)).toISOString(),
          max: new Date(Date.UTC(2018, 11, 31)).toISOString(),
          missing: false,
        };
      }
      aggregations = {
        facet: {
          field: component.facet,
          filters: {},
          min_doc_count: 1,
          order: { direction: 'DESC', type: 'COUNT' },
          size: 100,
        },
      };
      axios.post(component.url_api,
        {
          filters,
          aggregations,
          sourceFields: component.sourceFields,
        })
        .then((res) => {
          let data = [];
          let tooltipText = '';
          if (component.type === 'map') {
            res.data.results.forEach((e) => {
              try {
                const dataElement = {
                  id: e.value.id,
                  position: [e.value.address[0].gps.lat, e.value.address[0].gps.lon],
                  infos: [getSelectKey(e.value, 'label', this.props.language, 'default')],
                };
                data.push(dataElement);
              } catch (error) {
                // eslint-disable-no-empty
              }
            });
          } else if (component.type === 'timeline' && component.dataType === 'award') {
            res.data.results.forEach((e) => {
              try {
                const award = e.value.awards.filter(a => (a.structureName === component.award))[0];
                const awardYear = moment(award.date).format('YYYY');
                const dataElement = {
                  name: e.value.firstName.concat(' ', e.value.lastName),
                  label: award.label.concat(' (', awardYear.toString(), ')'),
                  year: awardYear,
                };
                data.push(dataElement);
                data = data.sort((a, b) => a.year - b.year);
              } catch (error) {
                // eslint-disable-no-empty
              }
            });
          } else if (component.type === 'packedbubble' && component.dataType === 'these') {
            res.data.facets[0].entries.forEach((e) => {
              const dataElement = {
                name: e.value,
                value: e.count,
              };
              //data.push(dataElement);
              data.push( {name: dataElement.name, data: [dataElement]});
            });
            const series = [];
            series.push({ name: 'Domaines', data });
            //data = series;
            tooltipText = 'thèses soutenues en 2018';
          }
          const text = (component.href) ? 'Explorer dans ScanR' : null;
          componentsData.push({
            data,
            tooltipText,
            position,
            type: component.type,
            buttonText: text,
            href: component.href,
            title: component.title,
            subtitle: component.subtitle,
            label: component.label,
            style: { height: '60vh' },
          });
          componentsData = componentsData.sort((a, b) => a.position - b.position);
          this.setState({ cData: componentsData });
        })
        .catch(() => {
          this.setState({ error: true });
        });
    });
  }

  render() {
    const TextComponent = () => (
      <div>
        <p className={`${classes.Title}`}>
          {params.title}
        </p>
        <p className={`${classes.Text}`}>
          {params.text}
        </p>
        <div className="container">
          <div className="row">
            <p className={`col-8 ${classes.Subtext}`}>
              {params.subtext}
            </p>
          </div>
        </div>
      </div>
    );
    return (
      <div className={`container-fluid ${classes.HomePage}`} style={{ backgroundColor: '#EBEEF0' }}>
        <Header
          language={this.props.language}
          switchLanguage={this.props.switchLanguage}
        />
        <HeaderTitle
          language={this.props.language}
          labelkey="focus"
          url1="/"
          url2="/focus"
        />

        {/* <LastFocus language={props.language} /> */}

        {/* } <DiscoverDataEsr language={props.language} /> */}
        <div className="container">
          <div className="row" key="text">
            <div className="col-lg-12">
              {this.state.error ? null : <TextComponent />}
            </div>
          </div>
          {
            this.state.cData.map(component => (
              <div className="row" key={component.label}>
                <div className="col-lg-12">
                  <GraphComponent
                    title={component.title}
                    subtitle={component.subtitle}
                    type={component.type}
                    data={component.data}
                    tooltipText={component.tooltipText}
                    style={component.style}
                    href={component.href}
                    buttonText={component.buttonText}
                    language={this.props.language}
                  />
                </div>
              </div>
            ))
          }
        </div>

        <LastFocus />

        <Footer language={this.props.language} />
      </div>
    );
  }
}


FocusList.propTypes = {
  match: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  switchLanguage: PropTypes.func.isRequired,
};
