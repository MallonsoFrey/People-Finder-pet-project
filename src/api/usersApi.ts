import axios from 'axios';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export const getUsers = async (): Promise<User[]> => {
  const res = await axios.get<User[]>('https://69b2e6b12a51e1d56914451a.mockapi.io/api/users');
  return res.data;
}

export const getUserById = async (id: string): Promise<User> => {
  const res = await axios.get<User>(`https://69b2e6b12a51e1d56914451a.mockapi.io/api/users/${id}`);
  return res.data;
}

export const deleteUserById = async (id: string): Promise<User> => {
  const res = await axios.delete<User>(`https://69b2e6b12a51e1d56914451a.mockapi.io/api/users/${id}`);
  return res.data;
}

export const createUser = async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
  const res = await axios.post<User>('https://69b2e6b12a51e1d56914451a.mockapi.io/api/users', user);
  return res.data;
};

export const updateUser = async (id: string, user: Partial<User>): Promise<User> => {
  const res = await axios.put<User>(`https://69b2e6b12a51e1d56914451a.mockapi.io/api/users/${id}`, user);
  return res.data;
};