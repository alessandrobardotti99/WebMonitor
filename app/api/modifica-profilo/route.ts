import { NextResponse } from "next/server";
import { db } from "@/app/db"; 
import { users } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const { name, email } = await req.json();

    const updatedUser = await db
      .update(users)
      .set({ name, email })
      .where(eq(users.id, session.user.id))
      .returning({ id: users.id, name: users.name, email: users.email });

    if (!updatedUser.length) {
      return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser[0] }, { status: 200 });
  } catch (error) {
    console.error("Errore nell'aggiornamento del profilo:", error);
    return NextResponse.json({ error: "Errore del server" }, { status: 500 });
  }
}
