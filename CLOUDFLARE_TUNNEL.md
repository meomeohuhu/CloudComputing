# Chay demo bang Cloudflare Tunnel mien phi

Cloudflare Quick Tunnel cho phep public app local ra mot URL HTTPS tam thoi dang `https://...trycloudflare.com`. Link nay mo duoc tren PC, laptop, dien thoai va tablet mien la may dang chay app van bat.

## Cach chay

Mo terminal 1:

```bash
npm run dev
```

Mo terminal 2:

```bash
npm run tunnel
```

Sau vai giay, terminal se in ra mot URL dang:

```text
https://random-name.trycloudflare.com
```

Dung URL do de demo PWA tren trinh duyet PC hoac gui qua dien thoai de mo tren mobile. Vi day la HTTPS nen phu hop de test PWA va camera tren browser.

## Luu y

- Day la tunnel mien phi dung cho demo/dev, khong phai URL production co dinh.
- Moi lan chay lai co the sinh URL moi.
- May local phai luon bat va terminal tunnel phai con chay.
- Neu muon URL on dinh cho bai nop chinh thuc, nen deploy `dist/` len Cloudflare Pages hoac Vercel.
