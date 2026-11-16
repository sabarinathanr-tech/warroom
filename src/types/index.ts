export type RoomVisibility = 'private' | 'invite';

export type ResourceType = 'link' | 'document' | 'note';

export type TaskStatus = 'pending' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  visibility: RoomVisibility;
  inviteCode?: string;
  ownerId: string;
  memberIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  roomId: string;
  title: string;
  type: ResourceType;
  description?: string;
  url?: string;
  fileName?: string;
  fileSize?: string;
  content?: string;
  sharedBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

export interface Task {
  id: string;
  roomId: string;
  title: string;
  description?: string;
  assignedTo?: {
    id: string;
    name: string;
    avatar?: string;
  };
  dueDate?: string;
  status: TaskStatus;
  createdAt: string;
}

export interface UserPreferences {
  emailNotifications: boolean;
  roomActivityNotifications: boolean;
  theme: 'light' | 'dark';
}
