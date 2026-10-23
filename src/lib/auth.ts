import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey, type CryptoKey } from "jose";

export interface AccessConfig {
  teamDomain: string;
  /** Optional. When set, the token must also be issued for this Access application. */
  aud?: string;
  email: string;
}

/** True only for a valid, unexpired Access JWT from our team, issued to the admin's email (and audience, if configured). */
export async function verifyAccessJwt(
  token: string | null | undefined,
  cfg: AccessConfig,
  key: CryptoKey | JWTVerifyGetKey,
): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, key as CryptoKey, {
      issuer: `https://${cfg.teamDomain}`,
      ...(cfg.aud && { audience: cfg.aud }),
    });
    return typeof payload.email === "string" && payload.email.toLowerCase() === cfg.email.toLowerCase();
  } catch {
    return false;
  }
}

const jwksByTeam = new Map<string, JWTVerifyGetKey>();

export function isAdmin(request: Request, env: Env & { DEV_BYPASS_ACCESS?: string; ACCESS_AUD?: string }): Promise<boolean> | boolean {
  // Local dev only: the flag lives in .dev.vars, which is never deployed, and only applies to localhost.
  if (env.DEV_BYPASS_ACCESS === "1" && new URL(request.url).hostname === "localhost") return true;
  const cfg = { teamDomain: env.ACCESS_TEAM_DOMAIN, aud: env.ACCESS_AUD, email: env.ADMIN_EMAIL };
  let jwks = jwksByTeam.get(cfg.teamDomain);
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(`https://${cfg.teamDomain}/cdn-cgi/access/certs`));
    jwksByTeam.set(cfg.teamDomain, jwks);
  }
  return verifyAccessJwt(request.headers.get("Cf-Access-Jwt-Assertion"), cfg, jwks);
}
