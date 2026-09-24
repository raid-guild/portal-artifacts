export function neighborStatus(player, neighbor, approaching = false) {
  if(!neighbor || !player)return 'far';
  if(Math.hypot(player.x-neighbor.meet.x,player.z-neighbor.meet.z)<=1.2)return 'ready';
  return approaching?'approaching':'far';
}
