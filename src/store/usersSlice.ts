import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUsers, getUserById, createUser, updateUser, deleteUserById, User } from '../api/usersApi';

interface UsersState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const data = await getUsers();
  return data;
});

export const fetchUserById = createAsyncThunk('users/fetchUserById', async (id: string) => {
  const data = await getUserById(id);
  return data;
});

export const addUser = createAsyncThunk('users/addUser', async (user: Omit<User, 'id' | 'createdAt'>) => {
  const data = await createUser(user);
  return data;
});

export const editUser = createAsyncThunk('users/editUser', async ({ id, user }: { id: string; user: Partial<User> }) => {
  const data = await updateUser(id, user);
  return data;
});

export const removeUser = createAsyncThunk('users/removeUser', async (id: string) => {
  await deleteUserById(id);
  return id;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch all users
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch users';
    });

    // Fetch user by ID
    builder.addCase(fetchUserById.fulfilled, (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    });

    // Add user
    builder.addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    });

    // Edit user
    builder.addCase(editUser.fulfilled, (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    });

    // Remove user
    builder.addCase(removeUser.fulfilled, (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    });
  },
});

export default usersSlice.reducer;