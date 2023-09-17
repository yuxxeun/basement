---
pubDate: "July 01 2022"
title: "Konfigurasi Text Editor Sejuta Umat"
description: "Visual Studio by default kinda sucks."
excerpt: "Visual Studio by default kinda sucks."
image: "~/assets/images/editor.jpg"
tags: [ideas]
---

Sebagai seseorang yang (kadang) suka menulis kode atau program random, gue rasa _text editor_ adalah salah satu dari sekian banyak perangkat lunak yang wajib gue punya dan pasang.

Belakangan ini gue sedang senang menggunakan text editor sejuta umat alias ehm **_[Visual Studio Code](https://visualstudio.microsoft.com/)_** (untuk mempermudah dalam penulisan alias gue males ngetik panjang x lebar, kedepannya kita singkat aja jadi **VScode**), sayangnya tampilan si VScode _by default_ sedikit berantakan dan _kinda boring i guess_.

![VScode by default](https://cdn.hashnode.com/res/hashnode/image/upload/v1627976927817/Nh-DzrwzD.png?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp) <center>_Visual Studio Code by default_</center>

Maka dari itu gue mencoba untuk membuatnya sedikit bersih dan _aesthetic_.

## Tema

Perubahan gue mulai dari tema, karena ini sangat mencolok perubahannya dan sangat mempengaruhi kenyamanan dalam menulis sebuah program (dibaca: kode). Saat ini gue menggunakan tema **_[Tokyo Night](https://marketplace.visualstudio.com/items?itemName=enkia.tokyo-night)_**.

## Font

Sekarang pindah ke font, gue rasa kegiatan menulis kode akan terasa membosankan apabila harus berhadapan dengan font `Comic Sans`, untuk itu gue mamakai `Cascadia Code` yang bisa lo unduh [di sini](https://github.com/microsoft/cascadia-code/releases). Jika dirasa gue bosan dengan si Cascadia, gue memiliki alternatif lain, seperti:

- [JetBrains Mono](https://www.jetbrains.com/lp/mono/)
- [Fira Code](https://github.com/tonsky/FiraCode)
- dan [Space Mono](https://fonts.google.com/specimen/Space+Mono)

dengan `"editor.fontLigatures": true` yang bisa lo _enable_ di file `settings.json`.

## Ikon

Ikon yang gue pakai yaitu [Viking Icon Theme](https://marketplace.visualstudio.com/items?itemName=willi84.vikings-icon-theme), alasan gue memilih ikon ini... ga ada sih lucu aja ehe.

## Settings.json

Oke, sekarang masuk ke setting (MacOs: `cmd` + `,` & Windows / Linux: `ctrl` + `,`), perubahan yang gue lakukan di sini lumayan banyak dan ini juga yang membuat VScode gue terlihat lebih bersih (dan _aesthetic_) lagi.

```json
{
  "workbench.editor.showTabs": false,
  "blade.format.enable": false,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.formatOnSave": true,
  "workbench.activityBar.visible": false,
  "workbench.statusBar.visible": false,
  "workbench.iconTheme": "vikings-icon-theme",
  "workbench.colorTheme": "Tokyo Night",
  "search.mode": "reuseEditor",
  "editor.fontSize": 15,
  "editor.fontFamily": "Cascadia Code, JetBrains Mono, Fira Code, Space Mono",
  "editor.fontLigatures": true,
  "editor.renderLineHighlight": "none",
  "editor.matchBrackets": "never",
  "editor.occurrencesHighlight": false,
  "editor.renderIndentGuides": false,
  "editor.minimap.enabled": false,
  "breadcrumbs.enabled": false,
  "editor.renderWhitespace": "none",
  "editor.lineHeight": 29,
  "bracketPairColorizer.showVerticalScopeLine": false,
  "editor.tokenColorCustomizations": null,
  "vikings-icon-theme.folders.color": "#fff",
  "window.menuBarVisibility": "compact",
  "vikings-icon-theme.opacity": 1,
  "workbench.startupEditor": "none",
  "kite.showWelcomeNotificationOnStartup": false,
  "files.autoSave": "onWindowChange",
  "terminal.integrated.fontFamily": "JetBrains Mono",
  "javascript.updateImportsOnFileMove.enabled": "never",
  "explorer.confirmDelete": false,
  "editor.smoothScrolling": true,
  "svelte.enable-ts-plugin": true
}
```

Sejauh ini hasil yang gue dapatkan seperti ini:

![Look mom, this is my Visual Studio Code with aestethic look](https://cdn.hashnode.com/res/hashnode/image/upload/v1627978307797/JwvBchRyX.png?auto=compress,format&format=webp) <center>_Look mom, this is my Visual Studio Code with aesthetic look_</center>

Terlihat cukup bersih lah ya daripada yang disajikan oleh VScode _by default_.
