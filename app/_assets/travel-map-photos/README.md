# Travel map photos

Only photos belong here. You do not need to modify any code or create a `manifest.json` file.

## Adding photos

1. Find or create the folder for the relevant city.
2. Place the photos directly in that folder.
3. Commit the files and rebuild the website. The system automatically detects the city, photo order, and total photo count.

Supported formats: JPG, JPEG, PNG, WebP, GIF, and AVIF. Convert HEIC or HEIF photos from a phone to JPG or WebP first.

Photos are sorted naturally by filename. Number prefixes are optional and are only needed when you want to control the display order manually. Both of the following naming styles are detected automatically:

```text
01-times-square.jpg
02-central-park.jpg
03-brooklyn-bridge.webp

times-square.jpg
central-park.jpg
brooklyn-bridge.webp
```

The filename automatically becomes the caption below the photo. For example, `02-central-park.jpg` is displayed as `central park`.

## City folder names

- `seattle`
- `san-francisco`
- `los-angeles`
- `san-diego`
- `new-york-city`
- `philadelphia`
- `boston`
- `orlando`
- `busan`
- `bangkok`
- `chongqing`
- `xian`
- `shanghai`
- `kyoto`
- `tokyo`
- `beijing`
- `macau`
- `qingdao`
- `dalian`
- `beihai`
- `lijiang`

Cities without photos continue to display a randomized lost-travel message.
