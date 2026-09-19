# NPC activity — Rook first

Rook stays beside the vehicle and cycles through inspecting, two wrench poses, and wiping her hands. Pauses between short gestures make the room feel inhabited without distracting from the puzzle. Her feet remain near one ground anchor; she does not patrol yet.

| Situation | Response |
| --- | --- |
| Exploring the unfinished repair | Inspect → tighten twice → inspect → wipe hands; repeat |
| Rook selected, including approach | Turn toward the traveler and hold the attentive pose |
| Player selects another target or walks away | Resume work |
| Walker repaired | Hold the relaxed, available-to-talk pose |
| Intro, open dialog, or hidden browser tab | Stop the activity timer |
| Reduced motion requested | Use a still pose |

`src/npc.ts` owns the timed routine and interruptions. `src/room-art.ts` draws the pose. `src/main.ts` supplies room context. Another NPC can use a different sequence without inheriting Rook's artwork or changing puzzle logic. Ambient animation never awards items, advances quests, or modifies saves. The interaction hotspot stays stationary and keyboard-accessible.

## Next NPCs

Start with a work station, an attentive pose, a few purposeful gestures, and a resting state. Author activity around the character's role: the keeper might sort parts, read a note, and look up. Give actions time to breathe rather than switching poses constantly.

When movement becomes necessary, add a few authored nearby anchors and a short walk between them, keeping the NPC and its hotspot together. Let conversation interrupt movement, reserve space for the player to approach, and prevent decorative movement from blocking essential interactions. Add pathfinding when an actual room needs it.

Keep story state separate from transient pose and position. Save NPC state only for narrative changes that must survive reload. Future scripted actions should have priority over ambient routines, then hand control back when complete. A future room-unmount lifecycle should cancel its actors' timers.

This pass uses four discrete illustrated poses, with slight clothing and posture differences. Rook does not yet walk, crouch at the damaged leg, or animate the final repair; completion still changes the scene image. See [asset notes](../art/prompts/rook-and-tools-notes.md).
