# YouTube Video Q&A App

A Next.js 14 application that allows users to submit YouTube videos and ask questions about the content using RAG (Retrieval Augmented Generation) with Gemini 2.0 Flash API.

## Features

- YouTube video transcript extraction
- Transcript chunking and embedding generation
- Vector similarity search for relevant content
- Question answering using Gemini 2.0 Flash API
- User authentication with Clerk
- Video management (add, view, delete)
- Question history

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Database:** NeonDB (PostgreSQL with vector extension)
- **ORM:** Prisma
- **Authentication:** Clerk
- **AI:** Gemini 2.0 Flash API
- **Embeddings:** Gemini text-embedding-004

## Setup Instructions

### Prerequisites

- Node.js 18+
- NeonDB account (or any PostgreSQL database with vector extension)
- Clerk account
- Google AI API key (for Gemini)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# Gemini API
GOOGLE_API_KEY="your-google-ai-api-key"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
CLERK_SECRET_KEY="your-clerk-secret-key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"
```

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/youtube-qa-app.git
   cd youtube-qa-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the database:
   ```
   npx prisma migrate dev --name init
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Sign up or sign in to your account
2. Add a YouTube video by pasting its URL
3. Wait for the video to be processed (transcript extraction and embedding generation)
4. Ask questions about the video content
5. View your question history

## Deployment

This application is designed to be deployed on Vercel's Hobby (Free) Tier.

## Rate Limiting

The application implements rate limiting to stay within the free tier limits of Gemini API (15 requests per minute).

## License

MIT
