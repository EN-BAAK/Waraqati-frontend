# Waraqati Frontend

Waraqati is a modern web platform that enables users to request and manage government-related services بسهولة وفعالية.  
This repository contains the **frontend application**, built with modern web technologies to deliver a fast, scalable, and user-friendly experience.

---

## 📌 Overview

The platform connects three main types of users:
- **Clients** who request services
- **Employees** who process requests
- **Admins** who manage the entire system

Waraqati focuses on simplifying service workflows, improving transparency, and enhancing user experience through a structured and scalable interface.

---

## 🛠️ Tech Stack

- **Next.js**
- **React.js**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**

---

## 🏗️ Architecture

This project is the **Frontend** of the Waraqati system and communicates with a separate backend:

- Frontend: This repository
- Backend: https://github.com/EN-BAAK/Waraqati-server

---

## 👥 User Roles & Permissions

### 👑 Admin (Manager)

Admins have full control over the platform:

#### Employees Management
- Add / Edit / Delete employees
- View employees with pagination
- View employee details:
  - Rating
  - Most worked-on service
  - Last 5 handled services

#### Clients Management
- Add / Edit / Delete clients
- View clients (without full profile details)

#### Services Management
- Add / Edit / Delete services
- View services with pagination
- Each service includes:
  - Name
  - Description
  - Duration
  - Price
  - Rating
- Link services to categories
- Attach required documents
- Attach questions

#### Documents Management
- Create reusable required documents (e.g. ID image)
- Link documents to services

#### Categories Management
- Add / Edit / Delete categories
- Each category includes:
  - Title
  - Description
  - Image

#### Questions Management
- Add / Edit / Delete questions
- Control question order
- Link questions to categories

#### Requests Management
- View all client requests
- Track request statuses (multiple states supported)

---

### 🧑‍💼 Employee

- Can be promoted to Admin by Manager
- View unassigned requests and take them
- Work on assigned requests
- Update request status
- View personal work history

---

### 👤 Client

- Browse available services
- Submit service requests
- Answer questions and upload required files
- Manage uploaded files (upload / download / delete)
- Track request status
- Rate completed requests

---

## 🚀 Core Features

- 🔍 Search & Filtering
- 📄 Pagination
- ⚡ Lazy loading for images (performance optimization)
- 🔐 Authentication system
- 📧 Email-based password reset
- 🔑 Password management for all users
- 📊 Role-based access control

---

## 🔐 Authentication

- Users can reset their password via email verification
- When an Admin creates a new user:
  - A verification code is sent via email
- Secure session handling using cookies

---

## ⚙️ Installation & Setup

### 1. Clone Frontend Repository

```bash
git clone https://github.com/EN-BAAK/Waraqati-frontend
cd Waraqati-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables
Create a .env file in the root directory and add:

```env
NEXT_PUBLIC_API_URL=

COOKIE_NAME=

NEXT_PUBLIC_USER_INFO=
```
### 4. Build the Project

```bash
npm run build
```

### 5. Setup Backend
Clone the backend repository:

```bash
git clone https://github.com/EN-BAAK/Waraqati-server
```
Then follow the instructions in its README.md.


### 6. Run the Application
Clone the backend repository:

```bash
npm start
```

## 📈 Future Improvements (TODO)

 - Employee can view full request details
 - Landing Page
 - Account verification system improvements
 - Notification system
 - Advanced search across pages

## 📌 Notes

- The project is optimized for performance using lazy loading techniques
- Designed with scalability and maintainability in mind
- Built using modern UI practices and reusable components

## 📄 License

This project is open-source and available under the MIT License.

---

**Designed and coded by me.**