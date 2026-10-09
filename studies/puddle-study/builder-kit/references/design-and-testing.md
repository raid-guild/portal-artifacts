# Route design and play testing

Start from the highest safe landing, then draw the intended path to the exit before adding rewards. Use height changes, turns, and bridges so the player can read where to go. Leave broad landings for gems: the blob must wrap around a gem for a sustained moment, and a tiny platform may make that impossible. Place flesh supplies before demanding climbs or difficult enclosures.

Check the physical route in the Workshop. Walk, contract, cast tendrils, and run through the intended path. Try falling from each exposed bridge; provide a recovery climb or an intentional death/respawn route. Keep the start and respawn area clear of pits and lava. Test an early shortcut too, since skipping points may be a fair tradeoff. Verify that a real blob can reach the exit, not merely that geometry is structurally valid.

For a lava bridge, paint the terrain below at its own support `base`; paint on the bridge top only if that top is deliberately hazardous. For a tunnel, check the entrance, internal clearance, and exit with both the brain and its surrounding flesh. For a climb, test from the lowest intended approach with the connected body rather than moving a single particle in code.

After playing, revise the JSON, run the validator, reimport, and play again. The validator cannot certify reachability, score balance, safe recovery, or frame rate.
