import api from "./axios";

const BASE_PATH = "/api/BranchSetting";

export const getAllBranches = () => api.get(BASE_PATH);

export const getBranchById = (id) => api.get(`${BASE_PATH}/${id}`);

export const createBranch = (data) => api.post(BASE_PATH, data);

export const updateBranch = (data) => api.put(BASE_PATH, data);

export const deleteBranch = (id) => api.delete(`${BASE_PATH}/${id}`);