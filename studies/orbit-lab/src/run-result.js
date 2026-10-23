// Artwork is optional: a canvas failure must not swallow a finished flight.
export function presentRunResult({ outcome, mode, populateCore, showResult, renderArtwork, artworkFailed, scheduleArtwork, isCurrent, reportError = console.error }) {
  populateCore();
  showResult();
  scheduleArtwork(() => {
    if (!isCurrent()) return;
    try {
      renderArtwork();
    } catch (error) {
      artworkFailed();
      reportError(`Orbit Lab ${mode} ${outcome} trail artwork failed`, error);
    }
  });
}
