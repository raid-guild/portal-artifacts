// Frame the complete run in map coordinates, independent of phone orientation.
export function drawFinishArt(canvas, archive, halfWidth, halfHeight, bounds, start, end) {
  const context = canvas.getContext('2d');
  const width = canvas.width, height = canvas.height;
  context.fillStyle = '#050e18'; context.fillRect(0, 0, width, height);
  const padding = 48;
  const scale = Math.min((width - padding * 2) / (bounds.maxX - bounds.minX), (height - padding * 2) / (bounds.maxY - bounds.minY));
  const mapWidth = (bounds.maxX - bounds.minX) * scale, mapHeight = (bounds.maxY - bounds.minY) * scale;
  const left = (width - mapWidth) / 2, top = (height - mapHeight) / 2;
  const sx = (bounds.minX + halfWidth) / (halfWidth * 2) * archive.width;
  const sy = (halfHeight - bounds.maxY) / (halfHeight * 2) * archive.height;
  const sw = (bounds.maxX - bounds.minX) / (halfWidth * 2) * archive.width;
  const sh = (bounds.maxY - bounds.minY) / (halfHeight * 2) * archive.height;
  context.save(); context.globalCompositeOperation = 'lighter';
  // Lift the faint permanent marks so the whole journey is visible in the print.
  context.filter = 'blur(3px)';
  for (let i = 0; i < 4; i++) context.drawImage(archive, sx, sy, sw, sh, left, top, mapWidth, mapHeight);
  context.filter = 'none';
  for (let i = 0; i < 7; i++) context.drawImage(archive, sx, sy, sw, sh, left, top, mapWidth, mapHeight);
  context.restore();
  const point = (p) => ({ x: left + (p.x - bounds.minX) * scale, y: top + (bounds.maxY - p.y) * scale });
  const first = point(start), last = point(end);
  context.shadowBlur = 16; context.shadowColor = '#7cffee'; context.fillStyle = '#dcfff6';
  context.beginPath(); context.arc(first.x, first.y, 3, 0, Math.PI * 2); context.fill();
  context.shadowColor = '#b78aff'; context.strokeStyle = '#b78aff'; context.lineWidth = 2;
  context.beginPath(); context.arc(last.x, last.y, 7, 0, Math.PI * 2); context.stroke();
  context.shadowBlur = 0;
}
