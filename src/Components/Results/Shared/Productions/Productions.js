import React, { Component, Fragment } from 'react';
import { IntlProvider, FormattedHTMLMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Axios from 'axios';
import Loader from '../../../Shared/LoadingSpinners/GraphSpinner';
import Errors from '../../../Shared/Errors/Errors';
import UIModal from '../../../Shared/Ui/Modal/UIModal';

/* REQUESTS */
import {
  API_PUBLICATIONS_SEARCH_END_POINT,
  API_PERSONS_SEARCH_END_POINT,
  API_CONTRIBUTE_PUBLICATIONS_SCANR,
} from '../../../../config/config';
import Request from './Requests/Request';
import PreRequest from './Requests/PreRequest';
import DateRequest from './Requests/DateRequest';
import { iDsFromFullNameCasesRequest, productionsWithoutIdsRequest } from './Requests/ProductionRequest';

/* SCSS */
import styles from '../../../../style.scss';

/* COMPONENTS */
import EmptySection from '../EmptySection/EmptySection';
import SuggestedDataForm from './Components/SuggestedDataForm';
import SuggestedDataConfirmForm from './Components/SuggestedDataConfirmForm';
import SectionTitleViewMode from '../SectionTitle';
import FilterPanel from './Components/FilterPanel';
import ProductionList from './Components/ProductionList';
import ProductionGraphs from './Components/ProductionGraphs';
import SearchSuggestedDataForm from './Components/SearchSuggestedDataForm';

/**
 * Productions
 * Url : .
 * Description : .
 * Responsive : .
 * Accessible : .
 * Tests unitaires : .
*/

import messagesFr from './translations/fr.json';
import messagesEn from './translations/en.json';

const PAGE_SIZE = 10;

class Productions extends Component {
  state = {
    productionType: 'publication',
    error: false,
    isLoading: true,
    total: 0,
    sliderData: [],
    totalPerType: {
      patent: null,
      publication: null,
      thesis: null,
    },
    query: '',
    currentQueryText: '',
    graphData: {
      isOa: {},
      journals: {},
      years: {},
      keywords: {},
      types: {},
    },
    activeGraph: null,
    viewMode: 'list',
    data: [],
    suggestedData: [],
    suggestedDataMessageID: '',
    suggestedDataSuccessID: '',
    isLoadingSuggestedData: false,
    currentPageSuggestedData: 0,
    querySuggestedData: '',
    loadMoreSuggestedData: false,
    isModalOpened: false,
    modalSize: 'big',
    selectedProduction: '',
    high: null,
    low: null,
  };

  componentDidMount() {
    this.fetchGlobalData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.childs.length !== this.props.childs.length) {
      this.fetchGlobalData();
    }
    if (prevState.low !== this.state.low || prevState.high !== this.state.high) {
      this.fetchDataByType();
    }
    if (prevState.total !== this.state.total) {
      this.fetchDataByType();
    }
    if (prevState.productionType !== this.state.productionType) {
      this.fetchDataByType();
    }
    if (prevState.query !== this.state.query) {
      const low = 2000;
      const high = 2021;
      this.setState({ low, high });
      this.fetchDataByType();
    }
  }


  fetchGlobalData = () => {
    const url = API_PUBLICATIONS_SEARCH_END_POINT;
    let allIds = [this.props.match.params.id];
    if (this.props.childs.length > 0) {
      const childs = this.props.childs.map(child => child.value.id).slice(0, 4095);
      allIds = allIds.concat(childs);
    }
    const preRequest = PreRequest;
    if (this.props.person) {
      preRequest.filters = {
        'authors.person.id': {
          type: 'MultiValueSearchFilter',
          op: 'all',
          values: [this.props.match.params.id],
        },
        productionType: {
          type: 'MultiValueSearchFilter',
          op: 'any',
          values: ['publication', 'patent'],
        },
      };
    } else {
      preRequest.filters = {
        'affiliations.id': {
          type: 'MultiValueSearchFilter',
          op: 'any',
          values: allIds,
        },
      };
    }
    Axios.post(url, preRequest).then((response) => {
      const totalPerType = {};
      response.data.facets.find(facet => facet.id === 'types').entries.forEach((type) => {
        totalPerType[type.value] = type.count;
      });
      let productionType = 'publication';
      if (!totalPerType.publication) {
        productionType = Object.keys(totalPerType)[0];
      }

      const viewMode = response.data.total > 10 ? 'graph' : 'list';
      this.setState({
        total: response.data.total,
        totalPerType,
        productionType,
        viewMode,
      });
    });
  };

  fetchDataByType = () => {
    if (this.state.total === 0) {
      this.setState({ isLoading: false });
      return;
    }
    this.setState({ isLoading: true });
    const url = API_PUBLICATIONS_SEARCH_END_POINT;
    const request = Request;
    const dateRequest = DateRequest;
    request.query = this.state.query;
    dateRequest.query = this.state.query;
    request.filters.productionType.values = [this.state.productionType];
    dateRequest.filters.productionType.values = [this.state.productionType];
    request.filters.year.min = this.state.low ? this.state.low : 2000;
    request.filters.year.max = this.state.high ? (this.state.high + 1) : 2021;
    let allIds = [this.props.match.params.id];
    if (this.props.childs.length > 0) {
      const childs = this.props.childs.map(child => child.value.id).slice(0, 4095);
      allIds = allIds.concat(childs);
    }
    if (this.props.person) {
      request.filters['authors.person.id'] = {
        type: 'MultiValueSearchFilter',
        op: 'all',
        values: [this.props.match.params.id],
      };
      dateRequest.filters['authors.person.id'] = {
        type: 'MultiValueSearchFilter',
        op: 'all',
        values: [this.props.match.params.id],
      };
    } else {
      request.filters['affiliations.id'] = {
        type: 'MultiValueSearchFilter',
        op: 'any',
        values: allIds,
      };
      dateRequest.filters['affiliations.id'] = {
        type: 'MultiValueSearchFilter',
        op: 'any',
        values: allIds,
      };
    }
    Axios.post(url, dateRequest).then((response) => {
      const sliderData = response.data.facets.find(facet => facet.id === 'years').entries;
      this.setState({
        sliderData,
      });
    });
    Axios.post(url, request).then((response) => {
      const graphData = {};
      response.data.facets.forEach((facet) => {
        graphData[facet.id] = facet;
      });
      graphData.keywords = {
        id: 'keywords',
        entries: graphData.keywordsFr.entries.concat(graphData.keywordsEn.entries),
      };
      const data = response.data.results.sort((a, b) => (b.value.publicationDate - a.value.publicationDate));
      const selectedProduction = data.length > 0 ? data[0].value.id : '';
      this.setState({
        data,
        selectedProduction,
        graphData,
        isLoading: false,
      });
    });
  };

  changeTypeHandler = (e) => {
    e.preventDefault();
    this.setState({
      productionType: e.target.value,
      activeGraph: null,
      low: null,
      high: null,
    });
  };

  viewModeClickHandler = (viewMode) => {
    this.setState({ viewMode });
  };

  modalHandler = () => {
    if (!this.state.isModalOpened) {
      this.fetchSuggestedData();
    } else {
      this.setState({ suggestedData: [] });
    }
    this.setState(prevState => ({ isModalOpened: !prevState.isModalOpened, querySuggestedData: this.props.fullName }));
  };

  queryTextChangeHandler = (e) => {
    this.setState({ currentQueryText: e.target.value });
  };

  queryChangeHandler = (e) => {
    // eslint-disable-next-line
    e.preventDefault();
    this.setState(prevState => ({ query: prevState.currentQueryText }));
  };

  setActiveGraphHandler = (nextGraph) => {
    this.setState({ activeGraph: nextGraph });
  };

  setSelectedProductionHandler = (selectedProduction) => {
    this.setState({ selectedProduction });
  };

  validateSuggestedData = (productions: Array) => {
    const contributionsUrl = API_CONTRIBUTE_PUBLICATIONS_SCANR;
    const contributionReq = {
      id: this.props.match.params.id,
      email: '',
      name: this.props.fullName,
      productions,
    };

    Axios.post(contributionsUrl, contributionReq).then((response) => {
      if (response.data.status === 'OK') {
        this.setState({ suggestedDataSuccessID: 'contribution_received', modalSize: 'small' });
      }
    });
  };

  handleSliderRange = (low, high) => {
    this.setState({
      high: Math.max(low, high),
      low: Math.min(low, high),
    });
  };

  updateSuggestedData=(param: { loading: boolean, messageID: string, data: Array }) => {
    this.setState({ isLoadingSuggestedData: param.loading || false, suggestedDataMessageID: param.messageID || '', suggestedData: param.data || [] });
  }

  fetchSuggestedData = (param:{ loadMore: boolean } = {}) => {
    this.updateSuggestedData({ loading: !param.loadMore, data: param.loadMore ? this.state.suggestedData : [] });
    const { loadMore } = param;
    const personsUrl = API_PERSONS_SEARCH_END_POINT;
    const publicationsUrl = API_PUBLICATIONS_SEARCH_END_POINT;
    const fullName = this.state.querySuggestedData || this.props.fullName;
    const personsReq = iDsFromFullNameCasesRequest(fullName);

    if (fullName.split(' ').length === 1) return;

    this.setState(prevState => ({ currentPageSuggestedData: loadMore ? prevState.currentPageSuggestedData + 1 : 0 }));

    Axios.post(personsUrl, personsReq).then(res => res.data.results).then((ids) => {
      if (ids.length > 0) {
        const publicationsReq = productionsWithoutIdsRequest(fullName, [...ids].map(id => id.value.id), this.state.currentPageSuggestedData, PAGE_SIZE);
        Axios.post(publicationsUrl, publicationsReq).then((response) => {
          const { suggestedData } = this.state;
          const { data } = response;
          if (!response.data.total) {
            this.updateSuggestedData({ messageID: 'nothing_found' });
          } else {
            const totalSuggested = loadMore ? (suggestedData.length + data.results.length) : data.results.length;
            this.setState({ loadMoreSuggestedData: !!totalSuggested < data.total });
            const results = data.results.sort((a, b) => (b.value.publicationDate - a.value.publicationDate));
            const productions = loadMore ? [...suggestedData, ...results] : results;

            this.updateSuggestedData({ data: productions, loading: false });
          }
        });
      } else {
        this.updateSuggestedData({ messageID: 'nothing_found' });
      }
    });
  };

  render() {
    const messages = {
      fr: messagesFr,
      en: messagesEn,
    };
    if (this.state.total === 0 || this.state.error || this.state.isLoading) {
      return (
        <IntlProvider locale={this.props.language} messages={messages[this.props.language]}>
          <Fragment>
            <section className="container-fluid py-4">
              <div className="container">
                <SectionTitleViewMode
                  icon="fa-folder-open"
                  objectType="publications"
                  language={this.props.language}
                  id={this.props.match.params.id}
                  total={this.state.total}
                  title={(this.props.language === 'fr') ? 'Productions (depuis 2013)' : 'Productions (since 2013)'}
                  lexicon="Productions"
                  viewModeClickHandler={this.viewModeClickHandler}
                  modalHandler={this.modalHandler}
                  viewMode={this.state.viewMode}
                />
                <FormattedHTMLMessage id="ProductionPerimeter" />
                {(this.state.total === 0) ? <EmptySection language={this.props.language} /> : null}
                {(this.state.error) ? <Errors error={500} /> : null}
                {
                  (this.state.isLoading)
                    ? (
                      <React.Fragment>
                        <FilterPanel
                          language={this.props.language}
                          data={[]}
                          totalPerType={this.state.totalPerType}
                          selectedType={this.state.productionType || 'publication'}
                          changeTypeHandler={this.changeTypeHandler}
                          currentQueryText={this.state.currentQueryText}
                          queryChangeHandler={this.queryChangeHandler}
                          queryTextChangeHandler={this.queryTextChangeHandler}
                          lowSliderYear={this.state.low}
                          highSliderYear={this.state.high}
                          handleSliderRange={this.handleSliderRange}
                        />
                        <Loader color={styles.publicationsColor} />
                      </React.Fragment>
                    )
                    : null
                }
              </div>
            </section>
          </Fragment>
        </IntlProvider>
      );
    }

    // set tooltip for slider
    const sliderDataWithTooltip = [];
    this.state.sliderData.forEach((entry) => {
      const newEntry = { ...entry };
      newEntry.tooltip = `${entry.count} ${this.state.productionType} - ${entry.value}`;
      sliderDataWithTooltip.push(newEntry);
    });
    return (
      <IntlProvider locale={this.props.language} messages={messages[this.props.language]}>
        <Fragment>
          <section className="container-fluid py-4">
            <div className="container">
              <SectionTitleViewMode
                icon="fa-folder-open"
                objectType="publications"
                language={this.props.language}
                id={this.props.match.params.id}
                total={this.state.total}
                title={(this.props.language === 'fr') ? 'Productions avec une affiliation française (depuis 2013)' : 'Productions with a French affiliation (since 2013)'}
                lexicon="Productions"
                subTitle={<FormattedHTMLMessage id="ProductionPerimeter" />}
                subTitleLink={<FormattedHTMLMessage id="SuggestPublication" />}
                modalHandler={this.modalHandler}
                viewModeClickHandler={this.viewModeClickHandler}
                viewMode={this.state.viewMode}
              />
              <FilterPanel
                language={this.props.language}
                data={sliderDataWithTooltip}
                totalPerType={this.state.totalPerType}
                selectedType={this.state.productionType}
                changeTypeHandler={this.changeTypeHandler}
                currentQueryText={this.state.currentQueryText}
                queryChangeHandler={this.queryChangeHandler}
                queryTextChangeHandler={this.queryTextChangeHandler}
                lowSliderYear={this.state.low}
                highSliderYear={this.state.high}
                handleSliderRange={this.handleSliderRange}
              />
              {
                (this.state.viewMode === 'list')
                  ? (
                    <ProductionList
                      language={this.props.language}
                      data={this.state.data}
                      selectedProduction={this.state.selectedProduction}
                      setSelectedProductionHandler={this.setSelectedProductionHandler}
                    />
                  )
                  : (
                    <ProductionGraphs
                      language={this.props.language}
                      activeGraph={this.state.activeGraph}
                      setActiveGraphHandler={this.setActiveGraphHandler}
                      graphData={this.state.graphData}
                      productionType={this.state.productionType}
                      totalPerType={this.state.totalPerType}
                    />
                  )
              }
            </div>
          </section>
          <UIModal
            titleID="suggested_production_title"
            modalHandler={this.modalHandler}
            isOpened={this.state.isModalOpened}
            size={this.state.modalSize}
          >
            {this.state.suggestedDataSuccessID ? (
              <SuggestedDataConfirmForm
                language={this.props.language}
                suggestedDataSuccessID={this.state.suggestedDataSuccessID}
              />
            )
              : (
                <SuggestedDataForm
                  validate={this.validateSuggestedData}
                  isLoading={this.state.isLoadingSuggestedData}
                  language={this.props.language}
                  suggestedData={this.state.suggestedData}
                  suggestedDataMessageID={this.state.suggestedDataMessageID}
                  loadMoreAction={this.state.loadMoreSuggestedData ? this.fetchSuggestedData : null}
                >
                  <SearchSuggestedDataForm
                    querySuggestedData={this.state.querySuggestedData}
                    language={this.props.language}
                    updateQuery={querySuggestedData => this.setState({ querySuggestedData })}
                    fetchProduction={this.fetchSuggestedData}
                  />
                </SuggestedDataForm>
              )
            }
          </UIModal>
        </Fragment>
      </IntlProvider>
    );
  }
}

export default Productions;

Productions.propTypes = {
  language: PropTypes.string.isRequired,
  fullName: PropTypes.string,
  match: PropTypes.object.isRequired,
  childs: PropTypes.array.isRequired,
  person: PropTypes.bool,
};
