/// <reference types="vite/client" />

const drawerArtifactMediaModules=import.meta.glob(
  "../_assets/drawer/*.{avif,AVIF,gif,GIF,jpeg,JPEG,jpg,JPG,png,PNG,webp,WEBP}",
  {eager:true,query:"?url",import:"default"},
) as Record<string,string>;

export const drawerArtifactMedia=Object.fromEntries(
  Object.entries(drawerArtifactMediaModules).map(([path,src])=>[
    path.split("/").pop()?.replace(/\.[^.]+$/u,"")??path,
    src,
  ]),
) as Record<string,string>;
