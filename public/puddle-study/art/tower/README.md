# Tower runtime art

The GLBs here are runtime copies of the editable Blender package at `../../../../tower-garden-02/`. The v2 files remain for fallback and archival comparison.

- `tower-spine-v3.glb`: one continuous violet core and pierced bone shell for all five storeys, game Y about -36 to 9.5, game Z behind the walking board near -7.3. The coral conduit is modeled into this asset.
- `storey-facade-a-v3.glb` and `storey-facade-b-v3.glb`: alternate open, forked front arcades. Attach at local game Y -.08 to -7.2, Z about 5.15–5.43. Runtime alternates A/B down the tower at 7.2-unit pitch.
- `side-parapet-l1-v3.glb`, `side-parapet-depth-v3.glb`, and `side-parapet-grip-v3.glb`: low pierced side edges outside the X ±9 play boundary. Their steps match each storey's authored terrace bands; no decorative mesh bridges the stair corridors.
- `rear-arch-wings-l1-v3.glb` and `rear-arch-wings-v3.glb`: smooth pierced rear wings joining the high rear deck around Z -5.2 on L1 or Z -6.4 on L2–5, leaving the central shaft visible.
- `switchback-trim-v2.glb`: first-storey floor trim. The obsolete violet pore material is hidden where it would duplicate new arch perforations.
- `exit-collar-v2.glb`: drain collar and lining. Gameplay retains the original exit collision and dark throat.

The exports are glTF Y-up with applied transforms, flat unlit materials and no external dependencies. They are decorative and must never become colliders or raycast targets. Source builds and validation are `scripts/build_tower_v3.py`, `scripts/validate_v3.py`, `scripts/build_side_rear_v3.py`, and `scripts/validate_side_rear_v3.py` in the Blender package. Their validation JSON reports record bounds and triangle counts. Generated fallback arch details appear only if the matching v3 facade fails to load; the slim rear joints disappear when the authored rear wings load.
