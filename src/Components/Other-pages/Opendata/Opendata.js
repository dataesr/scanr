import React from 'react';
import { IntlProvider, FormattedHTMLMessage } from 'react-intl';
import PropTypes from 'prop-types';

import Footer from '../../Shared/Footer/Footer';
import Header from '../../Shared/Header/Header-homePage';
import CardTwoColumns from './CardTwoColumns';
import CardWithButton from '../../Shared/CardWithButton/CardWithButton';
import HeaderTitle from '../../Shared/HeaderTitle/HeaderTitle';
import DiscoverThreeCards from '../../Shared/DiscoverThreeCards/DiscoverThreeCards';
import BlueBanner from '../../Shared/BlueBanner/BlueBanner';
import BannerOpendata from '../../Shared/BannerOpendata/BannerOpendata';
import Background from './poudre-bleu_Fgris-B.jpg';

/* Gestion des langues */
import messagesFr from './translations/fr.json';
import messagesEn from './translations/en.json';

/* SCSS */
import classes from './Opendata.scss';

const sectionStyle = {
  backgroundImage: `url(${Background})`,
  backgroundPosition: 'bottom 0 left 0',
};

const Opendata = (props) => {
  const messages = {
    fr: messagesFr,
    en: messagesEn,
  };

  return (
    <IntlProvider locale={props.language} messages={messages[props.language]}>
      <div className={`container-fluid ${classes.Opendata}`}>
        <Header
          language={props.language}
          switchLanguage={props.switchLanguage}
        />
        <section>
          <HeaderTitle
            language={props.language}
            switchLanguage={props.switchLanguage}
            schema="opendata"
          />
        </section>
        <section style={sectionStyle} className={classes.Content}>
          <div className="container">
            <div className="row">
              <CardTwoColumns
                language={props.language}
                title="Opendata.TitleOpendata"
              >
                <FormattedHTMLMessage
                  id="Opendata.TitleOpendata.content"
                  defaultMessage="Opendata.TitleOpendata.content"
                />
              </CardTwoColumns>
              <CardWithButton
                language={props.language}
                schema="entities"
                title="Opendata.card01"
                url="https://worldwide.espacenet.com/?locale=fr_EP"
                lib_button="Voir"
              />
              <CardWithButton
                language={props.language}
                schema="entities"
                title="Opendata.card02"
                url="https://worldwide.espacenet.com/?locale=fr_EP"
                lib_button="Voir"
              />
              <CardWithButton
                language={props.language}
                schema="projects"
                title="Opendata.card03"
                url="https://worldwide.espacenet.com/?locale=fr_EP"
                lib_button="Voir"
              />
              <CardWithButton
                language={props.language}
                schema="projects"
                title="Opendata.card04"
                url="https://worldwide.espacenet.com/?locale=fr_EP"
                lib_button="Voir"
              />
              <CardWithButton
                language={props.language}
                schema="entities"
                title="Opendata.card05"
                url="https://worldwide.espacenet.com/?locale=fr_EP"
                lib_button="Voir"
              />
              <CardWithButton
                language={props.language}
                schema="persons"
                title="Opendata.card06"
                url="https://worldwide.espacenet.com/?locale=fr_EP"
                lib_button="Voir"
              />
              <CardWithButton
                language={props.language}
                schema="persons"
                title="Opendata.card07"
                url="https://worldwide.espacenet.com/?locale=fr_EP"
                lib_button="Voir"
              />
              <CardWithButton
                language={props.language}
                schema="entities"
                title="Opendata.card08"
                url="https://worldwide.espacenet.com/?locale=fr_EP"
                lib_button="Voir"
              />
              <CardWithButton
                language={props.language}
                schema="entities"
                title="Opendata.card09"
                url="https://worldwide.espacenet.com/?locale=fr_EP"
                lib_button="Voir"
              />
              <CardWithButton
                language={props.language}
                schema="entities"
                title="Opendata.card10"
                url="https://worldwide.espacenet.com/?locale=fr_EP"
                lib_button="Voir"
              />
              <CardWithButton
                language={props.language}
                schema="persons"
                title="Opendata.card11"
                url="https://worldwide.espacenet.com/?locale=fr_EP"
                lib_button="Voir"
              />
            </div>
          </div>
        </section>
        <BannerOpendata
          language={props.language}
          title="BannerOpendata.Title"
          child="BannerOpendata.child"
          lib_button="BannerOpendata.lib_button"
        />
        <section className={classes.Api}>
          <div className="container">
            <div className="row">
              <CardTwoColumns
                language={props.language}
                title="Opendata.ApiScanr"
              >
                <FormattedHTMLMessage
                  id="Opendata.ApiScanr.content"
                  defaultMessage="Opendata.ApiScanr.content"
                />
              </CardTwoColumns>
              <CardWithButton
                language={props.language}
                title="Opendata.DocuApi"
                url="https://worldwide.espacenet.com/?locale=fr_EP"
                lib_button="Accéder"
              />
              <CardWithButton
                language={props.language}
                title="Opendata.EnSavoirPlusApi"
                url="https://worldwide.espacenet.com/?locale=fr_EP"
                lib_button="Lire"
              />
            </div>
          </div>
        </section>
        <section>
          <DiscoverThreeCards
            language={props.language}
            TitleCard1="Discover.TalkAboutScanr"
            TitleCard2="Discover.Sources"
            TitleCard3="Discover.Team"
          />
        </section>
        <BlueBanner
          language={props.language}
          schema="TalkAboutScanr"
        />
        <Footer language={props.language} />
      </div>
    </IntlProvider>
  );
};

export default Opendata;

Opendata.propTypes = {
  language: PropTypes.string.isRequired,
  switchLanguage: PropTypes.func.isRequired,
};
