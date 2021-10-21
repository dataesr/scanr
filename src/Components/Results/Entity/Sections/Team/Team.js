import React from 'react';
import PropTypes from 'prop-types';

import EmptySection from '../../../Shared/EmptySection/EmptySection';
import Leaders from '../../Shared/Leaders/Leaders';
import TeamComposition from './SubComponents/teamComposition';
/**
 * Team
 * Url : .
 * Description : .
 * Responsive : .
 * Accessible : .
 * Tests unitaires : .
*/
const Team = (props) => {
  const hideTeam = (props.childs && props.childs.length > 0 && props.data && props.data.level !== 'Unité de recherche');
  const hideLeaders = (!props.data.leaders || props.data.leaders.length === 0);
  if (hideTeam && hideLeaders) {
    return <EmptySection language={props.language} color="#fff" />;
  }
  return (
    <div className="row">
      { hideLeaders ? null
        : (
          <Leaders
            id={props.data.id}
            language={props.language}
            leaders={props.data.leaders}
          />
        )}
      { hideTeam ? null
        : (
          <TeamComposition
            id={props.data.id}
            language={props.language}
            persons={props.data.persons}
          />
        )}
    </div>
  );
};

export default Team;

Team.propTypes = {
  language: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
  childs: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
