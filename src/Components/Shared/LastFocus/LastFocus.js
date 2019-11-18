import React from 'react';
import { IntlProvider, FormattedHTMLMessage } from 'react-intl';
import PropTypes from 'prop-types';

/* Gestion des langues */
import messagesFr from './translations/fr.json';
import messagesEn from './translations/en.json';

import ButtonToPage from '../Ui/Buttons/ButtonToPage';
import FocusCard from '../Ui/FocusCard/FocusCard';

/* SCSS */
import classes from './LastFocus.scss';

const LastFocus = (props) => {
  const messages = {
    fr: messagesFr,
    en: messagesEn,
  };

  return (
    <IntlProvider locale={props.language} messages={messages[props.language]}>
      <section className={classes.LastFocus}>
        <div className="container">
          <div className="row">
            <div className={`col-lg-10 ${classes.Title}`}>
              <h2>
                <FormattedHTMLMessage
                  id="LastFocus.Title"
                  defaultMessage="LastFocus.Title"
                />
              </h2>
            </div>
            <div className={`col-lg-2 ${classes.Button}`}>
              <ButtonToPage
                className={classes.MarginTop}
                url="/focus"
              >
                <FormattedHTMLMessage
                  id="LastFocus.AllFocus"
                  defaultMessage="LastFocus.AllFocus"
                />
              </ButtonToPage>
            </div>
          </div>

          <div className="row">
            {
              props.focusList.map(oneFocus => (
                <div className="col-lg-4" key={oneFocus.title}>
                  <FocusCard
                    schema={oneFocus.schema}
                    tags={oneFocus.tags}
                    title={oneFocus.title}
                    type={oneFocus.type}
                    url={oneFocus.url}
                  />
                </div>
              ))
            }
          </div>
        </div>
      </section>
    </IntlProvider>
  );
};

export default LastFocus;

LastFocus.propTypes = {
  language: PropTypes.string.isRequired,
  focusList: PropTypes.array,
};
LastFocus.defaultProps = {
  focusList: [
    {
      tags: ['#satt', '#transfert', '#technonologies'],
      title: 'La carte des SATT',
      type: 'map',
      url: '/focus/carte-satt-2019',
      schema: 'entity',
    },
    {
      tags: ['#theses', '#tag2', '#tag3'],
      title: 'Quels sont les thèmes majeurs des thèses en France aujourd\'hui',
      type: 'bubble',
      url: '/focus/themes-theses-2018',
      schema: 'entity',
    },
    {
      tags: ['#tag1', '#tag2', '#tag3'],
      title: 'Prix Nobel: Qui sont les lauréats français ?',
      type: 'histoTop',
      url: '/focus/nobel',
      schema: 'entity',
    },
    {
      tags: ['#tag1', '#tag2', '#tag3'],
      title: 'La carte des projets financés par l\'ANR',
      type: 'donut',
      url: '/focus/donut-poles-compet-france-2019',
      schema: 'project',
    },
    {
      tags: ['#tag1', '#tag2', '#tag3'],
      title: 'Dépots de brevets : Evolution des dernières années en France',
      type: 'bubbleTop',
      url: '',
      schema: 'publication',
    },
    {
      tags: ['#tag1', '#tag2', '#tag3'],
      title: 'Présence sur le web: état des lieux des laboratoires français',
      type: 'treemap',
      url: '',
      schema: 'person',
    },
  ],
};
