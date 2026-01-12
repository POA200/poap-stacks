# Stacks POAP dApp

A Proof of Attendance Protocol (POAP) platform built on the Stacks Blockchain (Bitcoin L2).

## Project Overview

- **Frontend**: Next.js 14+ with App Router in Turborepo
- **Smart Contracts**: Clarity language for Stacks blockchain
- **Database**: PostgreSQL with Prisma ORM
- **UI**: Tailwind CSS + Shadcn UI components
- **Wallet**: Hiro Wallet / Xverse integration

## Project Structure

```
poap-stacks/
├── apps/
│   ├── web/              # Next.js Frontend (main dApp)
│   └── docs/             # Documentation site
├── packages/
│   ├── contracts/        # Clarity smart contracts
│   ├── database/         # Prisma configuration
│   ├── typescript-config/# Shared TypeScript configs
│   ├── eslint-config/    # Shared ESLint configs
│   └── ui-config/        # Tailwind + PostCSS configs
├── .env.example          # Environment variables template
└── turbo.json            # Turborepo configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd poap-stacks
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Set up the database:
```bash
cd apps/web
npx prisma migrate dev --name init
```

### Development

Start all apps in development mode:
```bash
npm run dev
```

The web app will run on `http://localhost:3000`

### Building

Build all packages:
```bash
npm run build
```

## Core Features

### For Event Hosts
- Create time-bound attendance events
- Set claim windows with block height/timestamp
- Manage attendee lists
- Monitor badge claims

### For Attendees
- Discover events
- Connect Stacks wallet (Hiro/Xverse)
- Mint unique NFT badges when claim window is active
- View claimed badges

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 19, Tailwind CSS |
| Contract | Clarity, SIP-009 NFT Standard |
| Blockchain | Stacks (Bitcoin L2) |
| Database | PostgreSQL, Prisma |
| Wallet | Stacks.js, Hiro/Xverse |
| Deployment | Vercel, Stacks Mainnet |

## Database Schema

```prisma
model User {
  id: String @id
  stacksAddress: String @unique
  name: String?
  bio: String?
  badges: Badge[]
  eventsCreated: Event[]
}

model Event {
  id: String @id
  title: String
  description: String
  startTime: DateTime
  endTime: DateTime
  host: User
  claims: Badge[]
  maxClaims: Int?
  status: String
}

model Badge {
  id: String @id
  txHash: String @unique
  owner: User
  event: Event
  createdAt: DateTime
}
```

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/events` | GET | List all events |
| `/api/events` | POST | Create new event |
| `/api/events/[id]` | GET | Get event details |
| `/api/events/[id]` | PATCH | Update event |
| `/api/users` | GET | List all users |
| `/api/users` | POST | Create new user |
| `/api/users/[id]` | GET | Get user profile |
| `/api/badges` | GET | List all badges |
| `/api/badges` | POST | Claim new badge |

## Smart Contracts

### POAP Core (`poap-core.clar`)

Implements SIP-009 NFT standard with:
- `mint-badge(event-id, to)`: Mint badge for attendee
- `is-claimed(event-id, claimer)`: Check if badge already claimed
- `get-token-owner(token-id)`: Get badge owner

## Environment Variables

See `.env.example` for required variables:

```env
DATABASE_URL=...           # PostgreSQL connection
NEXT_PUBLIC_STACKS_NETWORK=testnet
NEXT_PUBLIC_STACKS_API=https://api.testnet.hiro.so
```

## Development Workflow

1. Create feature branch
2. Make changes
3. Run linter: `npm run lint`
4. Run type check: `npm run check-types`
5. Run tests: `npm test`
6. Commit and push
7. Create pull request

## Deployment

### Frontend (Vercel)
Connected to main branch. Automatic deploys on push.

### Smart Contracts (Stacks)
Deploy to testnet or mainnet using Clarinet.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT
