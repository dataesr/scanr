import React from 'react';
import PropTypes from 'prop-types';

// Composants
import DiscoverDataEsr from '../../Shared/DiscoverDataEsr/DiscoverDataEsr';
import Footer from '../../Shared/Footer/Footer';
import Header from '../../Shared/Header/Header-homePage';
import Lexicon from '../../Shared/Lexicon/Lexicon';

import D3Bar from './D3Bar';
import D3BarRounded from './D3BarRounded';
import LMap from './LeafletMap';
import HighChartsGraph from './HighChartsAccessibility';

import classes from '../../Home-page/Home-page.scss';

/**
 * Focus-1 component <br/>
 * Url : /focus/$id <br/>
 * Description : Page présentant les graphs correspondant au focus $id <br/>
 * Responsive : . <br/>
 * Accessible : . <br/>
 * Tests
 */

// class Focus extends Component {
//   render() {
//     var str = window.location.href.split('/');
//     var test = <p>There is no focus id</p>
//     var id = str[str.length-1]
//     if (id != '' && str.length == 5) {
//         test = <p>Focus id is {id}</p>
//     }
//     return (
//       <div>
//           <p>Focus page</p>
//           {test}
//       </div>
//     );
//   }
// }

const divStyle = {
  width: '800px',
  height: '400px'
};

const FocusId = props => (
  <div className={`container-fluid ${classes.HomePage}`}>
    <Header
      language={props.language}
      switchLanguage={props.switchLanguage}
    />

    {/* <LastFocus language={props.language} /> */}

    <DiscoverDataEsr language={props.language} />

    <div>
      <p>BlaBlaBla</p>
      <br />
      <p>BlaBlaBla</p>
      <br />
      <p>BlaBlaBla</p>
      <br />
      <p>BlaBlaBla</p>
      <br />
      <p>BlaBlaBla</p>
      <br />
      <p>BlaBlaBla</p>
      <br />
      <p>BlaBlaBla</p>
    </div>

    <div id="d3" />

    <D3Bar />

    <D3BarRounded />

    <div id="mapid" style={divStyle} />

    <LMap />

    <HighChartsGraph />

    <Footer language={props.language} />

    <Lexicon
      className={classes.HomePageLexiconTop}
      language={props.language}
    />
  </div>
);

export default FocusId;

FocusId.propTypes = {
  language: PropTypes.string.isRequired,
  switchLanguage: PropTypes.func.isRequired,
};
