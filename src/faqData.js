// Stayful Sales Assistant — FAQ data
// Pre-loaded reference data. No backend, no API calls during use.
//
// Sources:
//  - Stayful Web Meeting Presenter Script (CONFIDENTIAL — INTERNAL USE ONLY)
//  - Stayful Lead Intelligence System (Objection + Conversion Intelligence,
//    W21–W25) — used to set tiers, add verbatim keywords, and add the
//    high-frequency objections that had no card (remote management, 72-hour
//    access, listing ranking, pricing control, net "what you keep", early-weeks
//    ramp-up, theft).
//
// tier:     1 = every meeting, 2 = most meetings, 3 = common, 4 = situational
// category: Revenue | Fees | Service | Contract | Setup | Legal & Tax | Situations
// profiles: lead profile types this answer is especially relevant to
// headline: glanceable one-line gist shown big while you keep talking
// answer:   full detail underneath
// keywords: natural phrasings a LEAD actually uses (incl. verbatim from
//           Objection Intelligence) — used to match live speech
// slide:    exact voice command to navigate the presentation, or null

export const TIERS = {
  1: { label: 'Tier 1 · Every meeting', short: 'Tier 1', color: 'rgb(93,129,86)' },
  2: { label: 'Tier 2 · Most meetings', short: 'Tier 2', color: '#d99a2b' },
  3: { label: 'Tier 3 · Common', short: 'Tier 3', color: '#5a7a9a' },
  4: { label: 'Tier 4 · Situational', short: 'Tier 4', color: '#6b7280' },
};

export const CATEGORIES = [
  'All',
  'Revenue',
  'Fees',
  'Service',
  'Contract',
  'Setup',
  'Legal & Tax',
  'Situations',
];

// Lead profile types (from the Lead Intelligence System).
export const PROFILES = ['Buy-to-STL', 'STL Switch', 'Abroad', 'Ex-STL'];
const ALL_PROFILES = [...PROFILES];

export const FAQS = [
  {
    id: 1,
    tier: 1,
    category: 'Revenue',
    profiles: ALL_PROFILES,
    question: 'How much will I actually make?',
    headline: 'Two figures — gross and net. The net is what matters.',
    answer:
      'We give you two figures — the gross, which is everything that comes in from guests, and the net, which is what actually lands in your bank after the platform fee, our management fee, the cleaning and the linen all come out. The net is the number that matters. Year one we project at 80% of the full run rate to be conservative while reviews build and pricing dials in; year two onwards is where properties typically settle.',
    keywords: [
      'how much will i make', 'how much can i earn', 'how much money',
      'what will i make', 'what do i get', 'income', 'earnings', 'profit',
      'return', 'take home', 'how much will it make', 'what can it make',
    ],
    slide: 'Investment Returns',
  },
  {
    id: 2,
    tier: 1,
    category: 'Service',
    profiles: ALL_PROFILES,
    question: 'What do you actually do — is it fully hands-off?',
    headline: 'Fully hands-off — we run everything except your bills.',
    answer:
      'We run the entire operation for you: guest communication, booking management, check-ins and check-outs, cleaning and linen changeovers after every stay, maintenance coordination and dynamic pricing. You genuinely don’t need to do anything operationally. The only things you stay responsible for are the bills — utilities, broadband, council tax and your mortgage.',
    keywords: [
      'what do you do', 'how does it work', 'hands off', 'hands-off',
      'do i have to do anything', 'whats involved for me', 'full service',
      'do you manage everything', 'is it managed', 'whats my involvement',
      'how much work is it for me',
    ],
    slide: 'How Stayful Works',
  },
  {
    id: 3,
    tier: 2,
    category: 'Revenue',
    profiles: ALL_PROFILES,
    question: 'Why is Year 1 lower than Year 2?',
    headline: 'Year 1 = 80% while reviews build and pricing dials in.',
    answer:
      'Year one we always project at 80% of the full run rate. That’s because you’re building reviews, getting your pricing dialled in, and the listing is finding its audience. So year one is the deliberately conservative number. Year two onwards is where properties typically settle into their full run rate.',
    keywords: [
      'year one', 'first year', 'why is year one lower', 'ramp up', 'ramp-up',
      'lower at the start', 'why less in the first year', 'build up',
      'why is the first year less', 'year two',
    ],
    slide: 'Investment Returns',
  },
  {
    id: 4,
    tier: 2,
    category: 'Revenue',
    profiles: ALL_PROFILES,
    question: 'Those numbers seem high — I’ve seen lower estimates elsewhere.',
    headline: 'Live postcode data — and Year 1 is already discounted 20%.',
    answer:
      'These are based on live market data from your specific postcode — the competing properties, current nightly rates and occupancy. I’d rather show you the real picture than an inflated number to win your business, and Year 1 is already discounted 20% for ramp-up. We also have a live Manchester property that did £56,900 last year against a £62k projection — so we track close to our numbers and we’re honest about the ramp-up.',
    keywords: [
      'numbers seem high', 'too good to be true', 'sounds optimistic',
      'seen lower', 'lower estimates elsewhere', 'are these realistic',
      'inflated', 'that seems high', 'is that realistic', 'overestimating',
    ],
    slide: 'Investment Returns',
  },
  {
    id: 5,
    tier: 1,
    category: 'Service',
    profiles: ALL_PROFILES,
    question: 'Who handles cleaning and changeovers?',
    headline: 'We handle every clean and linen change — guest-funded.',
    answer:
      'We do — cleaning and linen changeovers after every single stay are part of the service. The cleaning cost is actually charged to the guest as a cleaning fee, so it’s largely self-funding and doesn’t eat into your net. You never have to arrange or chase a clean.',
    keywords: [
      'cleaning', 'who cleans', 'changeover', 'change over', 'linen',
      'laundry', 'turnaround', 'clean between guests', 'housekeeping',
      'who does the cleaning',
    ],
    slide: 'Management',
  },
  {
    id: 6,
    tier: 2,
    category: 'Service',
    profiles: ALL_PROFILES,
    question: 'What about maintenance and repairs?',
    headline: 'We coordinate repairs — up to £300 without calling you.',
    answer:
      'We coordinate all maintenance for you. We can authorise repairs up to £300 without needing to call you so small issues get fixed fast; anything above that and we come to you first. We photograph the property before and after every stay, so if there’s damage we pursue recovery through AirCover or the guest’s security deposit and manage the whole claim.',
    keywords: [
      'maintenance', 'repairs', 'who fixes', 'something breaks', 'broken',
      'fix things', 'handyman', 'if something breaks', 'repair', 'plumber',
      'boiler', 'who deals with repairs',
    ],
    slide: 'Management',
  },
  {
    id: 7,
    tier: 1,
    category: 'Service',
    profiles: ALL_PROFILES,
    question: 'What about problem guests — how do you vet bookings?',
    headline: 'Every guest vetted — no parties, stag or hen bookings.',
    answer:
      'Every guest is vetted before we accept the booking — ID verification, profile history and message screening. We don’t accept stag dos, hen parties or party bookings. If a guest causes any issues during a stay, we handle it — you won’t be getting calls at midnight.',
    keywords: [
      'problem guests', 'bad guests', 'parties', 'party', 'vet guests',
      'vetting', 'screening', 'who do you let in', 'dodgy guests', 'stag',
      'hen', 'how do you check guests', 'troublesome guests',
      'right type of guests', 'getting the right type of guests',
      'wrong type of guests', 'how do you screen guests',
    ],
    slide: 'Vet Guests',
  },
  {
    id: 8,
    tier: 1,
    category: 'Revenue',
    profiles: ['Buy-to-STL', 'STL Switch'],
    question: 'How does short-let compare to a long let?',
    headline: 'Net beats a long let — even on conservative Year 1.',
    answer:
      'Let’s put the two side by side. With a traditional letting agent you’re typically looking at a 10–12% agency fee, plus void periods and maintenance you cover regardless. On the short-let side, even on our conservative Year 1 projection the net is materially higher per year, and by year two the uplift is larger again. The trade-off is it’s less predictable month to month — but the annual total, even at the conservative end, is clearly better.',
    keywords: [
      'long let', 'long term', 'long-term', 'versus', 'compared to renting',
      'traditional let', 'letting agent', 'vs long term', 'comparison',
      'normal rental', 'assured tenancy', 'instead of renting it out',
      'long term tenant',
    ],
    slide: 'Investment Returns',
  },
  {
    id: 9,
    tier: 2,
    category: 'Service',
    profiles: ALL_PROFILES,
    question: 'Which platforms do you list on?',
    headline: 'Airbnb, Booking.com + direct — daily dynamic pricing.',
    answer:
      'We list across Airbnb and Booking.com, and we’re building a direct booking channel as well. The dynamic pricing system adjusts your rate daily based on demand, local events and what competitors are doing — so you’re never leaving money on the table in peak periods and you stay competitive in the slower ones.',
    keywords: [
      'platforms', 'where do you list', 'airbnb', 'booking.com', 'booking com',
      'channels', 'which sites', 'listing sites', 'what sites', 'vrbo',
      'where will it be listed',
    ],
    slide: 'How Stayful Works',
  },
  {
    id: 10,
    tier: 2,
    category: 'Revenue',
    profiles: ['Buy-to-STL', 'STL Switch', 'Ex-STL'],
    question: 'Do you have real results I can look at?',
    headline: 'Real 2025 results — York, Manchester, Lincoln.',
    answer:
      'Yes — real Airbnb platform data from Jan–Dec 2025. A few from the portfolio: 17 Park Crescent, York — £54,688 gross / £34,727 net at 73.9% occupancy. 803 Eastbank Tower, Manchester — £56,921 / £35,917 at 68.7%. Museum Court, Lincoln — £57,328 / £36,288 at 64.2%. (Past performance of other properties doesn’t guarantee future results for yours.)',
    keywords: [
      'case studies', 'real results', 'examples', 'proof', 'evidence',
      'other properties', 'track record', 'do you have examples', 'results',
      'can you show me', 'real numbers', 'have you done this before',
      'comparable property', 'comparable results',
    ],
    slide: 'Your Experience',
  },
  {
    id: 11,
    tier: 3,
    category: 'Situations',
    profiles: ['STL Switch', 'Ex-STL'],
    question: 'I’m comparing you with another company (Pass the Keys / Hostmaker).',
    headline: '15% vs 20–22%, contractor network, Slack 24h response.',
    answer:
      'Completely fair — you should compare. The main differences worth checking: our management fee is 15% vs typically 20–22%+ elsewhere; how they handle maintenance — we have a nationwide contractor network where smaller operators often don’t; and how owner communication works — we use Slack with a 24-hour response time during office hours. Ask whoever you’re comparing with what their communication channel is and what response time they commit to.',
    keywords: [
      'other companies', 'competitors', 'pass the keys', 'hostmaker',
      'comparing', 'someone else', 'other agency', 'alternatives',
      'another company', 'shopping around', 'why you over',
    ],
    slide: null,
  },
  {
    id: 12,
    tier: 2,
    category: 'Legal & Tax',
    profiles: ['Buy-to-STL'],
    question: 'Do I need a special mortgage or insurance?',
    headline: 'Holiday-let mortgage or consent, plus short-let insurance.',
    answer:
      'You’ll need either a holiday let mortgage (if it’s a dedicated investment property) or your lender’s consent to let on a short-term basis — many lenders are fine with it. You’ll also need short-let / holiday let landlord insurance; some standard policies cover it, some don’t, so it’s worth checking with your provider. We can point you in the right direction, but we’re not financial advisers so I wouldn’t advise on the specifics.',
    keywords: [
      'mortgage', 'insurance', 'special mortgage', 'consent to let',
      'holiday let mortgage', 'landlord insurance', 'permission from my lender',
      'do i need a different mortgage', 'lender', 'what insurance do i need',
    ],
    slide: null,
  },
  {
    id: 13,
    tier: 2,
    category: 'Service',
    profiles: ALL_PROFILES,
    question: 'How will I know what’s happening with my property?',
    headline: 'Dedicated Slack, live calendar, monthly statements.',
    answer:
      'You get a dedicated Slack channel — that’s the main line of communication, and if something happens you hear about it there. We aim to respond within 24 hours during working hours. You also get a booking calendar where you can see all reservations in real time, and monthly income statements that go out between the 1st and 5th of every month for the previous month’s bookings.',
    keywords: [
      'communication', 'how do i know whats happening', 'updates', 'slack',
      'contact', 'keep in touch', 'reporting', 'kept informed',
      'how do you communicate', 'how will you keep me updated',
    ],
    slide: 'How Stayful Works',
  },
  {
    id: 14,
    tier: 1,
    category: 'Setup',
    profiles: ALL_PROFILES,
    question: 'How long does it take to go live?',
    headline: 'Live and taking bookings in 2–4 weeks from signing.',
    answer:
      'Once the agreement is signed, onboarding takes somewhere between two and four weeks — sometimes quicker if the property is ready to go. We handle the listing setup, get you across all the booking platforms, arrange the photography and do the final checks. You’d be live and taking bookings within a few weeks.',
    keywords: [
      'how long', 'how soon', 'timeline', 'when can i start', 'go live',
      'how quickly', 'how fast can we start', 'when would it be live',
      'how long to set up', 'time to go live',
    ],
    slide: 'Onboarding',
  },
  {
    id: 15,
    tier: 3,
    category: 'Service',
    profiles: ALL_PROFILES,
    question: 'How does the dynamic pricing work?',
    headline: 'Rate auto-adjusts daily on demand, events and competitors.',
    answer:
      'The system adjusts your nightly rate every day based on demand, local events and what competitors are doing. That means you’re never leaving money on the table during peak periods, and you stay competitive — and booked — in the quieter ones. It’s constantly working to maximise your annual total rather than chasing a flat fixed rate.',
    keywords: [
      'pricing', 'how do you price', 'dynamic pricing', 'set the rate',
      'nightly rate', 'who decides the price', 'how is the price set',
      'who sets the rates', 'pricing strategy',
    ],
    slide: 'How Stayful Works',
  },
  {
    id: 16,
    tier: 3,
    category: 'Revenue',
    profiles: ['Buy-to-STL', 'STL Switch'],
    question: 'What occupancy are you projecting?',
    headline: '~80% of projected occupancy in Year 1.',
    answer:
      'The projection is based on real occupancy data for your area. In Year 1 we model roughly 80% of the projected occupancy figure to stay conservative while the listing ramps up and builds reviews; from Year 2 it settles to the full projected rate. Our managed properties also run at 4.7–4.8 average ratings, which lifts visibility and booking rate in the algorithm.',
    keywords: [
      'occupancy', 'how often booked', 'how full', 'booked nights',
      'vacancy', 'how many nights', 'occupancy rate', 'how booked up',
    ],
    slide: 'Investment Returns',
  },
  {
    id: 17,
    tier: 1,
    category: 'Revenue',
    profiles: ALL_PROFILES,
    question: 'How consistent is the income — what about quiet months?',
    headline: 'Even the quietest month earns — anchor on the annual average.',
    answer:
      'The income is less even than a long let month to month, but it’s consistent across the year. The best months are your peak season; the slowest are usually January and February. Even in those months you’re still earning a solid net figure — the worst month is typically comparable to what a long let pays, and your best months far exceed it. The number to anchor on is the annual average, which smooths the seasonality out.',
    keywords: [
      'income consistency', 'how consistent is the income', 'consistent income',
      'consistency', 'monthly', 'seasonality', 'busy months', 'quiet months',
      'peak', 'low season', 'off season', 'month by month', 'breakdown',
      'which months', 'seasonal', 'busy season', 'january and february',
      'dropping off in winter', 'income dropping off',
    ],
    slide: 'Investment Returns',
  },
  {
    id: 18,
    tier: 3,
    category: 'Service',
    profiles: ALL_PROFILES,
    question: 'What happens if there’s damage?',
    headline: 'Photographed each stay — recovered via AirCover or deposit.',
    answer:
      'We photograph the property before and after every stay. If there’s damage we pursue recovery through AirCover or the guest’s £200 security deposit, and we handle all of that for you. We can authorise repairs up to £300 without needing to call you; anything above that, we come to you first. If we genuinely can’t recover something, we’ll be honest with you about it.',
    keywords: [
      'damage', 'whats damaged', 'broken by guest', 'deposit', 'aircover',
      'air cover', 'who pays for damage', 'if a guest breaks something',
      'damages', 'something gets damaged', 'damaged or stolen',
    ],
    slide: 'Vet Guests',
  },
  {
    id: 19,
    tier: 3,
    category: 'Situations',
    profiles: ALL_PROFILES,
    question: 'I’m worried about wear and tear.',
    headline: 'Short stays are gentler — inspected and photographed.',
    answer:
      'It’s a real consideration. Short-term guests actually tend to be gentler on a property than long-term tenants — they’re staying two to five nights, not two years. We inspect the property regularly, photograph before and after every stay, and pursue any damage through AirCover. Major wear items like mattresses and sofas have a lifespan regardless, and we’ll flag when something needs refreshing.',
    keywords: [
      'wear and tear', 'wear', 'damage over time', 'condition',
      'run down', 'gets worn', 'worn out', 'deterioration',
      'wear on the property',
    ],
    slide: null,
  },
  {
    id: 20,
    tier: 3,
    category: 'Service',
    profiles: ALL_PROFILES,
    question: 'Who actually books and stays in these properties?',
    headline: 'Corporate, NHS & healthcare, leisure — 30–40% returning.',
    answer:
      'It depends on your location, but typically a mix of corporate contractors, NHS and healthcare workers, city-break and leisure tourism, university and relocation stays. Properties near hospital clusters do particularly well with NHS and medical-visitor bookings. We only highlight demand drivers that genuinely apply to your area, and 30–40% of our bookings come from returning guests — which significantly reduces the randomness of who’s in your property.',
    keywords: [
      'who stays', 'who books', 'what kind of guests', 'who are the guests',
      'type of guest', 'demand', 'who rents it', 'what guests',
      'who would stay there', 'who actually books', 'healthcare workers',
      'nhs workers', 'healthcare and nhs', 'nhs',
    ],
    slide: 'Who Books',
  },
  {
    id: 21,
    tier: 3,
    category: 'Revenue',
    profiles: ['Buy-to-STL', 'STL Switch', 'Ex-STL'],
    question: 'Do your projections actually match reality?',
    headline: 'Manchester: £56.9k actual vs £62k projected.',
    answer:
      'They track closely. The clearest example: a live Manchester property did £56,900 last year against a £62k projection. The figures come from live market data in your postcode — current listings, occupancy and nightly rates — and Year 1 is already discounted 20% for ramp-up. I’d always rather show you the real picture than an inflated number.',
    keywords: [
      'do projections match', 'accurate', 'hit your numbers',
      'reliable projections', 'actuals', 'do you hit the projections',
      'how accurate', 'do you actually achieve',
    ],
    slide: 'Your Experience',
  },
  {
    id: 22,
    tier: 2,
    category: 'Service',
    profiles: ALL_PROFILES,
    question: 'What insurance and guest protection is in place?',
    headline: '£200 deposit, ID checks, £100k + £2.5M AirCover.',
    answer:
      'On every booking we collect a £200 security deposit and run ID checks. You’re covered by £100,000 of insurance per guest on top of Airbnb’s own AirCover, which covers up to £2.5 million in property damage. In practice the vast majority of stays are completely incident-free — but if something does happen, we manage the claim and you never deal with Airbnb directly.',
    keywords: [
      'insurance', 'protection', 'covered', 'aircover', 'air cover',
      'deposit', 'security', 'what protection', 'what cover', 'am i covered',
      'what if something goes wrong',
    ],
    slide: 'Vet Guests',
  },
  {
    id: 23,
    tier: 3,
    category: 'Service',
    profiles: ALL_PROFILES,
    question: 'Do you inspect the property?',
    headline: 'Inspections 1–3 times a year, plus per-stay photos.',
    answer:
      'Yes — we carry out property inspections, typically one to three times per year, to make sure standards are being maintained. Combined with the before-and-after photos on every stay, it means the condition of your property is actively monitored rather than left to chance.',
    keywords: [
      'inspections', 'do you check the property', 'visit the property',
      'how often do you inspect', 'inspect', 'check on the property',
      'property checks',
    ],
    slide: 'Management',
  },
  {
    id: 24,
    tier: 2,
    category: 'Setup',
    profiles: ALL_PROFILES,
    question: 'What’s the onboarding process, step by step?',
    headline: 'Sign → onboarding call → photos → listing → live.',
    answer:
      'Day 1 the agreement is signed. Days 1–3 we have an onboarding call and record the property details. If furnishing is needed that’s a 2–4 week window. The smart thermostat and key safe go in during setup, then professional photography (a half day plus editing), the listing is created and optimised over 2–3 days, and finally you go live on all platforms with bookings open.',
    keywords: [
      'onboarding', 'process', 'steps', 'what happens after i sign',
      'setup process', 'how does setup work', 'what are the steps',
      'whats the process', 'getting started', 'what happens next',
    ],
    slide: 'Onboarding',
  },
  {
    id: 25,
    tier: 2,
    category: 'Setup',
    profiles: ['Buy-to-STL', 'Abroad'],
    question: 'What if the property isn’t furnished yet?',
    headline: 'We can furnish it — itemised quote, recovered fast.',
    answer:
      'If the property needs furnishing, that’s something we can coordinate for you — or you can do it independently. I’ll send a setup quote after this call with a clear itemised cost. Payment is 100% upfront, and it’s usually recovered within the first few months of bookings.',
    keywords: [
      'furnishing', 'furniture', 'unfurnished', 'do i need to furnish',
      'empty property', 'furnish it', 'its not furnished', 'no furniture',
      'fit out',
    ],
    slide: 'Onboarding',
  },
  {
    id: 26,
    tier: 3,
    category: 'Setup',
    profiles: ['Buy-to-STL', 'STL Switch', 'Abroad'],
    question: 'What setup do I need to provide?',
    headline: 'Just a smart thermostat (~£200) and key safe (~£60).',
    answer:
      'Very little. We’d recommend a smart thermostat so we can manage energy remotely — about £200 once — and a key safe for access, about £60. That’s the extent of your one-off setup. Everything else is handled as part of onboarding.',
    keywords: [
      'what do i need', 'what do i provide', 'setup costs', 'thermostat',
      'key safe', 'what do i need to buy', 'equipment',
      'what do i need to provide', 'upfront costs',
    ],
    slide: null,
  },
  {
    id: 27,
    tier: 3,
    category: 'Service',
    profiles: ['STL Switch', 'Ex-STL'],
    question: 'Can I use my own cleaners?',
    headline: 'Possible if they meet our standards — most use ours.',
    answer:
      'In principle yes — but they’d need to meet our standards and be available on a flexible schedule, including same-day turnaround between check-out and check-in. In practice most owners find it simpler to use our cleaning network. If you have a trusted local cleaner, let’s have that conversation — we can sometimes work with them.',
    keywords: [
      'my own cleaner', 'use my cleaner', 'existing cleaner',
      'can i clean it myself', 'own cleaning', 'my cleaner',
      'keep my cleaner',
    ],
    slide: 'Management',
  },
  {
    id: 28,
    tier: 2,
    category: 'Service',
    profiles: ALL_PROFILES,
    question: 'What am I responsible for?',
    headline: 'Only the bills — utilities, council tax, mortgage.',
    answer:
      'Just the bills — utilities, broadband, council tax and your mortgage. Everything operational sits with us: guest comms, bookings, check-ins and check-outs, cleaning, maintenance and pricing. The only one-off items on your side are the smart thermostat (~£200) and key safe (~£60).',
    keywords: [
      'what am i responsible for', 'my responsibility', 'what do i pay for',
      'bills', 'utilities', 'council tax', 'whats on me',
      'what do i have to cover', 'what are my costs',
    ],
    slide: 'How Stayful Works',
  },
  {
    id: 29,
    tier: 1,
    category: 'Fees',
    profiles: ALL_PROFILES,
    question: 'What’s your management fee?',
    headline: '15% + VAT of gross — all-in, no hidden charges.',
    answer:
      'Our standard management fee is 15% plus VAT of gross revenue. That’s the full fee — everything is included: guest comms, pricing, cleaning coordination, maintenance and monthly reporting. There are no hidden charges on top. (For a full net breakdown of what you keep, see “what you actually keep”.)',
    keywords: [
      'fee', 'cost', 'how much do you charge', 'whats your cut', 'commission',
      'management fee', 'what do you take', 'your fee', 'charges', 'price',
      'how much do you take', 'whats it going to cost', 'what does it cost',
      'fee structure', 'understand the costs', 'understand the fees',
    ],
    slide: null,
  },
  {
    id: 30,
    tier: 2,
    category: 'Fees',
    profiles: ALL_PROFILES,
    question: 'Is there a discount or special offer?',
    headline: '13% if signed by the deadline · 12% for referrals.',
    answer:
      'Where we have a genuine deadline, I can do 13% plus VAT if the agreement is signed by the stated date — after that it goes back to 15%. There’s also a 12% plus VAT rate for existing Stayful client referrals. Any offer always has a clear expiry date stated upfront.',
    keywords: [
      'discount', 'offer', 'deal', 'cheaper', 'reduce the fee', 'special rate',
      'lower fee', 'negotiate', 'any discount', 'better rate',
      'can you do better',
    ],
    slide: null,
  },
  {
    id: 31,
    tier: 1,
    category: 'Revenue',
    profiles: ALL_PROFILES,
    question: 'What happens if the property sits empty?',
    headline: 'Slow months are factored in — annual average wins.',
    answer:
      'In the low months — typically January through March — there will be slower periods, and that’s already factored into the projection. The way to think about it: even your worst month is probably comparable to what a traditional let pays, and your best months far exceed it. The annual average is what matters.',
    keywords: [
      'empty', 'void', 'sits empty', 'no bookings', 'not booked', 'vacant',
      'quiet periods', 'what if it doesnt get booked', 'unbooked',
      'what if nobody books', 'income consistency', 'dropping off in winter',
    ],
    slide: 'Investment Returns',
  },
  {
    id: 32,
    tier: 2,
    category: 'Revenue',
    profiles: ['Buy-to-STL', 'STL Switch'],
    question: 'What does this look like after my mortgage?',
    headline: 'A clear monthly profit after the mortgage is covered.',
    answer:
      'If we take your mortgage figure into account, even on the conservative Year 1 projection you’re looking at a clear monthly profit after the mortgage is covered — and that gap widens in Year 2 at the full run rate. It’s the cleanest way to see what actually lands in your pocket each month.',
    keywords: [
      'after mortgage', 'mortgage payment', 'cover the mortgage',
      'profit after mortgage', 'net after mortgage', 'pay my mortgage',
      'after my mortgage', 'will it cover the mortgage',
    ],
    slide: 'Investment Returns',
  },
  {
    id: 33,
    tier: 3,
    category: 'Service',
    profiles: ALL_PROFILES,
    question: 'What’s your response time and office hours?',
    headline: 'Slack, 24h reply · Mon–Fri 9:30–5:00.',
    answer:
      'Your main line is the dedicated Slack channel, and we aim to respond within 24 hours during working hours. Office hours are Monday to Friday, 9:30am to 5:00pm. Slack is consistently the part of the service owners rate most highly — you’ll always know what’s happening.',
    keywords: [
      'response time', 'how fast', 'office hours', 'when are you open',
      'how quickly do you respond', 'support hours', 'how fast do you reply',
      'availability', 'opening hours',
    ],
    slide: 'Management',
  },
  {
    id: 34,
    tier: 3,
    category: 'Service',
    profiles: ALL_PROFILES,
    question: 'Can I see my bookings and income?',
    headline: 'Live booking calendar + monthly income statements.',
    answer:
      'Yes — you get a booking calendar showing all reservations in real time, plus monthly income statements that go out between the 1st and 5th of every month for the previous month’s completed bookings. Full visibility, without you having to chase anything.',
    keywords: [
      'see bookings', 'calendar', 'dashboard', 'see income', 'statements',
      'track income', 'view bookings', 'can i see whats booked',
      'do i get reports', 'monthly statement',
    ],
    slide: 'Management',
  },
  {
    id: 35,
    tier: 2,
    category: 'Fees',
    profiles: ALL_PROFILES,
    question: 'Is there a software fee or any other costs?',
    headline: '£42/month software fee — the only extra.',
    answer:
      'Yes — there’s a software fee of £42 per month, deducted from your payouts. That’s separate from the 15% + VAT management fee, and it’s the only additional fixed cost.',
    keywords: [
      'software fee', 'extra fees', 'other fees', 'hidden fees', 'monthly fee',
      'any other costs', 'additional charges', 'are there other costs',
      'anything else i pay', 'hidden costs',
    ],
    slide: null,
  },
  {
    id: 36,
    tier: 1,
    category: 'Contract',
    profiles: ALL_PROFILES,
    question: 'What’s the contract term?',
    headline: '6-month fixed, then 3-month rolling notice.',
    answer:
      'It’s a six-month fixed term to start — that gives us both time to properly ramp up, build the reviews, optimise pricing and let the listing find its audience. After the initial term it moves to a three-month rolling notice, so either of us can step away with three months’ notice at any point.',
    keywords: [
      'contract', 'term', 'how long is the contract', 'tie in', 'tie-in',
      'commitment', 'length of contract', 'lock in', 'locked in',
      'are we locked in', 'how long am i signing up', 'contract length',
      'notice period',
    ],
    slide: null,
  },
  {
    id: 37,
    tier: 2,
    category: 'Contract',
    profiles: ALL_PROFILES,
    question: 'What if I want to exit early?',
    headline: '£1,000 early exit fee within the first 6 months.',
    answer:
      'If you needed to exit within the first six months, there’s an early exit fee of £1,000 — that just covers the onboarding investment we’ve made. In practice, once properties are live and earning, owners don’t exit; they simply don’t have a reason to.',
    keywords: [
      'exit', 'cancel', 'get out', 'leave early', 'terminate',
      'break the contract', 'early exit', 'cancellation fee', 'pull out',
      'what if i want to leave', 'change my mind',
    ],
    slide: null,
  },
  {
    id: 38,
    tier: 3,
    category: 'Setup',
    profiles: ALL_PROFILES,
    question: 'When and how do I get paid?',
    headline: 'Paid 1st–5th each month for the prior month’s stays.',
    answer:
      'Payouts go out between the 1st and 5th of each month, covering the previous month’s completed stays. They land directly with you, with a monthly income statement showing exactly how the figure is made up.',
    keywords: [
      'when do i get paid', 'payouts', 'payment', 'wheres the money',
      'get paid', 'payment schedule', 'how do i get paid', 'when am i paid',
      'when does the money come',
    ],
    slide: 'Onboarding',
  },
  {
    id: 39,
    tier: 2,
    category: 'Contract',
    profiles: ALL_PROFILES,
    question: 'Six months feels like a long commitment.',
    headline: '6 months protects the ramp-up — it’s performance accountability.',
    answer:
      'I get that — you’re committing before you’ve seen results. But think of it as performance accountability, not lock-in: it takes three to four months to properly ramp a listing — build the reviews, optimise pricing, find the audience. In months 1–2 here’s exactly what we do; by month 3 you should be seeing real results. With a one-month term, owners would exit before the listing found its feet. The properties that see the best results are the ones that let the process run.',
    keywords: [
      'six months is long', 'long commitment', 'why six months',
      'thats a long tie in', 'too long', 'shorter contract',
      'do i have to commit for six months', 'six month', 'locked in',
      'try it for less time', 'commit for 6 months',
    ],
    slide: null,
  },
  {
    id: 40,
    tier: 3,
    category: 'Legal & Tax',
    profiles: ['Buy-to-STL'],
    question: 'Council tax or business rates?',
    headline: '140 available + 70 let → business rates route.',
    answer:
      'If the property is available for short-term let for more than 140 days a year and actually let for 70+ days, it can qualify for business rates instead of council tax — which often works out cheaper, and you may qualify for small business rates relief, meaning you could pay nothing. It’s a common route for our owners. We can’t advise on it officially, but it’s well worth looking into.',
    keywords: [
      'council tax', 'business rates', 'rates', 'tax', 'small business relief',
      'rateable', 'do i pay council tax', 'what about tax',
      'business rate',
    ],
    slide: null,
  },
  {
    id: 41,
    tier: 2,
    category: 'Situations',
    profiles: ['Abroad', 'STL Switch'],
    question: 'Can I use the property myself?',
    headline: 'Yes — block dates, we clear around them, pay only cleaning.',
    answer:
      'Absolutely — it stays your property. You block the dates on the calendar and we clear the surrounding bookings so it’s ready when you arrive; you just message the Slack channel to request a clean before you come in. The only cost is the cleaning fee for that stay. The key thing is lead time: in peak season, block early because confirmed bookings can’t be cancelled. In the quieter months you can block at short notice with minimal revenue impact.',
    keywords: [
      'use it myself', 'stay there', 'personal use', 'block dates',
      'use the property', 'my own use', 'holiday in it', 'stay in it myself',
      'can i use it', 'live in it sometimes', 'can i stay in my own property',
      'stay in my own home', 'holiday in my own',
    ],
    slide: null,
  },
  {
    id: 42,
    tier: 4,
    category: 'Situations',
    profiles: ['Buy-to-STL', 'STL Switch'],
    question: 'Short-let feels riskier than a long let.',
    headline: 'Different risks, not more — upfront pay, vetting, AirCover.',
    answer:
      'That’s a fair point — the income is less predictable month to month. But the risks with long-let are different, not absent: rent arrears, tenants who don’t leave, damage that’s harder to recover. With Airbnb every guest pays upfront, we vet every booking, and you have £2.5 million of AirCover protection. Different risks — not more risk.',
    keywords: [
      'risky', 'risk', 'riskier', 'safer', 'is it safe', 'what are the risks',
      'more risky than renting', 'sounds risky', 'feels risky',
      'too risky',
    ],
    slide: null,
  },

  // ── Added from Lead Intelligence (high-frequency objections with no card) ──
  {
    id: 43,
    tier: 1,
    category: 'Service',
    profiles: ALL_PROFILES,
    question: 'How do I manage it if I live far away or abroad?',
    headline: 'You don’t — we do. Full remote visibility from your phone.',
    answer:
      'You don’t manage it at all — we do, on the ground, wherever you are in the world. You get complete remote visibility: a dedicated Slack channel for anything that comes up, a live booking calendar, and monthly income statements. We handle check-ins, check-outs, cleaning, maintenance and every guest interaction locally, so distance makes no difference to how the property runs. Plenty of our owners are overseas or hours away and run everything from their phone.',
    keywords: [
      'managing the property remotely', 'manage it remotely', 'manage remotely',
      'i live far away', 'i live abroad', 'im abroad', 'overseas',
      'out of the country', 'how do i oversee it', 'remote management',
      'far from the property', 'keep an eye on it from a distance',
      'i wont be in the country', 'not nearby', 'different city',
      'how do i keep on top of it',
    ],
    slide: 'Management',
  },
  {
    id: 44,
    tier: 1,
    category: 'Fees',
    profiles: ALL_PROFILES,
    question: 'What do I actually keep after all the fees?',
    headline: 'Net = gross minus ~3% platform, 15%+VAT us, cleaning, £42 software.',
    answer:
      'Here’s the full picture, not just a percentage. From the gross a guest pays: Airbnb keeps around 3% platform fee, we take our 15% + VAT management fee, and cleaning comes out — but cleaning is charged to the guest, so it’s largely self-funding. There’s a £42/month software fee. What’s left is your net — the figure on your monthly statement. The clearest way to see it is your net income laid out month by month for the first six months, which I’ll send as a worked example so there are no surprises.',
    keywords: [
      'how much do i actually keep', 'what do i keep', 'what do i actually keep',
      'fee structure', 'understand the costs', 'understand the fees',
      'total costs', 'all the costs', 'what are the total costs',
      'how much of the income do i keep', 'net after fees', 'take home',
      'breakdown of costs', 'what comes out', 'how much do i walk away with',
    ],
    slide: 'Investment Returns',
  },
  {
    id: 45,
    tier: 3,
    category: 'Service',
    profiles: ALL_PROFILES,
    question: 'What’s the 72-hour access notice — can I get into my own property?',
    headline: '72h notice via Slack to visit — protects confirmed bookings.',
    answer:
      'You can visit any time — we just ask for 72 hours’ notice via Slack so we can work around any confirmed guest bookings and make sure there’s no clash. It isn’t about restricting you; it’s what lets us protect confirmed stays and keep your reviews and income intact. For a proper personal stay, you block the dates on the calendar and we clear around them.',
    keywords: [
      '72 hour', '72-hour', 'seventy two hours', 'access notice',
      'get into my own property', 'visit my property', 'access to my property',
      'can i go to the property', 'owner access', 'notice to visit',
      'how much notice to visit',
    ],
    slide: 'Management',
  },
  {
    id: 46,
    tier: 3,
    category: 'Service',
    profiles: ['Buy-to-STL', 'STL Switch', 'Ex-STL'],
    question: 'What do you do to boost my listing’s ranking / the algorithm?',
    headline: 'Fast replies, 100% listing, review velocity, Superhost, pricing.',
    answer:
      'Concrete things that move the Airbnb algorithm: fast guest response times (we aim well inside the thresholds that protect Superhost status), a 100%-complete, optimised listing, professional photography, and review velocity — getting your first reviews in quickly to build ranking signal. Add dynamic pricing that keeps you competitive every day, plus Superhost status once earned, and your listing gets materially more visibility and bookings than a self-managed one.',
    keywords: [
      'algorithm', 'algorithm boost', 'boost my ranking', 'listing ranking',
      'search ranking', 'optimise the listing', 'optimize listing', 'seo',
      'visibility', 'superhost', 'get to the top of search', 'how do you rank',
      'ranking', 'how do you get more bookings',
    ],
    slide: 'How Stayful Works',
  },
  {
    id: 47,
    tier: 3,
    category: 'Service',
    profiles: ['Buy-to-STL', 'STL Switch', 'Ex-STL'],
    question: 'Can I control the pricing or set a minimum nightly rate?',
    headline: 'Dynamic pricing is ours, but we’ll set a floor with you.',
    answer:
      'Day-to-day pricing is handled by our dynamic system — it adjusts daily on demand, events and competitors, which is what maximises your annual total. But it’s collaborative: if you want a minimum nightly floor, or you disagree with a particular rate, we’ll set that with you. You’re never locked out of the conversation — most owners find that once they see the system out-earn a flat rate, they’re happy to let it run.',
    keywords: [
      'control the pricing', 'pricing control', 'set my own price',
      'minimum nightly rate', 'set a minimum', 'set the rate myself',
      'disagree with the price', 'i want control over pricing',
      'can i set the price', 'more control over pricing',
    ],
    slide: 'How Stayful Works',
  },
  {
    id: 48,
    tier: 2,
    category: 'Revenue',
    profiles: ['Buy-to-STL', 'STL Switch', 'Abroad'],
    question: 'I’m nervous about the early weeks before it gets going.',
    headline: 'First 30 days: listing live, photos, first bookings & reviews.',
    answer:
      'That’s a fair concern — it’s execution risk, not the long-term model. Here’s what the first 30 days actually look like: listing created and optimised, professional photography live, you go live across the platforms, dynamic pricing starts working, and we push hard to land your first bookings and first reviews to build ranking signal. The early weeks are deliberately the most active period for us — that’s exactly when our work makes the biggest difference, which is why Year 1 is projected conservatively at 80%.',
    keywords: [
      'nervous about the early weeks', 'early weeks', 'first few weeks',
      'before it gets going', 'slow start', 'first 30 days', 'first month',
      'getting started slow', 'launch period', 'take a while to get going',
      'how long until bookings', 'start slow',
    ],
    slide: 'Onboarding',
  },
  {
    id: 49,
    tier: 3,
    category: 'Service',
    profiles: ALL_PROFILES,
    question: 'What if a guest steals or damages something?',
    headline: 'Theft covered — deposit, ID checks, AirCover, before/after photos.',
    answer:
      'Every guest is ID-verified and vetted, and we hold a £200 security deposit per booking. We photograph the property before and after every stay, so if something is taken or damaged we have the evidence and pursue recovery through the deposit or Airbnb’s AirCover — up to £2.5M property damage, plus £100k per guest. We manage the entire claim, so you never deal with Airbnb directly, and the vast majority of stays are completely incident-free.',
    keywords: [
      'stolen', 'theft', 'steal', 'take my things', 'guest steals',
      'something goes missing', 'rob', 'my belongings', 'valuables',
      'damaged or stolen', 'what if they steal',
    ],
    slide: 'Vet Guests',
  },
];
