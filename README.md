# SecureVault - Password Generator & Secure Vault

A privacy-first password manager with client-side encryption built with Next.js, MongoDB, and TypeScript.


## Features

- **Strong Password Generator**: Customizable length, character types, and exclude look-alike characters
- **Client-Side Encryption**: AES-GCM encryption - your passwords are encrypted in the browser before storage
- **Secure Vault**: Store passwords with title, username, URL, and notes
- **Search & Filter**: Quickly find your saved passwords
- **Copy to Clipboard**: Auto-clearing clipboard after 15 seconds
- **Privacy First**: Server never sees your plaintext passwords

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT with httpOnly cookies
- **Encryption**: Web Crypto API (AES-GCM, PBKDF2)
- **Styling**: Tailwind CSS v4, shadcn/ui

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud like MongoDB Atlas)

### Installation

1. **Clone or download the project**

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   \`\`\`env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_secret_key_min_32_chars
   \`\`\`

   - `MONGODB_URI`: Your MongoDB connection string (e.g., `mongodb://localhost:27017` or MongoDB Atlas URL)
   - `JWT_SECRET`: A random secret key for JWT signing (generate with `openssl rand -base64 32`)

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## How It Works

### Encryption

This app uses **client-side encryption** to ensure your passwords are never stored in plaintext:

1. **Master Password**: When you access your vault, you enter a master password
2. **Key Derivation**: PBKDF2 derives an encryption key from your master password (100,000 iterations)
3. **Encryption**: Each vault item is encrypted with AES-GCM before being sent to the server
4. **Storage**: Only encrypted data is stored in MongoDB
5. **Decryption**: When you view items, they're decrypted in your browser using your master password

**Why this is secure:**
- The server never sees your plaintext passwords
- Each item has a unique salt for key derivation
- AES-GCM provides authenticated encryption
- Master password never leaves your device


## Usage

1. **Sign Up**: Create an account with email and password
2. **Sign In**: Log in to access your vault
3. **Set Master Password**: Enter a master password to encrypt/decrypt your vault
4. **Generate Password**: Use the password generator to create strong passwords
5. **Save to Vault**: Add passwords with title, username, URL, and notes
6. **Search**: Filter your vault items by title, username, or URL
7. **Copy**: Click copy icons to copy passwords (auto-clears after 15 seconds)
8. **Edit/Delete**: Manage your vault items as needed

## Security Notes

- Use a strong, unique master password that you'll remember
- Your master password is used for encryption and is never stored
- If you forget your master password, your vault items cannot be decrypted
- The app uses secure session cookies with httpOnly flag
- All passwords are hashed with bcrypt before database storage
- Client-side encryption ensures zero-knowledge architecture

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Development

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

## Crypto Library Choice

**Web Crypto API** was chosen for encryption because:
- Native browser API - no external dependencies
- Cryptographically secure and well-audited
- Supports modern algorithms (AES-GCM, PBKDF2)
- Async operations don't block the UI
- Works in all modern browsers
