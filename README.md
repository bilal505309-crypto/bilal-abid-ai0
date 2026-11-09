# Bilal Abid AI

A responsive AI chat website with a dark, modern interface. It uses a server-side API key so the key is not exposed in the browser.

## Run on your computer

1. Install Node.js (version 18 or newer).
2. Extract this ZIP and open a terminal in the project folder.
3. Run `npm install`.
4. Copy `.env.example` to a new file named `.env`.
5. Put your own API key in `.env` after `OPENAI_API_KEY=`.
6. Run `npm start`.
7. Open `http://localhost:3000`.

## Important

- The site does not work as an AI until a valid API key is configured.
- API usage may cost money. Check the provider's pricing and usage limits before using it.
- Never put your API key in `public/app.js`, HTML, or any browser-side code.
- This assistant can answer a wide range of questions, but no AI can guarantee a correct answer to every question.
- Before publishing, add your own privacy policy, terms, contact information, and usage limits. Protect the API from abuse with authentication and rate limiting.
