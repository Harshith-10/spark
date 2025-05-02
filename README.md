# Spark: AI-Powered Learning Assistant

<div align="center">
  <img src="public/favicon.png" alt="Spark Logo" width="120" />
  <p><em>Transform your learning experience with advanced AI interactions</em></p>
</div>

## Overview

Spark is an innovative educational platform built with Next.js and React that leverages AI technology to provide an interactive learning experience. At its core, Spark features a sophisticated AI chatbot that can engage in educational conversations, display its reasoning process, and provide personalized learning assistance.

## Features

### AI Chat Interface
- **Real-time Streaming Responses**: Experience fluid conversations with character-by-character streaming of AI responses
- **Transparent Thinking Process**: Unique feature that reveals the AI's reasoning through expandable `<think>` sections
- **Rich Text Formatting**: Full Markdown support for well-structured educational content
- **Interactive Conversation Starters**: Pre-defined prompts to help users begin productive learning dialogues
- **Context-Aware Responses**: The AI maintains conversation context for coherent, relevant interactions

### Dashboard & Analytics
- **Learning Progress Visualization**: Track educational progress through intuitive charts and metrics
- **Interactive Data Displays**: Engage with your learning data through responsive, animated visualizations
- **Performance Insights**: Gain valuable feedback on learning patterns and areas for improvement

### Additional Features
- **Testing System**: Interactive assessments to reinforce learning
- **Settings Management**: Customize your experience, including AI endpoint configuration
- **Authentication System**: Secure login/registration functionality
- **Responsive Design**: Optimized experience across all device sizes
- **Dark/Light Theme Support**: Visual preferences for comfortable viewing

## Technology Stack

- **Frontend**: Next.js 15.3.1, React 19.0.0, TypeScript
- **UI Components**:
    - Radix UI primitives for accessible, composable components
    - Tailwind CSS for styling
    - Framer Motion for smooth animations
    - Lucide React for consistent iconography
- **AI Integration**:
    - Custom Ollama API integration with streaming support
    - Advanced text parsing for special features like thinking mode
- **Data Visualization**: Recharts for analytics representation
- **Deployment**: Docker support for containerized deployment

## Getting Started

### Prerequisites
- Node.js 18 or later
- npm, yarn, pnpm, or bun package manager
- Ollama server (local or remote) for AI functionality

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/spark.git
   cd spark
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### AI Configuration

Spark is designed to work with an Ollama-compatible AI backend. You can configure the API endpoint in the settings panel within the application.

The default model configuration is specified in `spark.modelfile`, and the application is pre-configured to connect to a default endpoint.

### Docker Deployment

For containerized deployment:

```bash
docker compose up -d
```