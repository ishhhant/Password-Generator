# 🛡️ SecureVault - Password Generator & Secure Vault  

> A **privacy-first password manager** with **client-side encryption**, built using **Next.js**, **MongoDB**, and **TypeScript**.  

---

## ✨ Features  

- 🔐 **Strong Password Generator** – Customizable length, character types, and exclude look-alike characters  
- 🧩 **Client-Side Encryption** – AES-GCM encryption ensures your passwords are encrypted before storage  
- 💾 **Secure Vault** – Save passwords with title, username, URL, and notes  
- 🔍 **Search & Filter** – Quickly find saved passwords  
- 📋 **Copy to Clipboard** – Auto-clears clipboard after 15 seconds  
- 🕵️ **Privacy First** – Server never sees your plaintext passwords  

---

## 🖼️ Preview  

### 🏠 Landing Page  
 ![image alt](https://github.com/ishhhant/Password-Generator/blob/a5971c8906bc5d3ff5056cc8600fb325da8102c3/public/Screenshot%202025-10-05%20135615.jpg)

### 🔑 Enter Master Password  
 ![image alt](https://github.com/ishhhant/Password-Generator/blob/8e6aedd7e6a9297927b456bbbd84c3e7292d8598/public/Screenshot%202025-10-05%20164942.jpg
)


### 🔐 Password Generator  

 ![image alt](https://github.com/ishhhant/Password-Generator/blob/8e6aedd7e6a9297927b456bbbd84c3e7292d8598/public/Screenshot%202025-10-05%20165028.jpg)

---

## 🧠 Tech Stack  

- **Frontend:** Next.js 15 (App Router), React, TypeScript  
- **Backend:** Next.js API Routes  
- **Database:** MongoDB  
- **Authentication:** JWT with httpOnly cookies  
- **Encryption:** Web Crypto API (AES-GCM, PBKDF2)  
- **Styling:** Tailwind CSS v4, shadcn/ui  

---

## ⚙️ Setup Instructions  

### 📋 Prerequisites  
- Node.js **18+**  
- MongoDB (Local or Cloud e.g., MongoDB Atlas)  

### 🚀 Installation  

1. **Clone or download** the project  
2. **Install dependencies:**  
   ```bash
   npm install
3. **Set environment variables**:

4. **Create a .env file in the root directory**:

    - MONGODB_URI=your_mongodb_connection_string
  
    - JWT_SECRET=your_random_secret_key_min_32_chars
  
    - NEXTAUTH_URL=https://password-generator-208.vercel.app

5. **Run the development server:**
   ```bash
   npm run dev


  - Visit: http://localhost:3000

---

## 🔒 How It Works

- SecureVault uses client-side encryption, ensuring your passwords are never stored in plaintext:

- Master Password → You enter this to encrypt/decrypt your vault

- Key Derivation → PBKDF2 derives an encryption key (100,000 iterations)

- Encryption → Each item encrypted via AES-GCM before upload

- Storage → Only encrypted data stored in MongoDB

- Decryption → Happens locally in the browser

---

## 💡 Usage

1. Sign Up – Create an account

2. Sign In – Access your vault

3. Set Master Password – Used for encryption/decryption

4. Generate Password – Use the strong password generator

5. Save to Vault – Add title, username, URL, and notes

6. Search – Filter vault entries

7. Copy – Use one-click copy (auto-clears in 15s)

8. Edit/Delete – Manage saved credentials easily

---

## 🌐 Deployment
- Using Vercel

- Push to GitHub

- Import project on Vercel

- Add environment variables

- Deploy 🚀
---
## 🧑‍💻 Development
  ```bash
  # Install dependencies
  npm install

  # Run dev server
  npm run dev
 
  # Build for production
  npm run build

  # Start production server
  npm start
```
---
## 🔐 Crypto Library Choice

Web Crypto API was selected because it’s:

 - 🧩 Built into browsers (no external dependencies)

 - 🔒 Cryptographically secure and well-audited

 - ⚡ Supports AES-GCM & PBKDF2

 - 💨 Non-blocking (async)

 - 🌍 Supported across all modern browsers
