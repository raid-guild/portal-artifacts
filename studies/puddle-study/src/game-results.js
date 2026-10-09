import {scoreRun} from './game-score.js';

export function resultLine(name,result){
  const score=scoreRun(result);if(!score)return '';
  const time=score.elapsed===null?'Legacy time unknown':
    `${score.elapsed.toFixed(1)}s / ${score.target}s target`;
  return `${name}: ${result.gems}/${result.totalGems} gems · ${result.gold}/${result.totalGold} gold · `+
    `${score.collectionPercent}% collected · ${score.collectionPoints.toFixed(1)} collection + `+
    `${score.timePoints} time = ${score.percent}% · ${time}`;
}
export function campaignResultLines(levels,scores,throughLevel){
  return levels.slice(0,throughLevel).filter(level=>scores[level.id]).map(level=>{
    const result=scores[level.id];return resultLine(level.name,{...result,
      totalGems:result.totalGems??level.gems.length,totalGold:result.totalGold??level.gold.length,
      target:result.target===undefined?(result.elapsed===undefined?undefined:level.targetTime):result.target});
  }).join('\n');
}
