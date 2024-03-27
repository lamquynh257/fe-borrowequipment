// import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "NTL",
        },
        email: {
          label: "email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        // console.log(credentials);
        // check input email pass
        if (!credentials.username || !credentials.password) {
          return null;
        }
        // check trùng user
        try {
          const user = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API}/api/finduser?username=${credentials.username}`,
            {
              headers: {
                Authorization: process.env.NEXT_PUBLIC_BACKEND_AUTHEN,
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );
          // console.log(user);

          //thay đổi mật khẩu khi mật khẩu eo2 thay đổi
          const userChange = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_API}/api/changepass`,
            {
              username: credentials.username,
              password: credentials.password,
            },
            {
              headers: {
                Authorization: process.env.NEXT_PUBLIC_BACKEND_AUTHEN,
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          if (!userChange) {
            return null;
          }
          // console.log(userChange);

          return userChange.data;
        } catch (error) {
          // console.log(credentials);
          const username = credentials.username;
          const password = credentials.password;
          const department = credentials.department;
          const phone = credentials.phone;
          const email = credentials.email;
          const fullname = credentials.fullname;
          const user = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_API}/api/createuser`,
            {
              username,
              department,
              email,
              fullname,
              phone,
              password,
            },
            {
              headers: {
                Authorization: process.env.NEXT_PUBLIC_BACKEND_AUTHEN,
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          return user;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 days
    updateAge: 1 * 60 * 60, // 1 hours
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user, session, trigger }) {
      // console.log("JWT Callback", user);

      if (user) {
        return {
          ...token,
          id: user.id,
          username: user.username,
          fullname: user.fullname,
          email: user.email,
          department: user.department,
          phone: user.phone,
          image: user.image,
          roleid: user.roleid,
        };
      }

      return token;
    },
    async session({ session, token, user }) {
      // console.log("Session Callback", user);
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          username: token.username,
          department: token.department,
          phone: token.phone,
          email: token.email,
          image: token.image,
          roleid: token.roleid,
        },
      };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
