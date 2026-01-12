import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import type { CurrentUser, TokenResponse, APIError } from '../types/api';

interface AuthContextType {
    user: CurrentUser | null;
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetches the current user profile from /api/me/
     * Returns null if the token is invalid or expired
     */
    const fetchCurrentUser = useCallback(async (authToken: string): Promise<CurrentUser | null> => {
        try {
            const response = await api.get<CurrentUser>('/api/me/', {
                headers: { Authorization: `Token ${authToken}` }
            });
            return response.data;
        } catch (err) {
            console.error('Failed to fetch user profile:', err);
            // Token is invalid or expired - clear it
            localStorage.removeItem('token');
            return null;
        }
    }, []);

    /**
     * Initialize auth state on mount
     * Validates stored token by fetching user profile
     */
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');

            if (storedToken) {
                setToken(storedToken);
                const userData = await fetchCurrentUser(storedToken);

                if (userData) {
                    setUser(userData);
                } else {
                    // Token was invalid - clean up
                    setToken(null);
                }
            }

            setIsLoading(false);
        };

        initAuth();
    }, [fetchCurrentUser]);

    /**
     * Login with username and password
     * Obtains token and fetches user profile
     */
    const login = async (username: string, password: string) => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await api.post<TokenResponse>('/api/token-auth/', {
                username,
                password
            });
            const { token: newToken } = response.data;

            localStorage.setItem('token', newToken);
            setToken(newToken);

            // Fetch full user profile
            const userData = await fetchCurrentUser(newToken);
            if (userData) {
                setUser(userData);
            } else {
                throw new Error('Failed to fetch user profile after login');
            }
        } catch (err: unknown) {
            const axiosError = err as { response?: { data?: APIError } };
            const errorMessage =
                axiosError.response?.data?.detail ||
                axiosError.response?.data?.non_field_errors?.[0] ||
                'Login failed. Please check your credentials.';

            setError(errorMessage);
            console.error('Login failed:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Logout - clears token and user state
     */
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setError(null);
    };

    /**
     * Clear any auth errors
     */
    const clearError = () => {
        setError(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            isLoading,
            error,
            clearError
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
