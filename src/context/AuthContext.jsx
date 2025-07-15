import { createContext, useReducer, useEffect, useCallback } from 'react';
import { authService, apiClient } from '../services/apiClient';

// Auth action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('auth_token'),
  refreshToken: localStorage.getItem('refresh_token'),
  isAuthenticated: false,
  isLoading: false,
  error: null
};

// Auth reducer
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
}

// Auth context
export const AuthContext = createContext();

// Auth provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const refreshToken = localStorage.getItem('refresh_token');

      if (token && refreshToken) {
        try {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

          // Set tokens in API client
          apiClient.setToken(token);
          apiClient.setRefreshToken(refreshToken);

          // Verify token and get user profile
          const user = await authService.getProfile();

          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: { user, token, refreshToken }
          });
        } catch (error) {
          console.error('Token verification failed:', error);
          // Clear invalid tokens
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          apiClient.clearTokens();

          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        } finally {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });

      const response = await authService.login(credentials);
      const { user, token, refreshToken } = response;

      // Store tokens
      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', refreshToken);

      // Set tokens in API client
      apiClient.setToken(token);
      apiClient.setRefreshToken(refreshToken);

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token, refreshToken }
      });

      return { success: true, user };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message || 'Login failed'
      });

      return { success: false, error: error.message };
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.REGISTER_START });

      const response = await authService.register(userData);
      const { user, token, refreshToken } = response;

      // Store tokens
      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', refreshToken);

      // Set tokens in API client
      apiClient.setToken(token);
      apiClient.setRefreshToken(refreshToken);

      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: { user, token, refreshToken }
      });

      return { success: true, user };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: error.message || 'Registration failed'
      });

      return { success: false, error: error.message };
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Call logout endpoint
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens regardless of API call result
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      apiClient.clearTokens();

      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  }, []);

  // Update profile function
  const updateProfile = useCallback(async (profileData) => {
    try {
      const updatedUser = await authService.updateProfile(profileData);

      dispatch({
        type: AUTH_ACTIONS.UPDATE_PROFILE,
        payload: updatedUser
      });

      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Change password function
  const changePassword = useCallback(async (passwordData) => {
    try {
      await authService.changePassword(passwordData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Forgot password function
  const forgotPassword = useCallback(async (email) => {
    try {
      await authService.forgotPassword(email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Reset password function
  const resetPassword = useCallback(async (resetData) => {
    try {
      await authService.resetPassword(resetData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  // Check if user has permission
  const hasPermission = useCallback((permission) => {
    if (!state.user || !state.user.permissions) return false;
    return state.user.permissions.includes(permission);
  }, [state.user]);

  // Check if user has role
  const hasRole = useCallback((role) => {
    if (!state.user || !state.user.roles) return false;
    return state.user.roles.includes(role);
  }, [state.user]);

  const value = {
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    clearError,

    // Utilities
    hasPermission,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook and HOC moved to separate files to avoid fast refresh issues
// See: src/hooks/useAuth.js and src/components/hoc/withAuth.jsx
