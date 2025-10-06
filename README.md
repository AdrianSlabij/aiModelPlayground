# AI Model Playground

Welcome to the AI Model Playground! This is a full-stack web application designed to compare the real-time, streaming responses of multiple AI models side-by-side. Users can enter a single prompt and watch as different models generate text, allowing for a direct comparison of speed, style, and content.

This project saves all prompts and responses to a database for tracking session history for each user. The two models currently being compared are `gemini-2.5-flash` and `gemini-2.5-pro`.

**Live Link:** [ai-model-playground.vercel.app](https://ai-model-playground.vercel.app/)

---

## Features

* **Real-Time Streaming:** Watch AI models generate text chunk-by-chunk using Server-Sent Events (SSE).
* **Side-by-Side Comparison:** A clean, two-column UI to directly compare responses from different models.
* **Session Management:** Each user session is tracked, and all comparison history is saved.
* **Persistent Data Storage:** All prompts and their full responses are stored in a PostgreSQL database.
* **Live Status Updates:** The UI provides clear status indicators for each model (Waiting, Generating, Complete, Error).

---

## Tech Stack

* **Frontend:** Next.js, React, Tailwind CSS
* **Backend:** NestJS, TypeScript
* **Database:** PostgreSQL (hosted on Neon)
* **ORM:** Prisma
* **Deployments:** Vercel (Frontend) and Render (Backend)

---

## Getting Started

Follow these instructions to get the project running on your local machine for development and testing.

### Prerequisites

* Node.js (v18 or newer)
* Git
* A Google AI API Key for the Gemini models. Get one from [Google AI Studio](https://aistudio.google.com/).
* A free [Neon](https://neon.tech/) account to host your PostgreSQL database.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YourUsername/ai-model-playground.git
    cd ai-model-playground
    ```

2.  **Set up the Backend:**
    * Navigate to the backend directory:
        ```bash
        cd backend
        ```
    * Install dependencies:
        ```bash
        npm install
        ```
    * Create your environment file from the example:
        ```bash
        cp .env.example .env
        ```
    * **Configure your database:** Create a new project on Neon and copy the connection string. Paste it into the `DATABASE_URL` variable in your `.env` file.
    * **Add your API key:** Add your Google AI API key to the `GEMINI_API_KEY` variable in the `.env` file.
    * Apply the database schema:
        ```bash
        npx prisma db push
        ```
    * Start the backend development server:
        ```bash
        npm run start:dev
        ```
    * The backend will now be running on `http://localhost:3001`.

3.  **Set up the Frontend:**
    * Open a **new terminal window** and navigate to the frontend directory:
        ```bash
        cd frontend
        ```
    * Install dependencies:
        ```bash
        npm install
        ```
    * Start the frontend development server:
        ```bash
        npm run dev
        ```
    * Open your browser and go to `http://localhost:3000`.

---

## ☁️ Deployment

### Backend (on Render)

1.  Create a new **"Web Service"** on Render and connect it to your GitHub repository.
2.  In the settings, configure the following:
    * **Root Directory:** `backend`
    * **Build Command:** `npm install && npx prisma generate && npx prisma db push && npm run build`
    * **Start Command:** `npm run start:prod`
3.  Add your environment variables under the **"Environment"** tab:
    * `DATABASE_URL`: Your Neon database connection string.
    * `GEMINI_API_KEY`: Your Google AI API key.

### Frontend (on Vercel)

1.  Create a new project on Vercel and connect it to your GitHub repository.
2.  Configure the following project settings:
    * **Framework Preset:** `Next.js`
    * **Root Directory:** `frontend`
3.  Add your environment variable under **Settings > Environment Variables**:
    * `NEXT_PUBLIC_API_URL`: The public URL of your deployed backend on Render (e.g., `https://your-backend-name.onrender.com`).
4.  Deploy! Vercel will automatically build and deploy your frontend.
