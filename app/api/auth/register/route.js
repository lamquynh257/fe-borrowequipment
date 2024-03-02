import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request) {
  const body = await request.json();
  const { username, password } = body.data;
  console.log(body.data);
  if (!username || !password) {
    return new NextResponse("Không được để trống.", { status: 400 });
  }
  const exist = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (exist) {
    return new NextResponse("Tài khoản đã tồn tại.", { status: 400 });
  }
  const hashPass = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      hashPass,
    },
  });
  return NextResponse.json(user);
}
