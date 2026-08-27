import countries110m from "./worldCountries110m.json";

type Coordinate = readonly [longitude:number,latitude:number];
type Ring = readonly Coordinate[];
type CountryPolygon = readonly Ring[];
type CountryGeometry =
  | {type:"Polygon";coordinates:CountryPolygon}
  | {type:"MultiPolygon";coordinates:readonly CountryPolygon[]};
type CountryFeature = {c:number;g:CountryGeometry|null};
export type FieldCaseMapView = "world"|"usa"|"asia";
export type FieldCaseMapCamera = {centerLon:number;centerLat:number;zoom:number};
type FieldCaseCountry = "United States"|"China"|"Japan"|"South Korea"|"Thailand";
type FieldCaseWorldGroup = "seattle"|"san-francisco"|"southern-california"|"mid-atlantic"|"boston"|"florida"|"busan"|"bangkok"|"chongqing"|"xian"|"east-china"|"kyoto"|"tokyo"|"beijing"|"macau"|"qingdao"|"dalian"|"beihai"|"lijiang";
export type FieldCaseTravelPin = {name:string;coordinate:Coordinate;country:FieldCaseCountry;region:Exclude<FieldCaseMapView,"world">;worldGroup:FieldCaseWorldGroup;photoFolder:string};
export type FieldCaseMapPinHit = {id:string;x:number;y:number;radius:number;count:number;pins:readonly FieldCaseTravelPin[];targetView:Exclude<FieldCaseMapView,"world">};

export const FIELD_CASE_MAP_VIEWS:Record<FieldCaseMapView,FieldCaseMapCamera> = {
  world:{centerLon:0,centerLat:0,zoom:1},
  usa:{centerLon:-97.5,centerLat:37.5,zoom:5.1},
  asia:{centerLon:111.5,centerLat:30,zoom:4.5},
};

export const FIELD_CASE_TRAVEL_PINS:readonly FieldCaseTravelPin[] = [
  {name:"Seattle",coordinate:[-122.3321,47.6062],country:"United States",region:"usa",worldGroup:"seattle",photoFolder:"seattle"},
  {name:"San Francisco",coordinate:[-122.4194,37.7749],country:"United States",region:"usa",worldGroup:"san-francisco",photoFolder:"san-francisco"},
  {name:"Los Angeles",coordinate:[-118.2437,34.0522],country:"United States",region:"usa",worldGroup:"southern-california",photoFolder:"los-angeles"},
  {name:"San Diego",coordinate:[-117.1611,32.7157],country:"United States",region:"usa",worldGroup:"southern-california",photoFolder:"san-diego"},
  {name:"New York City",coordinate:[-74.006,40.7128],country:"United States",region:"usa",worldGroup:"mid-atlantic",photoFolder:"new-york-city"},
  {name:"Philadelphia",coordinate:[-75.1652,39.9526],country:"United States",region:"usa",worldGroup:"mid-atlantic",photoFolder:"philadelphia"},
  {name:"Boston",coordinate:[-71.0589,42.3601],country:"United States",region:"usa",worldGroup:"boston",photoFolder:"boston"},
  {name:"Orlando",coordinate:[-81.3792,28.5383],country:"United States",region:"usa",worldGroup:"florida",photoFolder:"orlando"},
  {name:"Busan",coordinate:[129.0756,35.1796],country:"South Korea",region:"asia",worldGroup:"busan",photoFolder:"busan"},
  {name:"Bangkok",coordinate:[100.5018,13.7563],country:"Thailand",region:"asia",worldGroup:"bangkok",photoFolder:"bangkok"},
  {name:"Chongqing",coordinate:[106.5516,29.563],country:"China",region:"asia",worldGroup:"chongqing",photoFolder:"chongqing"},
  {name:"Xi'an",coordinate:[108.9398,34.3416],country:"China",region:"asia",worldGroup:"xian",photoFolder:"xian"},
  {name:"Shanghai",coordinate:[121.4737,31.2304],country:"China",region:"asia",worldGroup:"east-china",photoFolder:"shanghai"},
  {name:"Kyoto",coordinate:[135.7681,35.0116],country:"Japan",region:"asia",worldGroup:"kyoto",photoFolder:"kyoto"},
  {name:"Tokyo",coordinate:[139.6917,35.6895],country:"Japan",region:"asia",worldGroup:"tokyo",photoFolder:"tokyo"},
  {name:"Beijing",coordinate:[116.4074,39.9042],country:"China",region:"asia",worldGroup:"beijing",photoFolder:"beijing"},
  {name:"Macau",coordinate:[113.5439,22.1987],country:"China",region:"asia",worldGroup:"macau",photoFolder:"macau"},
  {name:"Qingdao",coordinate:[120.3826,36.0671],country:"China",region:"asia",worldGroup:"qingdao",photoFolder:"qingdao"},
  {name:"Dalian",coordinate:[121.6147,38.914],country:"China",region:"asia",worldGroup:"dalian",photoFolder:"dalian"},
  {name:"Beihai",coordinate:[109.1202,21.4813],country:"China",region:"asia",worldGroup:"beihai",photoFolder:"beihai"},
  {name:"Lijiang",coordinate:[100.233,26.8721],country:"China",region:"asia",worldGroup:"lijiang",photoFolder:"lijiang"},
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
    const projected=project(coordinate,width,height);
    let x=projected.x;
    const y=projected.y;
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

function wrappedLongitudeDelta(longitude:number,centerLon:number) {
  return ((longitude-centerLon+540)%360)-180;
}

function viewportScale(width:number,height:number,camera:FieldCaseMapCamera) {
  return Math.min(width/360,height/180)*camera.zoom;
}

function projectViewport(coordinate:Coordinate,width:number,height:number,camera:FieldCaseMapCamera,wrap=false) {
  const [longitude,latitude]=coordinate;
  const scale=viewportScale(width,height,camera);
  const longitudeDelta=wrap?wrappedLongitudeDelta(longitude,camera.centerLon):longitude-camera.centerLon;
  return {x:width/2+longitudeDelta*scale,y:height/2-(latitude-camera.centerLat)*scale};
}

function traceViewportRing(
  context:CanvasRenderingContext2D,
  ring:Ring,
  width:number,
  height:number,
  camera:FieldCaseMapCamera,
  worldPixelWidth:number,
) {
  let previousX:number|undefined;
  ring.forEach((coordinate,index)=>{
    const projected=projectViewport(coordinate,width,height,camera);
    let x=projected.x;
    const y=projected.y;
    if(previousX!==undefined){
      while(x-previousX>worldPixelWidth/2)x-=worldPixelWidth;
      while(previousX-x>worldPixelWidth/2)x+=worldPixelWidth;
    }
    if(index===0)context.moveTo(x,y);else context.lineTo(x,y);
    previousX=x;
  });
  context.closePath();
}

function drawViewportCountries(context:CanvasRenderingContext2D,width:number,height:number,camera:FieldCaseMapCamera) {
  const worldPixelWidth=360*viewportScale(width,height,camera);
  context.strokeStyle="rgba(41,65,57,.7)";
  context.lineWidth=Math.max(.7,width/1500);
  context.lineJoin="round";
  context.lineCap="round";
  countryFeatures.forEach((country,index)=>{
    if(!country.g)return;
    const fill=countryColors[(country.c-1+countryColors.length)%countryColors.length]??countryColors[index%countryColors.length];
    const polygons=country.g.type==="Polygon"?[country.g.coordinates]:country.g.coordinates;
    polygons.forEach((polygon)=>{
      for(const offset of [-worldPixelWidth,0,worldPixelWidth]){
        context.save();
        context.translate(offset,0);
        context.beginPath();
        polygon.forEach((ring)=>traceViewportRing(context,ring,width,height,camera,worldPixelWidth));
        context.fillStyle=fill;
        context.fill("evenodd");
        context.stroke();
        context.restore();
      }
    });
  });
}

function meanCoordinate(pins:readonly FieldCaseTravelPin[]):Coordinate {
  const latitude=pins.reduce((sum,pin)=>sum+pin.coordinate[1],0)/pins.length;
  const longitudeRadians=pins.map((pin)=>pin.coordinate[0]*Math.PI/180);
  const longitude=Math.atan2(
    longitudeRadians.reduce((sum,value)=>sum+Math.sin(value),0),
    longitudeRadians.reduce((sum,value)=>sum+Math.cos(value),0),
  )*180/Math.PI;
  return [longitude,latitude];
}

function drawViewportPin(
  context:CanvasRenderingContext2D,
  x:number,
  y:number,
  radius:number,
) {
  context.fillStyle="rgba(26,43,39,.28)";
  context.beginPath();context.ellipse(x+radius*.3,y+radius*.18,radius*.7,radius*.28,0,0,Math.PI*2);context.fill();
  context.strokeStyle="#873b31";
  context.lineWidth=Math.max(1.5,radius*.22);
  context.beginPath();context.moveTo(x,y);context.lineTo(x,y-radius*1.4);context.stroke();
  context.fillStyle="#b94e3e";
  context.beginPath();context.arc(x,y-radius*1.65,radius,0,Math.PI*2);context.fill();
  context.fillStyle="rgba(255,248,218,.86)";
  context.beginPath();context.arc(x-radius*.32,y-radius*1.95,radius*.24,0,Math.PI*2);context.fill();
}

export function drawFieldCaseMapViewport(
  canvas:HTMLCanvasElement,
  camera:FieldCaseMapCamera,
):readonly FieldCaseMapPinHit[] {
  const context=canvas.getContext("2d");
  if(!context)return [];
  const {width,height}=canvas;
  context.fillStyle="#d9cfad";
  context.fillRect(0,0,width,height);
  context.save();
  context.beginPath();context.rect(0,0,width,height);context.clip();
  context.strokeStyle="rgba(63,91,82,.2)";
  context.lineWidth=Math.max(1,width/1100);
  const scale=viewportScale(width,height,camera);
  const worldPixelWidth=360*scale;
  for(let longitude=-180;longitude<=180;longitude+=30){
    const projected=projectViewport([longitude,0],width,height,camera);
    for(const offset of [-worldPixelWidth,0,worldPixelWidth]){
      const x=projected.x+offset;
      if(x>=0&&x<=width){context.beginPath();context.moveTo(x,0);context.lineTo(x,height);context.stroke();}
    }
  }
  for(let latitude=-60;latitude<=60;latitude+=30){
    const {y}=projectViewport([camera.centerLon,latitude],width,height,camera);
    if(y>=0&&y<=height){context.beginPath();context.moveTo(0,y);context.lineTo(width,y);context.stroke();}
  }
  drawViewportCountries(context,width,height,camera);

  const verticalFold=context.createLinearGradient(width*.48,0,width*.52,0);
  verticalFold.addColorStop(0,"rgba(73,59,40,0)");verticalFold.addColorStop(.45,"rgba(73,59,40,.1)");verticalFold.addColorStop(.55,"rgba(255,248,218,.16)");verticalFold.addColorStop(1,"rgba(73,59,40,0)");
  context.fillStyle=verticalFold;context.fillRect(width*.48,0,width*.04,height);
  const horizontalFold=context.createLinearGradient(0,height*.46,0,height*.54);
  horizontalFold.addColorStop(0,"rgba(73,59,40,0)");horizontalFold.addColorStop(.45,"rgba(73,59,40,.08)");horizontalFold.addColorStop(.55,"rgba(255,248,218,.14)");horizontalFold.addColorStop(1,"rgba(73,59,40,0)");
  context.fillStyle=horizontalFold;context.fillRect(0,height*.46,width,height*.08);

  const groupedPins=new Map<FieldCaseWorldGroup,FieldCaseTravelPin[]>();
  FIELD_CASE_TRAVEL_PINS.forEach((pin)=>groupedPins.set(pin.worldGroup,[...(groupedPins.get(pin.worldGroup)??[]),pin]));
  const markerGroups:readonly (readonly FieldCaseTravelPin[])[]=camera.zoom<2.25
    ? Array.from(groupedPins.values())
    : FIELD_CASE_TRAVEL_PINS.map((pin)=>[pin]);
  const hits:FieldCaseMapPinHit[]=[];
  markerGroups.forEach((pins)=>{
    const coordinate=meanCoordinate(pins);
    const {x,y}=projectViewport(coordinate,width,height,camera,true);
    if(x<0||x>width||y<0||y>height)return;
    const radius=Math.max(4.5,width/260);
    drawViewportPin(context,x,y,radius);
    hits.push({
      id:pins[0].worldGroup,
      x,y,
      radius:Math.max(radius*1.7,width/70),
      count:pins.length,
      pins,
      targetView:pins[0].region,
    });
  });
  context.restore();
  context.strokeStyle="#7b503f";context.lineWidth=Math.max(3,width/300);context.strokeRect(4,4,width-8,height-8);
  return hits;
}

export function createFieldCaseWorldMapCanvas(resolution=1024) {
  const canvas=document.createElement("canvas");
  drawFieldCaseWorldMap(canvas,resolution);
  return canvas;
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
