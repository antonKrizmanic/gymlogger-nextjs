import { prisma } from "@/lib/prisma";

export function getUserFromDb(email: string, pwHash: string) {
  return prisma.User.findFirst({
    where: {
      email,
      password: pwHash,
    },
  });
}