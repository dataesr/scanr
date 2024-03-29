import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import PropTypes from 'prop-types';
import PersonCard from '../../../../Shared/Ui/PersonCard/PersonCard';
import EntityCard from '../../../../Shared/Ui/DeposantCard/DeposantCard';
import CardsTitle from '../../../../Shared/Ui/CardsTitle/CardsTitle';
import CounterCard from '../../../../Shared/Ui/CounterCard/CounterCard';
import CounterListCard from '../../../../Shared/Ui/CounterListCard/CounterListCard';

import classes from '../Patents.scss';
import countries from '../countries.json';

/**
 * Patent
 * Url : .
 * Description : .
 * Responsive : .
 * Accessible : .
 * Tests unitaires : .
*/
const PatentParticipants = (props) => {
  let inventors = props.data.filter((auth) => {
    if (auth.country !== 'None' && auth.rolePatent && auth.rolePatent.find(role => role.role === 'inv')) {
      return true;
    }
    return false;
  }).map(inv => ({
    fullName: inv.fullName,
    country: countries[props.language][inv.country],
  }));

  inventors = [...new Set(inventors.map(i => JSON.stringify(i)))].map(i => JSON.parse(i));

  let depos = props.data.filter((auth) => {
    if (auth.country !== 'None' && auth.rolePatent && auth.rolePatent.find(role => role.role === 'dep')) {
      return true;
    }
    return false;
  }).map(deposant => ({
    label: deposant.fullName,
    fullName: deposant.fullName,
    country: countries[props.language][deposant.country],
    id: (deposant.affiliations && deposant.affiliations.length) && deposant.affiliations[0].structure,
    typeParticipant: deposant.typeParticipant,
  }));

  depos = [...new Set(depos.map(i => JSON.stringify(i)))].map(i => JSON.parse(i));

  const deposants = [];

  const ids = [];

  depos.forEach((deposant) => {
    const newdep = { ...deposant };
    const structure = props.affiliations.find(aff => aff.id === deposant.id) || {};
    if (!deposant.id) {
      structure.label = { default: deposant.label, fr: deposant.label };
      structure.country = deposant.country || null;
    } else {
      ids.push(deposant.id);
    }
    newdep.structure = structure;
    if (ids.filter(id => id === deposant.id).length < 2) {
      deposants.push(newdep);
    }
  });

  const nbInventorsToShow = 4;

  return (
    <div className="row">
      <div className="col-md-6">
        <div className="row">
          <div className={`col ${classes.NoSpace}`}>
            <CardsTitle title={<FormattedHTMLMessage id="Patents.Participants.inventor" />} />
          </div>
        </div>
        <div className="row">
          {
            (inventors.length > 1)
              ? (
                <div className={`col-md-6 ${classes.CardContainer}`}>
                  <CounterCard
                    counter={inventors.length}
                    title=""
                    label={<FormattedHTMLMessage id="Patents.Participants.inventor" />}
                    color="Persons"
                  />
                </div>
              ) : null
          }
          {
            inventors.map((inventor, index) => {
              if (index < nbInventorsToShow) {
                return (
                  <div className={`col-md-6 ${classes.CardContainer}`}>
                    <PersonCard
                      data={inventor}
                      showTitle={false}
                      className={classes.BGLightGrey}
                    />
                  </div>
                );
              }
              return null;
            })
          }
          {
            (inventors.length > nbInventorsToShow + 1)
              ? (
                <div className={`col-md-6 ${classes.CardContainer}`}>
                  <CounterListCard
                    language={props.language}
                    data={inventors}
                    objectType="author"
                    limit={nbInventorsToShow}
                    roleKey="inventor"
                    labelKey="other-inventors"
                    modalTitleKey="inventors-modal-title"
                    color="MiddleGrey"
                    isPerson
                  />
                </div>
              ) : (
                <div className={`col-md-6 ${classes.CardContainer}`}>
                  <PersonCard
                    data={inventors[inventors.length - 1]}
                    showTitle={false}
                    className={classes.BGLightGrey}
                  />
                </div>
              )
          }
        </div>

      </div>
      <div className="col-md-6">
        <div className="row">
          <div className={`col ${classes.NoSpace}`}>
            <CardsTitle title={<FormattedHTMLMessage id="Patents.Participants.applicant" />} />
          </div>
        </div>
        <div className="row">
          {
            (deposants.length > 1)
              ? (
                <div className={`col-md-6 ${classes.CardContainer}`}>
                  <CounterCard
                    counter={deposants.length}
                    title=""
                    label={<FormattedHTMLMessage id="Patents.Participants.applicant" />}
                    color="ScanRBlue"
                  />
                </div>
              ) : null
          }
          {
            deposants.map((deposant, index) => {
              if (index < nbInventorsToShow) {
                if (deposant.typeParticipant === 'pp') {
                  return (
                    <div className={`col-md-6 ${classes.CardContainer}`}>
                      <PersonCard
                        data={deposant}
                        showTitle={false}
                        className={classes.BGLightGrey}
                      />
                    </div>
                  );
                }
                return (
                  <div className={`col-md-6 ${classes.CardContainer}`}>
                    <EntityCard
                      data={deposant}
                      showTitle={false}
                      className={classes.BGLightGrey}
                      language={props.language}
                    />
                  </div>
                );
              }
              return null;
            })
          }
          {
            (deposants.length > nbInventorsToShow)
              ? (
                <div className={`col-md-6 ${classes.CardContainer}`}>
                  <CounterListCard
                    language={props.language}
                    data={deposants}
                    objectType="author"
                    limit={nbInventorsToShow}
                    roleKey="applicant"
                    labelKey="other-applicants"
                    modalTitleKey="applicants-modal-title"
                    color="MiddleGrey"
                    isEntity
                  />
                </div>
              ) : null
          }
        </div>
      </div>
    </div>
  );
};

export default PatentParticipants;

PatentParticipants.propTypes = {
  language: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  affiliations: PropTypes.array,
};
