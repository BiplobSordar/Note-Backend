# Notes API Backend

A simple REST API for managing private notes. Built with **Node.js**, **Express**, and **MySQL**, with JWT-based authentication.

---

---

## **Features**

- User registration and login with hashed passwords
- JWT-based authentication
- Create, read, update, and delete private notes
- Secure note access per user
- Automatic table creation if not exist
- Error handling with proper HTTP status codes

---

## **Tech Stack**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-339933?style=for-the-badge&logoColor=white)
![dotenv](https://img.shields.io/badge/dotenv-000000?style=for-the-badge&logoColor=white)

---

## **Installation Guide**

### **1. Clone the repository**
```bash
git clone https://github.com/BiplobSordar/Note-Backend.git

cd backend

```

### **2. Install dependencies**

```bash
npm install

```


### **3. Create a .env file**

```bash
DB_HOST=<your-db-host>
DB_USER=<your-db-username>
DB_PASS=<your-db-password>
DB_NAME=<your-db-name>
DB_PORT=<your-db-port>
JWT_SECRET=<your-secret-key>
PORT=5000

```


### **4. Start the server**

```bash
npm run dev
```




