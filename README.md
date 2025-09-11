# Study Hub

A Next.js-based Study Hub is a web application. This project integrates a conversational AI interface, resource sidebar, and session management, styled with Tailwind CSS and powered by Supabase for backend services.

## Features

- Interactive chatbot for LMS queries
- Sidebar for navigation and session selection
- Resource panel for supplementary materials
- Responsive UI with Tailwind CSS
- Supabase integration for authentication and data storage
- Markdown support in chat messages


## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [DeepSeek](https://deepseek.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide React](https://lucide.dev/)
- [React Markdown](https://github.com/remarkjs/react-markdown)

## Getting Started

### Prerequisites

- Node.js >= 18.x
- npm

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/lms-chatbot.git
   cd lms-chatbot
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local` and fill in your Supabase and OpenAI credentials.

4. Run the development server:
   ```sh
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```sh
npm run build
npm start
```

## Project Structure

- `src/` — Application source code
- `public/` — Static assets
- `videos/` — Video resources
- `.next/` — Next.js build output (ignored in git)
- `.env.local` — Environment variables (ignored in git)

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm start` — Start production server
- `npm run lint` — Run ESLint

## License

MIT

---

For more details, see [package.json](package.json).