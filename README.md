<p align="center">
  <img src="https://raw.githubusercontent.com/sy-zaid/nailysis/main/frontend/public/nailysis-logo-small.png" alt="Nailysis Logo" width="250" />
</p>

# Nailysis - AI-Driven Clinical Web Application

Nailysis is an AI-powered clinical web application designed to revolutionize healthcare diagnosis and management in clinics and hospitals. It leverages cutting-edge machine learning for **nail image analysis** to help detect underlying health conditions. Built with a modern tech stack (Django + React), Nailysis streamlines clinic operations with integrated modules for EHR management, appointments, billing, lab tests, and real-time updates—catering to clinics in **Pakistan** (primarily Karachi) but built with scalability in mind.

---

## 📑 Table of Contents

1. [Scope of the Project](#scope-of-the-project)  
2. [Core Functionalities](#-core-functionalities)  
3. [Tech Stack](#-tech-stack)  
4. [Setup Instructions](#️-setup-instructions)  
5. [Contributing](#-contributing)  
6. [License](#-license)  
7. [Contact](#-contact)  

---

## Scope of the Project

Nailysis aims to:
- Enable early-stage disease detection via nail images using a custom AI model.
- Provide a centralized platform for managing **Electronic Health Records (EHR)**.
- Digitize and automate clinic workflows such as appointments, feedback, lab reports, and billing.
- Serve multiple user roles including:
  - Clinic Admin
  - Doctors
  - Patients
  - Lab Technicians
  - Lab Managers
  - System Admins

---

## 🔍 Core Functionalities

### 🧠 AI Model Integration
- Upload nail images for disease prediction (using a `.h5` / `.keras` AI model).
- Model results saved to EHR records for future reference.

### 📋 EHR (Electronic Health Records)
- Add/view/update medical history, prescriptions, diagnoses, immunization records, test results, etc.
- Secure storage with access controls per role.

### 📅 Appointment Management
- Book, update, and cancel appointments.
- Slot management for doctors.
- Time-slot based scheduling with date and duration.

### 🧪 Lab Information System (LIS)
- Blood Test: Numeric input  
- Imaging Test: File + Description  
- Pathology Report: File + Notes  
- Accessible to Lab Managers and Lab Technicians

### 💬 Feedback System
- Patients, Doctors, Lab Techs can submit feedback.
- Admins can respond and update status: Pending, In Progress, Resolved.

### 💳 Billing & Payments
- Fees set by Clinic Admins per appointment type.
- Integration-ready with local Pakistani payment gateways (demo mode).
- View paid/unpaid status per patient.

### 🛎️ Notifications (Coming Soon)
- Real-time alerts via WebSockets (for appointments, lab test updates, feedback, etc.)

### 🌐 Authentication & Authorization
- JWT-based authentication system.
- Protected routes based on user roles (Doctor, Patient, etc.)

---

## 🧰 Tech Stack

| Layer        | Technology                    |
|--------------|-------------------------------|
| Frontend     | React (Vite) + Axios          |
| Backend      | Django + Django REST Framework|
| AI Model     | TensorFlow/Keras (.h5)        |
| Database     | PostgreSQL / SQLite           |
| Real-time    | Django Channels + WebSockets  |
| Styling      | CSS                           |

---

## ⚙️ Setup Instructions

> Follow the steps below to set up both backend and frontend for local development.

### 1. Clone the Repository

```bash
git clone https://github.com/sy-zaid/nailysis.git
cd nailysis
```

### 2. Backend Setup

```bash
cd backend
python -m venv env
source env/bin/activate        # macOS/Linux
# or use: env\Scripts\activate  # Windows

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

### 4. Model Integration

Place your trained `.h5` or `.keras` model inside:

```bash
backend/model_service/
```

Make sure your model is referenced properly in the backend’s loading script.

---

## 🙌 Contributing

We welcome contributions from the community!  
To contribute:

1. Fork the repository  
2. Create a new branch (`git checkout -b feature/your-feature-name`)  
3. Commit your changes  
4. Push and open a pull request to the `develop` branch

Make sure to follow conventional commit messages and include helpful documentation.

---

## 📄 License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for more information.

---

## 📬 Contact

This project was developed as part of a university FYP by the **Nailysis Team**:

- **Zaid Syed Muhammad** — Team Lead; handled core backend, APIs, frontend integration, WebSockets, authentication, and AI model integration.
- **Tehmish & Abdullah** — Frontend (UI Implementation from Figma)  
- **Talha** — Feedbacks module backend, Class Diagram Design  
- **Ayma** — Use Case-Level Class Diagrams  

For technical inquiries, contact:  
📧 **syedmzaid.99@gmail.com**

Main repository maintained by **Zaid Syed Muhammad**.
