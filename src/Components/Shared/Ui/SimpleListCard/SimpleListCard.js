import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

import ButtonWithModal from '../Buttons/ButtonWithModal';

import classes from './SimpleListCard.scss';

/**
 * SimpleListCard component
 * Url : .
 * Description : Carte avec logo, titre, label, tooltip et bouton qui ouvre une modale affichant une liste d'items
 * Responsive : .
 * Accessible : .
 * Tests unitaires : .
*/
const logoFunction = logo => (
  (logo) ? <div className={classes.Logo}><i className={logo} aria-hidden="true" /></div> : null
);

const titleFunction = title => (
  (title) ? <h3 className={classes.Title}>{title}</h3> : null
);

const labelFunction = label => (
  (label) ? <p className={classes.Label}>{label}</p> : null
);

const multipleLabelsFunction = labels => (
  labels.map(label => (labelFunction(label)))
);

const additionalListFunction = (allProps) => {
  const items = allProps.list.map(item => (
    <li key={item.type} className="list-group-item">
      <div className="row">
        <div className="col">
          <span className={classes.Key}>{item.type}</span>
        </div>
        <div className="col-8">
          <span className={classes.Value}>{item.id}</span>
        </div>
      </div>
    </li>
  ));
  const itemsHtml = <ul className="list-group list-group-flush">{items}</ul>;
  return (
    <ButtonWithModal
      logo={allProps.logo}
      title={allProps.title}
      buttonLabel={allProps.labelListButton}
      dataHtml={itemsHtml}
    />
  );
};

const SimpleListCard = (props) => {
  const tooltip = (props.tooltip) ? (
    <Fragment>
      <span className={classes.Tooltip_i_top_right} data-tip={props.tooltip}>i</span>
      <ReactTooltip html />
    </Fragment>
  ) : null;

  return (
    <div className={classes.SimpleListCard}>
      {logoFunction(props.logo)}
      {titleFunction(props.title)}
      {(props.label) ? labelFunction(props.label) : null }
      {(props.multipleLabels) ? multipleLabelsFunction(props.multipleLabels) : null}
      {tooltip}

      {additionalListFunction(props)}
    </div>
  );
};


export default SimpleListCard;

SimpleListCard.propTypes = {
  label: PropTypes.string,
  multipleLabels: PropTypes.array,
  logo: PropTypes.string,
  title: PropTypes.string,
  tooltip: PropTypes.string,
};
