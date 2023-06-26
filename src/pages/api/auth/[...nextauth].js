import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const allowedEmails = ["msiksnis@gmail.com", "developermarty@gmail.com"]; // Add more allowed emails as needed.

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "demo" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (
          credentials.username === "demo" &&
          credentials.password === "demo"
        ) {
          const user = {
            id: 1,
            name: "Demo User",
            email: "demo@user.com",
            image: "https://via.placeholder.com/150",
            role: "user",
          };
          return Promise.resolve(user);
        } else {
          return Promise.resolve(null);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  debug: true,
  secret: process.env.JWT_SECRET,
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      if (allowedEmails.includes(user.email) || credentials) {
        return true;
      } else {
        return false;
      }
    },
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    error: "/sign-in-error",
  },
});
