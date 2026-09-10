# JobFair DISNAKER Kabupaten Sumenep — Prototype v1.0

Aplikasi web prototype tanpa framework/dependency sehingga dapat langsung dijalankan.

## Login administrator demo
- Email: `admin@disnakersumenep.go.id`
- Password: `Admin@123`

## Cara menjalankan
### Cara paling mudah
Klik dua kali `index.html` dan buka di browser modern.

### Dengan local web server
Jika Python tersedia:
```bash
python -m http.server 8080
```
Lalu buka http://localhost:8080

## Modul yang tersedia
- Landing page publik
- Login administrator
- Dashboard statistik
- Database pencari kerja
- Database perusahaan
- Database lowongan
- Search/filter data
- Detail data
- Ekspor CSV
- Responsive desktop/mobile

## Catatan keamanan
Login v1.0 adalah login DEMO di sisi frontend. Username/password dapat terlihat di source dan TIDAK boleh digunakan sebagai pola autentikasi produksi.

Untuk produksi, pindahkan autentikasi dan seluruh database ke backend (misalnya Supabase/PostgreSQL) dengan:
- hash password / Auth provider
- Role Based Access Control
- Row Level Security
- audit log
- server-side validation
- penyimpanan CV/berkas yang private
- backup database
