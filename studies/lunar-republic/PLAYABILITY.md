# First-delivery playability pass

The optional opening guide loads direction −50°, speed 3.2 km/s and zero departure delay. This reaches the planet safely but misses Azure: the player still finds the departure window. A fresh campaign succeeds around a one-hour delay. Guidance checks flight geometry, cargo survival and target location in that order; it never adjusts a shot automatically. Advice remains available for later operations. The first-delivery checklist ends after successful freight, and the introductory card can be dismissed.

The timeline shortcut is above the desktop sliders, with elapsed shifts and enemy-action count. Mobile retains the top-bar timeline button and shows compact live aiming advice without requiring scrolling between plot and controls.

## Validation and pacing observations

- Fresh campaign completed through the browser at a 375×667 viewport: guided setup, manual departure adjustment, successful launch at shift 2, return supplies at shift 4 (60 supplies after upkeep).
- Rules-level diplomatic run used calculated launch windows rounded to the UI’s 0.05-hour increments, with no resource injection: freight, two shifts of waiting, one solar upgrade and one battery upgrade, two relief drops, demonstration, two district strikes, surrender.
- Alliance at shift 9; demonstration at 11; strikes at 14 and 17; victory at 18 with 26 supplies remaining. Existing blockades persisted until surrender, as intended.
- Solar and battery upgrades frequently filled power storage between flights. The run confirms viability, not difficulty for a new player; aiming mistakes and long unsuccessful flights can change pacing substantially. No balance constants were changed in this pass. Observe player attempts before tightening supply or enemy timing.
- Existing military and diplomatic campaign tests remain green, along with new guidance tests.

## Interruptible fleet and priority freight

The first successful Port Azure ore delivery opens one priority request for the next delivery. Its deadline is four shifts after that first arrival, inclusive. A timely second arrival schedules 40 supply crates instead of 28. Return transit still takes two shifts, and a blockade can hold the shuttle. Missing the target leaves the request open if time remains; a late arrival receives the ordinary 28 crates. Further deliveries never reopen or repeat the bonus.

Vesper's blockade fleet has an exact due shift. A successful light or heavy strike on the shipyards, arriving while that fleet is still being prepared, postpones it by two shifts once for that preparation cycle. Striking on the due shift is too late because shift events resolve before arrival. Destroying the shipyards stops later mobilization. An already deployed blockade still needs its anchorage cleared.

The launch forecast runs the same campaign resolution as a committed shot. It shows the priority deadline and result, any disruption at arrival, the new fleet due shift, and the actual return crate amount. The compact mobile aiming notice shows the deadline and threat shift. Radio messages follow offer, fulfillment, expiry, preparation, and disruption; reading them does not change availability.

One no-injected-resource path demonstrates the choice: the first freight arrives at shift 2. A second freight can arrive at shift 5 and earn a 40-crate shuttle, which the blockade at shift 6 holds when it would otherwise return at shift 7. Alternatively, a shipyard strike arriving at shift 5 postpones the shift-6 fleet to shift 8, while the freight bonus expires after shift 6. Both paths remain playable; the player must choose which time pressure to address first.
