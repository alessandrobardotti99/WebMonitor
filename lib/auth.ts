import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Email e Password",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        console.log("🔑 Tentativo di login con:", credentials);

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Campi mancanti");
          return null;
        }

        // Trova l'utente nel database
        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .then((res) => res[0]);

        if (!user) {
          console.log("❌ Utente non trovato");
          return null;
        }

        // Verifica la password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          console.log("❌ Password errata");
          return null;
        }

        console.log("✅ Login riuscito!");
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = { id: token.id, email: token.email, name: token.name };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Debug per vedere errori
};

// Esporta NextAuth con le opzioni corrette
export default NextAuth(authOptions);
