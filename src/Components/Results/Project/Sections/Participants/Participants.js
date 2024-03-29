import React from 'react';
import PropTypes from 'prop-types';

import EmptySection from '../../../Shared/EmptySection/EmptySection';
import ParticipantRow from '../../Components/ParticipantRow';
import LeafletMap from '../../../../Shared/GraphComponents/Graphs/LeafletMap';
import getSelectKey from '../../../../../Utils/getSelectKey';

import classes from './Participants.scss';
import styles from '../../../../../style.scss';

/**
 * Participants
 * Url : .
 * Description : .
 * Responsive : .
 * Accessible : .
 * Tests unitaires : .
 */
const Participants = (props) => {
  if (!props.data) return <EmptySection />;
  const mapdata = [];

  for (let i = 0, len = props.data.length; i < len; i += 1) {
    const currentData = props.data[i];

    if (currentData.structure) {
      const dataElement = {
        id: currentData.structure.id,
        position: [currentData.structure.address[0].gps.lat, currentData.structure.address[0].gps.lon],
        infos: [getSelectKey(currentData.structure, 'label', props.language, 'default')],
      };

      mapdata.push(dataElement);
    }
  }

  const mapStyle = {
    height: '60vh',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    borderBottom: `5px solid ${styles.entityColor}`,
  };

  // Recherche et stockage des sous-participants
  const dataForRows = [];
  props.data.forEach((part) => {
    if (props.type.toUpperCase() === 'H2020') {
      const idPart = part.label.default.split('__')[2].slice(0, -2);
      // Dernier caractère : Si != 0 alors il s'agit d'un sous participant
      if (part.label.default.slice(-1) === '0') {
        // Recherche d'éventuels sous-participants
        const subs = props.data.filter((partSub) => {
          // Id
          const idPartSub = partSub.label.default.split('__')[2].slice(0, -2);
          return (idPartSub === idPart && partSub.label.default.slice(-1) !== '0');
        });
        const obj = {
          ...part, subParticipants: subs || null,
        };
        dataForRows.push(obj);
      }
    } else {
      dataForRows.push(part);
    }
  });
  return (
    <div className="row">
      <div className="px-3 col-12 col-lg-5">
        <div className={`${classes.participantList}`}>
          {dataForRows.map(part => (
            <div
              key={getSelectKey(part, 'label', props.language, 'default')}
              className={`col-12 py-3 px-3 ${classes.participantItem}`}
              role="button"
            >
              <ParticipantRow
                language={props.language}
                data={part}
                size="small"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="col-hidden col-lg-7 p-0">
        <div className={`w-100 ${classes.MapContainer}`}>
          {!!mapdata.length && (
          <LeafletMap
            zoom={2}
            filename="carto"
            data={mapdata}
            language={props.language}
            style={mapStyle}
          />
          )}
        </div>
      </div>
    </div>
  );
};

export default Participants;

Participants.propTypes = {
  language: PropTypes.string.isRequired, data: PropTypes.array, type: PropTypes.string.isRequired,
};
