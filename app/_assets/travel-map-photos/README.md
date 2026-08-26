# Travel map photos

这里只需要放照片，不需要修改代码，也不需要创建 `manifest.json`。

## 添加照片

1. 找到或新建对应的城市文件夹。
2. 直接把照片放进文件夹。
3. 提交并重新构建网站；系统会自动识别城市、照片顺序和照片总数。

支持：JPG、JPEG、PNG、WebP、GIF、AVIF。手机拍摄的 HEIC/HEIF 请先转换成 JPG 或 WebP。

照片按照文件名自然排序。序号完全是可选的，只在你想手动控制展示顺序时使用。以下两种写法都会被自动识别：

```text
01-times-square.jpg
02-central-park.jpg
03-brooklyn-bridge.webp

times-square.jpg
central-park.jpg
brooklyn-bridge.webp
```

文件名会自动变成照片下方的标题，例如 `02-central-park.jpg` 会显示为 `central park`。

## 城市文件夹名

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

没有照片的城市会继续显示随机的旅行遗失文案。
