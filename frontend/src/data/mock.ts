export interface Freelancer {
  id: string;
  name: string;
  email: string;
  rate: number;
}

export interface TimeEntry {
  id: string;
  date: string;
  hours: number;
  description: string;
}

export interface WorkLog {
  id: string;
  taskName: string;
  freelancerId: string;
  timeEntries: TimeEntry[];
}

// Mock Data

export const freelancers: Freelancer[] = [
  {
    id: "fr-001",
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    rate: 95,
  },
  {
    id: "fr-002",
    name: "Marcus Johnson",
    email: "marcus.j@email.com",
    rate: 75,
  },
  {
    id: "fr-003",
    name: "Elena Petrova",
    email: "elena.p@email.com",
    rate: 120,
  },
  {
    id: "fr-004",
    name: "David Kim",
    email: "david.kim@email.com",
    rate: 45,
  },
];

export const worklogs: WorkLog[] = [
  {
    id: "wl-001",
    taskName: "API Gateway Refactor",
    freelancerId: "fr-001",
    timeEntries: [
      {
        id: "te-001",
        date: "2026-01-06",
        hours: 6,
        description:
          "Analyzed existing gateway architecture and documented pain points",
      },
      {
        id: "te-002",
        date: "2026-01-07",
        hours: 8,
        description: "Implemented new routing layer with middleware support",
      },
      {
        id: "te-003",
        date: "2026-01-08",
        hours: 4,
        description: "Wrote integration tests for gateway endpoints",
      },
      {
        id: "te-004",
        date: "2026-01-09",
        hours: 3,
        description: "Code review fixes and documentation updates",
      },
    ],
  },
  {
    id: "wl-002",
    taskName: "User Dashboard Redesign",
    freelancerId: "fr-001",
    timeEntries: [
      {
        id: "te-005",
        date: "2026-01-20",
        hours: 5,
        description: "Created wireframes and component hierarchy",
      },
      {
        id: "te-006",
        date: "2026-01-21",
        hours: 7,
        description: "Built dashboard layout with responsive grid",
      },
      {
        id: "te-007",
        date: "2026-01-22",
        hours: 6,
        description: "Implemented chart components and data binding",
      },
    ],
  },
  {
    id: "wl-003",
    taskName: "Database Migration Script",
    freelancerId: "fr-002",
    timeEntries: [
      {
        id: "te-008",
        date: "2026-02-03",
        hours: 4,
        description: "Schema analysis and migration plan",
      },
      {
        id: "te-009",
        date: "2026-02-04",
        hours: 8,
        description: "Wrote migration scripts with rollback support",
      },
      {
        id: "te-010",
        date: "2026-02-05",
        hours: 6,
        description: "Tested migrations on staging environment",
      },
      {
        id: "te-011",
        date: "2026-02-06",
        hours: 2,
        description: "Documented migration procedures",
      },
    ],
  },
  {
    id: "wl-004",
    taskName: "Authentication Flow Update",
    freelancerId: "fr-002",
    timeEntries: [
      {
        id: "te-012",
        date: "2026-02-10",
        hours: 5,
        description: "Reviewed current OAuth2 implementation",
      },
      {
        id: "te-013",
        date: "2026-02-11",
        hours: 7,
        description: "Added PKCE support and refresh token rotation",
      },
      {
        id: "te-014",
        date: "2026-02-12",
        hours: 4,
        description: "Updated client-side token management",
      },
    ],
  },
  {
    id: "wl-005",
    taskName: "ML Pipeline Optimization",
    freelancerId: "fr-003",
    timeEntries: [
      {
        id: "te-015",
        date: "2026-02-17",
        hours: 8,
        description: "Profiled pipeline bottlenecks and memory usage",
      },
      {
        id: "te-016",
        date: "2026-02-18",
        hours: 6,
        description: "Implemented batch processing with GPU acceleration",
      },
      {
        id: "te-017",
        date: "2026-02-19",
        hours: 7,
        description: "Added model caching and warm-start support",
      },
      {
        id: "te-018",
        date: "2026-02-20",
        hours: 4,
        description: "Performance benchmarks and regression tests",
      },
      {
        id: "te-019",
        date: "2026-02-21",
        hours: 3,
        description: "Deployed to staging and validated metrics",
      },
    ],
  },
  {
    id: "wl-006",
    taskName: "Mobile App Bug Fixes",
    freelancerId: "fr-004",
    timeEntries: [
      {
        id: "te-020",
        date: "2026-01-13",
        hours: 3,
        description: "Fixed crash on notification deep links",
      },
      {
        id: "te-021",
        date: "2026-01-14",
        hours: 5,
        description: "Resolved memory leak in image gallery",
      },
      {
        id: "te-022",
        date: "2026-01-15",
        hours: 4,
        description: "Fixed offline mode data sync issues",
      },
    ],
  },
  {
    id: "wl-007",
    taskName: "CI/CD Pipeline Setup",
    freelancerId: "fr-004",
    timeEntries: [
      {
        id: "te-023",
        date: "2026-03-03",
        hours: 6,
        description: "Configured GitHub Actions workflows",
      },
      {
        id: "te-024",
        date: "2026-03-04",
        hours: 4,
        description: "Set up Docker build and push stages",
      },
      {
        id: "te-025",
        date: "2026-03-05",
        hours: 5,
        description: "Added deployment gates and rollback automation",
      },
    ],
  },
  {
    id: "wl-008",
    taskName: "Payment Integration",
    freelancerId: "fr-003",
    timeEntries: [
      {
        id: "te-026",
        date: "2026-03-10",
        hours: 7,
        description: "Integrated Stripe API for recurring billing",
      },
      {
        id: "te-027",
        date: "2026-03-11",
        hours: 5,
        description: "Built webhook handlers for payment events",
      },
      {
        id: "te-028",
        date: "2026-03-12",
        hours: 6,
        description: "Added invoice generation and PDF export",
      },
    ],
  },
  {
    id: "wl-009",
    taskName: "Search Service Implementation",
    freelancerId: "fr-001",
    timeEntries: [
      {
        id: "te-029",
        date: "2026-03-17",
        hours: 8,
        description: "Set up Elasticsearch cluster and index mappings",
      },
      {
        id: "te-030",
        date: "2026-03-18",
        hours: 6,
        description: "Implemented full-text search with faceted filtering",
      },
      {
        id: "te-031",
        date: "2026-03-19",
        hours: 5,
        description: "Added autocomplete and search suggestions",
      },
    ],
  },
  {
    id: "wl-010",
    taskName: "Accessibility Audit Fixes",
    freelancerId: "fr-004",
    timeEntries: [
      {
        id: "te-032",
        date: "2026-02-24",
        hours: 4,
        description: "Ran WCAG 2.1 audit and catalogued issues",
      },
      {
        id: "te-033",
        date: "2026-02-25",
        hours: 6,
        description: "Fixed color contrast and keyboard navigation",
      },
      {
        id: "te-034",
        date: "2026-02-26",
        hours: 3,
        description: "Added ARIA labels and screen reader support",
      },
    ],
  },
];

// Helper Functions

export function getFreelancer(freelancerId: string): Freelancer | undefined {
  return freelancers.find((f) => f.id === freelancerId);
}

export function getTotalHours(worklog: WorkLog): number {
  return worklog.timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
}

export function getTotalEarnings(worklog: WorkLog): number {
  const freelancer = getFreelancer(worklog.freelancerId);
  if (!freelancer) return 0;
  return getTotalHours(worklog) * freelancer.rate;
}

export function getWorklogById(id: string): WorkLog | undefined {
  return worklogs.find((w) => w.id === id);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getWorklogDateRange(worklog: WorkLog): {
  earliest: string;
  latest: string;
} {
  const dates = worklog.timeEntries.map((e) => e.date).sort();
  return { earliest: dates[0], latest: dates[dates.length - 1] };
}
