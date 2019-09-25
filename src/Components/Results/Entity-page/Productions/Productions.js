import React, { Component, Fragment } from 'react';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';
import Axios from 'axios';
import InputRange from 'react-input-range';

import { API_PUBLICATIONS_SEARCH_END_POINT, API_PUBLICATIONS_END_POINT } from '../../../../config/config';
import getSelectKey from '../../../../Utils/getSelectKey';

import Autocomplete from '../../../Shared/Ui/Autocomplete/Autocomplete';
import EmptySection from '../Shared/EmptySection/EmptySection';
import Select from '../../../Shared/Ui/Select/Select';
import SectionTitle from '../../../Shared/Results/SectionTitle/SectionTitle';

/* Gestion des langues */
import messagesFr from './translations/fr.json';
import messagesEn from './translations/en.json';

import messagesEntityFr from '../translations/fr.json';
import messagesEntityEn from '../translations/en.json';

import classes from './Productions.scss';

/**
 * Productions
 * Url : .
 * Description : .
 * Responsive : .
 * Accessible : .
 * Tests unitaires : .
*/
class Productions extends Component {
  state = {
    viewMode: 'list',
    data: [],
    initialData: [],
    selectedProduction: {},
    typeFilter: [],
    filterValue: null,
    autocompleteData: null,
    modifyMode: false,
    sliderYear: {
      min: 2000,
      max: new Date().getFullYear(),
    },
    minYear: 2000,
    maxYear: new Date().getFullYear(),
  }

  componentDidMount() {
    this.getData();
    // this.getYearsBounds();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.data !== this.state.data && this.state.data.length > 0) {
      // this.sortByYear();
      this.createTypeFilter();
      // this.createAutocompleteData();
    }
  }

  getData = () => {
    const url = API_PUBLICATIONS_SEARCH_END_POINT;
    const data = {
      pageSize: 5000,
      // sourceFields: ['id', 'title', 'type', 'year', 'acronym', 'duration', 'label', 'url', 'description', 'founding', 'participants'],
      filters: {
        'affiliations.id': {
          type: 'MultiValueSearchFilter',
          op: 'all',
          values: [this.props.structureId],
        },
      },
      aggregations: {
        types: {
          field: 'type',
          filters: {},
          min_doc_count: 1,
          order: {
            direction: 'DESC',
            type: 'COUNT',
          },
          size: 50,
        },
      },
    };
    Axios.post(url, data).then((response) => {
      console.log('getData_', url, '=>', response);
      this.setState({ data: response.data.results, initialData: response.data.results });
    });
  }

  getYearsBounds = () => {
    const url = API_PUBLICATIONS_SEARCH_END_POINT;
    const data = {
      pageSize: 5000,
      sourceFields: ['id'],
      filters: {
        'affiliations.id': {
          type: 'MultiValueSearchFilter',
          op: 'all',
          values: [this.props.structureId],
        },
      },
    };
    Axios.post(url, data).then((response) => {
      console.log('getYearsBounds_', url, '=>', response);
      const facetPublicationDates = response.data.facets.find(facet => facet.id === 'facet_publication_date');

      if (facetPublicationDates) {
        const allYears = [];
        facetPublicationDates.entries.forEach(e => (allYears.push(e.value.substring(0, 4))));

        const minYear = Math.min(...allYears);
        const maxYear = Math.max(...allYears);
        this.setState({ minYear, maxYear, sliderYear: { min: minYear, max: maxYear } });
      }
    });
  }

  modifyModeHandle = () => {
    this.setState(prevState => ({ modifyMode: !prevState.modifyMode }));
  }

  setSelectedProductionHandler = (selectedProduction) => {
    // Appel API sur production
    const url = `${API_PUBLICATIONS_END_POINT}/${selectedProduction.value.id}`;
    Axios.get(url).then((response) => {
      console.log('setSelectedProductionHandler_jre=>', response);
      // this.setState({ selectedProduction });
    });
  }

  createTypeFilter = () => {
    const typeFilter = [];
    for (let i = 0; i < this.state.data.length; i += 1) {
      const type = this.state.data[i].value.type;
      const found = typeFilter.find(item => item.value === type);
      if (found) {
        found.count += 1;
      } else {
        const obj = {};
        obj.value = type;
        obj.count = 1;
        typeFilter.push(obj);
      }
    }
    this.setState({ typeFilter });
  }

  renderViewList = (messages) => {
    const filteredData = this.state.data;

    const content = filteredData.map((item) => {
      let selected = '';
      if (item === this.state.selectedProduction) {
        selected = classes.Selected;
      }

      return (
        <Fragment key={item.value}>
          <div
            className={`${classes.Item} ${selected}`}
            onClick={() => this.setSelectedProductionHandler(item)}
            onKeyPress={() => this.setSelectedProductionHandler(item)}
            role="button"
            tabIndex={0}
          >
            <span className={classes.Title}>
              {item.value.title.default}
            </span>
            <span className={classes.Type}>
              <span className={classes[item.value.productionType]} />
              {item.value.productionType}
            </span>
          </div>
        </Fragment>
      );
    });

    const typeFilterPlaceHolder = (this.state.filterValue)
      ? `${this.state.data.length} ${this.state.filterValue}`
      : `${this.state.data.length} ${messages[this.props.language]['Entity.projects.selectTypesFilter.placeHolder']}`;

    return (
      <Fragment>
        <div className={`row ${classes.Filters}`}>
          <div className="col-md">
            <Select
              allLabel={messages[this.props.language]['Entity.projects.selectTypesFilter.allLabel']}
              count={this.state.data.length}
              title={messages[this.props.language]['Entity.projects.selectTypesFilter.title']}
              placeHolder={typeFilterPlaceHolder}
              data={this.state.typeFilter}
              onSubmit={this.setTypeFilter}
            />
          </div>
          <div className={`col-md ${classes.RangeSlider}`}>
            <div className={classes.Title}>
              Sélectionner une période
            </div>
            <div className={classes.Slider}>
              <InputRange
                minValue={this.state.minYear}
                maxValue={this.state.maxYear}
                formatLabel={value => value}
                value={this.state.sliderYear}
                onChange={value => this.setState({ sliderYear: value })}
              />
            </div>
          </div>
          <div className="col-md">
            <Autocomplete
              title={messages[this.props.language]['Entity.projects.autoCompleteTypesFilter.title']}
              placeHolder={typeFilterPlaceHolder}
              data={this.state.autocompleteData}
              onSubmit={this.setSelectedProjectHandler}
            />
          </div>
        </div>
        {/* /row */}
        <div className="row">
          <div className="col-lg-5">
            <div className={classes.ListOfProductions}>
              {content}
            </div>
          </div>
          <div className="col-lg-7">
            Detail
          </div>
        </div>
      </Fragment>
    );
  }

  render() {
    const messages = {
      fr: messagesFr,
      en: messagesEn,
    };

    const messagesEntity = {
      fr: messagesEntityFr,
      en: messagesEntityEn,
    };

    if (!this.state.data) {
      return (
        <Fragment>
          <IntlProvider locale={this.props.language} messages={messages[this.props.language]}>
            <section className={`container-fluid ${classes.Productions}`}>
              <div className="container">
                <SectionTitle
                  icon="fas fa-th"
                  modifyModeHandle={this.modifyModeHandle}
                  modifyMode={this.state.modifyMode}
                  emptySection
                >
                  {messagesEntity[this.props.language]['Entity.Section.Productions.label']}
                </SectionTitle>
                <div className="row">
                  <div className="col">
                    <EmptySection
                      language={this.props.language}
                      masterKey="Productions"
                      modifyMode={this.state.modifyMode}
                      modifyModeHandle={this.modifyModeHandle}
                    />
                  </div>
                </div>
              </div>
            </section>
          </IntlProvider>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <IntlProvider locale={this.props.language} messages={messages[this.props.language]}>
          <section className={`container-fluid ${classes.Productions}`}>
            <div className="container">
              <div className={`row ${classes.SectionTitle}`}>
                <div className="col">
                  <i className="fas fa-folder-open" />
                  <span className={classes.Label}>
                    {this.state.data.length}
                    &nbsp;
                    {messagesEntity[this.props.language]['Entity.Section.Productions.label']}
                  </span>
                </div>
                <div className="col text-right">
                  <div className="btn-group text-left" role="group">
                    {
                      (this.state.viewMode === 'list')
                        ? (
                          <Fragment>
                            <button type="button" onClick={() => this.viewModeClickHandler('list')} className={`btn  btn-sm ${classes.btn_scanrBlue}`}>
                              <i className="fas fa-list" />
                              &nbsp;
                              Liste des résultats
                            </button>
                            <button type="button" onClick={() => this.viewModeClickHandler('graph')} className={`btn  btn-sm ${classes.btn_scanrlightgrey}`}>
                              <i className="fas fa-chart-pie" />
                              &nbsp;
                              Visualisation des résultats
                            </button>
                          </Fragment>
                        )
                        : (
                          <Fragment>
                            <button type="button" onClick={() => this.viewModeClickHandler('list')} className={`btn  btn-sm ${classes.btn_scanrlightgrey}`}>
                              <i className="fas fa-list" />
                              &nbsp;
                              Liste des résultats
                            </button>
                            <button type="button" onClick={() => this.viewModeClickHandler('graph')} className={`btn  btn-sm ${classes.btn_scanrBlue}`}>
                              <i className="fas fa-chart-pie" />
                              &nbsp;
                              Visualisation des résultats
                            </button>
                          </Fragment>
                        )
                    }
                  </div>
                </div>
              </div>
              {/* /row */}
              <hr />
              {
                (this.state.viewMode === 'list')
                  ? this.renderViewList(messages)
                  : 'graph'
              }
            </div>
          </section>
        </IntlProvider>
      </Fragment>
    );
  }
}

export default Productions;

Productions.propTypes = {
  language: PropTypes.string.isRequired,
  structureId: PropTypes.string.isRequired,
};
