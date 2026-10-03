# Tech_Studio — Quality Engineering & AI Automation Consultancy

A modern, high-performance, enterprise-grade B2B technology consultancy platform for **Quality Engineering, Software Testing, Test Automation, and AI-Augmented Engineering**.

Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, **Lucide Icons**, **Firebase Firestore**, and **EmailJS**.

---

## 🚀 Key Features & Architecture

### 🌐 1. Public Consultancy Platform
- **Brand Positioning & Hero**: High-conversion B2B messaging with an interactive 6-step Quality Engineering transformation visual.
- **Value Strip**: Instant navigation across core capabilities (*Quality Engineering, Test Automation, AI Automation, Continuous Testing, QA Transformation*).
- **6 Core Services**: Interactive capability cards with expandable deliverables, tech stack chips, and consultation action triggers.
- **AI Automation Engine**: 5-stage interactive workflow (*Discover → Generate → Automate → Analyze → Optimize*) with engineering guardrails.
- **8 Practical AI Use Cases**: Real-world applications (synthetic data generation, flakiness triage, self-healing locators, etc.).
- **Traditional QA vs. Modern QE**: Interactive comparison matrix demonstrating shift-left quality velocity.
- **QA & Automation Maturity Assessment**: 5-question interactive benchmark calculation (*Getting Started, Developing, Scaling, AI-Augmented*) with targeted priority recommendations.
- **Case Studies & Methodology**: Structured problem-solution blueprints and engagement models (*Advisory, Project-Based, Continuous Partnership*).
- **Automated Contact & Consultation Pipeline**: On-page inquiry form and quick consultation modal with automated dual email dispatch.
- **Dark & Light Mode**: Seamless system detection with manual toggle.

---

### 🛡️ 2. Comprehensive Admin Operations Console (`Ctrl + Shift + A`)
Accessible via keyboard shortcut **`Ctrl + Shift + A`** or the subtle lock icon in the footer:
- **Inquiries & Leads CRM**: Filter, search, and audit incoming client consultations. Update status (*New, Contacted, In Review, Converted, Archived*), add internal notes, and monitor email delivery status.
- **Automated Dual Email Dispatch**:
  - Automatically dispatches a branded consultation confirmation receipt to the client.
  - Automatically routes an urgent lead alert with complete requirements to the business owner (`devmarlow01@gmail.com`).
  - Includes a 1-click **Resend Emails** button directly from the CRM row or audit modal.
- **Company Profile Editor**: Dynamically update company name, hero headline, consulting hours, contact email, phone, headquarters address, and emergency escalation.
- **Service Offerings Catalog**: Add, edit, remove, reorder, or feature services in real-time.
- **Interactive FAQ Manager**: Dynamically manage categories and answers.
- **Email Service Management Tab**:
  - Live connection status (Live EmailJS Connected vs. Simulation Mode).
  - Configure EmailJS Service ID, Public Key, and Template IDs directly in the UI.
  - Granular dispatch toggles (Client Confirmation / Owner Alert).
  - Built-in **Live Diagnostic & Test Dispatcher** to trigger test emails on demand.
  - Ready-to-paste template bodies with all variable bindings.
- **Security & Access Control**:
  - Authorized Google Sign-In checking against `devmarlow01@gmail.com`.
  - Verified owner Google sign-in; browser flags and passcodes do not grant access.
  - Cloud Firestore real-time persistence with offline local storage fallback.
  - Audit logging of all administrative actions.

---

## 💻 Tech Stack

- **Frontend**: React 19, TypeScript, Vite 6
- **Styling**: Tailwind CSS v4, Motion
- **Icons**: Lucide React
- **Cloud Database**: Firebase Firestore
- **Authentication**: Firebase Auth (verified owner Google account)
- **Email Automation**: EmailJS (`@emailjs/browser`)

---

## 🛠️ Getting Started Locally

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/tech-studio-consulting.git
cd tech-studio-consulting
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the sample environment file:
```bash
cp .env.example .env
```

Edit `.env` to provide your configuration:
```env
# Firebase Authentication is required for website administration.
VITE_FIREBASE_API_KEY=your_firebase_web_api_key

# EmailJS Service Integration (for automated client confirmation & lead alerts)
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
VITE_EMAILJS_TEMPLATE_CONFIRMATION=your_template_id_client
VITE_EMAILJS_TEMPLATE_ALERT=your_template_id_owner

# The Firebase project/database are defined in firebase-applet-config.json.
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
```
The compiled, production-ready static assets will be output in the `dist/` directory.

---

## 📧 EmailJS Automation Setup

1. Create a free account at [emailjs.com](https://www.emailjs.com).
2. Add an **Email Service** (e.g., Gmail) and copy the **Service ID**.
3. Go to **Account** → **API Keys** and copy your **Public Key**.
4. Create two templates in **Email Templates**:
   - **Client Confirmation**:
     - *To Email*: `{{to_email}}`
     - *Subject*: `Consultation Confirmed: {{company_name}} & {{user_name}}`
     - *Template ID* → `VITE_EMAILJS_TEMPLATE_CONFIRMATION`
   - **Owner Alert**:
     - *To Email*: `devmarlow01@gmail.com`
     - *Subject*: `⚡ [New Lead] {{lead_name}} - {{service_interest}}`
     - *Template ID* → `VITE_EMAILJS_TEMPLATE_ALERT`
5. You can paste these keys directly into the app's **Admin Portal (`Ctrl + Shift + A`) → Email Service Tab** and test them immediately!

---

## 🚀 Deployment

### Deploying to Vercel
1. Push your code to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Framework Preset: **Vite**.
4. Add your environment variables (`VITE_FIREBASE_API_KEY`, `VITE_EMAILJS_*`, etc.).
5. Click **Deploy**.

### Owner-only editing and Firebase rules
The existing website owner is `devmarlow01@gmail.com`. Only that verified account can enter the admin console or write published content. Visitors can read published content and create a new consultation or sample-download inquiry; they cannot read, update, or delete leads or audit records. Site/repository collaborators also need to remain restricted to the owner in their respective hosting settings.

1. Enable Google sign-in in the Firebase project's Authentication settings.
2. Add the actual Vercel and Sites domains to Firebase Authentication's authorized domains.
3. Set `VITE_FIREBASE_API_KEY` on the hosting provider before building.
4. Deploy the rules to the named Firestore database with an authenticated project owner:

```bash
npx firebase-tools deploy --only firestore:rules --project confident-studio-5ghtt
```

A GitHub push or frontend deployment does not deploy Firebase rules. The `firebase.json` file targets the database used by this website. Without Firebase configuration, the public website and sample library still render, but admin editing is disabled and inquiry storage stays in that browser. Administrator passwords must never be placed in public `VITE_*` variables.

### Deploying to Netlify / Cloudflare Pages / Cloud Run
The app builds into a standard static SPA (`dist/`). Configure your single-page app rewrite rule (`/* -> /index.html`) on your hosting platform.

---

## 📄 License
MIT © 2026 Tech_Studio. All rights reserved.
