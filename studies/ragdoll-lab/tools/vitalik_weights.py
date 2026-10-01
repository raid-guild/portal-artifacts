"""Rest-pose skin weights shared by the Vitalik builder and repair script.

Coordinates are Blender world space in meters (Z up). Keep the shoulder blend
continuous across sleeve caps so a raised arm carries the entire sleeve.
"""

def ramp(value, start, end):
    t = max(0., min(1., (value - start) / (end - start)))
    return t * t * (3 - 2 * t)


def weights(part, point):
    x, y, z = point
    side = 'left' if x < 0 else 'right'
    if part == 'sweater':
        # The fused garment has no sleeve submesh. In its rest silhouette the
        # upper sleeve's inner edge is about 0.23 m from center at chest height;
        # torso surface ends near 0.18 m. Blend across that real seam, including
        # the shoulder cap above z=1.56, with no height-dependent hard switch.
        cap = ramp(z, 1.48, 1.60)
        inner = .16 + .01 * cap
        outer = .225 - .020 * cap
        arm = ramp(abs(x), inner, outer)
        forearm = 1 - ramp(z, 1.15, 1.27)
        torso = 1 - arm
        chest = torso * ramp(z, 1.12, 1.36)
        pelvis = torso - chest
        return {side + '-forearm': arm * forearm,
                side + '-upper-arm': arm * (1 - forearm),
                'chest': chest, 'pelvis': pelvis}
    if part == 'pants':
        if abs(x) < .05 and z > .84: return {'pelvis': 1}
        thigh = ramp(z, .49, .61)
        hip = ramp(z, .91, 1.04)
        return {side + '-shin': 1 - thigh,
                side + '-thigh': thigh * (1 - hip), 'pelvis': thigh * hip}
    if part == 'head':
        head = ramp(z, 1.62, 1.68)
        return {'head': head, 'chest': 1 - head}
    if part == 'hand': return {side + '-forearm': 1}
    if part == 'shoe': return {side + '-foot': 1}
    return {'head': 1}
