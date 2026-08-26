/// <reference types="vite/client" />

import type { FieldCaseTravelPin } from "./fieldCaseMap";

export type TravelPhoto={src:string;alt:string;caption:string};

const travelPhotoModules=import.meta.glob(
  "../_assets/travel-map-photos/**/*.{avif,AVIF,gif,GIF,jpeg,JPEG,jpg,JPG,png,PNG,webp,WEBP}",
  {eager:true,query:"?url",import:"default"},
) as Record<string,string>;

function displayName(path:string,pin:FieldCaseTravelPin){
  const filename=path.split("/").pop()?.replace(/\.[^.]+$/u,"")??"";
  const label=filename.replace(/^\d+[\s_-]*/u,"").replace(/[\s_-]+/gu," ").trim();
  return label||`${pin.name} travel memory`;
}

export function travelPhotosForPin(pin:FieldCaseTravelPin):TravelPhoto[]{
  const folderMarker=`/travel-map-photos/${pin.photoFolder}/`;
  return Object.entries(travelPhotoModules)
    .filter(([path])=>path.replaceAll("\\","/").includes(folderMarker))
    .sort(([first],[second])=>first.localeCompare(second,undefined,{numeric:true,sensitivity:"base"}))
    .map(([path,src])=>{
      const caption=displayName(path,pin);
      return {src,caption,alt:`${pin.name} — ${caption}`};
    });
}
