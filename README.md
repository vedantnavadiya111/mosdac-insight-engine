# ISRO SagarMegh AI

A comprehensive AI-powered platform for accessing, analyzing, and downloading ISRO's meteorological and oceanographic satellite data. This project provides an intelligent interface to MOSDAC (Meteorological and Oceanographic Satellite Data Archival Centre) with advanced chatbot capabilities, dataset downloads, and browser extension integration.

## 🚀 Features

### 🤖 AI Chat Assistant

- **Intelligent Query Processing**: Advanced RAG (Retrieval-Augmented Generation) with HyDE (Hypothetical Document Embeddings) approach
- **Contextual Responses**: Powered by Google Gemini AI with specialized MOSDAC domain knowledge
- **Chat History**: Persistent conversation history per user
- **Vector Search**: Semantic search through scraped MOSDAC documentation using Qdrant vector database

### 📊 Dataset Downloads

- **Automated Downloads**: Direct integration with MOSDAC API for dataset retrieval
- **Download Management**: Queue-based download system with real-time status tracking
- **User Authentication**: Secure MOSDAC credential management
- **File Management**: Automatic file organization and serving

### 🌐 Browser Extension

- **Universal Access**: Chrome extension for accessing AI assistant on any website
- **MOSDAC Integration**: Content script injection on mosdac.gov.in for enhanced browsing
- **Floating Widget**: Non-intrusive chat interface overlay
- **Cross-platform**: Works seamlessly with the main web application

### 🔍 Data Scraping & Processing

- **Comprehensive Crawling**: Automated scraping of MOSDAC documentation and datasets
- **Multi-format Support**: HTML, PDF, XML content extraction
- **Text Processing**: Advanced preprocessing and chunking for optimal retrieval
- **Vector Embeddings**: Semantic indexing using Google's embedding models

## 🏗️ Architecture

The project consists of three main components:

### 1. **Client** (Next.js Frontend)

- **Framework**: Next.js 15 with TypeScript
- **UI**: Modern React components with Tailwind CSS
- **State Management**: React Query for server state
- **Authentication**: NextAuth.js integration
- **Features**:
  - Responsive dashboard interface
  - Real-time chat interface
  - Download management system
  - User authentication flows

### 2. **Server** (FastAPI Backend)

- **Framework**: FastAPI with Python
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Vector DB**: Qdrant for semantic search
- **AI**: Google Gemini integration
- **Features**:
  - RESTful API endpoints
  - JWT-based authentication
  - Background download processing
  - Vector search capabilities
  - MOSDAC API integration

### 3. **Extension** (Chrome Extension)

- **Framework**: React with Vite build system
- **TypeScript**: Full type safety
- **Features**:
  - Manifest V3 compliance
  - Content script injection
  - Background service worker
  - Chrome storage API integration

## 🛠️ Technology Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Query** - Server state management
- **NextAuth.js** - Authentication

### Backend

- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Relational database
- **SQLAlchemy** - Python ORM
- **Qdrant** - Vector database for semantic search
- **Google Gemini** - Large language model
- **JWT** - Authentication tokens
- **BeautifulSoup** - Web scraping
- **PDFMiner** - PDF text extraction

### Extension

- **React** - Component library
- **Vite** - Build tool
- **Chrome APIs** - Browser extension functionality
- **TypeScript** - Type safety

## 📁 Project Structure

```
project/
├── client/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility libraries
│   └── package.json
├── server/                 # FastAPI backend application
│   ├── app/
│   │   ├── routes/        # API endpoints
│   │   ├── models/        # Database models
│   │   ├── services/      # Business logic
│   │   ├── scraping/      # Web scraping utilities
│   │   ├── vector_db/     # Vector database operations
│   │   └── utils/         # Helper functions
│   └── requirements.txt
├── extension/              # Chrome extension
│   ├── src/
│   │   ├── popup/         # Extension popup interface
│   │   ├── content/       # Content script injection
│   │   ├── background/    # Service worker
│   │   └── lib/           # Extension utilities
│   └── manifest.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Python 3.9+
- PostgreSQL database
- Qdrant vector database
- Google Gemini API key

### Installation

1. **Clone the repository**

   ```bash
   git clone isro-sagarmegh-ai
   cd isro-sagarmegh-ai
   ```

2. **Setup Environment Variables**

   Create `.env` files in both `client/` and `server/` directories:

   **Server (.env)**

   ```env
   DATABASE_URL=postgresql://user:password@localhost/mosdac_ai
   QDRANT_URL=http://localhost:6333
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET_KEY=your_jwt_secret
   ```

   **Client (.env.local)**

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Install Dependencies**

   **Client**

   ```bash
   cd client
   pnpm install
   ```

   **Server**

   ```bash
   cd server
   pip install -r requirements.txt
   ```

   **Extension**

   ```bash
   cd extension
   pnpm install
   ```

4. **Setup Database**

   ```bash
   cd server
   # Create PostgreSQL database
   createdb mosdac_ai

   # Run migrations (if any)
   python -m alembic upgrade head
   ```

5. **Start Services**

   **Start Qdrant** (Docker)

   ```bash
   docker run -p 6333:6333 qdrant/qdrant
   ```

   **Start Server**

   ```bash
   cd server
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   **Start Client**

   ```bash
   cd client
   pnpm dev
   ```

   **Build Extension**

   ```bash
   cd extension
   pnpm build
   ```

## 🔧 Configuration

### Database Setup

The application uses PostgreSQL for persistent storage and Qdrant for vector search. Ensure both databases are running before starting the server.

### MOSDAC Integration

The system integrates with MOSDAC's official API for dataset downloads. Users need valid MOSDAC credentials to download datasets.

### AI Configuration

The chatbot uses Google Gemini for generating responses. Configure your API key in the server environment variables.

## 📚 API Documentation

### Authentication Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info

### Chat Endpoints

- `POST /chat/` - Send message to AI assistant
- `GET /chat/history` - Get chat history

### Download Endpoints

- `POST /download/start` - Start dataset download
- `GET /download/status/{job_id}` - Get download status
- `GET /download/history` - Get download history
- `GET /download/file/{job_id}` - Download completed file

## 🌟 Key Features in Detail

### AI Chat Assistant

The chatbot implements an advanced RAG system with:

- **HyDE Approach**: Generates hypothetical answers to improve retrieval
- **Vector Search**: Semantic similarity search through MOSDAC documentation
- **Context Awareness**: Maintains conversation history for better responses
- **Domain Specialization**: Trained specifically for MOSDAC and satellite data

### Download Management

Automated download system featuring:

- **Queue Processing**: Background job processing for large datasets
- **Status Tracking**: Real-time progress monitoring
- **Error Handling**: Robust error recovery and retry mechanisms
- **File Organization**: Automatic file management and serving

### Browser Extension

Chrome extension providing:

- **Universal Access**: AI assistant available on any website
- **MOSDAC Integration**: Enhanced browsing experience on mosdac.gov.in
- **Seamless Authentication**: Shared authentication with main application
- **Non-intrusive UI**: Floating widget that doesn't interfere with browsing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏛️ About ISRO SagarMegh

SagarMegh is ISRO's comprehensive platform for meteorological and oceanographic satellite data services. This AI-powered interface enhances access to MOSDAC's vast repository of satellite data, providing researchers, scientists, and weather professionals with intelligent tools for data discovery and analysis.

### Key Benefits

- **24/7 Data Availability**: Continuous access to satellite data archives
- **AI-Powered Insights**: Intelligent assistance for data discovery and analysis
- **Seamless Integration**: Browser extension for enhanced productivity
- **Secure Access**: Robust authentication and data protection
- **Real-time Monitoring**: Live weather and ocean state information

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Refer to the API documentation

---

**Developed for the 2025 SSIP Vikas Saptah Hackathon**

_Empowering space research with AI-driven satellite data access_
