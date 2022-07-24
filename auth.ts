import { auth, AuthHeader } from "./deps.ts";

export class OAuth2User extends auth.OAuth2User {
  async getAuthHeader(): Promise<AuthHeader> {
    const wasExpired = this.isAccessTokenExpired();
    const authHeader = await super.getAuthHeader();
    if (wasExpired) {
      localStorage.setItem("token", JSON.stringify(this.token));
    }
    return authHeader;
  }
}
