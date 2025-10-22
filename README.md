# 📺 YT-Bot: YouTube Video Q&A App

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Built With Next.js](https://img.shields.io/badge/Built%20With-Next.js-000000.svg?logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![NeonDB](https://img.shields.io/badge/NeonDB-00C8C8?style=for-the-badge&logo=postgresql&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)

## ✨ Overview

YT-Bot is a powerful Next.js 14 application that revolutionizes how you interact with YouTube video content. It allows users to submit YouTube video URLs and then leverage the cutting-edge Gemini 2.0 Flash API to ask intelligent questions about the video's content. Utilizing Retrieval Augmented Generation (RAG), the app extracts transcripts, generates embeddings, and performs vector similarity searches to provide accurate and context-aware answers.

## 🚀 Features

*   **Intelligent Q&A:** Ask natural language questions about any YouTube video and get precise answers powered by Gemini 2.0 Flash.
*   **Transcript Extraction:** Automatically fetches and processes YouTube video transcripts.
*   **Semantic Search:** Chunks and embeds transcripts, enabling vector similarity search for highly relevant content retrieval.
*   **User Authentication:** Secure user management powered by JWT for seamless sign-up and sign-in.
*   **Video Management:** Easily add, view details, and delete your submitted YouTube videos.
*   **Question History:** Keep track of all your questions and their corresponding AI-generated answers for each video.
*   **Rate Limiting:** Implements rate limiting to ensure efficient API usage and stay within free tier limits.

## 🛠️ Tech Stack

*   **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
*   **Backend:** Next.js API Routes
*   **Database:** NeonDB (PostgreSQL with `pg_vector` extension)
*   **ORM:** Prisma
*   **Authentication:** JWT
*   **AI/LLM:** Google Gemini 2.0 Flash API
*   **Embeddings:** Google Gemini `text-embedding-004`
*   **Video Processing:** `@langchain/community/document_loaders/web/youtube` for video metadata and transcript loading.

## ⚙️ Setup Instructions

Follow these steps to get your YT-Bot application up and running locally.

### Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/en/) (v18 or higher)
*   [npm](https://www.npmjs.com/) (comes with Node.js)
*   A [NeonDB](https://neon.tech/) account (or access to any PostgreSQL database with the `pg_vector` extension enabled).
*   A [Google AI Studio](https://aistudio.google.com/) account to obtain your Gemini API Key.

### Environment Variables

Create a `.env` file in the root of your project directory and populate it with the following variables:

```env
# Database Connection String (from NeonDB or your PostgreSQL provider)
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# Google Gemini API Key (from Google AI Studio)
GOOGLE_API_KEY="your-google-gemini-api-key"

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/yt-bot.git
    cd yt-bot
    ```
    *(Replace `yourusername/yt-bot.git` with your actual repository URL if you've forked it)*

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the database:**
    Ensure your `DATABASE_URL` in `.env` is correct. Then, apply Prisma migrations to set up your database schema:
    ```bash
    npx prisma migrate dev --name create_initial_tables
    ```
    *(If you already have migrations, use `npx prisma migrate deploy`)*

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Access the application:**
    Open your web browser and navigate to [http://localhost:3000](http://localhost:3000).

## 💡 How to Use

1.  **Sign Up / Sign In:** Register for a new account or log in using your credentials.
2.  **Add a YouTube Video:** On the dashboard, paste a YouTube video URL into the input field and submit it.
3.  **Processing:** The application will process the video, extracting its transcript and generating embeddings. This might take a moment depending on the video length.
4.  **Ask Questions:** Once processed, navigate to the video's detail page. You can now ask questions about the video content in the provided text area.
5.  **View Answers & History:** The AI's answer will appear, and your question will be added to the question history for easy reference.

## 📂 Project Structure
