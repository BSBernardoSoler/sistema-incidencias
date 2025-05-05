import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guard/auth.guard";
import { RolesGuard } from "../guard/roles.guard";
import { Roles } from "./role.decorator";

/**
 * Combina los decoradores de autenticación y autorización.
 * @param role - Rol requerido para acceder al recurso (puede ser un string o un array de strings).
 */
export function Auth(role: string) {
  return applyDecorators(Roles(role), UseGuards(AuthGuard, RolesGuard));
}
