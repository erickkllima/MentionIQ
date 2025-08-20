import type { Config } from "drizzle-kit";

export default {
  schema: "./shared/schema.ts",    // ajuste o caminho se necessário!
  out: "./drizzle",
  dialect: "sqlite",               // <-- troque 'driver' por 'dialect'
  dbCredentials: {
    url: "./db.sqlite",            // igual ao seu arquivo real
  },
} satisfies Config;
