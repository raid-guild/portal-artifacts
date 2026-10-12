// Counter-rotating transfer deck: openings feed the lower deck, never award a score.
export const UPPER_DECK_Y=.55;
export const TRANSFER_GATES=[
  {x:0,z:0,r:.62},
  ...Array.from({length:8},(_,i)=>({x:Math.cos(i*Math.PI/4)*1.94,z:Math.sin(i*Math.PI/4)*1.94,r:.54})),
];
