AI Model Playground

Welcome to the AI Model Playground! This is a full-stack web application designed to compare the real-time, streaming responses of multiple AI models side-by-side. Users can enter a single prompt and watch as different models generate text, allowing for a direct comparison of speed, style, and content.
This project saves all prompts and responses, and saves it to a database for tracking session history for each user.
The two models currently being compared against eachother are gemini-flash and gemini-pro.

Features

    Real-Time Streaming: Watch AI models generate text chunk-by-chunk using Server-Sent Events (SSE).

    Side-by-Side Comparison: A clean, two-column UI to directly compare responses from gemini-flash and gemini-pro.

    Session Management: Each user session is tracked, and all comparison history is saved.

    Persistent Data Storage: All prompts and their full responses are stored in a PostgreSQL database.

    Live Status Updates: The UI provides clear status indicators for each model (Waiting, Generating, Complete, Error).


Tech Stack

    Frontend: Next.js, React, Tailwind CSS

    Backend: NestJS, TypeScript

    Database: PostgreSQL (hosted on Neon)

    ORM: Prisma

    Deployments: Vercel and Render


Getting Started

Follow these instructions to get the project running on your local machine for development and testing.
Prerequisites

    Node.js (v18 or newer recommended)

    Git

    A Google AI API Key for the Gemini models. Get one from Google AI Studio.

    A free Neon account to host your PostgreSQL database.


Installation & Setup

    Clone the repository:

    git clone [https://github.com/YourUsername/ai-model-playground.git](https://github.com/YourUsername/ai-model-playground.git)
    cd ai-model-playground

    Set up the Backend:

        Navigate to the backend directory:

        cd backend

        Install dependencies:

        npm install

        Create your environment file by copying the example:

        cp .env.example .env

        Set up your database:

            Create a new project on Neon.

            From your Neon project dashboard, copy the connection string that starts with postgresql://.

            Paste this value into the DATABASE_URL variable in your .env file.

        Add your Google AI API key to the GEMINI_API_KEY variable in the .env file.

        Apply the database schema to your Neon database:

        npx prisma db push

        Start the backend development server:

        npm run start:dev

        The backend will be running on http://localhost:3001.

    Set up the Frontend:

        Open a new terminal window.

        Navigate to the frontend directory:

        cd frontend

        Install dependencies:

        npm install

        Start the frontend development server:

        npm run dev

        Open your browser and go to http://localhost:3000.


    Deployment
    
Backend (on Render)

    Create a new "Web Service" on Render and connect it to your GitHub repository.

    In the settings, configure the following:

        Root Directory: backend

        Build Command: npm install && npx prisma generate && npx prisma db push && npm run build

        Start Command: npm run start:prod

    Add your environment variables under the "Environment" tab:

        DATABASE_URL: Your Neon database connection string.

        GEMINI_API_KEY: Your Google AI API key.

Frontend (on Vercel)

    Create a new project on Vercel and connect it to your GitHub repository.

    Configure the following settings:

        Framework Preset: Next.js

        Root Directory: frontend

    Add your environment variable under Settings > Environment Variables:

        NEXT_PUBLIC_API_URL: The public URL of your deployed backend on Render (e.g., https://your-backend-name.onrender.com).

    Deploy! Vercel will automatically build and deploy your frontend.