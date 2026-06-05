import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "READER" | "WRITER" | "ADMIN"
    } & DefaultSession["user"]
  }

  interface User {
    role: "READER" | "WRITER" | "ADMIN"
  }
}
