import { Question } from "../types/quiz";

const sampleQuestions: Question[] = [
  {
    id: "q1",
    text: "Which React hook is used to manage side effects such as fetching data or subscribing to events?",
    choices: ["useState", "useEffect", "useMemo", "useRef"],
    correctIndex: 1,
    explanation: "`useEffect` runs after render and is commonly used for side effects like API calls and subscriptions.",
  },
  {
    id: "q2",
    text: "In a Node.js backend, which package is commonly used for building web servers and APIs?",
    choices: ["React", "Express", "Next.js", "Tailwind CSS"],
    correctIndex: 1,
    explanation: "Express is a minimal and flexible Node.js web application framework for building APIs and servers.",
  },
  {
    id: "q3",
    text: "What does REST stand for in web services?",
    choices: ["Representational State Transfer", "Rapid Service Transaction", "Remote Server Transfer", "Readable Structured Text"],
    correctIndex: 0,
    explanation: "REST stands for Representational State Transfer, an architectural style for distributed hypermedia systems.",
  },
  {
    id: "q4",
    text: "Which CSS framework provides utility classes and is used in this project?",
    choices: ["Bootstrap", "Material UI", "Tailwind CSS", "Bulma"],
    correctIndex: 2,
    explanation: "Tailwind CSS provides low-level utility classes to build custom designs quickly.",
  },
  {
    id: "q5",
    text: "When storing short-lived UI state that should survive page refresh but not persist forever, which web API is appropriate?",
    choices: ["localStorage", "sessionStorage", "IndexedDB", "Cookies"],
    correctIndex: 1,
    explanation: "sessionStorage persists data for a single tab session and is cleared when the tab is closed — ideal for session-scoped UI state.",
  },
  {
    id: "q6",
    text: "What is the primary role of an API key like OpenAI's key in a backend service?",
    choices: ["Style the frontend", "Authenticate requests to the AI service", "Store user sessions", "Manage database migrations"],
    correctIndex: 1,
    explanation: "API keys authenticate and authorize requests to external services such as OpenAI from your backend.",
  }
];

export default sampleQuestions;
