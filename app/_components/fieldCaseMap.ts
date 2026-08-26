import * as THREE from "three";
import countries110m from "./worldCountries110m.json";

type Coordinate = readonly [longitude:number,latitude:number];
type Ring = readonly Coordinate[];
type CountryPolygon = readonly Ring[];
type CountryGeometry =
  | {type:"Polygon";coordinates:CountryPolygon}
  | {type:"MultiPolygon";coordinates:readonly CountryPolygon[]};
type CountryFeature = {c:number;g:CountryGeometry|null};
export type FieldCaseTravelPin = {name:string;coordinate:Coordinate};

export const FIELD_CASE_TRAVEL_PINS:readonly FieldCaseTravelPin[] = [
  {name:"Seattle",coordinate:[-122.3321,47.6062]},
  {name:"San Francisco",coordinate:[-122.4194,37.7749]},
  {name:"Los Angeles",coordinate:[-118.2437,34.0522]},
  {name:"San Diego",coordinate:[-117.1611,32.7157]},
  {name:"New York City",coordinate:[-74.006,40.7128]},
  {name:"Philadelphia",coordinate:[-75.1652,39.9526]},
  {name:"Boston",coordinate:[-71.0589,42.3601]},
  {name:"Orlando",coordinate:[-81.3792,28.5383]},
  {name:"Busan",coordinate:[129.0756,35.1796]},
  {name:"Bangkok",coordinate:[100.5018,13.7563]},
  {name:"Chongqing",coordinate:[106.5516,29.563]},
  {name:"Xi'an",coordinate:[108.9398,34.3416]},
  {name:"Shanghai",coordinate:[121.4737,31.2304]},
  {name:"Osaka",coordinate:[135.5023,34.6937]},
  {name:"Tokyo",coordinate:[139.6917,35.6895]},
];

// Natural Earth 1:110m Admin-0 Countries, reduced to geometry and MAPCOLOR7.
// https://www.naturalearthdata.com/downloads/110m-cultural-vectors/
const countryFeatures=countries110m as unknown as readonly CountryFeature[];
const countryColors=["#60796d","#6c8274","#587267","#758777","#647d70","#708272","#5d766b"] as const;

function project([longitude,latitude]:Coordinate,width:number,height:number) {
  return {
    x:(longitude+180)/360*width,
    y:(90-latitude)/180*height,
  };
}

function traceRing(context:CanvasRenderingContext2D,ring:Ring,width:number,height:number) {
  let previousX:number|undefined;
  ring.forEach((coordinate,index)=>{
    let {x,y}=project(coordinate,width,height);
    if(previousX!==undefined){
      while(x-previousX>width/2)x-=width;
      while(previousX-x>width/2)x+=width;
    }
    if(index===0)context.moveTo(x,y);else context.lineTo(x,y);
    previousX=x;
  });
  context.closePath();
}

function drawCountryPolygon(
  context:CanvasRenderingContext2D,
  polygon:CountryPolygon,
  width:number,
  height:number,
  fill:string,
) {
  for(const offset of [-width,0,width]){
    context.save();
    context.translate(offset,0);
    context.beginPath();
    polygon.forEach((ring)=>traceRing(context,ring,width,height));
    context.fillStyle=fill;
    context.fill("evenodd");
    context.stroke();
    context.restore();
  }
}

function drawCountries(context:CanvasRenderingContext2D,width:number,height:number,resolution:number) {
  context.strokeStyle="rgba(41,65,57,.72)";
  context.lineWidth=Math.max(.55,resolution/1350);
  context.lineJoin="round";
  context.lineCap="round";
  countryFeatures.forEach((country,index)=>{
    if(!country.g)return;
    const fill=countryColors[(country.c-1+countryColors.length)%countryColors.length]??countryColors[index%countryColors.length];
    const polygons=country.g.type==="Polygon"?[country.g.coordinates]:country.g.coordinates;
    polygons.forEach((polygon)=>drawCountryPolygon(context,polygon,width,height,fill));
  });
}

export function drawFieldCaseWorldMap(canvas:HTMLCanvasElement,resolution=1024,showPins=false) {
  canvas.width=resolution;
  canvas.height=resolution/2;
  const context=canvas.getContext("2d");
  if(context){
    const {width,height}=canvas;
    context.fillStyle="#d9cfad";
    context.fillRect(0,0,width,height);

    context.strokeStyle="rgba(63,91,82,.22)";
    context.lineWidth=Math.max(1,resolution/700);
    for(let longitude=-150;longitude<=150;longitude+=30){
      const {x}=project([longitude,0],width,height);
      context.beginPath();context.moveTo(x,0);context.lineTo(x,height);context.stroke();
    }
    for(let latitude=-60;latitude<=60;latitude+=30){
      const {y}=project([0,latitude],width,height);
      context.beginPath();context.moveTo(0,y);context.lineTo(width,y);context.stroke();
    }

    drawCountries(context,width,height,resolution);

    context.fillStyle="rgba(25,52,47,.72)";
    context.font=`600 ${Math.round(resolution*.018)}px monospace`;
    context.textAlign="center";
    const labels:readonly (readonly [number,number,string])[]=[[-105,47,"NORTH AMERICA"],[-60,-18,"SOUTH AMERICA"],[16,52,"EUROPE"],[22,4,"AFRICA"],[92,49,"ASIA"],[134,-25,"AUSTRALIA"]];
    labels.forEach(([longitude,latitude,label])=>{
      const {x,y}=project([longitude,latitude],width,height);
      context.fillText(label,x,y);
    });
    const verticalFold=context.createLinearGradient(width*.48,0,width*.52,0);
    verticalFold.addColorStop(0,"rgba(73,59,40,0)");
    verticalFold.addColorStop(.43,"rgba(73,59,40,.12)");
    verticalFold.addColorStop(.53,"rgba(255,248,218,.2)");
    verticalFold.addColorStop(1,"rgba(73,59,40,0)");
    context.fillStyle=verticalFold;
    context.fillRect(width*.48,0,width*.04,height);
    const horizontalFold=context.createLinearGradient(0,height*.46,0,height*.54);
    horizontalFold.addColorStop(0,"rgba(73,59,40,0)");
    horizontalFold.addColorStop(.45,"rgba(73,59,40,.1)");
    horizontalFold.addColorStop(.55,"rgba(255,248,218,.18)");
    horizontalFold.addColorStop(1,"rgba(73,59,40,0)");
    context.fillStyle=horizontalFold;
    context.fillRect(0,height*.46,width,height*.08);
    context.strokeStyle="#7b503f";
    context.lineWidth=Math.max(3,resolution/300);
    context.strokeRect(5,5,width-10,height-10);
    context.strokeStyle="rgba(123,80,63,.45)";
    context.lineWidth=Math.max(1,resolution/700);
    context.strokeRect(12,12,width-24,height-24);
    if(showPins){
      const pinRadius=Math.max(3,resolution*.0035);
      FIELD_CASE_TRAVEL_PINS.forEach(({coordinate})=>{
        const {x,y}=project(coordinate,width,height);
        context.fillStyle="rgba(26,43,39,.28)";
        context.beginPath();context.ellipse(x+pinRadius*.3,y+pinRadius*1.2,pinRadius*.8,pinRadius*.34,0,0,Math.PI*2);context.fill();
        context.strokeStyle="#873b31";
        context.lineWidth=Math.max(1.5,resolution/550);
        context.beginPath();context.moveTo(x,y+pinRadius*.65);context.lineTo(x,y-pinRadius*.8);context.stroke();
        context.fillStyle="#b94e3e";
        context.beginPath();context.arc(x,y-pinRadius,pinRadius,0,Math.PI*2);context.fill();
        context.fillStyle="rgba(255,248,218,.8)";
        context.beginPath();context.arc(x-pinRadius*.32,y-pinRadius*1.3,pinRadius*.25,0,Math.PI*2);context.fill();
      });
    }
  }
}

export function createFieldCaseWorldMapTexture(resolution=1024) {
  const canvas=document.createElement("canvas");
  drawFieldCaseWorldMap(canvas,resolution);
  const texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.minFilter=THREE.LinearMipmapLinearFilter;
  texture.magFilter=THREE.LinearFilter;
  texture.userData.fieldCaseOwned=true;
  return texture;
}

export function pinPosition(
  [longitude,latitude]:Coordinate,
  centerX:number,
  centerZ:number,
  mapWidth:number,
  mapDepth:number,
):[number,number]{
  return [centerX+(longitude/360)*mapWidth,centerZ-(latitude/180)*mapDepth];
}
