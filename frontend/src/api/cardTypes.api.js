import api from "./axios";

const BASE_PATH = "/api/CardType";

export const getAllCardTypes = () => api.get(BASE_PATH);

export const getCardTypeById = (id) => api.get(`${BASE_PATH}/${id}`);

export const createCardType = (data) => api.post(BASE_PATH, data);

export const updateCardType = (data) => api.put(BASE_PATH, data);

export const deleteCardType = (id) => api.delete(`${BASE_PATH}/${id}`);