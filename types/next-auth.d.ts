import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: DefaultSession["user"] & {
      id: string;
      phone?: string;
      avatarVersion?: number;
      subscriptionTier?: string;
      isAdmin?: boolean;
    };
  }

  interface User {
    accessToken: string;
    phone?: string;
    subscriptionTier?: string;
    isAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    id?: string;
    phone?: string;
    avatarVersion?: number;
    subscriptionTier?: string;
    isAdmin?: boolean;
  }
}
