export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

interface ApiAuthor {
  id: string;
  name: string;
  profileImageKey: string;
}

interface ApiTag {
  tag: string;
}

export interface ApiPost {
  id: string;
  author: ApiAuthor;
  companyName: string;
  profileImageKey: string;
  location: string;
  employmentEndDate: string;
  positionTitle: string;
  domain: string;
  slogan: string;
  detailSummary: string;
  positionType: string;
  headCount: number;
  isBookmarked: boolean;
  createdAt: string;
  updatedAt: string;
  tags: ApiTag[];
  coffeeChatCount: number;
}

export interface Post {
  id: string;
  companyName: string;
  profileImageKey: string;
  employmentEndDate: string;
  positionTitle: string;
  domain: string;
  detailSummary: string;
  positionType: string;
  isBookmarked: boolean;
}

export interface ProfileResponse {
  id: string;
  name: string;
  createdAt: string; // iso date string
  updatedAt: string;
  userRole: string;
  email: string;
  enrollYear: number;
  department: string;
  positions?: string[];
  slogan?: string;
  explanation?: string;
  stacks?: string[];
  imageKey: string[];
  cvKey: string;
  portfolioKey: string;
  links?: { description: string; link: string }[];
}
