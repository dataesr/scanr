import React, { Component } from 'react';
import Axios from 'axios';

class Entity extends Component {
  state = {
    id: "016650996",
    label: {
      fr: "CYCLES LAPIERRE"
    },
    acronym: {},
    nature: "ETI",
    status: "active",
    isFrench: true,
    address: [
      {
        address: null,
        postcode: "21000",
        city: "Dijon",
        citycode: "21231",
        country: "France",
        provider: "adresse.data.gouv.fr",
        score: "0.9368909090909091",
        gps: {
          lat: 47.298541,
          lon: 5.024696,
          geohash: "u07t466vgzhg",
          fragment: true
        },
        urbanUnitCode: "UU21701",
        urbanUnitLabel: "Dijon",
        localisationSuggestions: null,
        main: true
      }
    ],
    alias: [
      "CYCLES LAPIERRE",
      "Q1163852",
    ],
    legalCategory: {
      code: "5720",
      label: "thisIsACategorieJuridique"
    },
    creationYear: 1966,
    links: [
      {
        id: "cycles-lapierre.fr",
        type: "main",
        url: "https://www.cycles-lapierre.fr/",
        label: null,
        mode: null,
      }
    ],
  institutions: [],
  activities: [
    {
      code: "LS7",
      type: null,
      label: {
        en: "Applied Medical Technologies, Diagnostics, Therapies and Public Health",
        fr: "Diagnostics, thérapies, technologie médicale appliquée et santé publique"
      },
      secondary: null
    }
  ],
  badges: [],
  startDate: -126230400000,
  socialMedias: [],
  externalIds: {},
  focus: [],
  keywords: {},
  lastUpdated: 1554305014928,
  children: [],
  spinoffFrom: [],
  websites: [],
  projects: [],
  publications: [],
  graph: [],
};

  componentWillMount() {
    const url = 'https://scanr-preprod.sword-group.com/api/v2/structures/016650996';
    Axios.get(url);
  }

  render() {
    return (
      <div>Entity page</div>
    );
  }
}

export default Entity;
