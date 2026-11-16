import { User, Room, Resource, Task } from '../types';

export const SEED_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Alex Morgan',
    email: 'alex.morgan@warroom.dev',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Lead Engineer & Product Architect. Building focused tools for modern teams.',
    createdAt: '2026-01-10T09:00:00Z'
  },
  {
    id: 'user-2',
    name: 'Sarah Chen',
    email: 'sarah.chen@warroom.dev',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    bio: 'Product Designer obsessed with craft, typography, and clean ergonomics.',
    createdAt: '2026-01-12T10:30:00Z'
  },
  {
    id: 'user-3',
    name: 'David Kim',
    email: 'david.kim@warroom.dev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Fullstack developer & distributed systems enthusiast.',
    createdAt: '2026-01-15T14:15:00Z'
  },
  {
    id: 'user-4',
    name: 'Elena Rostova',
    email: 'elena.rostova@warroom.dev',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Research analyst and technical program manager.',
    createdAt: '2026-02-01T11:00:00Z'
  }
];

export const SEED_ROOMS: Room[] = [
  {
    id: 'room-hackathon-2026',
    name: 'Hackathon 2026',
    description: '48-hour sprint building next-gen collaborative developer tools with high polish.',
    visibility: 'invite',
    inviteCode: 'WR-HACK',
    ownerId: 'user-1',
    memberIds: ['user-1', 'user-2', 'user-3'],
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-03-02T16:45:00Z'
  },
  {
    id: 'room-product-dev',
    name: 'Product Development',
    description: 'Q2 core roadmap execution, sprint tasks, specifications, and architecture decisions.',
    visibility: 'private',
    inviteCode: 'WR-PROD',
    ownerId: 'user-1',
    memberIds: ['user-1', 'user-2', 'user-4'],
    createdAt: '2026-02-15T09:30:00Z',
    updatedAt: '2026-03-03T11:20:00Z'
  },
  {
    id: 'room-research-workspace',
    name: 'Research Workspace',
    description: 'Literature review, benchmark datasets, competitor analysis, and UX audit findings.',
    visibility: 'invite',
    inviteCode: 'WR-RSRCH',
    ownerId: 'user-1',
    memberIds: ['user-1', 'user-3', 'user-4'],
    createdAt: '2026-02-20T14:00:00Z',
    updatedAt: '2026-03-01T18:10:00Z'
  }
];

export const SEED_RESOURCES: Resource[] = [
  // Hackathon room
  {
    id: 'res-1',
    roomId: 'room-hackathon-2026',
    title: 'Hackathon Pitch Deck & Architecture Overview',
    type: 'document',
    fileName: 'WarRoom_Pitch_Deck_v2.pdf',
    fileSize: '4.2 MB',
    description: 'Key slide deck summarizing problem statement, system architecture, and demo flow.',
    sharedBy: { id: 'user-1', name: 'Alex Morgan', avatar: SEED_USERS[0].avatar },
    createdAt: '2026-03-01T09:15:00Z'
  },
  {
    id: 'res-2',
    roomId: 'room-hackathon-2026',
    title: 'Figma Design System & Component Library',
    type: 'link',
    url: 'https://figma.com/file/warroom-design-system-2026',
    description: 'Refined UI tokens, color palettes, and accessible component specs.',
    sharedBy: { id: 'user-2', name: 'Sarah Chen', avatar: SEED_USERS[1].avatar },
    createdAt: '2026-03-01T10:45:00Z'
  },
  {
    id: 'res-3',
    roomId: 'room-hackathon-2026',
    title: 'Live Demo Protocol & Rehearsal Notes',
    type: 'note',
    content: '1. Alex presents the problem: fragmented context across chat and docs.\n2. Walk through creating a WarRoom in 15 seconds.\n3. Show instant resource sharing (links, documents, notes).\n4. Assign tasks and show the dynamic room progress indicator updating automatically.\n5. Wrap up with zero clutter SaaS philosophy.',
    description: 'Step-by-step 3-minute pitch run-of-show for judges.',
    sharedBy: { id: 'user-1', name: 'Alex Morgan', avatar: SEED_USERS[0].avatar },
    createdAt: '2026-03-01T11:30:00Z'
  },
  // Product Dev room
  {
    id: 'res-4',
    roomId: 'room-product-dev',
    title: 'API Specification Document v1.4',
    type: 'document',
    fileName: 'WarRoom_REST_Specs.yaml',
    fileSize: '148 KB',
    description: 'OpenAPI 3.1 schema definition for rooms, resource buckets, and task webhooks.',
    sharedBy: { id: 'user-3', name: 'David Kim', avatar: SEED_USERS[2].avatar },
    createdAt: '2026-02-18T15:00:00Z'
  },
  {
    id: 'res-5',
    roomId: 'room-product-dev',
    title: 'GitHub Monorepo Repository',
    type: 'link',
    url: 'https://github.com/warroom/core-app',
    description: 'Main production codebase with automated test pipelines.',
    sharedBy: { id: 'user-1', name: 'Alex Morgan', avatar: SEED_USERS[0].avatar },
    createdAt: '2026-02-16T09:00:00Z'
  },
  // Research room
  {
    id: 'res-6',
    roomId: 'room-research-workspace',
    title: 'User Feedback Interviews Synthesis',
    type: 'note',
    content: 'Key takeaways from 25 interviews:\n- Teams hate heavyweight tools with 400 menus.\n- Users want one place to pin the active documents for the current week.\n- Clear visual completion % prevents unnecessary status check meetings.',
    description: 'Summary of user testing sessions conducted in February.',
    sharedBy: { id: 'user-4', name: 'Elena Rostova', avatar: SEED_USERS[3].avatar },
    createdAt: '2026-02-22T16:20:00Z'
  }
];

export const SEED_TASKS: Task[] = [
  // Hackathon room (4 tasks: 3 completed, 1 pending => 75%)
  {
    id: 'task-1',
    roomId: 'room-hackathon-2026',
    title: 'Finalize UI color palette and typography tokens',
    description: 'Enforce clean contrast with #F7F8FA background and #5B5CE2 primary accent.',
    assignedTo: { id: 'user-2', name: 'Sarah Chen', avatar: SEED_USERS[1].avatar },
    dueDate: '2026-03-02',
    status: 'completed',
    createdAt: '2026-03-01T08:30:00Z'
  },
  {
    id: 'task-2',
    roomId: 'room-hackathon-2026',
    title: 'Implement Room details tabs and resource modals',
    description: 'Enable adding links, notes, and local file attachments seamlessly.',
    assignedTo: { id: 'user-1', name: 'Alex Morgan', avatar: SEED_USERS[0].avatar },
    dueDate: '2026-03-02',
    status: 'completed',
    createdAt: '2026-03-01T09:00:00Z'
  },
  {
    id: 'task-3',
    roomId: 'room-hackathon-2026',
    title: 'Wire up reactive room progress calculation',
    description: 'Ensure progress = (completed / total) * 100 updates dashboard in real time.',
    assignedTo: { id: 'user-3', name: 'David Kim', avatar: SEED_USERS[2].avatar },
    dueDate: '2026-03-02',
    status: 'completed',
    createdAt: '2026-03-01T10:15:00Z'
  },
  {
    id: 'task-4',
    roomId: 'room-hackathon-2026',
    title: 'Record 2-minute product walkthrough demo',
    description: 'Walk through creating room, sharing files, and marking tasks done.',
    assignedTo: { id: 'user-1', name: 'Alex Morgan', avatar: SEED_USERS[0].avatar },
    dueDate: '2026-03-04',
    status: 'pending',
    createdAt: '2026-03-01T11:00:00Z'
  },

  // Product Dev room (3 tasks: 1 completed, 2 pending => 33%)
  {
    id: 'task-5',
    roomId: 'room-product-dev',
    title: 'Audit responsive layout on mobile viewports',
    description: 'Verify sidebar collapses neatly and room headers adapt without overflow.',
    assignedTo: { id: 'user-2', name: 'Sarah Chen', avatar: SEED_USERS[1].avatar },
    dueDate: '2026-03-05',
    status: 'completed',
    createdAt: '2026-02-25T10:00:00Z'
  },
  {
    id: 'task-6',
    roomId: 'room-product-dev',
    title: 'Setup automated CI test runner for linting and build validation',
    description: 'Configure GitHub Actions workflow for typechecking on pull requests.',
    assignedTo: { id: 'user-3', name: 'David Kim', avatar: SEED_USERS[2].avatar },
    dueDate: '2026-03-07',
    status: 'pending',
    createdAt: '2026-02-26T14:30:00Z'
  },
  {
    id: 'task-7',
    roomId: 'room-product-dev',
    title: 'Benchmark client-side search index on large task sets',
    description: 'Ensure filtering remains instant across hundreds of active rooms.',
    assignedTo: { id: 'user-1', name: 'Alex Morgan', avatar: SEED_USERS[0].avatar },
    dueDate: '2026-03-09',
    status: 'pending',
    createdAt: '2026-02-27T16:00:00Z'
  },

  // Research Workspace (2 tasks: 1 completed, 1 pending => 50%)
  {
    id: 'task-8',
    roomId: 'room-research-workspace',
    title: 'Synthesize competitor UX workflows',
    description: 'Document points of friction in typical project management suites.',
    assignedTo: { id: 'user-4', name: 'Elena Rostova', avatar: SEED_USERS[3].avatar },
    dueDate: '2026-03-01',
    status: 'completed',
    createdAt: '2026-02-21T11:00:00Z'
  },
  {
    id: 'task-9',
    roomId: 'room-research-workspace',
    title: 'Draft user research executive summary',
    description: 'Distribute 2-page brief to product stakeholders.',
    assignedTo: { id: 'user-4', name: 'Elena Rostova', avatar: SEED_USERS[3].avatar },
    dueDate: '2026-03-06',
    status: 'pending',
    createdAt: '2026-02-23T15:30:00Z'
  }
];
