# Environment Variables Configuration Guide

This document describes all configurable environment variables for the IntroBot application.

## Overview

The application uses environment variables to configure various aspects of the chatbot, including:
- LLM model settings
- Personal information and branding
- Social media links
- API configurations

## File Structure

- **Root `.env`**: Frontend configuration (Vite variables with `VITE_` prefix)
- **`backend/.env`**: Backend configuration (server, API keys, LLM settings)
- **`.env.example`**: Template for all environment variables

## Backend Configuration (`backend/.env`)

### Server Settings

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Backend server port | `3001` | No |

### Personal Identity

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NAME` | Your name (used in system prompts) | `Praj` | Yes |

**Note:** The system also uses detailed professional context from `backend/src/context/professional_context.md`.


### Groq API Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `GROQ_API_KEY` | Your Groq API key | - | Yes |
| `GROQ_MODEL` | LLM model to use | `meta-llama/llama-4-scout-17b-16e-instruct` | No |

### LLM Model Parameters - Main Chat Model

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `GROQ_TEMPERATURE` | Controls randomness (0.0-2.0) | `0.7` | No |
| `GROQ_MAX_TOKENS` | Maximum response length | `2048` | No |

**Temperature Guide:**
- `0.0-0.3`: More focused, deterministic responses
- `0.4-0.7`: Balanced creativity and consistency
- `0.8-2.0`: More creative, varied responses

### LLM Model Parameters - Conversation Title Generation

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `GROQ_NAMING_TEMPERATURE` | Temperature for title generation | `0.3` | No |
| `GROQ_NAMING_MAX_TOKENS` | Max tokens for titles | `50` | No |

**Note:** Lower temperature for titles ensures consistent, concise naming.

---

## Frontend Configuration (Root `.env`)

### Supabase Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | - | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | - | Yes |

### Backend API Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_BACKEND_URL` | Backend API endpoint | `http://localhost:3001` | No |

### Personal Information

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_INTRO_NAME` | Welcome screen greeting | `Hi, I'm Praj!` | No |
| `VITE_WORK_TITLE_1` | First work title option | `Full-time husband, otherwise an AI Research Engineer.` | No |
| `VITE_WORK_TITLE_2` | Second work title option | `Full-time husband, also an AI Research Engineer.` | No |

**Note:** The app randomly selects between the two work titles on each page load.

### Social Links

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_LINKEDIN_URL` | LinkedIn profile URL | `https://www.linkedin.com/in/prajwal-khairnar/` | No |
| `VITE_GITHUB_URL` | GitHub profile URL | `https://github.com/prajwalkhairnar` | No |
| `VITE_EMAIL` | Contact email address | `prajwal.pkhairnar@gmail.com` | No |

### Export/Download Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_CV_FILENAME` | Filename for CV downloads | `Prajwal_Khairnar_CV.pdf` | No |
| `VITE_ASSISTANT_NAME` | Assistant name in exports | `Praj` | No |

---

## Setup Instructions

### 1. Initial Setup

Copy the example files to create your environment configuration:

```bash
# Root directory (frontend)
cp .env.example .env

# Backend directory
cp backend/.env.example backend/.env
```

### 2. Configure Required Variables

Edit both `.env` files and set the required variables:

**Root `.env`:**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**`backend/.env`:**
```env
GROQ_API_KEY=your_groq_api_key
NAME=YourName
```

### 3. Customize Optional Variables

Personalize the chatbot by updating optional variables like:
- Personal information (name, titles)
- Social media links
- LLM parameters (temperature, max tokens)
- CV filename

### 4. Restart Development Servers

After changing environment variables, restart both servers:

```bash
# Frontend
npm run dev

# Backend (in backend directory)
npm run dev
```

---

## Customization Examples

### Example 1: Adjust LLM Creativity

For more creative responses:
```env
GROQ_TEMPERATURE=1.0
GROQ_MAX_TOKENS=3000
```

For more focused, consistent responses:
```env
GROQ_TEMPERATURE=0.3
GROQ_MAX_TOKENS=1500
```

### Example 2: Personalize for Different User

```env
# Backend
NAME=Jane

# Frontend
VITE_INTRO_NAME=Hi, I'm Jane!
VITE_WORK_TITLE_1=Software Engineer & AI Enthusiast
VITE_WORK_TITLE_2=Building the future with AI
VITE_LINKEDIN_URL=https://www.linkedin.com/in/jane-doe/
VITE_GITHUB_URL=https://github.com/janedoe
VITE_EMAIL=jane.doe@example.com
VITE_CV_FILENAME=Jane_Doe_CV.pdf
VITE_ASSISTANT_NAME=Jane
```

### Example 3: Production Deployment

```env
# Frontend
VITE_BACKEND_URL=https://api.yourdomain.com

# Backend
PORT=8080
```

---

## Security Best Practices

1. **Never commit `.env` files** - They're already in `.gitignore`
2. **Keep API keys secret** - Don't share or expose them
3. **Use different keys for development and production**
4. **Rotate API keys regularly**
5. **Use environment-specific configurations** for dev/staging/prod

---

## Troubleshooting

### Changes Not Reflecting

1. **Restart the development servers** - Environment variables are loaded at startup
2. **Clear browser cache** - Vite may cache old values
3. **Check variable names** - Frontend variables must start with `VITE_`

### Missing Variables

If you see errors about missing environment variables:

1. Check that the variable is defined in the correct `.env` file
2. Verify the variable name matches exactly (case-sensitive)
3. Ensure there are no extra spaces around the `=` sign
4. Restart the development server

### Default Values

Most variables have sensible defaults. If a variable is not set, the application will use the default value shown in this documentation.

---

## Additional Resources

- [Vite Environment Variables Documentation](https://vitejs.dev/guide/env-and-mode.html)
- [Groq API Documentation](https://console.groq.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
