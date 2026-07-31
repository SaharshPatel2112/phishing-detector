import { getAuth, clerkClient } from "@clerk/express";
import { ADMIN_EMAILS } from "../config/admin.js";

export async function requireAdmin(req, res, next) {
  const { userId } = getAuth(req);
  const clerkUser = await clerkClient.users.getUser(userId);
  const email = clerkUser.emailAddresses[0]?.emailAddress?.toLowerCase() || "";

  if (!ADMIN_EMAILS.includes(email)) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}
