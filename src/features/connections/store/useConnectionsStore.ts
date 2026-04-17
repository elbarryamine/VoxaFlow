import { create } from "zustand";
import type { Connection, ConnectionType } from "../types/Connection.types";
import { MOCK_CONNECTIONS } from "../constants/MOCK_CONNECTIONS";

let idCounter = 100;

interface ConnectionsStore {
  connections: Connection[];
  addConnection: (conn: Omit<Connection, "id" | "createdAt">) => Connection;
  updateConnection: (id: string, patch: Partial<Omit<Connection, "id">>) => void;
  deleteConnection: (id: string) => void;
  getByType: (type: ConnectionType) => Connection[];
}

export const useConnectionsStore = create<ConnectionsStore>((set, get) => ({
  connections: MOCK_CONNECTIONS,

  addConnection: (conn) => {
    const newConn: Connection = {
      ...conn,
      id: `conn-${++idCounter}`,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ connections: [...state.connections, newConn] }));
    return newConn;
  },

  updateConnection: (id, patch) => {
    set((state) => ({
      connections: state.connections.map((c) =>
        c.id === id ? { ...c, ...patch } : c,
      ),
    }));
  },

  deleteConnection: (id) => {
    set((state) => ({
      connections: state.connections.filter((c) => c.id !== id),
    }));
  },

  getByType: (type) => get().connections.filter((c) => c.type === type),
}));
