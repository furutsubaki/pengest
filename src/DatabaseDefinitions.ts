export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
    graphql_public: {
        Tables: {
            [_ in never]: never
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            graphql: {
                Args: {
                    operationName?: string
                    query?: string
                    variables?: Json
                    extensions?: Json
                }
                Returns: Json
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
    public: {
        Tables: {
            Follower: {
                Row: {
                    createdAt: string | null
                    followedId: string
                    followerId: string
                    id: string | null
                    updatedAt: string | null
                }
                Insert: {
                    createdAt?: string | null
                    followedId: string
                    followerId: string
                    id?: string | null
                    updatedAt?: string | null
                }
                Update: {
                    createdAt?: string | null
                    followedId?: string
                    followerId?: string
                    id?: string | null
                    updatedAt?: string | null
                }
            }
            Image: {
                Row: {
                    createdAt: string
                    id: string
                    originalSrc: string
                    updatedAt: string
                    userId: string | null
                }
                Insert: {
                    createdAt?: string
                    id?: string
                    originalSrc: string
                    updatedAt?: string
                    userId?: string | null
                }
                Update: {
                    createdAt?: string
                    id?: string
                    originalSrc?: string
                    updatedAt?: string
                    userId?: string | null
                }
            }
            Likes: {
                Row: {
                    createdAt: string | null
                    id: string
                    postId: string
                    updatedAt: string | null
                    userId: string
                }
                Insert: {
                    createdAt?: string | null
                    id?: string
                    postId: string
                    updatedAt?: string | null
                    userId: string
                }
                Update: {
                    createdAt?: string | null
                    id?: string
                    postId?: string
                    updatedAt?: string | null
                    userId?: string
                }
            }
            Post: {
                Row: {
                    createdAt: string
                    id: string
                    parentPostId: string | null
                    text: string
                    updatedAt: string
                    userId: string
                }
                Insert: {
                    createdAt?: string
                    id?: string
                    parentPostId?: string | null
                    text: string
                    updatedAt?: string
                    userId: string
                }
                Update: {
                    createdAt?: string
                    id?: string
                    parentPostId?: string | null
                    text?: string
                    updatedAt?: string
                    userId?: string
                }
            }
            Post_Image: {
                Row: {
                    created_at: string
                    id: string
                    imageId: string
                    postId: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    imageId: string
                    postId: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    imageId?: string
                    postId?: string
                }
            }
            Profile: {
                Row: {
                    createdAt: string
                    detail: string
                    headerImage: string
                    icon: string
                    id: string
                    linkGithub: string
                    linkHome: string
                    linkPixiv: string
                    linkTwitter: string
                    name: string
                    screenName: string
                    updatedAt: string
                    userId: string
                }
                Insert: {
                    createdAt?: string
                    detail?: string
                    headerImage?: string
                    icon: string
                    id?: string
                    linkGithub?: string
                    linkHome?: string
                    linkPixiv?: string
                    linkTwitter?: string
                    name: string
                    screenName?: string
                    updatedAt?: string
                    userId: string
                }
                Update: {
                    createdAt?: string
                    detail?: string
                    headerImage?: string
                    icon?: string
                    id?: string
                    linkGithub?: string
                    linkHome?: string
                    linkPixiv?: string
                    linkTwitter?: string
                    name?: string
                    screenName?: string
                    updatedAt?: string
                    userId?: string
                }
            }
            Repost: {
                Row: {
                    createdAt: string | null
                    id: string
                    postId: string
                    updatedAt: string | null
                    userId: string | null
                }
                Insert: {
                    createdAt?: string | null
                    id?: string
                    postId: string
                    updatedAt?: string | null
                    userId?: string | null
                }
                Update: {
                    createdAt?: string | null
                    id?: string
                    postId?: string
                    updatedAt?: string | null
                    userId?: string | null
                }
            }
            Setting: {
                Row: {
                    createdAt: string
                    id: string
                    language: string
                    updatedAt: string
                    userId: string
                }
                Insert: {
                    createdAt?: string
                    id?: string
                    language?: string
                    updatedAt?: string
                    userId: string
                }
                Update: {
                    createdAt?: string
                    id?: string
                    language?: string
                    updatedAt?: string
                    userId?: string
                }
            }
            User: {
                Row: {
                    authId: string
                    createdAt: string
                    deactivateAt: string | null
                    freezeAt: string | null
                    id: string
                    updatedAt: string
                }
                Insert: {
                    authId: string
                    createdAt?: string
                    deactivateAt?: string | null
                    freezeAt?: string | null
                    id?: string
                    updatedAt?: string
                }
                Update: {
                    authId?: string
                    createdAt?: string
                    deactivateAt?: string | null
                    freezeAt?: string | null
                    id?: string
                    updatedAt?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
    storage: {
        Tables: {
            buckets: {
                Row: {
                    created_at: string | null
                    id: string
                    name: string
                    owner: string | null
                    public: boolean | null
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    id: string
                    name: string
                    owner?: string | null
                    public?: boolean | null
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    name?: string
                    owner?: string | null
                    public?: boolean | null
                    updated_at?: string | null
                }
            }
            migrations: {
                Row: {
                    executed_at: string | null
                    hash: string
                    id: number
                    name: string
                }
                Insert: {
                    executed_at?: string | null
                    hash: string
                    id: number
                    name: string
                }
                Update: {
                    executed_at?: string | null
                    hash?: string
                    id?: number
                    name?: string
                }
            }
            objects: {
                Row: {
                    bucket_id: string | null
                    created_at: string | null
                    id: string
                    last_accessed_at: string | null
                    metadata: Json | null
                    name: string | null
                    owner: string | null
                    path_tokens: string[] | null
                    updated_at: string | null
                }
                Insert: {
                    bucket_id?: string | null
                    created_at?: string | null
                    id?: string
                    last_accessed_at?: string | null
                    metadata?: Json | null
                    name?: string | null
                    owner?: string | null
                    path_tokens?: string[] | null
                    updated_at?: string | null
                }
                Update: {
                    bucket_id?: string | null
                    created_at?: string | null
                    id?: string
                    last_accessed_at?: string | null
                    metadata?: Json | null
                    name?: string | null
                    owner?: string | null
                    path_tokens?: string[] | null
                    updated_at?: string | null
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            extension: {
                Args: {
                    name: string
                }
                Returns: string
            }
            filename: {
                Args: {
                    name: string
                }
                Returns: string
            }
            foldername: {
                Args: {
                    name: string
                }
                Returns: string[]
            }
            get_size_by_bucket: {
                Args: Record<PropertyKey, never>
                Returns: {
                    size: number
                    bucket_id: string
                }[]
            }
            search: {
                Args: {
                    prefix: string
                    bucketname: string
                    limits?: number
                    levels?: number
                    offsets?: number
                    search?: string
                    sortcolumn?: string
                    sortorder?: string
                }
                Returns: {
                    name: string
                    id: string
                    updated_at: string
                    created_at: string
                    last_accessed_at: string
                    metadata: Json
                }[]
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
