// server/reset-db.ts
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

async function resetDatabase() {
  const dbPath = path.resolve(process.cwd(), "sqlite.db");

  try {
    // 1. Remover o banco antigo
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log("🗑️ Banco SQLite removido com sucesso.");
    } else {
      console.log("ℹ️ Nenhum banco SQLite encontrado, criando do zero...");
    }

    // 2. Rodar migrations
    console.log("📦 Rodando migrations (drizzle push)...");
    execSync("npx drizzle-kit push", { stdio: "inherit" });

    // 3. Executar seed
    console.log("🌱 Rodando seed...");
    execSync("npm run seed", { stdio: "inherit" });

    console.log("✅ Reset completo com seed!");
  } catch (err) {
    console.error("❌ Erro ao resetar o banco:", err);
    process.exit(1);
  }
}

resetDatabase();
