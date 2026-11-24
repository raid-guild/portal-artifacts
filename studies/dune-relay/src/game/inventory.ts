import { BOOSTERS, type BoosterKind } from './boosters';

export type ToolKind = 'tileBomb' | 'freeSwap';
export type Inventory = Record<ToolKind | BoosterKind,number>;
export const TOOL_PRICE = 600;
export const EMPTY_INVENTORY: Inventory = {tileBomb:0,freeSwap:0,jet:0,flywheel:0,prism:0};
export const TOOLS: {kind:ToolKind;title:string;image:string;instruction:string}[] = [
  {kind:'tileBomb',title:'Tile Bomb',image:'/sprites/tile-bomb.png',instruction:'Tap one tile, salt block, or seedpod to hit it.'},
  {kind:'freeSwap',title:'Free Swap',image:'/sprites/free-swap.png',instruction:'Choose two adjacent tiles. No match is required.'},
];
export function normalizeInventory(value:unknown):Inventory {
  const source=value && typeof value==='object' ? value as Record<string,unknown> : {};
  const result={...EMPTY_INVENTORY};
  for(const kind of Object.keys(result) as (keyof Inventory)[]) if(Number.isSafeInteger(source[kind]) && (source[kind] as number)>=0 && (source[kind] as number)<=1000000) result[kind]=source[kind] as number;
  return result;
}
export function boosterFunding(selected:readonly BoosterKind[],inventory:Inventory):{owned:BoosterKind[];purchased:BoosterKind[];coinCost:number} {
  const owned:BoosterKind[]=[],purchased:BoosterKind[]=[];
  for(const kind of selected) (inventory[kind]>0?owned:purchased).push(kind);
  return {owned,purchased,coinCost:purchased.reduce((sum,kind)=>sum+BOOSTERS.find(item=>item.kind===kind)!.cost,0)};
}
