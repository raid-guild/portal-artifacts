import { kingdom } from './kingdom.mjs';

export const guide = {
  title: 'RaidGuild Field Guide',
  subtitle: 'A cartographer’s guide to joining the Guild',
  canonical: 'https://portal-artifacts-production.up.railway.app/raidguild-field-guide/',
  handbook: 'https://handbook.raidguild.org',
  image: 'joining-map-concept-v1.png',
  imageAlt: 'Illustrated seven-stop path through a fantasy Guild landscape, from finding the Guild to participating as a member. A dotted side trail marks paid-work onboarding.',
  categories: [
    { name: 'Journey maps', description: 'Follow the paths people and ideas take through the Guild.', entries: ['Joining the Guild', 'Raid lifecycle · in the chart room', 'Developing a RIP · in the chart room'] },
    { name: 'Machine diagrams', description: 'Explore the machinery of collaboration through illustrated metaphors.', entries: ['Raid airship cutaway · in the workshop', 'Desert walker · in the workshop'] },
    { name: 'Character field notes', description: 'Meet the roles and practices that keep a party moving.', entries: ['Guild classes and stewards · in the sketchbook'] },
  ],
  stages: [
    { id: 1, title: 'Find the Guild', x: 24.5, y: 22.5, lead: 'Create a Portal profile and join Discord.', detail: 'Portal holds profiles, sessions, posts, and cohort interest. Discord is the live community space. You can start with either door.', linkLabel: 'Open Portal', link: 'https://portal.raidguild.org/', extraLinks: [{ label: 'Join Discord', url: 'https://discord.gg/rGFpfQf' }] },
    { id: 2, title: 'Join a cohort', x: 53, y: 35, lead: 'Signal interest, meet builders, and complete the cohort.', detail: 'Current cohort dates and signup details appear in Portal. The cohort combines onboarding, workshops, and a Demo Day.', linkLabel: 'Read the cohort guide', link: 'https://handbook.raidguild.org/docs/membership/become-an-apprentice' },
    { id: 3, title: 'Demo and graduate', x: 50, y: 47, lead: 'Share your work at Demo Day.', detail: 'An accepted demo moves you into the cohort graduate or apprentice stage. Graduation is its own approval; it is distinct from full DAO membership.', linkLabel: 'Read the joining guide', link: 'https://handbook.raidguild.org/docs/membership/join-the-guild' },
    { id: 4, title: 'Contribute', x: 29, y: 52, lead: 'Build trust through Raids, RIPs, and Guild life.', detail: 'Join work and discussions, practice the Code of Conduct, and make your collaboration visible. Opportunities are shaped by participation; paid work is not guaranteed.', linkLabel: 'Explore RIPs', link: 'https://handbook.raidguild.org/docs/dao-operations/rips' },
    { id: 5, title: 'Find a Champion', x: 38, y: 67, lead: 'Ask a current member other than your cohort host to Champion you.', detail: 'At Raider Roundtable, the Champion explains your working relationship and why you are ready, then helps sponsor a membership proposal. This is separate from the cohort graduation decision.', linkLabel: 'Read the membership path', link: 'https://handbook.raidguild.org/docs/membership/become-a-member' },
    { id: 6, title: 'Membership proposal', x: 34, y: 75.5, lead: 'Submit and complete the onchain proposal.', detail: 'The proposal follows the Guild’s current governance process. Confirm live proposal requirements and DAO settings in the handbook and DAO tools before acting.', linkLabel: 'Read the membership path', link: 'https://handbook.raidguild.org/docs/membership/become-a-member' },
    { id: 7, title: 'Make it your Guild', x: 49, y: 90, lead: 'Participate in governance and activate member benefits.', detail: 'Full membership brings a voice in Guild decisions and access to shared resources. Availability and use of each resource follow its own current process.', linkLabel: 'Explore member benefits', link: 'https://handbook.raidguild.org/docs/membership/member-benefits' },
  ],
  paidWork: { title: 'Before receiving paid Raid work', lead: 'Complete RaidGuild LLC registration and light KYC.', detail: 'This is a separate requirement for compensation. It is not a gate to full DAO membership.', linkLabel: 'Read Getting Paid', link: 'https://handbook.raidguild.org/docs/raids/getting-paid' },
  sources: [
    { label: 'Join the Guild · handbook', url: 'https://handbook.raidguild.org/docs/membership/join-the-guild' },
    { label: 'Become an Apprentice · handbook', url: 'https://handbook.raidguild.org/docs/membership/become-an-apprentice' },
    { label: 'Become a Member · handbook', url: 'https://handbook.raidguild.org/docs/membership/become-a-member' },
    { label: 'Getting Paid · handbook', url: 'https://handbook.raidguild.org/docs/raids/getting-paid' },
  ],
};

export const entries = [
  {
    id: 'joining', shelf: 'Journey maps', title: 'Your path into the Guild', eyebrow: 'JOURNEY MAP / 01',
    intro: 'Seven stops from first contact to active membership. Choose a numbered marker, or read the complete route in text.',
    image: guide.image, imageWidth: 1024, imageHeight: 1536, imageAlt: guide.imageAlt,
    mapHash: 'map', textHash: 'text', sourcesHash: 'sources',
    textTitle: 'Read every waypoint', textIntro: 'This text carries the stage notes independently of the illustration. Cohort graduation and membership approval are separate steps.',
    sourceIntro: 'This map is a creative guide to the membership journey. The handbook is the source for current details. The illustration is a concept with baked captions; the stage notes are editable separately.',
    sourceNote: 'The machinery and landscape language elsewhere in the Field Guide is metaphor. It does not define Guild policy, rights, or compensation.',
    items: guide.stages.map((stage) => ({ ...stage, kind: 'stage', hash: `stage-${stage.id}` })),
    paidWork: guide.paidWork,
    sources: guide.sources,
  },
  kingdom,
];
