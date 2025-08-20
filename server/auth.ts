// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { db } from "./db";
import { users } from "../shared/schema"; // ajuste o caminho se necessário

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.username, username)
      });
      if (!user) return done(null, false, { message: "Usuário não encontrado" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return done(null, false, { message: "Senha incorreta" });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, id)
    });
    done(null, user || false);
  } catch (err) {
    done(err, false);
  }
});

// Middleware para proteger rotas
export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Não autenticado" });
}

export default passport;
