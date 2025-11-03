import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import apiClient from '../api';
import type { Post } from '../types/types';
import { useAuth } from './AuthContext';

interface ApiAuthor {
  id: string;
  name: string;
  profileImageKey: string;
}

interface ApiTag {
  tag: string;
}

interface ApiPost {
  id: string;
  author: ApiAuthor;
  companyName: string;
  profileImageKey: string;
  location: string;
  employmentEndDate: string; // ISO date string
  positionTitle: string;
  domain: string;
  slogan: string;
  detailSummary: string;
  positionType: string;
  headCount: number;
  isBookmarked: boolean;
  createdAt: string; // This is an ISO date string
  updatedAt: string; // This is an ISO date string
  tags: ApiTag[];
  coffeeChatCount: number;
}

interface PostContextType {
  posts: Post[] | null;
  paginator: number;
  isLoading: boolean;
  fetchPosts: (query: string) => Promise<void>;
  toggleBookmark: (postId: string) => void;
}

export const encodeQueryParams = ({
  params,
}: {
  params: Record<
    string,
    | string
    | number
    | boolean
    | string[]
    | number[]
    | boolean[]
    | null
    | undefined
  >;
}) => {
  const queryParameters = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return; // null, undefined 제외

    if (Array.isArray(value)) {
      value.forEach((v) => {
        queryParameters.append(key, v.toString());
      });
    } else {
      queryParameters.append(key, value.toString());
    }
  });

  return queryParameters.toString();
};

const PostContext = createContext<PostContextType | undefined>(undefined);

interface PostProviderProps {
  children: ReactNode;
}

export const PostProvider = ({ children }: PostProviderProps) => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [paginator, setPaginator] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      // User logged out, clear all bookmarks from the current state
      setPosts((prevPosts) => {
        if (!prevPosts) return null;
        return prevPosts.map((post) => ({ ...post, isBookmarked: false }));
      });
    }
  }, [user]);

  const fetchPosts = useCallback(async (query: string) => {
    setIsLoading(true);
    try {
      const url = `/api/post?${query}`;
      const response = await apiClient.get<{
        posts: ApiPost[]; // posts stored in array
        paginator: { lastPage: number };
      }>(url);
      setPaginator(response.data.paginator.lastPage);
      const apiPosts = response.data.posts;
      const formattedPosts: Post[] = apiPosts.map((p: ApiPost) => ({
        id: p.id,
        companyName: p.companyName,
        profileImageKey: p.profileImageKey,
        employmentEndDate: p.employmentEndDate,
        positionTitle: p.positionTitle,
        domain: p.domain,
        detailSummary: p.detailSummary,
        positionType: p.positionType,
        isBookmarked: p.isBookmarked,
      }));
      setPosts(formattedPosts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setPosts(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleBookmark = useCallback(
    async (postId: string) => {
      // Optimistic UI update
      const originalPosts = posts;
      setPosts((prevPosts) => {
        if (!prevPosts) return null;
        return prevPosts.map((post) =>
          post.id === postId
            ? { ...post, isBookmarked: !post.isBookmarked }
            : post
        );
      });

      const postToUpdate = originalPosts?.find((p) => p.id === postId);
      if (!postToUpdate) return;

      try {
        if (postToUpdate.isBookmarked) {
          // 북마크 해제 API 호출
          await apiClient.delete(`/api/post/${postId}/bookmark`);
        } else {
          // 북마크 추가 API 호출
          await apiClient.post(`/api/post/${postId}/bookmark`);
        }
      } catch (error) {
        console.error('북마크 처리 실패:', error);
        alert('북마크 처리에 실패했습니다.');
        // API 호출 실패 시, 상태를 원래대로 되돌림
        setPosts(originalPosts);
      }
    },
    [posts]
  );

  const value = useMemo(
    () => ({
      posts,
      isLoading,
      paginator,
      fetchPosts,
      toggleBookmark,
    }),
    [posts, isLoading, paginator, fetchPosts, toggleBookmark]
  );
  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};
