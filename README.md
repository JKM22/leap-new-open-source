# Leap.new Open Source

An open-source platform for AI-driven full-stack application generation using natural language prompts. Built with Encore.ts microservices architecture, React frontend, and PostgreSQL.

## 🚀 Features

- **AI Code Generation**: Natural language to full-stack application code
- **Microservices Architecture**: Modular, scalable backend services
- **Real-time Updates**: Event-driven communication between services
- **Modern UI**: Dark theme with Leap.new-inspired interface
- **Multi-cloud Deployment**: AWS and GCP support via Encore
- **Type-safe APIs**: Full-stack TypeScript with auto-generated clients

## 🏗️ Architecture

- **API Gateway**: REST and GraphQL endpoint aggregation
- **Notes Service**: Example CRUD service with tags and real-time updates
- **CodeGen Service**: AI-powered code generation (OpenAI/local LLM)
- **Web Frontend**: React + TypeScript + Tailwind UI
- **Event Bus**: Pub/Sub for service communication
- **PostgreSQL**: Managed database with migrations

## 🛠️ Local Development

### Prerequisites

- Node.js 18+
- Encore CLI: `curl -L https://encore.dev/install.sh | bash`
- Git

### Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd leap-new-open-source
```

2. Install dependencies:
```bash
encore app init
```

3. Set up environment variables:
```bash
# Create secrets in Encore dashboard or via CLI
encore secret set OpenAIKey "your-openai-api-key"
```

4. Run database migrations:
```bash
encore db migrate
```

5. Start development server:
```bash
encore run
```

The application will be available at:
- Backend: `http://localhost:4000`
- Frontend: `http://localhost:3000`

## 🚀 Deployment

### AWS Deployment (Default)

1. Link your Encore app to AWS:
```bash
encore env create production --cloud=aws
```

2. Set production secrets:
```bash
encore secret set --env=production OpenAIKey "your-production-openai-key"
```

3. Deploy:
```bash
encore deploy production
```

### GCP Deployment

1. Link your Encore app to GCP:
```bash
encore env create production --cloud=gcp
```

2. Set production secrets and deploy as above.

### GitHub Actions CI/CD

The repository includes automated CI/CD pipelines:

- **Pull Request**: Runs tests and linting
- **Main Branch**: Deploys to staging environment
- **Tagged Release**: Deploys to production

Set the following GitHub secrets:
- `ENCORE_AUTH_TOKEN`: Your Encore authentication token

## 🔄 2-Way GitHub Sync (Leap Workflow)

Enable bidirectional sync between your local development and GitHub:

1. Install GitHub CLI: `gh auth login`
2. Configure Encore GitHub integration:
```bash
encore auth login --github
encore app link-github <your-repo>
```

3. Enable auto-sync in Encore dashboard:
   - Go to your app settings
   - Enable "GitHub Sync"
   - Configure sync preferences

## 📚 API Documentation

Once running, access the API documentation at:
- REST API: `http://localhost:4000/`
- GraphQL Playground: `http://localhost:4000/graphql`

## 🧪 Testing

Run the test suite:
```bash
# Backend tests
encore test

# Frontend tests
cd frontend && npm test

# Integration tests
npm run test:e2e
```

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## 🏢 Services Overview

### API Gateway
- REST and GraphQL endpoint aggregation
- Request routing and load balancing
- Cross-service data composition

### Notes Service
- CRUD operations for notes
- Tag management system
- Real-time event publishing

### CodeGen Service
- AI-powered code generation
- Support for multiple LLM providers
- Template-based code scaffolding

### Web Frontend
- React-based user interface
- Real-time updates via WebSockets
- Responsive design with Tailwind CSS

For detailed architecture documentation, see [ARCHITECTURE.md](ARCHITECTURE.md).
