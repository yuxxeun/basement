#!/bin/bash

read -p "Masukkan judul post: " judul

judul_tanpa_dash=$(echo $judul | sed 's/\(.*[^-]\)-$/\1/')

nama_file=$(echo $judul_tanpa_dash | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g').md

direktori_tujuan="data/blog/"

mkdir -p $direktori_tujuan

echo "---" > $direktori_tujuan/$nama_file
echo "pubDate: $(date +'%Y-%m-%d')" >> $direktori_tujuan/$nama_file
echo "title: $judul_tanpa_dash" >> $direktori_tujuan/$nama_file
echo "description: " >> $direktori_tujuan/$nama_file
echo "excerpt: " >> $direktori_tujuan/$nama_file
echo "image: \"~/assets/images\"" >> $direktori_tujuan/$nama_file
echo "tags: []" >> $direktori_tujuan/$nama_file
echo "---" >> $direktori_tujuan/$nama_file
echo "" >> $direktori_tujuan/$nama_file

echo "Post dengan judul '$judul_tanpa_dash' telah berhasil dibuat pada file '$direktori_tujuan/$nama_file'."