# Leap.new Open Source

An open-source platform for AI-driven full-stack application generation using natural language prompts. Built with Encore.ts microservices architecture, React frontend, and PostgreSQL.

## 🚀 Overview

Leap.new Open Source is a comprehensive platform that transforms natural language descriptions into production-ready applications. Unlike prototyping tools, it generates real backend services with APIs, databases, and deployments to major cloud providers.

### Key Features

- **AI Code Generation**: Transform prompts into full-stack applications
- **Microservices Architecture**: Scalable backend built with Encore.ts
- **Real-time Collaboration**: WebSocket-powered updates and event streaming
- **Multi-cloud Deployment**: Deploy to AWS, GCP, or run locally
- **Type-safe APIs**: End-to-end TypeScript with auto-generated clients
- **Production Ready**: Built-in databases, caching, and monitoring

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Frontend  │    │   API Gateway   │    │ CodeGen Service │
│   (React/TS)    │◄──►│   (GraphQL +    │◄──►│   (AI/LLM)      │
│                 │    │   REST + WS)    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  Notes Service  │    │   Event Bus     │
                       │   (CRUD + Tags) │◄──►│ (Kafka/NATS/   │
                       │                 │    │  Cloud Pub/Sub) │
                       └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   PostgreSQL    │    │ Redis Cache     │
                       │  (Multi-DB)     │    │   (Optional)    │
                       └─────────────────┘    └─────────────────┘
```

### Services

- **API Gateway**: REST/GraphQL endpoints, WebSocket support, authentication
- **Notes Service**: CRUD operations with tags, real-time events
- **CodeGen Service**: AI-powered code generation with multiple LLM providers
- **Event Bus**: Pluggable event system (Kafka, NATS, Cloud Pub/Sub)
- **Web Frontend**: React + TypeScript + Tailwind CSS interface

## 🛠️ Quickstart (Local Development)

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Encore CLI: `curl -L https://encore.dev/install.sh | bash`
- Git

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/leap-new/open-source.git
cd leap-new-open-source
```

2. **Start development environment**
```bash
make dev
```

This will:
- Start PostgreSQL, Redis, and NATS using Docker Compose
- Install dependencies
- Run database migrations
- Start the Encore backend
- Launch the frontend development server

3. **Set up secrets** (optional for AI features)
```bash
encore secret set OpenAIKey "your-openai-api-key"
encore secret set EventBusType "nats"
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Encore Dashboard: http://localhost:4000/_encore

### Alternative Setup (Manual)

```bash
# Install dependencies
npm install
cd frontend && npm install

# Start infrastructure
docker-compose -f docker-compose.dev.yml up -d

# Run migrations
encore db migrate

# Start backend
encore run

# Start frontend (in another terminal)
cd frontend && npm run dev
```

## 🚀 Deploy to AWS

### Prerequisites
- AWS CLI configured
- Encore account: [encore.dev](https://encore.dev)

### Deploy

1. **Create environment**
```bash
make create-env-production
encore env create production --cloud=aws
```

2. **Set production secrets**
```bash
encore secret set --env=production OpenAIKey "your-production-openai-key"
encore secret set --env=production EventBusType "kafka"
```

3. **Deploy**
```bash
make deploy-aws ENV=production
```

### Using Terraform (Optional)

```bash
cd terraform/aws
terraform init
terraform plan -var="db_password=your-secure-password"
terraform apply
```

## 🌐 Deploy to GCP

### Prerequisites
- Google Cloud SDK configured
- Encore account with GCP integration

### Deploy

1. **Create environment**
```bash
encore env create production --cloud=gcp
```

2. **Set secrets**
```bash
encore secret set --env=production OpenAIKey "your-openai-key"
encore secret set --env=production GCPProjectId "your-project-id"
```

3. **Deploy**
```bash
make deploy-gcp ENV=production
```

## 🧪 Run Tests

```bash
# Run all tests
make test

# Backend tests only
encore test

# Frontend tests only
cd frontend && npm test

# Integration tests
encore test --integration

# Test with coverage
make test
```

## 📚 API Documentation

Once running, access the API documentation:
- REST API: http://localhost:4000/
- GraphQL Playground: http://localhost:4000/graphql
- WebSocket: ws://localhost:4000/ws

### Example API Usage

```bash
# Create a note
curl -X POST http://localhost:4000/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "My Note", "body": "Note content"}'

# Generate code
curl -X POST http://localhost:4000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a todo app", "target": "frontend"}'

# Deploy an app
curl -X POST http://localhost:4000/deploy \
  -H "Content-Type: application/json" \
  -d '{"appId": "app123", "target": "aws", "environment": "production"}'
```

## 🔧 Configuration

### Environment Variables

See `.env.example` for all configuration options.

Key settings:
- `EVENT_BUS_TYPE`: Event bus adapter (nats, kafka, gcp-pubsub)
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: For AI code generation
- `AWS_REGION` / `GCP_PROJECT_ID`: Cloud deployment settings

### Encore Profiles

Configure deployment targets in `encore.toml`:
- `aws-default`: AWS ECS deployment
- `gcp-default`: Google Cloud Run deployment
- `local`: Local development

## 🤝 How to Contribute

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `make test`
5. Submit a pull request

### Development Workflow

- **Code Style**: We use Prettier and ESLint
- **Testing**: Write tests for new features
- **Documentation**: Update docs for API changes
- **Commits**: Use conventional commit messages

## 📋 Roadmap

### Current Features
- ✅ AI-powered code generation
- ✅ Real-time WebSocket updates
- ✅ Multi-cloud deployment
- ✅ Event-driven architecture
- ✅ Type-safe APIs

### Upcoming Features
- 🔄 User authentication & teams
- 🔄 Advanced code templates
- 🔄 Visual app builder
- 🔄 GitHub integration
- 🔄 Monitoring & analytics

## 🐛 Troubleshooting

### Common Issues

**Backend won't start**
```bash
# Check if ports are in use
lsof -i :4000
# Kill conflicting processes
make clean && make dev
```

**Database connection errors**
```bash
# Reset database
make db-reset
# Check Docker containers
docker-compose -f docker-compose.dev.yml logs postgres
```

**Frontend build issues**
```bash
# Clear node modules
cd frontend && rm -rf node_modules package-lock.json
npm install
```

### Getting Help

- 📖 [Documentation](https://docs.leap.new)
- 💬 [Discord Community](https://discord.gg/leap)
- 🐛 [GitHub Issues](https://github.com/leap-new/open-source/issues)
- 📧 [Email Support](mailto:support@leap.new)

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [Encore.ts](https://encore.dev) - Backend framework
- [OpenAI](https://openai.com) - AI code generation
- [Tailwind CSS](https://tailwindcss.com) - UI styling
- [React](https://react.dev) - Frontend framework

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=leap-new/open-source&type=Date)](https://star-history.com/#leap-new/open-source&Date)

---

Made with ❤️ by the Leap.new team and contributors
