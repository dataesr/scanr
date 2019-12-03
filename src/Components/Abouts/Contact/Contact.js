import React from 'react';
import PropTypes from 'prop-types';


import CardToPage from '../../Shared/CardWithButton/CardToPage';
import Banner from '../../Shared/Banner/Banner';
import Footer from '../../Shared/Footer/Footer';
import Header from '../../Shared/Header/Header';
import HeaderTitle from '../../Shared/HeaderTitle/HeaderTitle';
import FormContact from '../../Shared/FormContact/FormContact';

/* SCSS */
import classes from './Contact.scss';


/**
 * Contact
 * Url : /contact
 * Description : Page du formulaire de contact scanR
 * Responsive : .
 * Accessible : .
 * Tests unitaires : .
 */

const Contact = props => (
  <React.Fragment>
    <Header />
    <HeaderTitle
      language={props.language}
      labelkey="contact"
      url1="/"
      url2="#"
    />
    <section className="container py-4">
      <FormContact language={props.language} />
    </section>

    <section className={classes.Cards}>
      <div className="container py-3">
        <div className="row">
          <div className={`col-lg ${classes.CardContainer}`}>
            <CardToPage
              cssClass="card_lightdark"
              labelKey="contributeScanr"
              language={props.language}
              btnText="discover"
              url=""
              target="_blank"
            />
          </div>
          <div className={`col-lg ${classes.CardContainer}`}>
            <CardToPage
              cssClass="card_lightdark"
              labelKey="whatAreOurSources"
              language={props.language}
              btnText="discover"
              url=""
              target="_blank"
            />
          </div>
          <div className={`col-lg ${classes.CardContainer}`}>
            <CardToPage
              cssClass="card_lightdark"
              labelKey="openData"
              language={props.language}
              btnText="discover"
              url=""
              target="_blank"
            />
          </div>
        </div>
      </div>
    </section>

    <Banner
      cssClass="BannerDark"
      labelKey="Appear"
      language={props.language}
      url=""
      target="_blank"
    />

    <Footer language={props.language} />
  </React.Fragment>
);

export default Contact;

Contact.propTypes = {
  language: PropTypes.string.isRequired,
};
