# Architecture Documentation

## Overview

Leap.new Open Source is built as a microservices architecture using Encore.ts, providing a scalable and maintainable platform for AI-driven application generation.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Frontend  │    │   API Gateway   │    │ CodeGen Service │
│   (React/TS)    │◄──►│   (GraphQL +    │◄──►│   (AI/LLM)      │
│                 │    │   REST)         │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  Notes Service  │    │   Event Bus     │
                       │   (CRUD + Tags) │◄──►│   (Pub/Sub)     │
                       │                 │    │                 │
                       └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   PostgreSQL    │    │  Cloud Storage  │
                       │  (Encore Mgd)   │    │   (Optional)    │
                       └─────────────────┘    └─────────────────┘
```

## Services

### 1. API Gateway (`backend/gateway/`)

**Responsibilities:**
- Route requests to appropriate services
- Aggregate data from multiple services
- Provide both REST and GraphQL interfaces
- Handle cross-cutting concerns (logging, monitoring)

**Endpoints:**
- `GET /api/health` - Health check
- `POST /graphql` - GraphQL endpoint
- `/api/*` - REST API routing

**Technology:**
- Encore.ts API framework
- GraphQL schema stitching
- Service-to-service communication

### 2. Notes Service (`backend/notes/`)

**Responsibilities:**
- CRUD operations for notes
- Tag management and filtering
- Real-time event publishing
- Example implementation for generated apps

**Endpoints:**
- `GET /notes` - List notes with filtering
- `POST /notes` - Create new note
- `GET /notes/:id` - Get specific note
- `PUT /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note
- `GET /notes/:id/tags` - Get note tags
- `POST /notes/:id/tags` - Add tags to note

**Database Schema:**
```sql
-- Notes table
CREATE TABLE notes (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tags table
CREATE TABLE tags (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#gray'
);

-- Note-Tag relationships
CREATE TABLE note_tags (
  note_id BIGINT REFERENCES notes(id) ON DELETE CASCADE,
  tag_id BIGINT REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);
```

### 3. CodeGen Service (`backend/codegen/`)

**Responsibilities:**
- Process natural language prompts
- Generate frontend/backend code snippets
- Manage AI provider integrations (OpenAI, local LLM)
- Template-based code scaffolding

**Endpoints:**
- `POST /generate` - Generate code from prompt
- `GET /templates` - List available templates
- `POST /validate` - Validate generated code
- `GET /providers` - List available AI providers

**AI Integration:**
- OpenAI GPT-4 integration
- Local LLM support (Ollama, etc.)
- Template system for consistent code generation
- Code validation and formatting

### 4. Web Frontend (`frontend/`)

**Responsibilities:**
- User interface for the platform
- Real-time updates via WebSockets
- Code preview and editing
- Project management

**Pages:**
- `/` - Dashboard with prompt input
- `/projects` - Project list and management
- `/projects/:id` - Project detail and preview
- `/admin` - Admin panel (future)

**Components:**
- Sidebar navigation
- Prompt input with AI suggestions
- Code preview with syntax highlighting
- Real-time collaboration features

## Data Flow

### 1. Code Generation Flow

```
User Input (Prompt) → API Gateway → CodeGen Service → AI Provider → Code Output
                                  ↓
                              Event Bus → Notes Service (Save Generated App)
                                  ↓
                              WebSocket → Frontend (Real-time Update)
```

### 2. Notes CRUD Flow

```
Frontend Request → API Gateway → Notes Service → PostgreSQL
                                      ↓
                                 Event Bus → Other Services (Notifications)
                                      ↓
                                 WebSocket → Frontend (Real-time Update)
```

### 3. GraphQL Data Aggregation

```
GraphQL Query → API Gateway → Multiple Services (Notes, CodeGen) → Aggregated Response
```

## Event System

### Event Bus Architecture

The platform uses Encore's built-in Pub/Sub system for event-driven communication:

**Event Types:**
- `note.created` - When a new note is created
- `note.updated` - When a note is modified
- `note.deleted` - When a note is removed
- `code.generated` - When new code is generated
- `project.created` - When a new project is created

**Event Schema:**
```typescript
interface NoteEvent {
  type: 'created' | 'updated' | 'deleted';
  noteId: string;
  userId?: string;
  timestamp: Date;
  data: Note;
}

interface CodeGeneratedEvent {
  type: 'generated';
  promptId: string;
  userId?: string;
  timestamp: Date;
  code: {
    frontend: string;
    backend: string;
    type: 'component' | 'service' | 'full-app';
  };
}
```

## Database Design

### PostgreSQL Schema

The application uses a single PostgreSQL database managed by Encore with the following main entities:

**Core Tables:**
- `notes` - User notes and content
- `tags` - Reusable tags for categorization
- `note_tags` - Many-to-many relationship
- `generated_apps` - AI-generated applications
- `templates` - Code generation templates

**Indexes:**
- `notes.created_at` - For chronological ordering
- `notes.title` - For text search
- `tags.name` - For tag lookup
- `generated_apps.created_at` - For project listing

## Security Considerations

### API Security

- **Input Validation**: All API inputs are validated using TypeScript interfaces
- **SQL Injection Prevention**: Parameterized queries via Encore's SQL template literals
- **Rate Limiting**: Built-in Encore rate limiting on API endpoints
- **CORS**: Configured for frontend domain

### Data Protection

- **Environment Variables**: Sensitive data stored in Encore secrets
- **Database Encryption**: Automatic encryption at rest via cloud providers
- **API Keys**: Secure storage and rotation of AI provider keys

## Scalability Considerations

### Horizontal Scaling

- **Stateless Services**: All services are stateless and can scale horizontally
- **Database Connection Pooling**: Managed by Encore's database layer
- **Event Bus**: Encore Pub/Sub handles message distribution at scale

### Performance Optimization

- **Database Indexes**: Strategic indexing for common queries
- **Caching**: Future implementation of Redis caching layer
- **CDN**: Static assets served via CDN in production

## Deployment Architecture

### Cloud Infrastructure

**AWS Deployment:**
- ECS Fargate for containerized services
- RDS PostgreSQL for database
- CloudFront for CDN
- Application Load Balancer

**GCP Deployment:**
- Cloud Run for containerized services
- Cloud SQL PostgreSQL
- Cloud CDN
- Cloud Load Balancing

### Monitoring and Observability

- **Logs**: Structured logging via Encore's built-in logging
- **Metrics**: Service metrics and health checks
- **Tracing**: Distributed tracing for request flows
- **Alerts**: Automated alerting for service health

## Development Workflow

### Local Development

1. **Service Independence**: Each service can be developed and tested independently
2. **Hot Reloading**: Encore provides hot reloading for rapid development
3. **Database Migrations**: Version-controlled schema changes
4. **Event Testing**: Local event bus for testing event flows

### Testing Strategy

- **Unit Tests**: Service-level business logic testing
- **Integration Tests**: API endpoint testing with test database
- **E2E Tests**: Full user workflow testing
- **Performance Tests**: Load testing for scalability validation

## Future Enhancements

### Planned Features

- **User Authentication**: JWT-based authentication system
- **Real-time Collaboration**: Multi-user editing capabilities
- **Advanced AI Models**: Support for additional AI providers
- **Code Deployment**: Direct deployment of generated applications
- **Template Marketplace**: Community-contributed templates

### Architecture Evolution

- **Microservices Expansion**: Additional specialized services
- **Event Sourcing**: Event-driven state management
- **CQRS**: Command Query Responsibility Segregation
- **API Versioning**: Backward-compatible API evolution
