# Travel map photos

这里是地图照片目录。每个城市使用一个同名子文件夹；点击地图 pin 时，网站会读取该文件夹里的 `manifest.json`。

## 添加照片

1. 复制 `_template` 文件夹，并改成下面对应的城市文件夹名。
2. 把 JPG、PNG、WebP 或 GIF 照片放进城市文件夹。
3. 编辑该文件夹里的 `manifest.json`，按希望展示的顺序填写文件名。
4. `caption` 和 `alt` 可以留空，但不要删除 `file`。

示例：

```text
travel-map-photos/
  tokyo/
    manifest.json
    01-night.jpg
    02-ramen.jpg
```

```json
{
  "photos": [
    {
      "file": "01-night.jpg",
      "caption": "Shinjuku after dark",
      "alt": "Night street in Shinjuku"
    },
    {
      "file": "02-ramen.jpg",
      "caption": "Late-night ramen",
      "alt": "A bowl of ramen in Tokyo"
    }
  ]
}
```

也可以只写文件名：

```json
{ "photos": ["01-night.jpg", "02-ramen.jpg"] }
```

如果城市文件夹、`manifest.json` 或照片不存在，地图会显示随机的旅行遗失文案。

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
- `osaka`
- `tokyo`
- `beijing`
- `macau`
- `qingdao`
- `dalian`
- `beihai`
- `lijiang`
