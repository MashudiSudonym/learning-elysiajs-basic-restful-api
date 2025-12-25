import { describe, it, expect } from "bun:test";
import { app } from "../src/index";

describe("Auth API", () => {
  it("should sign up a user", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test User",
          email: "test2@example.com",
          password: "password123",
          isAdult: true,
        }),
      })
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.message).toBe("Account created successfully");
  });

  it("should sign in a user", async () => {
    const response = await app.handle(
      new Request("http://localhost/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test2@example.com",
          password: "password123",
        }),
      })
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.message).toBe("sign in success");
    expect(data.data.accessToken).toBeDefined();
    expect(data.data.refreshToken).toBeDefined();
  });

  it("should access protected route with token", async () => {
    // First sign in to get token
    const signInResponse = await app.handle(
      new Request("http://localhost/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test2@example.com",
          password: "password123",
        }),
      })
    );
    const signInData = await signInResponse.json();
    const token = signInData.data.accessToken;

    const response = await app.handle(
      new Request("http://localhost/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.message).toBe("User retrieved successfully");
  });

  it("should logout and invalidate token", async () => {
    // Sign in first
    const signInResponse = await app.handle(
      new Request("http://localhost/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test2@example.com",
          password: "password123",
        }),
      })
    );
    const signInData = await signInResponse.json();
    const token = signInData.data.accessToken;

    // Logout
    const logoutResponse = await app.handle(
      new Request("http://localhost/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
    );
    expect(logoutResponse.status).toBe(200);

    // Try access protected route, should fail
    const response = await app.handle(
      new Request("http://localhost/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
    expect(response.status).toBe(401);
  });
});