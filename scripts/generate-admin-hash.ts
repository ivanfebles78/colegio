/**
 * Genera un hash bcrypt para la contraseña del admin.
 *
 * Uso:
 *   npm run admin:hash -- TU_CONTRASEÑA
 *
 * Copia el resultado en .env como ADMIN_PASSWORD_HASH.
 */
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error("❌  Faltan argumentos.\n   Uso: npm run admin:hash -- TU_CONTRASEÑA");
  process.exit(1);
}

if (password.length < 8) {
  console.error("⚠️   Recomendado al menos 8 caracteres. Aborto.");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log("\nHash generado (copia en .env como ADMIN_PASSWORD_HASH):\n");
console.log(hash);
console.log("\nDe paso, genera también un ADMIN_SESSION_SECRET fuerte:");
console.log(
  Array.from({ length: 48 }, () =>
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(
      Math.floor(Math.random() * 62),
    ),
  ).join(""),
);
console.log();
