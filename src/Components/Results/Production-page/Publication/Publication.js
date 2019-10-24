import React, { Component, Fragment } from 'react';
import { IntlProvider, FormattedHTMLMessage } from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment';

import HeaderTitle from '../../Entity-page/HeaderTitle/HeaderTitle';
import SectionTitle from '../../../Shared/Results/SectionTitle/SectionTitle';
import SummaryCard from '../Shared/SummaryCard/SummaryCard';
import SimpleCard from '../../../Shared/Ui/SimpleCard/SimpleCard';
import SourceCard from './SubComponents/SourceCard';
import OaCard from '../Shared/Oa/OaCard';
import OaHost from '../Shared/Oa/OaHost';
import OaLink from '../Shared/Oa/OaLink';
import PersonCard from '../../../Shared/Ui/PersonCard/PersonCard';
import CounterCard from '../../../Shared/Ui/CounterCard/CounterCard';
import CounterListCard from '../../../Shared/Ui/CounterListCard/CounterListCard';
import AffiliationCard from '../../../Search-page/SearchResults/ResultCards/EntityCard';

import Background from '../../../Shared/images/poudre-fuschia_Fgris-B.jpg';
import BackgroundAuthors from '../../../Shared/images/poudre-orange-Fbleu-BR.jpg';
import BackgroundAffiliations from '../../../Shared/images/poudre-jaune_Fgris-B.jpg';

import classes from './Publication.scss';

import getSelectKey from '../../../../Utils/getSelectKey';

/* Gestion des langues */
import messagesFr from './translations/fr.json';
import messagesEn from './translations/en.json';

const messages = {
  fr: messagesFr,
  en: messagesEn,
};

/**
 * Publication
 * Url : .
 * Description : .
 * Responsive : .
 * Accessible : .
 * Tests unitaires : .
*/
class Publication extends Component {
  state = {
    modifyModePortrait: false,
    modifyModeOa: false,
    modifyModeAuthors: false,
    modifyModeAffiliations: false,
  };

  modifyModeHandlePortrait = () => {
    this.setState(prevState => ({ modifyModePortrait: !prevState.modifyModePortrait }));
  }

  modifyModeHandleOa = () => {
    this.setState(prevState => ({ modifyModeOa: !prevState.modifyModeOa }));
  }

  modifyModeHandleAuthors = () => {
    this.setState(prevState => ({ modifyModeAuthors: !prevState.modifyModeAuthors }));
  }

  modifyModeHandleAffiliations = () => {
    this.setState(prevState => ({ modifyModeAffiliations: !prevState.modifyModeAffiliations }));
  }

  getAuthor = role => (this.props.data.authors.find(person => person.role === role))

  getAuthors = role => (this.props.data.authors.filter(person => person.role === role))

  getSortedAuthors = () => {
    const orderAuthors = ['author', 'directeurthese', 'presidentjury', 'membrejury', 'rapporteur'];
    const sortedAuthors = [];
    orderAuthors.forEach((role) => {
      const authors = this.getAuthors(role);
      if (authors.length > 0) {
        authors.forEach(author => sortedAuthors.push(author));
      }
    });
    return sortedAuthors;
  }

  handleChange = (sectionName) => {
    document.getElementById(sectionName).scrollIntoView(true);
    window.scrollBy({ top: -120, behavior: 'smooth' });
  };

  render() {
    if (!this.props.data) {
      return null;
    }
    const sectionStyle = {
      backgroundImage: `url(${Background})`,
    };
    const sectionStyleAuthors = {
      backgroundImage: `url(${BackgroundAuthors})`,
    };
    const sectionStyleAffiliations = {
      backgroundImage: `url(${BackgroundAffiliations})`,
    };

    const id = (this.props.data.id.substring(0, 3) === 'doi') ? this.props.data.id.substring(3) : this.props.data.id;
    const publicationDate = moment(this.props.data.publicationDate).format('L');
    const summary = (this.props.language === 'fr') ? getSelectKey(this.props.data, 'summary', this.props.language, 'default') : getSelectKey(this.props.data, 'alternativeSummary', this.props.language, 'default');
    const nbAuthorsToShow = 6;
    const sortedAuthors = this.getSortedAuthors();

    return (
      <IntlProvider locale={this.props.language} messages={messages[this.props.language]}>
        <Fragment>
          <HeaderTitle
            language={this.props.language}
            label={getSelectKey(this.props.data, 'title', this.props.language, 'default')}
            handleChangeForScroll={this.handleChange}
            idPage="Publication"
          />
          <section className={`container-fluid ${classes.Publication}`} style={sectionStyle} id="Publication">
            <div className="container">
              <SectionTitle
                icon="fas fa-id-card"
                modifyModeHandle={this.modifyModeHandlePortrait}
                modifyMode={this.state.modifyModePortrait}
              >
                <FormattedHTMLMessage id="Publication.title" defaultMessage="Publication.title" />
              </SectionTitle>

              <div className="row">
                <div className="col-lg">
                  <div className="row">
                    <div className={`col-12 ${classes.CardContainer}`}>
                      <SimpleCard
                        language={this.props.language}
                        logo="fas fa-id-card"
                        title={messages[this.props.language]['Publication.publication.title']}
                        label={getSelectKey(this.props.data, 'title', this.props.language, 'default')}
                        tooltip=""
                        masterKey="Publication/title"
                        modifyMode={this.state.modifyModePortrait}
                        allData={this.props.data}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-5">
                      <div className="row">
                        <div className={`col-md-12 ${classes.CardContainer}`}>
                          <SimpleCard
                            language={this.props.language}
                            logo="fas fa-calendar-day"
                            title="doi"
                            label={id}
                            tooltip=""
                            masterKey="Publication/publicationDate"
                            modifyMode={this.state.modifyModePortrait}
                            allData={this.props.data}
                          />
                        </div>
                        <div className={`col-md-12 ${classes.CardContainer}`}>
                          <SimpleCard
                            language={this.props.language}
                            logo="fas fa-calendar-day"
                            title={messages[this.props.language]['Publication.publication.publicationDate']}
                            label={publicationDate}
                            tooltip=""
                            masterKey="Publication/publicationDate"
                            modifyMode={this.state.modifyModePortrait}
                            allData={this.props.data}
                          />
                        </div>
                      </div>
                    </div>
                    <div className={`col-md-7 ${classes.CardContainer}`}>
                      <SourceCard
                        language={this.props.language}
                        data={this.props.data.source}
                        masterKey="Publication/publicationType"
                        modifyMode={this.state.modifyModePortrait}
                        allData={this.props.data}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg">
                  <div className="row">
                    <div className={`col-12 ${classes.CardContainer}`}>
                      <SummaryCard
                        language={this.props.language}
                        title={messages[this.props.language]['Publication.summary.title']}
                        text={summary}
                        tooltip=""
                        masterKey="Publication/summary"
                        modifyMode={this.state.modifyModePortrait}
                        allData={this.props.data}
                      />
                    </div>
                    <div className={`col-md-6 ${classes.CardContainer}`}>
                      <SimpleCard
                        language={this.props.language}
                        logo="fas fa-bookmark"
                        title={messages[this.props.language]['Publication.publication.type']}
                        label={messages[this.props.language][`Publication.publication.type.${this.props.data.type}`]}
                        tooltip=""
                        masterKey="Publication/publicationType"
                        modifyMode={this.state.modifyModePortrait}
                        allData={this.props.data}
                      />
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className={`container-fluid ${classes.OaSection}`} id="AccessType">
            <div className="container">
              <SectionTitle
                icon={(this.props.data && this.props.data.isOa) ? 'fas fa-lock-open' : 'fas fa-lock'}
                modifyModeHandle={this.modifyModeHandleOa}
                modifyMode={this.state.modifyModeOa}
              >
                <FormattedHTMLMessage id="Publication.oa.title" defaultMessage="Publication.oa.title" />
              </SectionTitle>
              <div className="row">
                <div className={`col-3 ${classes.CardContainer}`}>
                  <OaCard
                    language={this.props.language}
                    oa={(this.props.data && this.props.data.isOa) ? this.props.data.isOa : false}
                    oaEvidence={(this.props.data && this.props.data.oaEvidence) ? this.props.data.oaEvidence : false}
                    masterKey="AccessType/OaCard"
                    modifyMode={this.state.modifyModeOa}
                    allData={this.props.data}
                  />
                </div>
                {
                  (this.props.data && this.props.data.oaEvidence && this.props.data.oaEvidence.hostType) ? (
                    <div className={`col-3 ${classes.CardContainer}`}>
                      <OaHost
                        language={this.props.language}
                        oaEvidence={this.props.data.oaEvidence}
                        masterKey="AccessType/OaCard"
                        modifyMode={this.state.modifyModeOa}
                        allData={this.props.data}
                      />
                    </div>
                  ) : null
                }
                {
                  (this.props.data && this.props.data.oaEvidence && (this.props.data.oaEvidence.url || this.props.data.oaEvidence.pdfurl)) ? (
                    <div className={`col-3 ${classes.CardContainer}`}>
                      <OaLink
                        language={this.props.language}
                        oaEvidence={this.props.data.oaEvidence}
                        masterKey="AccessType/OaCard"
                        modifyMode={this.state.modifyModeOa}
                        allData={this.props.data}
                      />
                    </div>
                  ) : null
                }
              </div>
            </div>
          </section>
          <section className={`container-fluid ${classes.AuthorsSection}`} style={sectionStyleAuthors} id="Authors">
            <div className="container">
              <SectionTitle
                icon="fas fa-id-card"
                modifyModeHandle={this.modifyModeHandleAuthors}
                modifyMode={this.state.modifyModeAuthors}
              >
                <FormattedHTMLMessage id="Publication.authors.title" defaultMessage="Publication.authors.title" />
              </SectionTitle>
              <div className="row">
                {
                  (this.props.data.authors && this.props.data.authors.length > 1)
                    ? (
                      <div className={`col-3 ${classes.CardContainer}`}>
                        <CounterCard
                          counter={this.props.data.authors.length}
                          title=""
                          label={messages[this.props.language]['Publication.publication.persons']}
                          color="Persons"
                          className={classes.PersonCardHeight}
                        />
                      </div>
                    ) : null
                }
                {
                  sortedAuthors.map((author, index) => {
                    if (index < nbAuthorsToShow) {
                      return (
                        <div className={`col-3 ${classes.CardContainer}`}>
                          <PersonCard
                            data={author}
                            showTitle={false}
                            language={this.props.language}
                            role={messages[this.props.language][`Publication.publication.${author.role}`]}
                            masterKey="Publication/person"
                            modifyMode={this.state.modifyModeAuthors}
                            allData={this.props.data}
                            className={classes.PersonCardHeight}
                          />
                        </div>
                      );
                    }
                    return null;
                  })
                }
                {
                  (this.props.data.authors && this.props.data.authors.length > nbAuthorsToShow)
                    ? (
                      <div className={`col-3 ${classes.CardContainer}`}>
                        <CounterListCard
                          language={this.props.language}
                          data={sortedAuthors}
                          limit={nbAuthorsToShow}
                          title=""
                          labelKey="authors"
                          color="Default"
                        />
                      </div>
                    ) : null
                }
              </div>
            </div>
          </section>
          {
            (this.props.data && this.props.data.affiliations)
              ? (
                <section className={`container-fluid ${classes.AffiliationsSection}`} style={sectionStyleAffiliations} id="Affiliations">
                  <div className="container">
                    <SectionTitle
                      icon="fas fa-id-card"
                      modifyModeHandle={this.modifyModeHandleAffiliations}
                      modifyMode={this.state.modifyModeAffiliations}
                    >
                      <FormattedHTMLMessage id="Publication.affiliations.title" defaultMessage="Publication.affiliations.title" />
                    </SectionTitle>
                    <ul className={`row ${classes.Ul}`}>
                      {
                        this.props.data.affiliations.map(item => (
                          <li key={item} className={`col-3 ${classes.Li}`}>
                            <AffiliationCard
                              data={item}
                              small
                              language={this.props.language}
                            />
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                </section>
              ) : null
          }
        </Fragment>
      </IntlProvider>
    );
  }
}

export default Publication;

Publication.propTypes = {
  language: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};
