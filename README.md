# Kütüphane Yönetim Sistemi API

Bu proje, bir kütüphane yönetim sisteminin backend API'sini içerir.

## Özellikler

- Kullanıcı yönetimi (kayıt, giriş, şifre sıfırlama)
- Kitap yönetimi (ekleme, silme, güncelleme, arama)
- Ödünç alma/iade işlemleri
- Kategori yönetimi
- Yazar yönetimi
- E-posta bildirimleri

## Kurulum

1. Gerekli paketleri yükleyin:
```bash
npm install
```

2. `.env` dosyasını oluşturun ve gerekli değişkenleri ayarlayın:
```
DATABASE_URL="postgresql://kullanici:sifre@localhost:5432/kutuphane"
JWT_SECRET="gizli_anahtariniz"
PORT=3000
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-specific-password"
FRONTEND_URL="http://localhost:3000"
```

3. Veritabanını oluşturun:
```bash
npx prisma migrate dev
```

4. Uygulamayı başlatın:
```bash
npm start
```

## API Endpoints

### Kullanıcı İşlemleri
- POST /api/auth/register - Kullanıcı kaydı
- POST /api/auth/login - Kullanıcı girişi
- POST /api/auth/forgot-password - Şifre sıfırlama isteği
- POST /api/auth/reset-password - Şifre sıfırlama

### Kitap İşlemleri
- GET /api/books - Tüm kitapları listele
- GET /api/books/:id - Kitap detayı
- POST /api/books - Yeni kitap ekle
- PUT /api/books/:id - Kitap güncelle
- DELETE /api/books/:id - Kitap sil
- GET /api/books/search - Kitap arama

### Ödünç İşlemleri
- POST /api/borrow - Kitap ödünç al
- POST /api/borrow/:id/return - Kitap iade et
- GET /api/borrow/overdue - Gecikmiş ödünçler

## Teknolojiler

- Node.js
- Express.js
- Prisma
- PostgreSQL
- JWT
- Nodemailer
