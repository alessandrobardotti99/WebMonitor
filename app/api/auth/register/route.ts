export const dynamic = "force-dynamic"; // Disabilita la generazione statica

import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("📩 Ricevuta richiesta di registrazione...");
    const body = await req.json();
    console.log("📩 Dati ricevuti:", body);

    const { email, password, name } = body;

    if (!email || !password || !name) {
      console.log("❌ Campi mancanti");
      return NextResponse.json({ error: "Tutti i campi sono obbligatori" }, { status: 400 });
    }

    // Controlla se l'utente esiste già
    const existingUser = await db.select().from(users).where(eq(users.email, email)).then(res => res[0]);
    console.log("👤 Utente esistente:", existingUser);

    if (existingUser) {
      return NextResponse.json({ error: "Email già in uso" }, { status: 400 });
    }

    // Hash della password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔑 Password hashata");

    // Crea l'utente
    await db.insert(users).values({ email, password: hashedPassword, name });
    console.log("✅ Utente registrato con successo!");

    return NextResponse.json({ message: "Registrazione completata" }, { status: 201 });

  } catch (error) {
    console.error("❌ Errore nel server:", error);
    return NextResponse.json({ error: "Errore nel server" }, { status: 500 });
  }
}
