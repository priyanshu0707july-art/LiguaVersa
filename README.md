# LinguaVerse AI 🌐✨

LinguaVerse AI is a next-generation, highly scalable real-time multilingual video communication platform. Inspired by the visual fidelity of Unreal Engine 5 and the architectural robustness of Google Meet, LinguaVerse shatters language barriers with sub-500ms AI translation pipelines.

## The 7-Step Architecture

This repository contains the complete implementation of the 7-step master plan:

### 1. Futuristic UI/UX Design (Frontend)
- **Aesthetic**: Dark futuristic theme, glassmorphism, soft neon gradients (`#6E56FF`, `#00E7FF`).
- **Tech**: React, Vite, Framer Motion, Vanilla CSS.
- **Features**: Highly responsive cinematic landing page with interactive layouts.

### 2. Scalable Microservices Architecture (Backend)
- **Architecture**: NestJS Monorepo.
- **Microservices**: Scaffolded API Gateway, Auth Service, and a WebRTC Meeting Signaling Service.
- **Infrastructure**: Dockerized PostgreSQL and Redis for high-speed pub/sub messaging across nodes.

### 3. Comprehensive Database Design
- **ORM**: Prisma configured for a massive 22-table schema.
- **Features**: Complete relational mapping for Identity, Organizations, Subscriptions, AI Speech Histories, and Meetings. Includes UUIDs, Soft Delete patterns, and Audit columns.

### 4. Real-time Multilingual Communication Engine
- **Pipeline**: Audio stream WebSocket gateway connecting Speech-to-Text -> LLM Translation -> Text-to-Speech (Voice Cloning) -> Lip Sync Visemes.
- **Latency**: Architected for sub-500ms streaming performance using Node `EventEmitter` patterns.

### 5. Google Meet-Like Video System
- **UI Grid**: Auto-calculating `Active Speaker` and `Gallery` views for dynamic participant scaling.
- **Controls**: Premium glassmorphic host control bar and a collapsible sidebar housing Live Chat, Participant lists, and AI Notes.

### 6. Unreal Engine 5 Inspired 3D Landing Page
- **Tech**: React Three Fiber, Three.js, GSAP.
- **Visuals**: Procedurally generated Holographic AI Brain, Earth, and Voice Particle systems.
- **Cinematics**: GSAP ScrollTrigger camera fly-throughs, paired with `@react-three/postprocessing` (Bloom, Depth of Field, Vignette).

### 7. Complete End-to-End User Flow
- **Routing**: Connected as a full Single Page Application via `react-router-dom`.
- **Journey**: Landing Page ➔ Authentication Gateway ➔ User Dashboard ➔ Video Meeting Room ➔ Post-Meeting AI Summary Page.

---
*Built with ❤️ for the future of global communication.*
