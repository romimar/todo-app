# Todo App

A modern, full-stack todo application built with React, TypeScript, Express.js, and Swagger API documentation.

## Features

- Create, read, update, and delete todo items
- Real-time search filtering
- Sort by due date
- Toggle completion status
- Show/hide completed items
- Pagination (4 items per page)
- Responsive design
- Efficient data fetching and caching with React Query
- Toast notifications for user feedback (sonner)
- Interactive API documentation (Swagger UI)
- Modern UI with Tailwind CSS and Shadcn/ui

## Architecture

**Client-Server Model** with RESTful API design:

```
┌─────────────────┐         HTTP/REST           ┌─────────────────┐
│  React Client   │ ◄─────────────────────────► │  Express Server │
│  (Port 5173)    │      (JSON over HTTP)       │  (Port 8080)    │
└─────────────────┘                             └─────────────────┘
```

### Tech Stack

**Frontend:**

- React + TypeScript
- Vite (build tool)
- TailwindCSS
- Shadcn/ui components
- TanStack Query (React Query) - data fetching & caching
- Sonner - toast notifications
- Axios

**Backend:**

- Express.js
- Swagger/OpenAPI 3.0
- Helmet (security)
- CORS

## Quick Start

### Prerequisites

- Node.js v20+ and npm
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/romimar/todo-app.git
cd todo-app
```

2. **Install backend dependencies**

```bash
cd server
npm install
```

3. **Install frontend dependencies**

```bash
cd ../client
npm install
```

### Running the Application

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

Server runs at `http://localhost:8080`

**Terminal 2 - Frontend:**

```bash
cd client
npm run dev
```

App runs at `http://localhost:5173`

### Access Points

- **Application**: http://localhost:5173
- **API Documentation**: http://localhost:8080/api-docs

## API Endpoints

| Method | Endpoint         | Description     |
| ------ | ---------------- | --------------- |
| GET    | `/api/items`     | Get all items   |
| POST   | `/api/items`     | Create new item |
| PUT    | `/api/items/:id` | Update item     |
| DELETE | `/api/items/:id` | Delete item     |

Full interactive documentation available at `/api-docs`.

## Project Structure

```
todo-app/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/         # React components
│   │   │   ├── TodoContainer.tsx
│   │   │   ├── ItemRow.tsx
│   │   │   ├── ListPagination.tsx
│   │   │   ├── shared/         # Reusable components
│   │   │   │   ├── Form.tsx
│   │   │   │   └── InputSearch.tsx
│   │   │   └── ui/             # Shadcn/ui components
│   │   ├── context/            # React context providers
│   │   │   └── ToastContext.tsx
│   │   ├── lib/                # Utility functions
│   │   │   └── utils.ts
│   │   ├── types/              # TypeScript types
│   │   │   └── formDataType.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── index.html
│   ├── components.json
│   ├── eslint.config.js
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                     # Express backend
│   ├── index.js                # Main server file
│   └── package.json
├── package.json
├── .gitignore
└── README.md
```

## Development

### Available Scripts

**Backend:**

```bash
npm run dev     # Development with nodemon
```

**Frontend:**

```bash
npm run dev     # Start dev server
npm run build   # Build for production
npm run preview # Preview production build
npm run lint    # Run ESLint
```

### Code Style

- **Frontend**: ESLint + TypeScript strict mode
- **Backend**: Standard JavaScript (CommonJS)

## Security

- Helmet.js for secure HTTP headers
- CORS restricted to `localhost:5173`
- Input validation on all API endpoints
- Content Security Policy configured

### Using Swagger UI

1. Navigate to http://localhost:8080/api-docs
2. Click any endpoint → "Try it out"
3. Fill in parameters → "Execute"

## Known Limitations

- In-memory storage (data resets on server restart)
- No authentication/authorization
- No database persistence

## Future Enhancements

- [ ] PostgreSQL/MongoDB integration
- [ ] User authentication (JWT)
- [ ] Unit & integration tests
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Cloud deployment (Vercel/Railway)

## License

MIT License - feel free to use this project for learning or personal use.

## Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Swagger](https://swagger.io/) for API documentation
- [Tailwind CSS](https://tailwindcss.com/) for styling
