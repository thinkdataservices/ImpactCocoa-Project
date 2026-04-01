import { betterAuth } from 'better-auth';
import { magicLink } from 'better-auth/plugins';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      // TODO: integrate email provider (nodemailer, resend, etc.)
      console.log(`[Reset Password] ${user.email}: ${url}`);
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        // TODO: integrate email provider (nodemailer, resend, etc.)
        console.log(`[Magic Link] ${email}: ${url}`);
      },
    }),
  ],
  trustedOrigins: [process.env.FE_URL || 'http://localhost:3030', 'https://thinkdata.creativext.com'],
});
