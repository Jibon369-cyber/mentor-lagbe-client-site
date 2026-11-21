import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

// No baseURL: requests go to /api/auth/... on our own domain,
// and next.config.ts forwards them to the Express server.
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields({ user: { role: { type: "string" } } })],
});
