import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MetaTags from 'react-meta-tags';

import Footer from '../Shared/Footer/Footer';
import Header from '../Shared/Header/Header-homePage';
import LastFocus from '../Shared/LastFocus/LastFocus';
// import LexiconPanel from '../Shared/Lexicon/LexiconPanel';
import MostActiveThemes from '../Shared/MostActiveThemes/MostActiveThemes';
// import Newsletter from '../Shared/Newsletter/Newsletter';
import ScanrToday from '../Shared/ScanrToday/ScanrToday';
import Search from './Search/Search';
import Banner from '../Shared/Banner/Banner';

import classes from './Home.scss';


class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearchFull: true,
    };

    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isSearchFull !== this.state.isSearchFull) {
      return true;
    }
    return false;
  }

  handleScroll = () => {
    if (window.scrollY) {
      if (this.state.isSearchFull) { this.setState({ isSearchFull: false }); }
    } else {
      /* eslint-disable */
      if (!this.state.isSearchFull && window.scrollY === 0) { this.setState({ isSearchFull: true }); }
      /* eslint-enable */
    }
  }


  render() {
    const pageTitle = "ScanR | Moteur de la Recherche et de l'Innovation";
    const pageDescription = 'TODO';
    const pageImage = '../../svg/logo-scanr-blue.svg';
    return (
      <div className={`container-fluid ${classes.HomePage}`} onScroll={this.handleScroll}>

        <MetaTags>
          <title>{pageTitle}</title>
          <meta id="meta-description" name="description" content={pageDescription} />
          <meta id="og-title" property="og:title" content={pageTitle} />
          <meta id="og-image" property="og:image" content={pageImage} />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={pageTitle} />
          <meta name="twitter:description" content={pageDescription} />
          <meta name="twitter:image" content={pageImage} />
        </MetaTags>

        <Header
          language={this.props.language}
          switchLanguage={this.props.switchLanguage}
        />

        <Search
          {...this.props}
          language={this.props.language}
          isFull={this.state.isSearchFull}
        />

        <ScanrToday
          language={this.props.language}
          isFull={this.state.isSearchFull}
          lexicon={{ target: this.state.lexiconTarget, lexiconHandler: this.lexiconHandler }}
        />

        <Banner
          language={this.props.language}
          labelKey="WhatAreOurSources"
          cssClass="BannerLight"
          url="/ressources"
        />

        <MostActiveThemes
          language={this.props.language}
          data={['Brain to computer', 'Marathon', 'Biotechnologie', 'Fusion nucléaire', 'Brain content', 'Cryptographie', 'Matériaux', 'Machine learning', 'Intelligence artificielle', 'Réalité virtuelle']}
          lexiconHandler={() => this.lexiconHandler()}
        />

        <Banner
          language={this.props.language}
          labelKey="Appear"
          cssClass="BannerLight"
          url=""
        />

        <LastFocus language={this.props.language} />

        {/* Not for Now */}
        {/* <Newsletter language={this.props.language} /> */}

        <Banner
          language={this.props.language}
          labelKey="DiscoverDataesr"
          cssClass="BannerDark"
          url={`https://data.esr.gouv.fr/${this.props.language.toUpperCase()}/`}
          target="_blank"
        />

        <Footer language={this.props.language} />
      </div>
    );
  }
}

export default HomePage;

HomePage.propTypes = {
  language: PropTypes.string.isRequired,
  switchLanguage: PropTypes.func.isRequired,
};
