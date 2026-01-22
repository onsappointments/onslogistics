import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();

        const email = credentials.email.trim().toLowerCase();
        const user = await User.findOne({ email });
        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.fullName,        // NextAuth uses this as session.user.name
          email: user.email,
          role: user.role,
          adminType: user.adminType || null,
          permissions: user.permissions || [],
          company: user.company || "",      // ✅ NEW (use this everywhere)
          fullName: user.fullName || "",    // ✅ NEW (optional convenience)
        };
      },
    }),
  ],
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.adminType = user.adminType;
        token.permissions = user.permissions;
        token.company = user.company;
        token.fullName = user.fullName;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.adminType = token.adminType;
        session.user.permissions = token.permissions;
        session.user.company = token.company;
        session.user.fullName = token.fullName;
      }
      return session;
    },
  },

  pages: { signIn: "/login" },
};
