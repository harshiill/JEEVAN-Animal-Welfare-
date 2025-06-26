
# 🐾 Jeevan - Animal Welfare App

An AI-powered platform for image-based animal disease detection and real-time reporting of injured or stray animals. Built with **Next.js**, **MongoDB**, **Cloudinary**, and **Zod**.

---

## 📦 Tech Stack

- **Next.js** (App Router, TypeScript, Tailwind CSS)
- **MongoDB Atlas** with Mongoose
- **Cloudinary** for image uploads
- **Zod** for schema validation
- **bcryptjs** for password hashing
- **Multer** for image upload handling
- **JWT** for token creation & verification during login,logout..
- **Firebase FCM**, **Socket.IO** (real-time and notifications - planned)

---

## 🚀 Initial Setup Guide

Follow these steps to set up the project locally.

---

### 1. 📁 Create Project Folder

```bash
mkdir jeevan
cd jeevan
```

---

### 2. 🧱 Scaffold the Project (Next.js)

```bash
npx create-next-app@latest .
```

Answer prompts as follows:

```
✔ Would you like to use TypeScript?              » Yes
✔ Would you like to use ESLint?                 » Yes
✔ Would you like to use Tailwind CSS?           » Yes
✔ Would you like your code inside a `src/` dir? » Yes
✔ Would you like to use App Router?             » Yes
✔ Would you like to use Turbopack?              » No
✔ Customize the import alias?                   » No
```

---

### 3. 📦 Install Dependencies

```bash
npm install mongoose cloudinary dotenv zod bcryptjs multer
```

---

### 4. 🔐 Setup Environment Variables

Create a `.env.` file in the root based on the sample:

```bash
cp .env.sample .env
```

#### Example `.env.sample` contents:
```
MONGO_URI=
TOKEN_SECRET=
DOMAIN=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret
```

---

### 5. 🧠 Project Structure (Basic)

```
/src
  ├── /app
  ├── /components
  ├── /lib        # db.ts, cloudinary.ts
  ├── /models     # mongoose schemas
  ├── /middleware.ts        # Middleware
  ├── /helpers       # utils
  ├── /Schemas       # ZOD Schema Validations
.env
.env.sample
```

---

### 6. ✅ Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---


## 🤝 Contributing

Pull requests welcome! If you're looking to contribute, please fork the repo and open a PR.

---

## 📄 License

IIITDMJ © 2025 Jeevan Project
