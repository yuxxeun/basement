---
pubDate: "June 17 2022"
title: "Fear. Uncertainty. Doubt."
description: "As title said."
excerpt: "Setidaknya ada 3 hal yang manusia benci baik sadar maupun tidak sadar."
image: "~/assets/images/gradient.jpg"
tags: [life]
---

Setidaknya ada 3 hal yang manusia benci baik sadar maupun tidak sadar.

3 hal tersebut ialah:

- Ketakutan
- Ketidakpastian
- Keraguan

_Generally speaking_, bukan tanpa alasan mengapa terkadang kita berdoa sebelum melakukan perjalanan; menyisihkan uang gaji untuk ber-investasi, membayar lebih demi garansi, ataupun berlangganan pada salah satu produk asuransi.

Semata-mata untuk melawan 3 hal diatas yang hasilnya membuahkan ketenangan, baik hanya untuk sementara ataupun selama mungkin. Gue pribadi melakukan hal serupa, beribadah sebisa mungkin; membuat anggaran dari uang gaji untuk menabung & ber-investasi (still not sure if it's a _different thing_).

Yang tujuannya untuk setidaknya mengurangi ketakutan, ketidakpastian, dan keraguan yang gue miliki dalam hidup.

Dari 3 hal diatas, yang paling gue benci adalah **ketidakpastian**.

Manusia selalu dihantui ketidakpastian dari bangun tidur sampai akan tertidur lagi nanti. Apa yang akan terjadi pada hari ini? Apa yang akan terjadi besok? Apakah besok gue masih bangun diatas ranjang atau di alam kubur? Akan ada masalah apa lagi pada hari ini?

Bagaimanapun ketidakpastian adalah sesuatu yang tidak bisa dihindari, dan biasanya satu hal yang bisa gue lakukan untuk menghadapinya adalah dengan membiasakan. Karena sekali lagi, ada sesuatu yang bisa dan tidak bisa kita kontrol, maka apa lagi yang bisa kita lakukan selain pasrah setelah mempersiapkan & berusaha semaksimal mungkin?

Kembali ke topik FUD, dalam dunia _InfoSec_ topik ini lumayan laris khususnya ketika menanggapi orang-orang yang termakan akan hal itu khususnya oleh penyedia layanan "VPN komersil" yang selalu menyerukan bahwa jaringan internet kita tidak pribadi dan seseorang sedang menguntit kita.

Meskipun di lain sisi hal diatas sedikit benar, tapi ada satu hal yang jarang sekali orang awam seperti kita perhatikan: **_Threat model_**.

Misal bayangkan begini, lo naik motor malam-malam sendirian di suatu jalan random. Ada satu motor dengan dua penumpang yang mengikuti lo di belakang, lalu apa yang lo pikirkan dan yang paling penting apa yang bakal lo lakukan?

Banyak kemungkinan yang bisa dipilih: Menyamakan kecepatan lalu menendangnya dari samping, berhenti dan memastikan bahwa mereka tidak mengikuti, ataupun tetap santai dan menganggap tidak ada yang salah.

Apapun tindakan yang lo pilih, setidaknya lo sudah memikirkannya.

Sekarang begini, bagaimana bila mereka memang mengikuti namun dengan maksud baik seperti menemani? Atau mereka pun ternyata merasakan hal yang sama dengan lo? Atau yang memang orang random aja yang lagi jalan-jalan malam?

Atau bagaimana jika mereka memang gangster?

Setelah memikirkannya kemungkinan-kemungkinan yang ada, baru lo memikirkan kemungkinan-kemungkinan apa yang akan terjadi bila hal diatas... terjadi.

Sekarang begini, mengapa orang menabung? Misal, untuk persiapan di masa depan. Lalu bila ada pertanyaan lanjutan yang sekiranya menimbulkan keraguan terhadap kita seperti: <i>"Bagaimana bila ternyata besok kiamat? Bagaimana bila kita tidak akan pernah menikmati tabungan tersebut? Bagaimana bila hari ini adalah kesempatan terakhir kita untuk hidup?"</i>, dsb.

Pada dasarnya dalam threat modeling ada 4 pertanyaan yang harus bisa dijawab:

1. Apa yang kita lakukan?
2. Apa yang sekiranya salah?
3. Apa yang akan kita lakukan jika suatu hal terjadi?
4. Apakah yang kita lakukan sudah baik?

Kita ambil konteks dalam aktivitas menabung, jadi, mari kita jawab 4 pertanyaan diatas:

1. Menggunakan dana dari tabungan untuk dana darurat
2. Tidak menganggarkan uang darurat juga, mungkin?
3. Mengambil dana yang ada di tabungan sebagai dana darurat
4. Kurang efektif, harusnya dana darurat berada di anggaran terpisah sehingga tidak mempengaruhi tujuan dari aktivitas menabung tersebut

Poin nomor empat diatas terasa sedikit negatif, mari kita buat _counterpart-nya_ untuk yang sedikit positif: 4. Kurang efektif tapi lumayan efisien, karena masih ada kebutuhan primer lain dan sedangkan prioritas dalam tujuan dari menabung tersebut tidak sepenting apa yang harus dilakukan dengan kebutuhan dana darurat yang dibutuhkan.

Idk, apakah ini relevan atau tidak dengan Threat Modeling yang ada di dunia InfoSec, sejauh yang gue pahami kira-kira seperti itu. Jawaban-jawaban yang ada bersifat relatif dan disesuaikan dengan keadaan masing-masing.

## Vulnerability

Dalam agama islam, beribadah—khususnya solat—adalah sebuah kewajiban selama 5 waktu dalam ~24jam. Jawaban dari pertanyaan **_"mengapa solat?"_** sangat beragam, dari yang tujuan ibadah secara harfiah seperti _"untuk mengingat tuhan"_ sampai ke jawaban klasik seperti _"untuk mendapatkan pahala dan terhindar dari dosa"_.

Dalam sebuah sistem, ada sebuah konsep bernama "vulnerability" yang tujuannya untuk melakukan exploit. Vulnerability (kerentanan) ini adalah sebuah celah keamanan, dan karena adanya kerentanan tersebut tujuannya dari si penyerang adalah untuk memanfaatkan agar bisa melakukan "eksploitasi" dengan "payload" yang benar.

Mari kita ambil contoh dari para penyedia layanan VPN komersil yang memasarkan produk mereka. Apa yang mereka gunakan sebagai bahan utama dalam pemasaran? Ancaman. Seruan bahwa privasi di dunia digital kita sedang terancam, dan menggunakan VPN mereka adalah bentuk perlawanannya.

Bagi yang masih sedikit awam khususnya dalam topik privasi; industri periklanan, data mining, dsb, besar kemungkinan iklan tersebut efektif. Siapa juga yang tidak tenang bila aktivitas ber-internet kita diawasi oleh "pihak ketiga" yang tertarik untuk mengolah data dari aktivitas kita tersebut?

Siapa juga yang tidak tenang bila ada seorang "hacker" yang berada di jaringan kita dan menguntit (ataupun memodifikasi) data (alias paket internet) yang kita kirim dan terima?

Dan siapa juga yang tidak risih ketika kita sedang mencari tentang "budget nikah" lalu tidak lama kemudian kita mendapatkan promosi terkait hotel murah di Jogja yang cocok untuk ber-bulan madu?

Ketakutan dan ketidakpastian adalah hal yang paling laku dijual kepada manusia. Dari promo (hanya minggu ini!), cashback (kapan lagi ya ga?), jaminan (momen bagaimana jika...), dsb adalah hal yang lumrah kita lihat & rasakan pada hari ini.
Dan ketika sudah berada di titik keraguan, di sinilah eksploitasi bisa mulai dilakukan ketika kita sudah merasa rentan. Dengan "payload" yang pas, maka akan mendapatkan throughput yang diharapkan.

Yang diuntungkan? entahlah.

FUD menjadi alat menyerang yang efektif karena tidak ada satupun yang bisa melihat masa depan.

Dan setidaknya, kita mendapatkan "ketenangan" karena keraguan tersebut mungkin sudah tidak dirasakan lagi kehadirannya.

Yang berarti kita sebisa mungkin meyakinkan bahwa yang diuntungkan adalah kita, yang mungkin tanpa memikirkan jawaban akan 4 pertanyaan yang pernah disinggung.

## Penutup

Tentu saja maksud dan tujuan gue menulis tentang FUD disini topik utamanya bukanlah tentang membahas seputar layanan VPN komersil, InfoSec, bagaimana hacker melakukan hacking, atau apapun itu yang terlihat keren dan pintar.

Somehow terkadang gue merasa lelah dengan ketidakpastian.

Sampai kapan hidup gue akan terus begini?

Akan menjadi apa gue pada 5 tahun kedepan nanti?

Apakah gue masih akan bisa merasakan sesuatu yang bernama kebahagiaan (<i>in a literally way</i>)?

Apakah suatu saat gue dapat mengerti arti dari cinta secara harfiah dan bukan sebatas kiasan semata?

Apakah gue suatu saat nanti akan wisuda?

Kapan nikah?

Kapan punya anak?

Kapan manusia dapat melihat bentuk asli bumi sehingga tidak ada lagi kubu bumi bulat dan datar?

Kapan naik gaji lagi???? (ini bercanda tapi kalau mau diseriusin juga boleh. Karena hampir semua orang suka dengan uang yang banyak, benar?)

Apakah surga dan neraka itu ada?

Apakah ketika gue tidur sekarang gue akan terbangun lagi?

Apakah kalau gue beli Mac Mini tahun ini di tahun depan nanti Apple mengeluarkan Mac Mini dengan chip M1 Pro dengan harga yang tidak beda jauh?

Dan masih banyak lagi ketidakpastian lainnya.

Oke oke, sekarang kita kembali ke konteks yang sebenarnya.

Biasalah, kehidupan pribadi.

Tidak sedikit yang menaruh kepercayaan kepada gue.

Dari orang tua khususnya sebagai anak laki-laki satu-satunya, tauladan sebagai kakak, pekerjaan sebagai karyawan, hubungan sebagai pacar, pertemanan sebagai sahabat, muslim sebagai umatnya, dsb.

Tentu saja gue tidak pernah meminta untuk mereka melakukan itu, terlebih karena kepercayaan itu seharusnya didapat bukan diminta.

Dan apalagi yang bisa gue lakukan selain berusaha semaksimal mungkin dan meyakinkan mereka—baik langsung ataupun tidak langsung—bahwa mereka tidak menaruh kepercayaan kepada orang yang salah?

Tapi sekali lagi, bagaimana bila gue ternyata mengecewakan mereka? Bagaimana bila usaha gue tidak semaksimal itu? Bagaimana bila ternyata hasil yang didapat tidak sesuai dengan harapan gue? Dan masih banyak lagi pertanyaan yang dimulai dengan **"bagaimana"**.

Gue belum mengetahui jawabannya sampai gue mengetik ini.

Jika sebelumnya gue hanya bisa pasrah terkait apa yang terjadi khususnya terhadap apa yang tidak bisa gue kontrol, setidaknya sekarang gue bisa mengetahui jawaban yang bisa membuat gue tenang: mengetahui jawaban dari 4 pertanyaan sialan dalam threat modeling, untuk setiap hal yang sedang gue hadapi.

Karena setiap manusia pasti memiliki kerentanan, dan celah yang paling rentan adalah di ketakutan, ketidakpastian, dan keraguan.

Dan gue sudah merasa lelah selalu dihantui 3 hal tersebut sehingga seringkali hari-hari gue selalu diselimuti dengan ketidaktenangan.

Dan mengetahui jawabannya, somehow memberikan ketenangan.

Tanpa perlu melakukan pelarian dengan menegak minuman ber-alkohol dengan tidak _responsibly_, tanpa perlu berpura-pura semuanya baik-baik saja dengan membohongi diri sendiri, tanpa perlu meditasi yang tidak menyelesaikan permasalahan utama.

Cukup dengan mengetahui 4 jawaban terkait pertanyaan-pertanyaan yang ada.
Dan untuk bagian apakah jawabannya nanti sesuai dengan yang diinginkan atau tidak, itu urusan lain.

Karena yang terjadi, terjadilah.

**P.S: I'm pretty sure i'm sober as i wrote this. But if you feel otherwise, I'm sorry and take this post as just my conversation with my mind because my only enemies are my ego and myself (and javascript too maybe)**.
