import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./emailAuth";

describe("email password auth", () => {
  it("stores a salted hash that verifies only with the original password", async () => {
    const stored = await hashPassword("correct-horse-battery");
    expect(stored).toMatch(/^scrypt:[^:]+:[a-f0-9]+$/);
    expect(stored).not.toContain("correct-horse-battery");
    await expect(verifyPassword("correct-horse-battery", stored)).resolves.toBe(true);
    await expect(verifyPassword("wrong-password", stored)).resolves.toBe(false);
  });
});
