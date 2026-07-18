# Security notes

StadiumPulse AI is a hackathon MVP. Its Gemini key is supplied through `VITE_GEMINI_API_KEY` in a local `.env` file, which is excluded from version control. The app shows a clear configuration message when the key is missing or malformed and never logs the key.

All user-entered text is trimmed, stripped of control characters, limited to 500 characters, and placed in clearly delimited data fields before it is included in Gemini prompts. Submit actions also use a short client-side cooldown to reduce accidental or abusive repeat requests.

This prototype does not collect or process real PII, payments, or authentication credentials. A production version should send Gemini requests through a protected server-side endpoint, enforce server-side rate limits, and apply authentication and audit controls.
