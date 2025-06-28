export type UserMode = 'seeker' | 'poster';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  mode: UserMode;
  // Seeker-specific fields
  education?: {
    tenth?: number;
    twelfth?: number;
    graduation?: number;
  };
  // Poster-specific fields
  company?: {
    name: string;
    description?: string;
    industry?: string;
  };
};

// Auth Stack Navigation Types
export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
};

// Main App Stack Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  // Modal screens that can be accessed from anywhere
  CreateJob: undefined;
  JobDetails: {
    jobId: string;
    mode?: 'view' | 'edit';
  };
  JobApplications: {
    jobId: string;
  };
  ApplicationDetails: {
    applicationId: string;
  };
  ProfileEdit: {
    mode: UserMode;
  };
};

// Tab Navigation Types for Seeker Mode
export type SeekerTabParamList = {
  Dashboard: undefined;
  Profile: undefined;
  AppliedJobs: undefined;
};

// Tab Navigation Types for Poster Mode
export type PosterTabParamList = {
  Dashboard: undefined;
  Profile: undefined;
  MyJobs: undefined;
};

// Combined Tab Navigation (union type)
export type TabParamList = SeekerTabParamList | PosterTabParamList;

// Screen-specific parameter types
export type JobDetailsParams = {
  jobId: string;
  mode?: 'view' | 'edit';
};

export type JobApplicationsParams = {
  jobId: string;
};

export type ApplicationDetailsParams = {
  applicationId: string;
};

export type ProfileEditParams = {
  mode: UserMode;
};

// Job-related types
export type JobStatus = 'active' | 'closed' | 'draft';

export type Job = {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
  experienceLevel: 'entry' | 'mid' | 'senior';
  location: string;
  salaryRange?: {
    min: number;
    max: number;
  };
  jobType: 'full-time' | 'part-time' | 'remote' | 'contract';
  status: JobStatus;
  postedDate: string;
  postedBy: string; // User ID
  applicationsCount: number;
};

// Application-related types
export type ApplicationStatus =
  | 'pending'
  | 'reviewed'
  | 'interview'
  | 'rejected'
  | 'accepted';

export type JobApplication = {
  id: string;
  jobId: string;
  applicantId: string;
  appliedDate: string;
  status: ApplicationStatus;
  jobTitle: string;
  companyName: string;
  location: string;
  jobType: string;
};

// Navigation props types for screens
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type {
  CompositeNavigationProp,
  RouteProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Root Stack Navigation Props
export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

// Auth Stack Navigation Props
export type AuthStackNavigationProp =
  NativeStackNavigationProp<AuthStackParamList>;

// Seeker Tab Navigation Props
export type SeekerTabNavigationProp =
  BottomTabNavigationProp<SeekerTabParamList>;

// Poster Tab Navigation Props
export type PosterTabNavigationProp =
  BottomTabNavigationProp<PosterTabParamList>;

// Combined navigation prop for screens that can navigate to both tabs and root stack
export type CombinedNavigationProp = CompositeNavigationProp<
  RootStackNavigationProp,
  SeekerTabNavigationProp | PosterTabNavigationProp
>;

// Screen-specific navigation and route props
export type DashboardScreenNavigationProp = CombinedNavigationProp;
export type DashboardScreenRouteProp = RouteProp<
  SeekerTabParamList | PosterTabParamList,
  'Dashboard'
>;

export type ProfileScreenNavigationProp = CombinedNavigationProp;
export type ProfileScreenRouteProp = RouteProp<
  SeekerTabParamList | PosterTabParamList,
  'Profile'
>;

export type AppliedJobsScreenNavigationProp = CompositeNavigationProp<
  RootStackNavigationProp,
  SeekerTabNavigationProp
>;
export type AppliedJobsScreenRouteProp = RouteProp<
  SeekerTabParamList,
  'AppliedJobs'
>;

export type MyJobsScreenNavigationProp = CompositeNavigationProp<
  RootStackNavigationProp,
  PosterTabNavigationProp
>;
export type MyJobsScreenRouteProp = RouteProp<PosterTabParamList, 'MyJobs'>;

export type JobDetailsScreenNavigationProp = RootStackNavigationProp;
export type JobDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  'JobDetails'
>;

export type CreateJobScreenNavigationProp = RootStackNavigationProp;
export type CreateJobScreenRouteProp = RouteProp<
  RootStackParamList,
  'CreateJob'
>;

export type JobApplicationsScreenNavigationProp = RootStackNavigationProp;
export type JobApplicationsScreenRouteProp = RouteProp<
  RootStackParamList,
  'JobApplications'
>;

export type ApplicationDetailsScreenNavigationProp = RootStackNavigationProp;
export type ApplicationDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  'ApplicationDetails'
>;

// Combined screen props for easy use
export type DashboardScreenProps = {
  navigation: DashboardScreenNavigationProp;
  route: DashboardScreenRouteProp;
};

export type ProfileScreenProps = {
  navigation: ProfileScreenNavigationProp;
  route: ProfileScreenRouteProp;
};

export type AppliedJobsScreenProps = {
  navigation: AppliedJobsScreenNavigationProp;
  route: AppliedJobsScreenRouteProp;
};

export type MyJobsScreenProps = {
  navigation: MyJobsScreenNavigationProp;
  route: MyJobsScreenRouteProp;
};

export type JobDetailsScreenProps = {
  navigation: JobDetailsScreenNavigationProp;
  route: JobDetailsScreenRouteProp;
};

export type CreateJobScreenProps = {
  navigation: CreateJobScreenNavigationProp;
  route: CreateJobScreenRouteProp;
};

export type JobApplicationsScreenProps = {
  navigation: JobApplicationsScreenNavigationProp;
  route: JobApplicationsScreenRouteProp;
};

export type ApplicationDetailsScreenProps = {
  navigation: ApplicationDetailsScreenNavigationProp;
  route: ApplicationDetailsScreenRouteProp;
};

// Utility types for hooks
export type UseNavigationHook = () => CombinedNavigationProp;

// Context types
export type UserContextType = {
  user: UserProfile | null;
  mode: UserMode;
  isAuthenticated: boolean;
  setUser: (user: UserProfile | null) => void;
  setMode: (mode: UserMode) => void;
  login: (user: UserProfile) => void;
  logout: () => void;
  toggleMode: () => void;
};

export type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
};

// Mock data types for development
export type MockJobData = Job[];
export type MockApplicationData = JobApplication[];

// Navigation state types
export type NavigationState = {
  index: number;
  routes: Array<{
    name: string;
    key: string;
    params?: any;
  }>;
};

export type JobIdParam = string;
export type ApplicationIdParam = string;

// Deep linking types
export type DeepLinkConfig = {
  screens: {
    Auth: {
      path: '/auth';
      screens: {
        Login: 'login';
        Splash: 'splash';
      };
    };
    Main: {
      path: '/app';
      screens: {
        Dashboard: 'dashboard';
        Profile: 'profile';
        AppliedJobs: 'applied-jobs';
        MyJobs: 'my-jobs';
      };
    };
    JobDetails: '/job/:jobId';
    CreateJob: 'create-job';
    JobApplications: '/job/:jobId/applications';
    ApplicationDetails: '/application/:applicationId';
  };
};

// Declare global navigation types for react-navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
