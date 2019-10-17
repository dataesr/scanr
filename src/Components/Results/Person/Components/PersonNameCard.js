import React, { Fragment } from 'react';
// import { IntlProvider, FormattedHTMLMessage } from 'react-intl';
import ReactTooltip from 'react-tooltip';
import { IntlProvider, FormattedHTMLMessage } from 'react-intl';

import PropTypes from 'prop-types';

import classes from './PersonNameCard.scss';
import SubmitBox from '../../../Shared/SubmitBox/SubmitBox';
import ButtonWithModal from '../../../Shared/Ui/Buttons/ButtonWithModal';
import messagesFr from '../translations/fr.json';
import messagesEn from '../translations/en.json';

const messages = {
  fr: messagesFr,
  en: messagesEn,
};

/**
 * PersonCardName component
 * Url : .
 * Description : Carte avec logo, titre, label et tooltip
 * Responsive : .
 * Accessible : .
 * Tests unitaires : .
*/

const PersonCardName = (props) => {
  const logo = (<div className={classes.Logo}><i className="fas fa-qrcode" aria-hidden="true" /></div>);
  const htmlList = (props.data.externalIds)
    ? props.data.externalIds.map(tag => (
      <li className="d-flex">
        <p className="m-0 pr-4">
          {tag.type}
        </p>
        <p className="m-0">
          {tag.id}
        </p>
      </li>
    ))
    : null;
  const tooltip = (props.tooltip) ? (
    <Fragment>
      <span className={classes.Tooltip_i_top_right} data-tip={props.tooltip}>i</span>
      <ReactTooltip html />
    </Fragment>
  ) : null;
  return (
    <Fragment>
      <IntlProvider locale={props.language} messages={messages[props.language]}>
        <div className={`d-flex flex-column pb-3 ${classes.PersonCardName}`}>
          {(props.modifyMode) ? <SubmitBox language={props.language} masterKey={props.masterKey} label={props.allData.fullName} /> : null}
          <div className={classes.Logo}>
            {logo}
          </div>
          <div className={classes.Title}>
            <FormattedHTMLMessage id="Person.informations.identity.name" defaultMessage="Person.informations.identity.name" />
          </div>
          <div className={classes.Label}>
            {props.data.fullName}
          </div>
          <div className={classes.Title}>
            <FormattedHTMLMessage id="Person.informations.identity.gender" defaultMessage="Person.informations.identity.gender" />
          </div>
          <div className={classes.Label}>
            {props.data.gender}
          </div>
          <div className={`mt-auto pb-2 ${classes.Title}`}>
            <FormattedHTMLMessage id="Person.informations.identity.identifiers" defaultMessage="Person.informations.identity.identifiers" />
          </div>
          {
            (props.data.externalIds && props.data.externalIds.length > 0)
              ? (
                <ButtonWithModal
                  logo={logo}
                  title={messages[props.language]['Person.informations.identity.identifiers']}
                  buttonLabel={messages[props.language]['Person.seeAll']}
                  dataHtml={htmlList}
                />
              )
              : props.data.id
          }
          {tooltip}
        </div>
      </IntlProvider>
    </Fragment>
  );
};

export default PersonCardName;

PersonCardName.propTypes = {
  language: PropTypes.string,
  data: PropTypes.object,
  tooltip: PropTypes.string,
  masterKey: PropTypes.string, // Utilisée pour le mode modifier/enrichir
  modifyMode: PropTypes.bool,
  allData: PropTypes.object.isRequired,
};
