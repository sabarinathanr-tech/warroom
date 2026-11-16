import React, { createContext, useContext, useState, useEffect } from 'react';
import { Room, Resource, Task, User } from '../types';
import { SEED_ROOMS, SEED_RESOURCES, SEED_TASKS, SEED_USERS } from '../data/seed';
import { generateId, generateInviteCode } from '../utils';
import { useAuth } from './AuthContext';

interface RoomContextType {
  rooms: Room[];
  resources: Resource[];
  tasks: Task[];
  users: User[];
  createRoom: (name: string, description: string, visibility: 'private' | 'invite') => Room;
  joinRoom: (inviteCode: string) => { success: boolean; message: string; room?: Room };
  getRoomById: (id: string) => Room | undefined;
  getRoomResources: (roomId: string) => Resource[];
  getRoomTasks: (roomId: string) => Task[];
  getRoomProgress: (roomId: string) => {
    percentage: number;
    completedTasks: number;
    totalTasks: number;
  };
  addResource: (resourceData: Omit<Resource, 'id' | 'createdAt' | 'sharedBy'>) => Resource;
  deleteResource: (resourceId: string) => void;
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'status'>) => Task;
  toggleTaskStatus: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  deleteRoom: (roomId: string) => void;
  getOverallStats: () => {
    activeRooms: number;
    sharedResources: number;
    overallProgress: number;
  };
}

const STORAGE_KEY_ROOMS = 'warroom_rooms_v1';
const STORAGE_KEY_RESOURCES = 'warroom_resources_v1';
const STORAGE_KEY_TASKS = 'warroom_tasks_v1';

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ROOMS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored rooms', e);
      }
    }
    return SEED_ROOMS;
  });

  const [resources, setResources] = useState<Resource[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_RESOURCES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored resources', e);
      }
    }
    return SEED_RESOURCES;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TASKS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored tasks', e);
      }
    }
    return SEED_TASKS;
  });

  // Persist whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RESOURCES, JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  }, [tasks]);

  const createRoom = (name: string, description: string, visibility: 'private' | 'invite'): Room => {
    const currentUserId = user?.id || 'user-1';
    const newRoom: Room = {
      id: `room-${generateId()}`,
      name: name.trim(),
      description: description.trim(),
      visibility,
      inviteCode: generateInviteCode(),
      ownerId: currentUserId,
      memberIds: [currentUserId],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRooms((prev) => [newRoom, ...prev]);
    return newRoom;
  };

  const joinRoom = (inviteCode: string): { success: boolean; message: string; room?: Room } => {
    const code = inviteCode.trim().toUpperCase();
    const foundRoom = rooms.find(
      (r) => r.inviteCode && r.inviteCode.toUpperCase() === code
    );

    if (!foundRoom) {
      return {
        success: false,
        message: 'No room found with this invite code. Try WR-HACK, WR-PROD, or WR-RSRCH.',
      };
    }

    const currentUserId = user?.id || 'user-1';
    if (!foundRoom.memberIds.includes(currentUserId)) {
      const updatedRoom = {
        ...foundRoom,
        memberIds: [...foundRoom.memberIds, currentUserId],
        updatedAt: new Date().toISOString(),
      };
      setRooms((prev) => prev.map((r) => (r.id === foundRoom.id ? updatedRoom : r)));
      return {
        success: true,
        message: `Successfully joined ${foundRoom.name}!`,
        room: updatedRoom,
      };
    }

    return {
      success: true,
      message: `You are already a member of ${foundRoom.name}.`,
      room: foundRoom,
    };
  };

  const deleteRoom = (roomId: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
    setResources((prev) => prev.filter((res) => res.roomId !== roomId));
    setTasks((prev) => prev.filter((t) => t.roomId !== roomId));
  };

  const getRoomById = (id: string): Room | undefined => {
    return rooms.find((r) => r.id === id);
  };

  const getRoomResources = (roomId: string): Resource[] => {
    return resources.filter((res) => res.roomId === roomId);
  };

  const getRoomTasks = (roomId: string): Task[] => {
    return tasks.filter((t) => t.roomId === roomId);
  };

  const getRoomProgress = (roomId: string) => {
    const roomTasks = tasks.filter((t) => t.roomId === roomId);
    const totalTasks = roomTasks.length;
    if (totalTasks === 0) {
      return { percentage: 0, completedTasks: 0, totalTasks: 0 };
    }
    const completedTasks = roomTasks.filter((t) => t.status === 'completed').length;
    const percentage = Math.round((completedTasks / totalTasks) * 100);
    return { percentage, completedTasks, totalTasks };
  };

  const addResource = (resourceData: Omit<Resource, 'id' | 'createdAt' | 'sharedBy'>): Resource => {
    const newResource: Resource = {
      ...resourceData,
      id: `res-${generateId()}`,
      sharedBy: {
        id: user?.id || 'user-1',
        name: user?.name || 'Alex Morgan',
        avatar: user?.avatar || SEED_USERS[0].avatar,
      },
      createdAt: new Date().toISOString(),
    };

    setResources((prev) => [newResource, ...prev]);

    // Touch room updatedAt
    setRooms((prev) =>
      prev.map((r) =>
        r.id === resourceData.roomId ? { ...r, updatedAt: new Date().toISOString() } : r
      )
    );

    return newResource;
  };

  const deleteResource = (resourceId: string) => {
    setResources((prev) => prev.filter((r) => r.id !== resourceId));
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'status'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: `task-${generateId()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);

    // Touch room updatedAt
    setRooms((prev) =>
      prev.map((r) =>
        r.id === taskData.roomId ? { ...r, updatedAt: new Date().toISOString() } : r
      )
    );

    return newTask;
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
          return { ...task, status: nextStatus };
        }
        return task;
      })
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const getOverallStats = () => {
    const activeRooms = rooms.length;
    const sharedResources = resources.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      activeRooms,
      sharedResources,
      overallProgress,
    };
  };

  return (
    <RoomContext.Provider
      value={{
        rooms,
        resources,
        tasks,
        users: SEED_USERS,
        createRoom,
        joinRoom,
        getRoomById,
        getRoomResources,
        getRoomTasks,
        getRoomProgress,
        addResource,
        deleteResource,
        addTask,
        toggleTaskStatus,
        deleteTask,
        deleteRoom,
        getOverallStats,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};
