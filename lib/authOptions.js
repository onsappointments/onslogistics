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
          name: user.fullName,
          email: user.email,
          role: user.role,
          adminType: user.adminType || null,
          permissions: user.permissions || [],
          company: user.company || "",
          fullName: user.fullName || "",
          verified: user.verified || false,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user, trigger }) {
      // ✅ initial sign-in
      if (user) {
        token.id = user.id;
        token.email = user.email; // ✅ store email so we can re-fetch later
        token.role = user.role;
        token.adminType = user.adminType;
        token.permissions = user.permissions;
        token.company = user.company;
        token.fullName = user.fullName;
        token.verified = user.verified;
      }

      // ✅ when you call `update()` on client, refresh from DB
      if (trigger === "update" && token?.email) {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email }).select("verified");
        token.verified = dbUser?.verified ?? false;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email; // ✅ ensure email stays in session
        session.user.role = token.role;
        session.user.adminType = token.adminType;
        session.user.permissions = token.permissions;
        session.user.company = token.company;
        session.user.fullName = token.fullName;
        session.user.verified = token.verified;
      }
      return session;
    },
  },

  pages: { signIn: "/login" },
};
