import { registerAs } from '@nestjs/config';

export default registerAs('googleOAuth', () => ({
  clinetID: process.env.GOOGLE_CLIENT_ID,
  clinetSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}));
