// Fictional park hosts; historical replies are paraphrased from the linked sources.
export const neighbors = [
  {
    "id": "mabel",
    "name": "Mabel",
    "animal": "bear",
    "kind": "chat",
    "x": -20,
    "z": 1.5,
    "facing": 0.25,
    "meet": {
      "x": -19,
      "z": 3
    },
    "intro": "A shady spot and a little local history? Pull up a patch of grass.",
    "topics": [
      {
        "id": "railroad",
        "question": "How did Salida get started?",
        "text": "The railroad helped shape the town we know today. The Denver & Rio Grande established Salida in 1880 as a division point, and the town became a supply hub for nearby mining and farming communities.",
        "sourceLabel": "City of Salida · Historic Survey",
        "sourceUrl": "https://www.cityofsalida.com/commdev/page/salida-historic-survey-plan-questionnaire"
      },
      {
        "id": "downtown",
        "question": "Why all the brick downtown?",
        "text": "Downtown suffered major fires in 1886 and 1888. Salida rebuilt with a substantial commercial district, much of it made up of two-story brick buildings. Those streets still carry the shape of a busy railroad town.",
        "sourceLabel": "City of Salida · Downtown Plan, p. 11",
        "sourceUrl": "https://www.cityofsalida.com/media/15106"
      },
      {
        "id": "arts",
        "question": "From trains to a festival park?",
        "text": "Railroad activity declined in the mid-twentieth century. Tourism, outdoor recreation and the arts grew in importance. This little park story is one personal glimpse of the community that followed.",
        "sourceLabel": "City of Salida · Downtown Plan, p. 11",
        "sourceUrl": "https://www.cityofsalida.com/media/15106"
      }
    ]
  },
  {
    "id": "juniper",
    "name": "Juniper",
    "animal": "rabbit",
    "kind": "chat",
    "x": -4.5,
    "z": -5.8,
    "facing": 0.6,
    "meet": {
      "x": -4.5,
      "z": -4.5
    },
    "intro": "Hear that river? There is a whole mountain journey upstream of this shady bank.",
    "topics": [
      {
        "id": "headwaters",
        "question": "Where does this river begin?",
        "text": "The Arkansas River has its headwaters near Leadville, Colorado. By the time it reaches Salida, it has already traveled down the Upper Arkansas Valley, past Buena Vista and through Browns Canyon.",
        "sourceLabel": "USGS · Arkansas headwaters",
        "sourceUrl": "https://www.usgs.gov/centers/central-plains-water-science-center/historic-floods-along-arkansas-river",
        "sources": [
          {
            "label": "Colorado Parks & Wildlife · River sections",
            "url": "https://cpw.state.co.us/state-parks/arkansas-headwaters-recreation-area/arkansas-headwaters-recreation-area-river-sections"
          }
        ]
      },
      {
        "id": "canyon",
        "question": "What is around the next bend?",
        "text": "Downstream of Salida, the river enters Bighorn Sheep Canyon. Colorado Parks & Wildlife describes granite walls, deep pools and rocky banks, with pinyon pine, juniper and oak brush along the canyon.",
        "sourceLabel": "Colorado Parks & Wildlife · River sections",
        "sourceUrl": "https://cpw.state.co.us/state-parks/arkansas-headwaters-recreation-area/arkansas-headwaters-recreation-area-river-sections"
      },
      {
        "id": "boulders",
        "question": "Why all the big river rocks?",
        "text": "Farther upstream, below Leadville, ancient glacial dams broke and scattered large boulders across the river bottom. The upper river changes character along the way: quiet stretches, narrow canyons and whitewater.",
        "sourceLabel": "Colorado Parks & Wildlife · Upper Arkansas Valley",
        "sourceUrl": "https://cpw.state.co.us/sites/default/files/dam/iv4cywcl7k/ahra-state-park-brochure.pdf"
      }
    ]
  },
  {
    "id": "hops",
    "name": "Hops",
    "animal": "fox",
    "kind": "chat",
    "x": 17.5,
    "z": 8,
    "facing": 3.14,
    "meet": {
      "x": 17.5,
      "z": 6.5
    },
    "intro": "A whole park full of brewers, neighbors and good stories. Want the short version of how this gathering began?",
    "topics": [
      {
        "id": "origins",
        "question": "How did Rendezvous begin?",
        "text": "The Colorado Brewers Guild needed a place for its annual membership meeting. Many brewers were already attending the Salida Beer Festival in 1995, so Salida became their impromptu meeting place. The Rendezvous grew from that camaraderie.",
        "sourceLabel": "Colorado Brewers Guild · Event history",
        "sourceUrl": "https://coloradobeer.org/colorado-brewers-rendezvous/"
      },
      {
        "id": "anniversary",
        "question": "What made 2026 special?",
        "text": "The July 11, 2026 gathering celebrated the 30th Colorado Brewers Rendezvous here in Riverside Park. The Guild listed more than 60 Colorado craft breweries. Our six booths are just a little remembered route through a much bigger afternoon.",
        "sourceLabel": "Colorado Brewers Guild · 2026 Rendezvous",
        "sourceUrl": "https://coloradobeer.org/colorado-brewers-rendezvous/"
      }
    ]
  },
  {
    "id": "keys",
    "name": "Keys & the Cottonwoods",
    "animal": "fox",
    "kind": "music",
    "x": 16.7,
    "z": -4.7,
    "facing": 0.4,
    "meet": {
      "x": 17.2,
      "z": -1.8
    },
    "intro": "Got room for a little synth interlude? This is an original tune made for the miniature park.",
    "topics": []
  }
];

export const stageTrack = {
  "title": "Beer Crossing",
  "src": "./assets/audio/beer-crossing.mp3",
  "credit": "An original synth track by the narrator."
};
