# Documentation

Comprehensive documentation for the Scalable App Template.

## Getting Started

Start here if you're new to the template:

- **[Getting Started](setup/getting-started.md)** - Quick start guide and basic usage
- **[Troubleshooting](setup/troubleshooting.md)** - Common issues and solutions

## Architecture

Understand the template architecture:

- **[Serverless Architecture](architecture/serverless.md)** - Firebase Cloud Functions design
- **[Clean Architecture](architecture/CLEAN_ARCHITECTURE.md)** - Domain-driven design principles

## Development

- **[Agentic Architecture](agentic/AGENTIC_ARCHITECTURE.md)** - AI agent integration (optional)
- **[Quick Start Agents](agentic/QUICK_START_AGENTS.md)** - Get started with AI features (optional)

## Deployment

- **[Deployment Guide](deployment/DEPLOYMENT.md)** - Production deployment instructions

## Contributing

- **[Contributing Guidelines](CONTRIBUTING.md)** - How to contribute to the template
- **[Changelog](CHANGELOG.md)** - Version history and changes

## Quick Links

### Setup & Run
```bash
./setup.sh  # One-time setup
./dev.sh    # Start development
./deploy.sh # Deploy to production
```

### Key Files
- `backend/functions/main.py` - Cloud Functions entry points
- `backend/functions/handlers/` - Business logic handlers
- `firebase.json` - Firebase configuration
- `firestore.rules` - Database security rules

### Documentation Structure
```
docs/
├── setup/
│   ├── getting-started.md    # ⭐ Start here
│   └── troubleshooting.md
│
├── architecture/
│   ├── serverless.md         # Serverless design
│   └── CLEAN_ARCHITECTURE.md # Clean Architecture
│
├── agentic/                  # AI features (optional)
│   ├── AGENTIC_ARCHITECTURE.md
│   └── QUICK_START_AGENTS.md
│
├── deployment/
│   └── DEPLOYMENT.md
│
├── archive/                  # Old documentation
│
├── CONTRIBUTING.md
└── CHANGELOG.md
```

## External Resources

- [Firebase Functions Docs](https://firebase.google.com/docs/functions)
- [Cloud Functions Python](https://github.com/GoogleCloudPlatform/functions-framework-python)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Need Help?

1. **Check troubleshooting**: [setup/troubleshooting.md](setup/troubleshooting.md)
2. **Read getting started**: [setup/getting-started.md](setup/getting-started.md)
3. **Check logs**: `tail -f logs/firebase.log`
4. **Open an issue**: Submit with logs and error details
