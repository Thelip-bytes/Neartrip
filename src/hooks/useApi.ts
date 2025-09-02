"use client"

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'

// API base configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

// Generic API client
class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = localStorage.getItem('neatrip_token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const authHeaders = await this.getAuthHeaders()
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      headers: {
        ...this.defaultHeaders,
        ...authHeaders,
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ApiError(response.status, errorData.message || 'An error occurred')
      }

      return await response.json()
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError(0, 'Network error')
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', ...options })
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', ...options })
  }
}

export const apiClient = new ApiClient()

// Custom error class
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Query keys factory
export const queryKeys = {
  auth: ['auth'] as const,
  user: (id: string) => ['users', id] as const,
  users: () => ['users'] as const,
  posts: () => ['posts'] as const,
  post: (id: string) => ['posts', id] as const,
  userPosts: (userId: string) => ['users', userId, 'posts'] as const,
  places: () => ['places'] as const,
  place: (id: string) => ['places', id] as const,
  search: (query: string) => ['search', query] as const,
  notifications: () => ['notifications'] as const,
  messages: () => ['messages'] as const,
  conversation: (id: string) => ['messages', id] as const,
} as const

// Custom hooks for common operations
export function useApiQuery<T>(
  key: readonly any[],
  fn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: key,
    queryFn: fn,
    ...options,
  })
}

export function useApiMutation<T, V = any>(
  fn: (variables: V) => Promise<T>,
  options?: Omit<UseMutationOptions<T, ApiError, V>, 'mutationFn'>
) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: fn,
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context)
    },
    onError: (error, variables, context) => {
      // Handle 401 errors (unauthorized)
      if (error.status === 401) {
        // Clear auth state and redirect to login
        localStorage.removeItem('neatrip_token')
        localStorage.removeItem('neatrip_user')
        window.location.href = '/auth/login'
      }
      options?.onError?.(error, variables, context)
    },
  })
}

// Authentication hooks
export function useAuthQuery() {
  const { isAuthenticated } = useAuth()
  
  return useApiQuery(
    queryKeys.auth,
    async () => {
      const response = await apiClient.get('/auth/me')
      return response
    },
    {
      enabled: isAuthenticated,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 401/403 errors
        if (error.status === 401 || error.status === 403) {
          return false
        }
        return failureCount < 3
      },
    }
  )
}

// Posts hooks
export function usePostsQuery(options?: { limit?: number; offset?: number }) {
  return useApiQuery(
    [...queryKeys.posts(), options],
    async () => {
      const params = new URLSearchParams()
      if (options?.limit) params.append('limit', options.limit.toString())
      if (options?.offset) params.append('offset', options.offset.toString())
      
      const response = await apiClient.get(`/posts?${params.toString()}`)
      return response
    },
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      keepPreviousData: true,
    }
  )
}

export function usePostQuery(id: string) {
  return useApiQuery(
    queryKeys.post(id),
    async () => {
      const response = await apiClient.get(`/posts/${id}`)
      return response
    },
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  
  return useApiMutation(
    async (data: { caption: string; location?: string; media?: File[] }) => {
      const formData = new FormData()
      formData.append('caption', data.caption)
      if (data.location) formData.append('location', data.location)
      if (data.media) {
        data.media.forEach((file, index) => {
          formData.append(`media[${index}]`, file)
        })
      }
      
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
        headers: await apiClient.getAuthHeaders(),
      })
      
      if (!response.ok) {
        throw new ApiError(response.status, 'Failed to create post')
      }
      
      return response.json()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeys.posts())
      },
    }
  )
}

export function useLikePost() {
  const queryClient = useQueryClient()
  
  return useApiMutation(
    async ({ postId, action }: { postId: string; action: 'like' | 'unlike' }) => {
      const response = await apiClient.post(`/posts/${postId}/${action}`)
      return response
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(queryKeys.post(variables.postId))
        queryClient.invalidateQueries(queryKeys.posts())
      },
    }
  )
}

// Users hooks
export function useUserQuery(id: string) {
  return useApiQuery(
    queryKeys.user(id),
    async () => {
      const response = await apiClient.get(`/users/${id}`)
      return response
    },
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )
}

export function useUserPostsQuery(userId: string, options?: { limit?: number; offset?: number }) {
  return useApiQuery(
    [...queryKeys.userPosts(userId), options],
    async () => {
      const params = new URLSearchParams()
      if (options?.limit) params.append('limit', options.limit.toString())
      if (options?.offset) params.append('offset', options.offset.toString())
      
      const response = await apiClient.get(`/users/${userId}/posts?${params.toString()}`)
      return response
    },
    {
      enabled: !!userId,
      staleTime: 2 * 60 * 1000, // 2 minutes
      keepPreviousData: true,
    }
  )
}

// Places hooks
export function usePlacesQuery(options?: { category?: string; limit?: number; offset?: number }) {
  return useApiQuery(
    [...queryKeys.places(), options],
    async () => {
      const params = new URLSearchParams()
      if (options?.category) params.append('category', options.category)
      if (options?.limit) params.append('limit', options.limit.toString())
      if (options?.offset) params.append('offset', options.offset.toString())
      
      const response = await apiClient.get(`/places?${params.toString()}`)
      return response
    },
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      keepPreviousData: true,
    }
  )
}

export function usePlaceQuery(id: string) {
  return useApiQuery(
    queryKeys.place(id),
    async () => {
      const response = await apiClient.get(`/places/${id}`)
      return response
    },
    {
      enabled: !!id,
      staleTime: 15 * 60 * 1000, // 15 minutes
    }
  )
}

// Search hooks
export function useSearchQuery(query: string, options?: { type?: 'posts' | 'places' | 'users'; limit?: number }) {
  return useApiQuery(
    [...queryKeys.search(query), options],
    async () => {
      if (!query.trim()) return { results: [] }
      
      const params = new URLSearchParams()
      params.append('q', query)
      if (options?.type) params.append('type', options.type)
      if (options?.limit) params.append('limit', options.limit.toString())
      
      const response = await apiClient.get(`/search?${params.toString()}`)
      return response
    },
    {
      enabled: query.trim().length > 0,
      staleTime: 30 * 1000, // 30 seconds
      keepPreviousData: true,
    }
  )
}

// Infinite query hooks for pagination
export function useInfinitePostsQuery(options?: { limit?: number }) {
  return useApiQuery(
    ['infinite-posts', options],
    async ({ pageParam = 0 }) => {
      const params = new URLSearchParams()
      params.append('offset', (pageParam * (options?.limit || 10)).toString())
      params.append('limit', (options?.limit || 10).toString())
      
      const response = await apiClient.get(`/posts?${params.toString()}`)
      return {
        ...response,
        pageParam,
      }
    },
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      keepPreviousData: true,
    }
  )
}

// Optimistic updates hooks
export function useOptimisticUpdate<T>(
  queryKey: readonly any[],
  updateFn: (oldData: T | undefined) => T
) {
  const queryClient = useQueryClient()
  
  return useApiMutation(
    async (variables: any) => {
      // This will be implemented by the specific mutation
      return variables
    },
    {
      onMutate: async (variables) => {
        await queryClient.cancelQueries(queryKey)
        const previousData = queryClient.getQueryData<T>(queryKey)
        
        queryClient.setQueryData<T>(queryKey, updateFn(previousData))
        
        return { previousData }
      },
      onError: (err, variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(queryKey, context.previousData)
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(queryKey)
      },
    }
  )
}

// Prefetching utility
export function usePrefetch() {
  const queryClient = useQueryClient()
  
  const prefetchQuery = React.useCallback(
    async <T>(
      key: readonly any[],
      fn: () => Promise<T>,
      options?: { staleTime?: number }
    ) => {
      await queryClient.prefetchQuery({
        queryKey: key,
        queryFn: fn,
        staleTime: options?.staleTime || 5 * 60 * 1000,
      })
    },
    [queryClient]
  )
  
  return { prefetchQuery }
}