export function interpolateBodyQuaternion(previous, current, alpha, output, previousScratch, currentScratch) {
  previousScratch.set(previous.x, previous.y, previous.z, previous.w);
  currentScratch.set(current.x, current.y, current.z, current.w);
  return output.copy(previousScratch).slerp(currentScratch, alpha);
}
