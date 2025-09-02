// Database types matching Prisma schema
export type PlaceCategory = 
  | 'NATURE'
  | 'CITY_SPOT'
  | 'LAKE'
  | 'CAFE'
  | 'RESTAURANT'
  | 'MUSEUM'
  | 'PARK'
  | 'BEACH'
  | 'MOUNTAIN'
  | 'HISTORICAL'
  | 'ENTERTAINMENT'
  | 'SHOPPING'
  | 'ADVENTURE'
  | 'OTHER'

export type MediaType = 'IMAGE' | 'VIDEO'

export type NotificationType = 
  | 'LIKE'
  | 'COMMENT'
  | 'FOLLOW'
  | 'SHARE'
  | 'MENTION'
  | 'SYSTEM'

// User Management
export interface User {
  id: string
  email: string
  username?: string
  name?: string
  bio?: string
  avatar?: string
  coverImage?: string
  website?: string
  instagram?: string
  twitter?: string
  location?: string
  isVerified: boolean
  createdAt: Date
  updatedAt: Date

  // Relations (will be populated from other collections)
  posts?: Post[]
  likes?: Like[]
  comments?: Comment[]
  shares?: Share[]
  savedPlaces?: SavedPlace[]
  follows?: Follow[]
  followers?: Follow[]
  notifications?: Notification[]
}

// Places/Spots
export interface Place {
  id: string
  name: string
  description?: string
  category: PlaceCategory
  tags?: string[] // Array of tags instead of JSON string
  location: string
  latitude?: number
  longitude?: number
  address?: string
  phone?: string
  website?: string
  bestTimeToVisit?: string
  ticketInfo?: string
  openingHours?: OpeningHours // Structured object instead of JSON string
  isVerified: boolean
  isCurated: boolean
  createdAt: Date
  updatedAt: Date

  // Relations
  posts?: Post[]
  savedPlaces?: SavedPlace[]
  media?: PlaceMedia[]
}

export interface OpeningHours {
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  saturday?: string
  sunday?: string
}

// Place Media (Photos/Videos)
export interface PlaceMedia {
  id: string
  placeId: string
  type: MediaType
  url: string
  caption?: string
  isPrimary: boolean
  createdAt: Date
}

// Posts with media
export interface Post {
  id: string
  caption?: string
  location?: string
  placeId?: string
  authorId: string
  isReel: boolean
  createdAt: Date
  updatedAt: Date

  // Relations
  author?: User
  place?: Place
  media?: PostMedia[]
  likes?: Like[]
  comments?: Comment[]
  shares?: Share[]
}

// Post Media (Photos/Videos)
export interface PostMedia {
  id: string
  postId: string
  type: MediaType
  url: string
  caption?: string
  order: number
  createdAt: Date
}

// Social Interactions
export interface Like {
  id: string
  userId: string
  postId: string
  createdAt: Date

  // Relations
  user?: User
  post?: Post
}

export interface Comment {
  id: string
  content: string
  userId: string
  postId: string
  parentId?: string
  createdAt: Date
  updatedAt: Date

  // Relations
  user?: User
  post?: Post
  parent?: Comment
  replies?: Comment[]
}

export interface Share {
  id: string
  userId: string
  postId: string
  platform?: string
  createdAt: Date

  // Relations
  user?: User
  post?: Post
}

// User Following System
export interface Follow {
  id: string
  followerId: string
  followingId: string
  createdAt: Date

  // Relations
  follower?: User
  following?: User
}

// Saved Places (Bookmarks)
export interface SavedPlace {
  id: string
  userId: string
  placeId: string
  createdAt: Date

  // Relations
  user?: User
  place?: Place
}

// Notifications
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: any // Structured data instead of JSON string
  isRead: boolean
  createdAt: Date

  // Relations
  user?: User
}

// Database interface
export interface Database {
  users: User[]
  places: Place[]
  placeMedia: PlaceMedia[]
  posts: Post[]
  postMedia: PostMedia[]
  likes: Like[]
  comments: Comment[]
  shares: Share[]
  follows: Follow[]
  savedPlaces: SavedPlace[]
  notifications: Notification[]
}

// Query types
export interface WhereClause<T> {
  [key: string]: any;
}

export interface OrderByClause<T> {
  [key: string]: 'asc' | 'desc';
}

export interface QueryOptions<T> {
  where?: WhereClause<T>
  orderBy?: OrderByClause<T>
  limit?: number
  offset?: number
  include?: IncludeClause<T>
}

export interface IncludeClause<T> {
  [key: string]: any;
}

// Database operations interface
export interface JsonDatabase {
  // User operations
  findUser: (id: string) => Promise<User | null>
  findUserByEmail: (email: string) => Promise<User | null>
  findUserByUsername: (username: string) => Promise<User | null>
  findUsers: (options?: QueryOptions<User>) => Promise<User[]>
  createUser: (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<User>
  updateUser: (id: string, data: Partial<User>) => Promise<User | null>
  deleteUser: (id: string) => Promise<boolean>

  // Place operations
  findPlace: (id: string) => Promise<Place | null>
  findPlaces: (options?: QueryOptions<Place>) => Promise<Place[]>
  createPlace: (data: Omit<Place, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Place>
  updatePlace: (id: string, data: Partial<Place>) => Promise<Place | null>
  deletePlace: (id: string) => Promise<boolean>

  // Post operations
  findPost: (id: string) => Promise<Post | null>
  findPosts: (options?: QueryOptions<Post>) => Promise<Post[]>
  createPost: (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Post>
  updatePost: (id: string, data: Partial<Post>) => Promise<Post | null>
  deletePost: (id: string) => Promise<boolean>

  // Like operations
  findLike: (userId: string, postId: string) => Promise<Like | null>
  findLikes: (options?: QueryOptions<Like>) => Promise<Like[]>
  createLike: (data: Omit<Like, 'id' | 'createdAt'>) => Promise<Like>
  deleteLike: (userId: string, postId: string) => Promise<boolean>

  // Comment operations
  findComment: (id: string) => Promise<Comment | null>
  findComments: (options?: QueryOptions<Comment>) => Promise<Comment[]>
  createComment: (data: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Comment>
  updateComment: (id: string, data: Partial<Comment>) => Promise<Comment | null>
  deleteComment: (id: string) => Promise<boolean>

  // Follow operations
  findFollow: (followerId: string, followingId: string) => Promise<Follow | null>
  findFollows: (options?: QueryOptions<Follow>) => Promise<Follow[]>
  createFollow: (data: Omit<Follow, 'id' | 'createdAt'>) => Promise<Follow>
  deleteFollow: (followerId: string, followingId: string) => Promise<boolean>

  // Saved Place operations
  findSavedPlace: (userId: string, placeId: string) => Promise<SavedPlace | null>
  findSavedPlaces: (options?: QueryOptions<SavedPlace>) => Promise<SavedPlace[]>
  createSavedPlace: (data: Omit<SavedPlace, 'id' | 'createdAt'>) => Promise<SavedPlace>
  deleteSavedPlace: (userId: string, placeId: string) => Promise<boolean>

  // Notification operations
  findNotification: (id: string) => Promise<Notification | null>
  findNotifications: (options?: QueryOptions<Notification>) => Promise<Notification[]>
  createNotification: (data: Omit<Notification, 'id' | 'createdAt'>) => Promise<Notification>
  updateNotification: (id: string, data: Partial<Notification>) => Promise<Notification | null>
  deleteNotification: (id: string) => Promise<boolean>

  // Utility operations
  count: <T extends keyof Database>(collection: T, where?: WhereClause<Database[T][0]>) => Promise<number>
  exists: <T extends keyof Database>(collection: T, where: WhereClause<Database[T][0]>) => Promise<boolean>
  clear: () => Promise<void>
  backup: () => Promise<string>
  restore: (backup: string) => Promise<void>
}