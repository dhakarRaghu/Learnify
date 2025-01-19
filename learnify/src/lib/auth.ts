import { DefaultSession, getServerSession, NextAuthOptions } from "next-auth";
import { prisma } from "./db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            credits: number;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        credits: number;
        email?: string | null; // Optional if token.email is sometimes undefined
    }
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    callbacks: {
        // Link accounts during sign-in
        async signIn({ user, account }) {
            try {
                // Check if a user already exists with this email
                const existingUser = await prisma.user.findFirst({
                    where: { email: user.email },
                });

                if (existingUser) {
                    // Check if the account is already linked
                    const existingAccount = await prisma.account.findFirst({
                        where: {
                            userId: existingUser.id,
                            provider: account?.provider,
                            providerAccountId: account.providerAccountId,
                        },
                    });

                    if (!existingAccount) {
                        // Link the new provider to the existing user
                        await prisma.account.create({
                            data: {
                                userId: existingUser.id,
                                provider: account.provider,
                                providerAccountId: account?.providerAccountId,
                                type: account?.type,
                                access_token: account?.access_token,
                                refresh_token: account?.refresh_token,
                                expires_at: account?.expires_at,
                                token_type: account?.token_type,
                                scope: account?.scope,
                                id_token: account?.id_token,
                                session_state: account?.session_state,
                            },
                        });
                    }
                }

                return true; // Allow the sign-in
            } catch (error) {
                console.error("Error during sign-in:", error);
                return false; // Reject the sign-in
            }
        },

        // Attach user data (id, credits) to the token
        async jwt({ token }) {
            if (!token.email) return token; // Skip if email is missing

            try {
                // Fetch the user from the database
                const db_user = await prisma.user.findFirst({
                    where: { email: token.email },
                    select: { id: true, credits: true },
                });

                if (db_user) {
                    token.id = db_user.id;
                    token.credits = db_user.credits || 0; // Default credits to 0 if null
                }
            } catch (error) {
                console.error("Error fetching user for JWT:", error);
            }

            return token;
        },

        // Attach token data to the session object
        async session({ session, token }) {
            if (token) {
                session.user = {
                    ...session.user,
                    id: token.id,
                    credits: token.credits || 0, // Default credits to 0 if missing
                };
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET as string,
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
};

export const getAuthSession = () => {
    return getServerSession(authOptions);
};
