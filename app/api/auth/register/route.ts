import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return new Response("Email je već u upotrebi.", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword
    }
  });

  // TODO: Ovdje pošalji email za potvrdu
  console.log(`Pošalji email za potvrdu na ${email}`);

  return new Response("Registracija uspješna. Provjeri email za potvrdu!", { status: 200 });
}
