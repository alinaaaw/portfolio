import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";

const width=1400;
const height=700;
const source=JSON.parse(await readFile(new URL("../app/_components/worldCountries110m.json",import.meta.url),"utf8"));
const colors=["#60796d","#6c8274","#587267","#758777","#647d70","#708272","#5d766b"];
const project=([longitude,latitude])=>[(longitude+180)/360*width,(90-latitude)/180*height];

function ringPath(ring){
  let previousX;
  return `${ring.map((coordinate,index)=>{
    let [x,y]=project(coordinate);
    if(previousX!==undefined){
      while(x-previousX>width/2)x-=width;
      while(previousX-x>width/2)x+=width;
    }
    previousX=x;
    return `${index===0?"M":"L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ")} Z`;
}

const countryPaths=source.flatMap((country,index)=>{
  if(!country.g)return [];
  const polygons=country.g.type==="Polygon"?[country.g.coordinates]:country.g.coordinates;
  const fill=colors[((country.c??index)-1+colors.length)%colors.length];
  return polygons.flatMap((polygon)=>[-width,0,width].map((offset)=>
    `<path d="${polygon.map(ringPath).join(" ")}" transform="translate(${offset} 0)" fill="${fill}" fill-rule="evenodd" stroke="rgba(41,65,57,.72)" stroke-width="1.04" stroke-linejoin="round"/>`,
  ));
}).join("");

const grid=[...Array(11)].map((_,index)=>`<line x1="${(index+1)*width/12}" y1="0" x2="${(index+1)*width/12}" y2="${height}"/>`).join("")
  +[...Array(5)].map((_,index)=>`<line x1="0" y1="${(index+1)*height/6}" x2="${width}" y2="${(index+1)*height/6}"/>`).join("");
const pins=[[-122.3321,47.6062],[-122.4194,37.7749],[-118.2437,34.0522],[-117.1611,32.7157],[-74.006,40.7128],[-75.1652,39.9526],[-71.0589,42.3601],[-81.3792,28.5383],[129.0756,35.1796],[100.5018,13.7563],[106.5516,29.563],[108.9398,34.3416],[121.4737,31.2304],[135.5023,34.6937],[139.6917,35.6895]].map((coordinate)=>{
  const [x,y]=project(coordinate);
  return `<g><line x1="${x}" y1="${y+3}" x2="${x}" y2="${y-4}" stroke="#873b31" stroke-width="2.5"/><circle cx="${x}" cy="${y-5}" r="4.9" fill="#b94e3e"/><circle cx="${x-1.5}" cy="${y-6.5}" r="1.2" fill="#fff8da"/></g>`;
}).join("");

const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#d9cfad"/>
  <g stroke="rgba(63,91,82,.22)" stroke-width="2">${grid}</g>
  <g>${countryPaths}</g>
  <g fill="rgba(25,52,47,.72)" font-family="monospace" font-size="25" font-weight="600" text-anchor="middle">
    <text x="292" y="167">NORTH AMERICA</text><text x="467" y="420">SOUTH AMERICA</text>
    <text x="762" y="148">EUROPE</text><text x="786" y="334">AFRICA</text>
    <text x="1058" y="159">ASIA</text><text x="1221" y="447">AUSTRALIA</text>
  </g>
  ${pins}
  <rect x="5" y="5" width="1390" height="690" fill="none" stroke="#7b503f" stroke-width="4.7"/>
  <rect x="12" y="12" width="1376" height="676" fill="none" stroke="rgba(123,80,63,.45)" stroke-width="2"/>
</svg>`;

const output=process.argv[2]??join(tmpdir(),"field-case-map-preview.png");
await sharp(Buffer.from(svg)).png().toFile(output);
console.log(output);
