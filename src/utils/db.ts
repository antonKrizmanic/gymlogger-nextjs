import { prisma } from "@/src/lib/prisma";

export function getUserFromDb(email: string, pwHash: string) {
  return prisma.user.findFirst({
    where: {
      email,
      password: pwHash,
    },
  });
}