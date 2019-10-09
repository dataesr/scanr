import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider, FormattedHTMLMessage } from 'react-intl';

import SectionTitle from '../../../../Shared/Results/SectionTitle/SectionTitle';
import SimpleCard2 from '../../../../Shared/Ui/SimpleCard/SimpleCard2';

import BudgetCard from '../../Components/Budget';
import classes from './Financial.scss';

import messagesFr from '../../translations/fr.json';
import messagesEn from '../../translations/en.json';

const messages = {
  fr: messagesFr,
  en: messagesEn,
};
/**
 * Financial
 * Url : .
 * Informations : .
 * Responsive : .
 * Accessible : .
 * Tests unitaires : .
*/

const Financial = (props) => {
  if (props.data.budgetTotal || props.data.budgetFinanced) {
    return (
      <section className={`container-fluid ${classes.Financial}`}>
        <IntlProvider locale={props.language} messages={messages[props.language]}>
          <div className="container">
            <SectionTitle
              icon="fas fa-id-card"
              modifyModeHandle={props.modifyModeHandleAuthors}
              modifyMode={props.modifyModeAuthors}
            >
              <FormattedHTMLMessage id="Project.financial.title" defaultMessage="Project.financial.title" />
            </SectionTitle>
            <div className="row">
              <div className={`d-flex flex-wrap align-self-start ${classes.noSpace100}`}>
                {
                  (props.data.budgetTotal)
                    ? (
                      <div className={classes.noSpace25}>
                        <SimpleCard2
                          language={props.language}
                          logo="fas fa-euro-sign"
                          title={messages[props.language]['Project.financial.total']}
                          label={props.data.budgetTotal}
                          tooltip=""
                          masterKey="Project/title"
                          modifyMode={props.modifyModeAuthors}
                          allData={props.data}
                          bgColor="#e9ecf1"
                        />
                      </div>
                    )
                    : null
                }
                {
                  (props.data.budgetFinanced)
                    ? (
                      <div className={classes.noSpace25}>
                        <SimpleCard2
                          language={props.language}
                          logo="fas fa-euro-sign"
                          title={messages[props.language]['Project.financial.financed']}
                          label={props.data.budgetFinanced}
                          tooltip=""
                          masterKey="Project/title"
                          modifyMode={props.modifyModeAuthors}
                          allData={props.data}
                          bgColor="#e9ecf1"
                        />
                      </div>
                    )
                    : null
                }
                {
                  (props.data.budgetTotal && props.data.budgetFinanced)
                    ? (
                      <div className={classes.noSpace25}>
                        <BudgetCard
                          language={props.language}
                          title={messages[props.language]['Project.financial.money']}
                          tooltip=""
                          logo="fas fa-money-check-alt"
                          financed={props.data.budgetFinanced}
                          total={props.data.budgetTotal}
                          masterKey="Project/money"
                          modifyMode={props.modifyModeAuthors}
                          allData={props.data}
                        />
                      </div>
                    )
                    : null
                }
              </div>
            </div>
          </div>
        </IntlProvider>
      </section>
    );
  }
  return (
    <section className={`container-fluid ${classes.Financial}`}>
      <IntlProvider locale={props.language} messages={messages[props.language]}>
        <div className="container">
          <SectionTitle
            icon="fas fa-id-card"
            modifyModeHandle={props.modifyModeHandleAuthors}
            modifyMode={props.modifyModeAuthors}
          >
            <FormattedHTMLMessage id="Project.financial.title" defaultMessage="Project.financial.title" />
          </SectionTitle>
          <div className="row">
            <div className={`d-flex pl-4 pr-4 ${classes.noDataOnSection}`}>
              <FormattedHTMLMessage id="Project.financial.noFinancial" defaultMessage="Project.financial.noFinancial" />
            </div>
          </div>
        </div>
      </IntlProvider>
    </section>
  );
};

export default Financial;

Financial.propTypes = {
  language: PropTypes.string.isRequired,
  data: PropTypes.string,
  modifyModeHandleAuthors: PropTypes.func.isRequired,
  modifyModeAuthors: PropTypes.func.isRequired,
};
