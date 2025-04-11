import { create } from "zustand";

interface ProjectIpMap {
  [projectId: string]: string;
}

interface IpState {
  deploymentIps: ProjectIpMap;

  setDeploymentIp: (projectId: string, ip: string) => void;

  getDeploymentIp: (projectId: string) => string | undefined;

  removeDeployment: (projectId: string) => void;
}

export const useIpStore = create<IpState>((set, get) => ({
  deploymentIps: {},

  setDeploymentIp: (projectId, ip) =>
    set((state) => ({
      deploymentIps: { ...state.deploymentIps, [projectId]: ip },
    })),

  getDeploymentIp: (projectId) => {
    return get().deploymentIps[projectId];
  },

  removeDeployment: (projectId) => {
    set((state) => {
      const newDeploymentIps = { ...state.deploymentIps };
      delete newDeploymentIps[projectId];
      return { deploymentIps: newDeploymentIps };
    });
  },
}));
