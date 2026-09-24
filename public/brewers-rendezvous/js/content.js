export const stops = [
  {
    id: 'arrival', type: 'story', eyebrow: '01 / Riverside Park', title: 'Under the cottonwoods',
    kicker: 'Salida, Colorado · July 11, 2026',
    body: 'The Arkansas River slips past a whole park of giant cottonwoods. Beneath them: tent roofs, tasting glasses, music, and the happy chaos of the 30th Brewers Rendezvous. This is my remembered route through one very good afternoon.',
    note: 'A personal recap, arranged as a little walk. The park layout is an impression.',
    x: -19, z: 6, color: '#729a69'
  },
  {
    id: 'liquid', type: 'beer', eyebrow: '02 / A standout pour', title: 'Liquid Mechanics',
    beer: 'Lucid AF', style: 'West Coast IPA', verdict: '“10 out of 10.” My favorite pour of the day.',
    body: 'The voice memo got the brewery name a little wrong, but not the enthusiasm. Lucid AF was the pour that stayed at the top of my list. Liquid Mechanics makes hoppy beers, dark beers, and German-inspired ales and lagers in Lafayette.',
    note: 'My favorite of the day · 10/10.',
    url: 'https://www.liquidmechanicsbrewing.com/ridiculus-lorem', linkLabel: 'Liquid Mechanics source',
    x: -12, z: 0.8, color: '#d79542', beerColor: '#d4932f'
  },
  {
    id: 'seedstock', type: 'beer', eyebrow: '03 / A crisp turn', title: 'Seedstock',
    beer: 'West Coast Pilsner', style: 'Pilsner', verdict: '“Really, really like it.”',
    body: 'After all those hop-forward pours, this one landed bright and clean. Seedstock’s current West Coast Pilsner pairs a gentle bitterness with a fruity aroma. My notes singled it out as a beer to find again.',
    note: 'My notes gave it 9.5/10. The current tap-list description may differ from the festival pour.',
    url: 'https://seedstockbrewery.com/on-tap', linkLabel: 'Seedstock tap list',
    x: -2.5, z: 0.8, color: '#88a8a0', beerColor: '#e4b34d'
  },
  {
    id: 'fournoses', type: 'beer', eyebrow: '04 / One more favorite', title: 'Four Noses',
    beer: 'The sweeter IPA', style: 'IPA', verdict: '“Excellent! Love it.” A little sweeter, in the best way.',
    body: 'This pour earned its own excited line in the recorder and joined the short list of beers I hoped to revisit. 4 Noses brews from its Colorado locations in Broomfield and Denver.',
    note: 'My notes called it “Cryo About Damn Time” and gave it 9.5/10. The exact release name still needs confirmation.',
    url: 'https://www.4nosesbrewing.com/', linkLabel: '4 Noses brewery',
    x: 7, z: 0.8, color: '#c77c62', beerColor: '#c87d33'
  },
  {
    id: 'ramblebine', type: 'beer', eyebrow: '05 / Across the trail', title: 'Ramblebine',
    beer: 'West Coast IPA', style: 'West Coast IPA · from my notes', verdict: '“Really delicious.” A 9.5/10 discovery.',
    body: 'This one landed near the very top of my recap: a West Coast IPA, a delighted “really delicious,” and 9.5 out of 10. Ramblebine also made my list of beers to look for again. The brewery is based in Grand Junction.',
    note: 'My notes identify the brewery and style, but not the release name. The current tap list cannot confirm which festival beer I tried.',
    url: 'https://ramblebinebrewing.com/', linkLabel: 'Ramblebine brewery',
    x: -12, z: 9, facing: Math.PI, host: 'fox', color: '#927e9e', beerColor: '#dcaa46'
  },
  {
    id: 'joyride', type: 'beer', eyebrow: '06 / A floral turn', title: 'Joyride',
    beer: 'West Coast IPA', style: 'West Coast IPA · from my notes', verdict: '“Pretty dang good, almost floral.”',
    body: 'Among all the hop-forward pours, this one left a particular word in the recording: floral. My recap gave Joyride’s West Coast IPA a 9 out of 10. Joyride is an Edgewater brewery, across from Sloan’s Lake.',
    note: 'The tasting reaction and 9/10 rating are from my recap. The exact festival release name remains unconfirmed.',
    url: 'https://www.joyridebrewing.com/', linkLabel: 'Joyride brewery',
    x: -2.5, z: 9, facing: Math.PI, host: 'rabbit', color: '#6c9fb2', beerColor: '#dca047'
  },
  {
    id: 'breckenridge', type: 'beer', eyebrow: '07 / A lager detour', title: 'Breckenridge',
    beer: 'New Zealand pilsner', style: 'Pilsner · remembered from my recap', verdict: '“Super delish.” Another 9/10.',
    body: 'My recap made room for another lager highlight: a New Zealand pilsner from Breckenridge, marked “super delish” and scored 9 out of 10. A welcome change of direction in an afternoon full of IPAs.',
    note: 'This brewery/style pairing comes from the rough recap. The exact festival release and style are not independently confirmed; no current beer has been substituted.',
    url: 'https://www.breckbrew.com/', linkLabel: 'Breckenridge brewery',
    x: 7, z: 9, facing: Math.PI, host: 'bear', color: '#c3a256', beerColor: '#e7c768'
  },
  {
    id: 'community', type: 'story', eyebrow: '08 / Between the pours', title: 'More than beer',
    kicker: 'Water, music, and shade',
    body: 'Firefighters kept cold water flowing. A cover band sent Stones and Beatles songs over the lawn. Tebo tribute stickers appeared everywhere. Between tents, the big cottonwoods held the whole scene together.',
    note: 'These are details from my voice recap, remembered through a noisy recording.',
    x: 13.5, z: 1.7, color: '#77a7a1'
  },
  {
    id: 'departure', type: 'story', eyebrow: '09 / The river keeps moving', title: 'On the way out',
    kicker: 'A very Salida exit',
    body: 'The crowd eased out toward Sackett Avenue as kids rolled by on bikes with river tubes and surfboards. I left with a handful of new favorites, the last of the music in my ears, and the river still going.',
    note: 'Afterward: a stop at Benson’s Tavern. The tasting trail ends here, but the afternoon lingers.',
    x: 19, z: 13.5, color: '#78957e'
  }
];

export const breweryStops = stops.filter((stop) => stop.type === 'beer');
