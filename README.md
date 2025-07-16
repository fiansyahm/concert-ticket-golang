# Sistem Pemesanan Tiket Konser

Proyek ini adalah sistem pemesanan tiket konser, yang terdiri dari beberapa layanan mikroservice (ditulis dalam Go) dan aplikasi frontend berbasis React.

## Struktur Proyek

-   `booking-service/`: Menangani logika pemesanan konser dan tiket.
-   `payment-service/`: Mengelola proses pembayaran.
-   `user-service/`: Mengelola otentikasi pengguna dan profil.
-   `frontend/`: Aplikasi satu halaman React untuk interaksi pengguna.

## Prasyarat

Sebelum menjalankan aplikasi, pastikan telah menginstal yang berikut:

-   **Go**: Versi 1.18 atau lebih tinggi (atau versi yang ditentukan dalam file `go.mod`).
-   **Node.js**: Versi 14 atau lebih tinggi.
-   **npm** atau **Yarn**: Manajer paket untuk frontend.

## Pengaturan

1.  **Kloning repositori:**
    ```bash
    git clone https://github.com/fiansyahm/concert-ticket-golang.git
    cd concert-ticket-golang
    ```

2.  **Pengaturan Layanan Backend:**
    Setiap layanan memiliki file `go.mod` dan `go.sum` sendiri. perlu masuk ke setiap direktori layanan untuk menginstal dependensi.

    Untuk setiap layanan (`booking-service`, `payment-service`, `user-service`):
    ```bash
    cd booking-service # atau payment-service, user-service
    go mod tidy
    cd ..
    ```
    *(Ulangi untuk ketiga direktori layanan)*

    **Variabel Lingkungan:**
    Setiap layanan menggunakan file `.env` untuk konfigurasi. Salin file `.env.example` ke `.env` di setiap direktori layanan dan konfigurasikan sesuai kebutuhan.

    ```bash
    cp booking-service/.env.example booking-service/.env
    cp payment-service/.env.example payment-service/.env
    cp user-service/.env.example user-service/.env
    ```
 mungkin perlu menyesuaikan nomor port atau pengaturan lain di file `.env` ini.

3.  **Pengaturan Frontend:**
    Navigasi ke direktori `frontend` dan instal dependensi Node.js.

    ```bash
    cd frontend
    npm install # atau yarn install
    cd ..
    ```

## Menjalankan Aplikasi

### 1. Mulai Layanan Backend

Buka tiga jendela/tab terminal terpisah untuk layanan backend.

**Terminal 1: Layanan Pengguna (User Service)**
```bash
cd user-service
go run main.go
```

**Terminal 2: Layanan Pemesanan (Booking Service)**
```bash
cd booking-service
go run main.go
```

**Terminal 3: Layanan Pembayaran (Payment Service)**
```bash
cd payment-service
go run main.go
```

Setiap layanan biasanya akan mencatat alamat mendengarkannya (misalnya, `Listening on :8080`).

### 2. Mulai Aplikasi Frontend

Buka jendela/tab terminal baru untuk frontend.

**Terminal 4: Frontend**
```bash
cd frontend
npm run dev # atau yarn dev
```

Ini akan memulai server pengembangan React, biasanya di `http://localhost:5173` (atau port lain jika dikonfigurasi di `vite.config.js`). Buka URL ini di browser web untuk mengakses aplikasi.

## File Basis Data

Setiap layanan menggunakan file basis data MySql (misalnya, `booking.db`, `payment.db`, `user.db`). File-file ini akan dibuat di direktori layanan masing-masing (atau direktori root jika dikonfigurasi demikian) saat layanan berjalan untuk pertama kalinya. dapat memeriksa file-file ini menggunakan peramban MySql jika diperlukan.

---