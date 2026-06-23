import NextAuth from "next-auth";

import Credentials from "next-auth/providers/credentials";

import { loginUser } from "@/lib/api";

/** JWT cookies must stay small — never store base64 avatars in the token. */
function avatarForToken(url?: string | null): string | undefined {
  if (!url || url.startsWith("data:") || url.length > 512) return undefined;
  return url;
}

export const { handlers, signIn, signOut, auth } = NextAuth({

  providers: [

    Credentials({

      name: "credentials",

      credentials: {

        email: { label: "Email", type: "email" },

        password: { label: "Password", type: "password" },

      },

      async authorize(credentials) {

        if (!credentials?.email || !credentials?.password) return null;



        try {

          const res = await loginUser({

            email: credentials.email as string,

            password: credentials.password as string,

          });



          if (res.success && res.data) {

            const u = res.data.user;

            return {

              id: u.id,

              email: u.email,

              name: u.full_name,

              image: avatarForToken(u.avatar_url),

              phone: u.phone ?? undefined,

              accessToken: res.data.access_token,

            };

          }

        } catch {

          return null;

        }

        return null;

      },

    }),

  ],

  session: { strategy: "jwt" },

  pages: {

    signIn: "/login",

  },

  callbacks: {

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.phone = user.phone;
        const safe = avatarForToken(user.image);
        if (safe) token.picture = safe;
      }

      if (
        token.picture &&
        typeof token.picture === "string" &&
        (token.picture.startsWith("data:") || token.picture.length > 512)
      ) {
        delete token.picture;
      }

      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.email) token.email = session.email;
        if ("phone" in session) token.phone = session.phone as string | undefined;
        if ("avatarVersion" in session) {
          token.avatarVersion = session.avatarVersion as number;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;

      if (session.user) {
        session.user.id = token.id as string;
        session.user.phone = token.phone as string | undefined;
        if (token.picture) session.user.image = token.picture as string;
        if (token.avatarVersion) {
          (session.user as { avatarVersion?: number }).avatarVersion =
            token.avatarVersion as number;
        }
      }

      return session;
    },

  },

});

