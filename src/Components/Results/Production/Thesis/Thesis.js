import React, { Component, Fragment } from 'react';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment';
import Similars from '../Shared/Similars/Similars';
import HeaderTitle from '../../../Shared/Results/HeaderTitle/HeaderTitle';
import SectionTitle from '../../Shared/SectionTitle';
import SummaryCard from '../Shared/SummaryCard/SummaryCard';
import SimpleCard from '../../../Shared/Ui/SimpleCard/SimpleCard';
import SimpleCardWithButton from '../../../Shared/Ui/SimpleCardWithButton/SimpleCardWithButton';
import OaCard from '../Shared/Oa/OaCard';
import OaHost from '../Shared/Oa/OaHost';
import OaLink from '../Shared/Oa/OaLink';
import PersonCard from '../../../Shared/Ui/PersonCard/PersonCard';
import CounterCard from '../../../Shared/Ui/CounterCard/CounterCard';
import CounterListCard from '../../../Shared/Ui/CounterListCard/CounterListCard';
import AffiliationCard from '../../../Search/SearchResults/ResultCards/EntityCard';
import TagCard from '../../../Shared/Ui/TagCard/TagCard';
import LogoCard from '../../../Shared/Ui/LogoCard/LogoCard';
import YoutubeCard from '../../../Shared/Ui/YoutubeCard/YoutubeCard';
import PrizeCard from '../../../Shared/Ui/PrizeCard/PrizeCard';

import Background from '../../../Shared/images/poudre-bleu_Fgris-B.jpg';
import BackgroundAuthors from '../../../Shared/images/poudre-orange-Fbleu-BR.jpg';
import BackgroundAffiliations from '../../../Shared/images/poudre-jaune_Fgris-B.jpg';

import classes from './Thesis.scss';

import getSelectKey from '../../../../Utils/getSelectKey';

/* Gestion des langues */
import messagesFr from './translations/fr.json';
import messagesEn from './translations/en.json';

const messages = {
  fr: messagesFr,
  en: messagesEn,
};

/**
 * Thesis
 * Url : .
 * Description : .
 * Responsive : .
 * Accessible : .
 * Tests unitaires : .
*/
class Thesis extends Component {
  getAuthor = role => (this.props.data.authors.find(person => person.role === role))

  getAuthors = role => (this.props.data.authors.filter(person => person.role === role))

  getSortedAuthors = () => {
    const orderAuthors = ['author', 'directeurthese', 'rapporteur', 'presidentjury', 'membrejury'];
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
      return <div>null</div>;
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

    const id = (this.props.data.id.substring(0, 5) === 'these') ? this.props.data.id.substring(5) : this.props.data.id;
    const publicationDate = moment(this.props.data.publicationDate).format('L');
    const summary = (this.props.language === 'fr') ? getSelectKey(this.props.data, 'summary', this.props.language, 'default') : getSelectKey(this.props.data, 'alternativeSummary', this.props.language, 'default');
    const nbAuthorsToShow = 6;
    const sortedAuthors = this.getSortedAuthors();
    const theseLink = 'http://www.theses.fr/'.concat({ id }.id);

    let swHeritageLink = null;
    if (this.props.data.links && this.props.data.links.length > 0) {
      const swL = this.props.data.links.find(el => el.type === 'software_heritage');
      if (swL) {
        swHeritageLink = swL.url;
      }
    }

    let youtubeUrl = null;
    if (this.props.data.links && this.props.data.links.length > 0) {
      for (let i = 0; i < this.props.data.links.length; i += 1) {
        if (this.props.data.links[i].type.toLowerCase() === 'youtube') {
          youtubeUrl = this.props.data.links[i].url;
        }
      }
    }

    const newAwards = [];
    if (this.props.data.awards) {
      this.props.data.awards.forEach((element) => {
        let labelToUse = element.label;
        if (element.description) {
          labelToUse = element.label.concat(' (', element.description).concat(')');
        }
        newAwards.push({
          label: labelToUse,
          date: element.date,
        });
      });
    }

    return (
      <IntlProvider locale={this.props.language} messages={messages[this.props.language]}>
        <Fragment>
          <HeaderTitle
            language={this.props.language}
            label={getSelectKey(this.props.data, 'title', this.props.language, 'default')}
            handleChangeForScroll={this.handleChange}
            idPage="Thesis"
            id={this.props.data.id}
          />
          <section className={`container-fluid ${classes.Thesis}`} style={sectionStyle} id="Thesis">
            <div className="container">
              <SectionTitle
                icon="fa-id-card"
                objectType="publications"
                language={this.props.language}
                id={this.props.id}
                title={messages[this.props.language]['Thesis.title']}
              />
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
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className={`col-md-6 ${classes.CardContainer}`}>
                      <SimpleCardWithButton
                        language={this.props.language}
                        logo="fas fa-id-card"
                        title={messages[this.props.language]['Publication.publication.id']}
                        label={id}
                        tooltip=""
                        url={theseLink}
                        link="link_these"
                      />
                    </div>
                    <div className={`col-md-6 ${classes.CardContainer}`}>
                      <SimpleCard
                        language={this.props.language}
                        logo="fas fa-calendar-day"
                        title={messages[this.props.language]['Publication.publication.publicationDate']}
                        label={publicationDate}
                        tooltip=""
                      />
                    </div>
                    <div className={`col-md-6 ${classes.CardContainer}`}>
                      { /* eslint-disable */ }
                      <PersonCard
                        data={this.getAuthor('author')}
                        showTitle={false}
                        language={this.props.language}
                        role="author"
                      />
                    { /* eslint-enable */ }
                    </div>
                    {
                    (swHeritageLink) ? (
                      <div className={`col-md-6 ${classes.CardContainer}`}>
                        <LogoCard
                          url="./img/swh-logo.jpg"
                          language={this.props.language}
                          cssClass="Height150"
                        />
                      </div>
                    ) : null
                    }
                  </div>
                  <div className="row">
                    { (youtubeUrl) ? (
                      <div className={`col-md-12 ${classes.CardContainer}`} style={{ height: '500px' }}>
                        <YoutubeCard url={youtubeUrl} autoHeight />
                      </div>
                    ) : null }
                  </div>

                  <div className="row">
                    {
                      newAwards.map(award => (
                        <div className={`col-md-6 col-sm-12 ${classes.CardContainer}`}>
                          <PrizeCard
                            date={award.date}
                            language={this.props.language}
                            label={award.label}
                            icon="prize"
                            color="#fe7747"
                          />
                        </div>
                      ))
                    }
                  </div>

                </div>
                <div className="col-lg">
                  <div className="row">
                    {
                      (summary) ? (
                        <div className={`col-12 ${classes.CardContainer}`}>
                          <SummaryCard
                            language={this.props.language}
                            title={messages[this.props.language]['Publication.summary.title']}
                            text={summary}
                            tooltip=""
                          />
                        </div>
                      ) : null
                    }
                    {
                      (this.props.data.keywords.default.length > 0) ? (
                        <div className={`col-12 ${classes.CardContainer}`}>
                          <TagCard
                            language={this.props.language}
                            logo="fas fa-clipboard-list"
                            title={messages[this.props.language]['Publication.publication.tags']}
                            tagStyle={{ backgroundColor: '#3778bb', color: 'white' }}
                            labelListButton="Autres"
                            tagList={this.props.data.keywords.default}
                            tooltip=""
                          />
                        </div>
                      ) : null
                    }
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className={`container-fluid ${classes.OaSection}`} id="AccessType">
            <div className="container">
              <SectionTitle
                icon="fa-open-folder"
                objectType="publications"
                language={this.props.language}
                id={this.props.id}
                title={messages[this.props.language]['Publication.oa.title']}
              />
              <div className="row">
                <div className={`col-md-3 ${classes.CardContainer}`}>
                  <OaCard
                    language={this.props.language}
                    oa={(this.props.data && this.props.data.isOa) ? this.props.data.isOa : false}
                    oaEvidence={(this.props.data && this.props.data.oaEvidence) ? this.props.data.oaEvidence : false}
                  />
                </div>
                {
                  (this.props.data && this.props.data.oaEvidence && this.props.data.oaEvidence.hostType) ? (
                    <div className={`col-md-3 ${classes.CardContainer}`}>
                      <OaHost
                        language={this.props.language}
                        hostType={this.props.data.oaEvidence.hostType}
                      />
                    </div>
                  ) : null
                }
                {
                  (this.props.data && this.props.data.oaEvidence && (this.props.data.oaEvidence.url || this.props.data.oaEvidence.pdfurl)) ? (
                    <div className={`col-md-3 ${classes.CardContainer}`}>
                      <OaLink
                        language={this.props.language}
                        oaEvidence={this.props.data.oaEvidence}
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
                icon="fa-open-folder"
                objectType="publications"
                language={this.props.language}
                id={this.props.id}
                title={messages[this.props.language]['Publication.authors.title']}
              />
              <div className="row">
                {
                  (this.props.data.authors && this.props.data.authors.length > 1)
                    ? (
                      <div className={`col-md-3 ${classes.CardContainer}`}>
                        <CounterCard
                          counter={this.props.data.authors.length}
                          title=""
                          label={messages[this.props.language]['Publication.publication.persons']}
                          color="Persons"
                        />
                      </div>
                    ) : null
                }
                {
                  sortedAuthors.map((author, index) => {
                    if (index < nbAuthorsToShow) {
                      return (
                        <div className={`col-md-3 ${classes.CardContainer}`}>
                          <PersonCard
                            data={author}
                            showTitle={false}
                            language={this.props.language}
                            role={author.role}
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
                      <div className={`col-md-3 ${classes.CardContainer}`}>
                        <CounterListCard
                          language={this.props.language}
                          data={sortedAuthors}
                          objectType={this.props.data.productionType}
                          limit={nbAuthorsToShow}
                          title=""
                          labelKey="authors-thesis"
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
                      icon="fa-open-folder"
                      objectType="publications"
                      language={this.props.language}
                      id={this.props.id}
                      title={messages[this.props.language]['Publication.affiliations.title']}
                    />
                    <div className={`row ${classes.Ul}`}>
                      {
                        this.props.data.affiliations.map(item => (
                          <div key={item} className={`col-md-4 ${classes.Li}`}>
                            <AffiliationCard
                              data={item}
                              small
                              language={this.props.language}
                            />
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </section>
              ) : null
          }
          <Similars id={this.props.id} language={this.props.language} />
        </Fragment>
      </IntlProvider>
    );
  }
}

export default Thesis;

Thesis.propTypes = {
  language: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};
