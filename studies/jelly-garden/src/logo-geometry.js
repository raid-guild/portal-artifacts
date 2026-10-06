import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { TessellateModifier } from 'three/addons/modifiers/TessellateModifier.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

// The SVG's cutouts remain holes. We mirror its screen coordinates into an
// upright Three.js object and reverse every triangle to retain outward winding.
export function buildLogoGeometry(svgText) {
  const loader=new SVGLoader();
  const paths=loader.parse(svgText).paths;
  const shapes=paths.flatMap(path=>SVGLoader.createShapes(path));
  if(!shapes.length)throw new Error('RaidGuild SVG has no filled shapes');
  const simplify=points=>{
    const filtered=[];
    for(const point of points)if(!filtered.length||filtered.at(-1).distanceTo(point)>.12)filtered.push(point);
    if(filtered.length>2&&filtered.at(-1).distanceTo(filtered[0])<.12)filtered.pop();
    let changed=true;
    while(changed&&filtered.length>3){
      changed=false;
      for(let i=0;i<filtered.length;i++){
        const a=filtered[(i+filtered.length-1)%filtered.length],b=filtered[i],c=filtered[(i+1)%filtered.length];
        const ac=c.clone().sub(a),ab=b.clone().sub(a);
        if(ac.lengthSq()>0&&Math.abs(ac.x*ab.y-ac.y*ab.x)/ac.length()<.07&&ab.dot(ac)>0&&ab.lengthSq()<ac.lengthSq()){
          filtered.splice(i,1);changed=true;break;
        }
      }
    }
    return filtered;
  };
  const cleanShapes=shapes.map(shape=>{
    const clean=new THREE.Shape(simplify(shape.getPoints(12)));
    clean.holes=shape.holes.map(hole=>new THREE.Path(simplify(hole.getPoints(12))));
    return clean;
  });
  const viewWidth=Number(svgText.match(/viewBox="[\d.]+ [\d.]+ ([\d.]+)/)?.[1]||112);
  const expectedScale=2.7/viewWidth;
  let geometry=new THREE.ExtrudeGeometry(cleanShapes,{
    depth:.35,steps:1,curveSegments:16,
    // Bevel size is in SVG path units; the later XY normalization shrinks it.
    bevelEnabled:true,bevelThickness:.018,bevelSize:.018/expectedScale,bevelSegments:4
  });
  geometry.computeBoundingBox();
  const bounds=geometry.boundingBox;
  const scale=2.7/(bounds.max.x-bounds.min.x);
  const centerX=(bounds.min.x+bounds.max.x)/2,centerY=(bounds.min.y+bounds.max.y)/2;
  const contours=cleanShapes.flatMap(shape=>[shape,...shape.holes]);
  const boundary=[];
  for(const contour of contours){
    const points=contour.getPoints(16).map(point=>[(point.x-centerX)*scale,-(point.y-centerY)*scale]);
    for(let i=0;i<points.length;i++)boundary.push([...points[i],...points[(i+1)%points.length]]);
  }
  geometry.translate(-(bounds.min.x+bounds.max.x)/2,-(bounds.min.y+bounds.max.y)/2,-.175);
  geometry.scale(scale,-scale,1);
  if(geometry.index)geometry=geometry.toNonIndexed();
  const attr=geometry.attributes.position;
  for(let i=0;i<attr.count;i+=3){
    const bx=attr.getX(i+1),by=attr.getY(i+1),bz=attr.getZ(i+1);
    attr.setXYZ(i+1,attr.getX(i+2),attr.getY(i+2),attr.getZ(i+2));
    attr.setXYZ(i+2,bx,by,bz);
  }
  geometry.deleteAttribute('normal');
  geometry.computeVertexNormals();
  const subdivided=new TessellateModifier(.23,4).modify(geometry);
  geometry.dispose();
  subdivided.deleteAttribute('uv');
  subdivided.deleteAttribute('normal');
  const smooth=mergeVertices(subdivided,1e-5);
  subdivided.dispose();
  // Cap centers swell away from every outer and cutout edge, like a softly
  // filled pouch. Topology and all SVG holes stay intact.
  const cap=smooth.attributes.position;
  for(let i=0;i<cap.count;i++){
    const z=cap.getZ(i);if(Math.abs(z)<.18)continue;
    const x=cap.getX(i),y=cap.getY(i);let distance2=Infinity;
    for(const [ax,ay,bx,by] of boundary){
      const vx=bx-ax,vy=by-ay,denominator=vx*vx+vy*vy;
      const t=denominator?THREE.MathUtils.clamp(((x-ax)*vx+(y-ay)*vy)/denominator,0,1):0;
      const dx=x-ax-vx*t,dy=y-ay-vy*t;distance2=Math.min(distance2,dx*dx+dy*dy);
    }
    const t=THREE.MathUtils.clamp((Math.sqrt(distance2)-.02)/.22,0,1),bulge=.065*t*t*(3-2*t);
    cap.setZ(i,z+Math.sign(z)*bulge);
  }
  smooth.computeVertexNormals();
  smooth.computeBoundingBox();
  return smooth;
}
