import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";

const width=1400;
const height=700;
const view=process.argv[3]??"world";
const cameras={world:{centerLon:0,centerLat:0,zoom:1},usa:{centerLon:-97.5,centerLat:37.5,zoom:5.1},asia:{centerLon:111.5,centerLat:30,zoom:4.5}};
const camera=cameras[view]??cameras.world;
const scale=Math.min(width/360,height/180)*camera.zoom;
const worldPixelWidth=360*scale;
const source=JSON.parse(await readFile(new URL("../app/_components/worldCountries110m.json",import.meta.url),"utf8"));
const colors=["#60796d","#6c8274","#587267","#758777","#647d70","#708272","#5d766b"];
const project=([longitude,latitude])=>[width/2+(longitude-camera.centerLon)*scale,height/2-(latitude-camera.centerLat)*scale];

function ringPath(ring){
  let previousX;
  return `${ring.map((coordinate,index)=>{
    let [x,y]=project(coordinate);
    if(previousX!==undefined){
      while(x-previousX>worldPixelWidth/2)x-=worldPixelWidth;
      while(previousX-x>worldPixelWidth/2)x+=worldPixelWidth;
    }
    previousX=x;
    return `${index===0?"M":"L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ")} Z`;
}

const countryPaths=source.flatMap((country,index)=>{
  if(!country.g)return [];
  const polygons=country.g.type==="Polygon"?[country.g.coordinates]:country.g.coordinates;
  const fill=colors[((country.c??index)-1+colors.length)%colors.length];
  return polygons.flatMap((polygon)=>[-worldPixelWidth,0,worldPixelWidth].map((offset)=>
    `<path d="${polygon.map(ringPath).join(" ")}" transform="translate(${offset} 0)" fill="${fill}" fill-rule="evenodd" stroke="rgba(41,65,57,.7)" stroke-width="1.04" stroke-linejoin="round"/>`,
  ));
}).join("");

const grid=[];
for(let longitude=-180;longitude<=180;longitude+=30){
  const [baseX]=project([longitude,0]);
  for(const offset of [-worldPixelWidth,0,worldPixelWidth]){const x=baseX+offset;if(x>=0&&x<=width)grid.push(`<line x1="${x}" y1="0" x2="${x}" y2="${height}"/>`);}
}
for(let latitude=-60;latitude<=60;latitude+=30){const [,y]=project([camera.centerLon,latitude]);if(y>=0&&y<=height)grid.push(`<line x1="0" y1="${y}" x2="${width}" y2="${y}"/>`);}

const travelPins=[
  {coordinate:[-122.3321,47.6062],group:"seattle"},{coordinate:[-122.4194,37.7749],group:"san-francisco"},{coordinate:[-118.2437,34.0522],group:"southern-california"},{coordinate:[-117.1611,32.7157],group:"southern-california"},
  {coordinate:[-74.006,40.7128],group:"mid-atlantic"},{coordinate:[-75.1652,39.9526],group:"mid-atlantic"},{coordinate:[-71.0589,42.3601],group:"boston"},{coordinate:[-81.3792,28.5383],group:"florida"},
  {coordinate:[129.0756,35.1796],group:"busan"},{coordinate:[100.5018,13.7563],group:"bangkok"},{coordinate:[106.5516,29.563],group:"chongqing"},{coordinate:[108.9398,34.3416],group:"xian"},{coordinate:[121.4737,31.2304],group:"east-china"},{coordinate:[135.5023,34.6937],group:"osaka"},{coordinate:[139.6917,35.6895],group:"tokyo"},
  {coordinate:[116.4074,39.9042],group:"beijing"},{coordinate:[113.5439,22.1987],group:"macau"},{coordinate:[120.3826,36.0671],group:"qingdao"},{coordinate:[121.6147,38.914],group:"dalian"},{coordinate:[109.1202,21.4813],group:"beihai"},{coordinate:[100.233,26.8721],group:"lijiang"},
];
const groups=view==="world"?Array.from(travelPins.reduce((map,pin)=>map.set(pin.group,[...(map.get(pin.group)??[]),pin]),new Map()).values()):travelPins.map((pin)=>[pin]);
const pins=groups.map((group)=>{
  const coordinate=[group.reduce((sum,pin)=>sum+pin.coordinate[0],0)/group.length,group.reduce((sum,pin)=>sum+pin.coordinate[1],0)/group.length];
  const [x,y]=project(coordinate);
  if(x<0||x>width||y<0||y>height)return "";
  const radius=group.length>1?11:5.4;
  const count=group.length>1?`<text x="${x}" y="${y-radius*1.6+4}" fill="#fff8da" font-family="monospace" font-size="12" font-weight="700" text-anchor="middle">${group.length}</text>`:`<circle cx="${x-1.6}" cy="${y-radius*1.95}" r="1.3" fill="#fff8da"/>`;
  return `<g><line x1="${x}" y1="${y}" x2="${x}" y2="${y-radius*1.4}" stroke="#873b31" stroke-width="2.5"/><circle cx="${x}" cy="${y-radius*1.65}" r="${radius}" fill="#b94e3e"/>${count}</g>`;
}).join("");

const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#d9cfad"/>
  <g stroke="rgba(63,91,82,.2)" stroke-width="2">${grid.join("")}</g>
  <g>${countryPaths}</g>${pins}
  <rect x="4" y="4" width="1392" height="692" fill="none" stroke="#7b503f" stroke-width="4.7"/>
</svg>`;

const output=process.argv[2]??join(tmpdir(),`field-case-map-${view}.png`);
await sharp(Buffer.from(svg)).png().toFile(output);
console.log(output);
