---
pubDate: "November 3 2022"
title: "ORM: The Abstraction Dilemma"
description: "And, damn, ORM (and MVC pattern) is so over-engineering"
excerpt: "And, damn, ORM (and MVC pattern) is so over-engineering"
image: "~/assets/images/orm.png"
tags: ['software engineering']
---

Ditahun 2018, sesuatu yang disebut "transformasi digital" sedang naik daun, dari proses digitasi sampai digitalisasi. Masyarakat dari berbagai lapisan berlomba untuk menerapkan teknologi di berbagai aspek, berkat era informasi ini pada pertengahan abad 21 ini.

Penggunaan personal komputer (PC) sudah relatif banyak namun satu hal yang membuat gelembung ini besar adalah satu: internet. Internet salah satunya dapat menghubungkan penjual emping yang misal berada di Banjarnegara dengan pembeli yang berada di Sragen.

Internet memungkinan sesuatu yang sebelumnya tidak mungkin karena terdapat bingkai pemisah yang bernama geografis.

Jika internet diibaratkan sebuah pulau, alamat IP berarti sebuah tanah kosong. Bangunannya adalah sesuatu yang disebut dengan situs, dan tidak jarang satu bangunan dihuni oleh banyak... penghuni.

Setiap bangunan memiliki rancangan yang berbeda-beda, tergantung si *arsitek*. Pada sekitaran tahun 2018, kebanyakan bangunan tersebut memiliki rancangan yang sama: dibangun menggunakan sesuatu bernama HTML, CSS, JavaScript, PHP, dan basis data rasional yang kemungkinan besar MySQL. Dan jenis bangunan tersebut ada dua: statis dan dinamis. Perbedaan utamanya pada dasarnya hanyalah sumber data yang diambil untuk menampilkan sebuah halaman situs: apakah langsung dari kode, atau diambil dari sebuah penyimpanan data.

Umumnya, jika jenis situs yang ingin dibuat berjenis aplikasi, situs tersebut kemungkinan besar bersifat dinamis karena adanya interaksi yang dilakukan oleh pengguna dan aplikasi harus bisa menangani interaksi tersebut. Misal, bila aplikasi tersebut memiliki sistem "autentikasi" untuk dapat mengenali siapa pengguna X dengan tanda pengenal Y di aplikasi tersebut, maka si aplikasi harus menyimpan data Y tersebut.

Data tersebut secara teknis bisa disimpan dimana saja, namun yang paling umum adalah di penyimpanan data yang persisten sehingga aplikasi tidak kehilangan data yang sudah dimasukkan sebelumnya oleh si pengguna ketika misalnya aplikasi tersebut mati.

Penyimpanan data yang persisten tersebut biasa disebut dengan basis data atau database. Tidak banyak pilihan database yang bisa digunakan pada kala itu, namun yang paling populer penggunaannya adalah basis data rasional yang salah satunya adalah [MySQL](https://mariadb.org/about).

Karena MySQL juga pada dasarnya adalah sebuah aplikasi, cara agar membuat aplikasi kita bisa berkomunikasi dengan aplikasi lain adalah melalui sesuatu yang disebut dengan [*Application Programming Interface*](https://en.wikipedia.org/wiki/API) (API). *API* biasa memiliki berbagai lapisan tergantung seberapa banyak detail yang ingin disembunyikan atau yang biasa disebut dengan abstraksi.

Dulu gue pernah ingin menjadi seorang "Fullstack Engineer" dan pekerjaan di Front-End kurang lebih adalah melakukan slicing yang sederhananya adalah tentang mengubah berkas PSD ke HTML, berbeda dengan sekarang yang sepertinya harus mengetahui semua lapisan yang ada di OSI model.

Just kidding.

Di bagian back-end, mereka besar kemungkinan bertanggung jawab akan *business/domain logic* yang sederhananya "mengkodekan" aturan bisnis dunia nyata yang menentukan bagaimana data dapat dibuat, disimpan, dan diubah.

Jika ada kesalahan "logic" yang menyebabkan bisnis rugi 10 milyar karena kegagalan ataupun kesalahan dalam penyimpanan data ke basis data, tidak perlu berpikir lama siapa yang harus disalahkan.

Sekarang kita fokus ke bagian teknis.

Basis data disebut "rasional" salah satunya adalah karena data dipresentasikan dalam bentuk tabel yang mana terdiri dari baris dan kolom. Sistem dari basis data yang rasional ini disebut dengan *Relational Database Management System* (RDBMS) yang maksudnya, bila basis data tersebut menggunakan RDBMS, cara untuk berinteraksi dengan si database ini menggunakan sesuatu bernama *Structured Query Language* (SQL).


Kala itu bahasa pemrograman yang gue gunakan adalah PHP: Hypertext Preprocessor. Alasannya? Tuntutan (educational purpose) dan Pasar. Gue kurang mengerti kenapa PHP populer kala itu, yang gue yakin karena alasan ekosistem yang menjadikan pengembang PHP sebagai warga negara kelas satu seperti munculnya Web Hosting khusus untuk Web Server yang bisa menjalankan kode PHP, Content Management System (CMS) yang dibuat menggunakan PHP, dan yang paling penting dukungan PHP terhadap driver MySQL secara native.

### PHP + MySQL in the nutshell

Untuk membuat aplikasi yang dibuat menggunakan PHP dapat berkomunikasi dengan MySQL, kita perlu menghubungkannya terlebih dahulu, yakni melalui API. PHP menawarkan dua cara (jika gue tidak salah ingat) yakni melalui PDO atau langsung menggunakan *driver* resmi terkait basis data yang digunakan.

Mari kita fokus ke penggunaan *driver* resmi. Dalam penggunaan driver resminya pun terdapat 2 paradigma yang ada: Prosedural dan object-oriented. Karena gue suka ribet, mari kita pilih cara prosedural.

Untuk menghubungkan aplikasi PHP kita ke basis data MySQL, method dari API yang ada yang bisa kita gunakan adalah `mysqli_connect` yang umumnya membutuhkan 3 parameter: hostname, username, dan password. Jika parameter hostname ter-definisi, maka komunikasi dengan MySQL harusnya menggunakan TCP daripada via UNIX socket (IPC).

Kode nya kurang lebih seperti ini:

```php
$conn = mysqli_connect( $hostname, $username, $password );

if ( !$conn ) {
  die( 'connection failed' . mysqli_connect_error() );
}

mysqli_close( $conn );
```

Kita akan menggunakan *variable* `$conn` tersebut untuk memanggil method lain seperti untuk melakukan *query* misalnya dengan memanggil `mysqli_query`. Let's do it, I guess?

```php
$conn = mysqli_connect( $hostname, $username, $password );

if ( !$conn ) {
  die( 'connection failed' . mysqli_connect_error() );
}

$database_list = mysqli_query( $conn, "show databases" );

if ( $database_list ) {
  print_r( $database_list );
}

mysqli_close( $conn );
```

Hasilnya jika memiliki 4 database, kurang lebih seperti ini:

```sql
(
    [current_field] => 0
    [field_count] => 1
    [lengths] =>
    [num_rows] => 4
    [type] => 0
)
```

That's it.

### Very SELECT

Cara untuk menampilkan data menggunakan SQL adalah menggunakan statement `SELECT`. Argumen paling penting dari `SELECT` ini adalah nama table yang ingin diambil dan daftar kolom yang ingin ditampilkan.

Umumnya kita harus mendefinisikan nama kolom yang ingin diambil karena alasan privasi daripada menggunakan `*` yang chaotic-evil sehingga menampilkan data lain yang mungkin tidak kita butuhkan dalam konteks tertentu.

Menggunakan statement `SELECT` di `mysqli_query` tidak terlalu sulit, mungkin seperti ini dengan konteks kita ingin mengambil data di kolom `email` dari table `users`:

```php
$conn = mysqli_connect( $hostname, $username, $password, $dbname );

if ( !$conn ) {
  die( 'connection failed' . mysqli_connect_error() );
}

$users = mysqli_query( $conn, "SELECT email FROM users" );

if ( mysqli_num_rows( $users ) > 0 ) {
  while( $row = mysqli_fetch_assoc( $users ) ) {
    print_r( $row );
  }
}

mysqli_close( $conn );
```

Diatas kita sudah mendefinisikan `$dbname` dan juga kita memanggil `mysqli_num_rows` untuk memastikan bahwa ada data yang bisa kita proses dan juga memanggil `mysqli_fetch_assoc` untuk menyimpan hasil *query* yang kita lakukan sebagai *associative* array.

Hasilnya kurang lebih seperti ini:

```shell
Array
(
    [email] => anggun@acme.inc
)
Array
(
    [email] => kiko@enak.tau
)
Array
(
    [email] => krido@hey.io 
)
```

Sekarang kita ke bagian yang menarik, bagaimana kita ingin mengambil data untuk user `anggun@acme.inc` saja? Kita bisa menambahkan `WHERE` didalam sintaks SQL kita sebelumnya!

Tapi sedikit lucu jika menggunakan kolom `email` sebagai kunci utama. Biasanya kolom yang digunakan sebagai kunci utama adalah `id` dengan tipe data integer agar bisa di *auto increment* sehingga data yang disimpan bisa dijamin unik.

Berarti sekarang mari kita ambil data `email` berdasarkan `id` dari si `users` tersebut!

```php
$conn = mysqli_connect( $hostname, $username, $password, $dbname );

if ( !$conn ) {
  die( 'connection failed' . mysqli_connect_error() );
}

$user_id = 1337;
$user = mysqli_query( $conn, "SELECT email FROM users where id = $user_id" );

if ( mysqli_num_rows( $user ) > 0 ) {
  while( $row = mysqli_fetch_assoc( $user ) ) {
    print_r( $row );
  }
}

mysqli_close( $conn );
```

Dan hasilnya kurang lebih seperti ini:

```shell
Array
(
    [email] => anggun@acme.inc
)
```

Very ez. Tapi nilai `$user_id` diatas masih statis, harusnya dinamis entah diambil dari `$_GET`, `$_POST` atau bahkan `$_COOKIE`.

Anggap kita ambil dari *cookie* dengan *key* bernama `user_id` karena jika menggunakan *query parameter* terlalu jelas. Kode nya seperti ini:

```php
$conn = mysqli_connect( $hostname, $username, $password, $dbname );

if ( !$conn ) {
  die( 'connection failed' . mysqli_connect_error() );
}

if ( !isset( $_COOKIE[ 'user_id' ] ) ) {
  die( 'no user_id' );
}

$user_id = $_COOKIE[ 'user_id' ];
$user = mysqli_query( $conn, "SELECT email FROM users where id = $user_id" );

if ( mysqli_num_rows( $user ) > 0 ) {
  while( $row = mysqli_fetch_assoc( $user ) ) {
    print_r( $row );
  }
}

mysqli_close( $conn );
```

Jika nilai `$_COOKIE['user_id']` adalah `1337`, maka hasilnya kurang lebih sama seperti yang sebelumnya.

Bagaimana bila nilainya adalah `1337 or 1 = 1`?

You guessed it right.

(and yes, $_SESSION and/or JWT exist for a reason — just in case)

### Abstractions

Meskipun sintaks SQL bersifat deklaratif, jurangnya justru ada di API nya. Ya, PHP memiliki PDO tapi bahasa pemrograman bukan hanya PHP di dunia ini.

Jika kita melihat cuplikan kode diatas, kita bisa membuat abstraksi seperti untuk:

- membuat koneksi dan menutupnya
- menangani data yang didapat dari input pengguna
- menangani ketika data yang diminta tidak ada
- memberikan ketika data yang diminta ada

...terlepas bahasa pemrograman ataupun basis data yang digunakan.

Pseudocode nya mungkin seperti ini:

```php
$db = new DB( $ENV[ 'DB' ] );

if ( !isset( $_COOKIE[ 'user_id' ] ) ) {
  die( 'no user_id' );
}

$user = $db->select(
  'users',
  array( 'email' ),
  array( 'id' => $_COOKIE[ 'user_id' ] )
);

print_r( $user );
```

Yes, kita bisa buat abstraksi lagi untuk terus menutupi aib yang ada di kode kita yang mungkin menjadi seperti ini:

```php
if ( ! isset( $_COOKIE[ 'user_id' ] ) ) {
  die( 'no user_id' );
}

$user = User::find( $_COOKIE[ 'user_id' ], array( 'email' ) );

print_r( $user );
```

Dan, ya, mungkin kamu sedikit familiar dengan sintaks diatas.

### The abstraction dilemma

Bangun tidur cek Twitter ada unpopular opinion tentang *ORMs are often overused*. Meskipun gue seringnya cuman tertarik bahas unpopular opinion tentang buna raven, but I can't stand this one.

Yes man, ORMs are often overused. We can literally put a very raw SQL queries on something like `/sql.php?query=select * from users --because why not` dan sanitization berada di level reverse proxy or something ataupun bisa pakai GraphQL biar lebih gaya.

Tapi sebelum kita julidin ORM, mari kita bahas sedikit apa itu ORM.

### Object-relational Mapping (ORM)

ORM singkatnya adalah sebuah teknik untuk melakukan query dan memanipulasi data dari sebuah database menggunakan paradigma berorientasi objek.

Seperti, untuk memanggil `SELECT email FROM users where id = 1337` kita bisa hanya dengan memanggil method `find` dari instance `User` misalnya seperti `User::find( 1337, [ 'email' ] )` dan hasilnya terserah ingin kita apa kan.

Yang membedakan ORM dengan *"query builder"* pada dasarnya hanyalah level abstraksi alias API yang ditawarkan, seperti mungkin kita bisa menggunakan `$db->select( 'users', [ 'email' ], [ 'id' => 1337 ] )` yang misalnya karena kita tidak percaya dengan apa yang dilakukan oleh method `find`. Tapi ORM ada bukan karena tanpa alasan, fitur umum yang dijual oleh ORM salah duanya adalah "association" dan "hooks".

Dengan *query builder* tentu kita bisa melakukan ini:

```php
$db->transaction(
  function( $db ) {
    $db->insert(
      'addresses',
      array( 'address' => 'Jl. Dipayuda' )
    );

    $address_id = $db->id();

    $db->insert(
      'shipping_address',
      array( 'address' => 'Jl. Mayjend Panjaitan No.69' )
    );

    $shipping_address_id = $db->id();

    $db->insert(
      'users',
      array(
        'name' => 'krido',
        'address_id' => $address_id,
        'shipping_address_id' => $shipping_address_id
      )
    );
  }
);

$db->commit();
```

Dengan ORM, mungkin bisa seperti ini:

```php
DB::transaction( function() {
  $address = new Address(
    array( 'address' => 'Jl. Dipayuda' )
  );

  $shipping_address = new ShippingAddress(
    array( 'address' => 'Jl. Mayjend Panjaitan No.69' )
  );

  $user = User::find( 69 );

  $user->address()->save( $address );
  $user->shipping_address()->save( $shipping_address );
} );
```

Atau contoh hooks, dengan query builder mungkin kita bisa saja melakukan seperti ini:

```php
$db->transaction(
  function( $db ) {
    $db->delete(
      'users',
      array( 'user_id' => 1337 )
    );

    $db->delete(
      'logs',
      array( 'user_id' => 1337 )
    );
  }
);

$db->commit();
```

Dengan ORM, mungkin bisa seperti ini:

```php
self::deleting( function( $user ) {
  $user->logs()->each( function ( $log ) {
    $log->delete();
  } );
} );
```

Ya mungkin tidak sesederhana diatas, tapi semoga mendapat gambarannya.

### Testing

Misal ada kasus: *Ambil data artikel yang memiliki id 10*, bagaimana kita menulis test untuk skenario diatas?

Kita pasti harus mengsimulasikan basis data yang ada karena tidak mungkin bila menggunakan basis data beneran. Berdasarkan contoh diatas, untuk menandakan bahwa artikel yang diambil adalah yang memiliki id 10 dan bukan 6969, misal pseudocode nya seperti ini:

```php
function get_article_by_id( $article_id ) {
  // ... query to db
  return $article;
}
```

Dengan query builder, kemungkinan besar untuk mengetahui apakah yang kita query tersebut "benar" adalah dengan melakukan pencocokan dengan raw query nya, misalnya seperti ini:

```php
$query = $article->get_article_by_id( 10 )->queryString;
assert(
  $query,
  "SELECT id, title, content FROM articles WHERE id = 10"
);
```

Dengan ORM, kita bisa melakukannya misal seperti ini:

```php
$article = Article::find( 10 );

assert(
  $article->id,
  10
);
```

Karena dengan ORM kita bisa melakukan seeding data dengan mudah dan hal yang perlu kita gunakan untuk berinteraksi dengan basis data adalah sesuatu bernama "model".

### 'The abstraction dilemma' dilemma

Sekarang begini, pada akhirnya, kita—sebagai pengembang—pun akan membuat abstraksi.

Ingin support driver berbeda agar ketika menggunakan SQLite dan MySQL bisa menggunakan API yang sama di aplikasi kita? Cute, maybe let's write our own driver compatibility layer.

Ingin mengatur connection pooling terhadap database yang kita gunakan? Sweet, let's write one too!

What if we want to use MVC but still want to say fuck you to ORM? Writing models is cheap, let's write our own FactoryModel base class!

Also, input sanitization.

And parameter interpolation might sound sexy too!

Gue mendingan nulis library gue sendiri (dan nulis test + dokumentasi + maintain + fix bug + rilis + update deps) daripada harus menarik barang random dari internet yang berukuran 291kB hanya untuk sesuatu bernama ORM ini (plus harus mengingat API yang ada di docs yang enggak banget buat level gue).

And, damn, ORM (and MVC pattern) is so over-engineering. Apa susahnya coba pas pengguna klik tombol login, kirim `SELECT email, password FROM users WHERE email = (email_input) and password = bcrypt(sha256(md5((password_input))), (very_salt))` mungkin di payload POST, proses whatever yang didapat dari response backend, and that's that.

Data pengguna yang ada di basis data kita kan milik pengguna juga, dengan bantuan "row-level security" mungkin harusnya oke oke aja klo interface yang digunakan user adalah SQL editor (atau bisa stream SQL query via netcat or something).

Dan hey, sekarang 2022 dan RDBMS itu terlalu kuno. Kita punya firebase, supabase, fauna, mongodb, couchdb, anything yang mana memiliki nice API dan very serverless.

Oh, kita juga ada Ethereum Blockchain sekarang.

Pengetahuan tentang ORM lo akan kadaluarsa karena web3 is the future, database scaling for internet-scale is hard (good luck in using vitess & cockroachdb) and the future is now.

### Penutup

Gue mengerti maksud dan tujuan menghindari ORM adalah untuk menghindari overhead (yang mungkin tidak seberapa) dan yang paling penting agar siapapun ingin melihat ke lower-level view dengan menulis sintaks raw SQL agar siapaun tahu apa yang dia lakukan mungkin untuk mencegah "script kiddies problem".

Dan, ya, ORM is overused. Hampir setiap framework dari mirco sampai macro pasti menawarkan ORM sekalipun mungkin kita tidak membutuhkannya.

Dari pengalaman gue yang pernah menulis raw SQL query, menggunakan query builder, sampai ke penggunaan ORM, yang paling cocok dengan gue adalah tidak berinteraksi dengan basis data sama sekali.

That's why I'm here, as a Frontend Engineer.

Just kidding.

JIKA GUE HANYA MEMENTINGKAN EGO, GUE LEBIH SUKA QUERY BUILDER. JARI GUE PEGEL HARUS NAHAN SHIFT TIAP KALI NGETIK SELECT, FROM, ORDER BY, WHERE, JOIN, BLABLABLA SEKALIPUN TIDAK WAJIB DITULIS DENGAN FORMAT UPPERCASE (SEPERTI YANG ADA DI BAGIAN LIMITATIONS DI MIT LICENSE) SEPERTI INI DAN JUGA GUE MALES BUKA DOKUMENTASI BUAT MENGINGAT API APA AJA YANG BISA DIGUNAKAN DI ORM YANG GUE GUNAKAN.

TAPI MENULIS KODE (ATAU LEBIH SPESIFIKNYA MENGEMBANGKAN APLIKASI) ADALAH SEBUAH KERJA SAMA TIM. KITA TIDAK BISA MEMAKSA ORANG LAIN UNTUK MENYESUAIKAN DENGAN SELERA KITA APALAGI SAMPAI MENJADI BAGIAN DARI "ENGINEERING CULTURE" HANYA KARENA GUE LEAD DI ORGANISASI TERSEBUT, MISALNYA.

GUE SEDANG TIDAK TERIAK BY THE WAY.

SEBAGAI PENUTUP, UNTUK PERTANYAAN TO ORM OR NOT TO, JAWABANNYA ADALAH ✨TERGANTUNG✨.

SEKIAN.
