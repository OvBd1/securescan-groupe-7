function mapOwasp(rule) {

  if (rule.includes("access")) return "A01"
  if (rule.includes("config")) return "A02"
  if (rule.includes("supply")) return "A03"
  if (rule.includes("crypto")) return "A04"
  if (rule.includes("sql") || rule.includes("injection")) return "A05"
  if (rule.includes("design")) return "A06"
  if (rule.includes("auth")) return "A07"
  if (rule.includes("integrity")) return "A08"
  if (rule.includes("logging")) return "A09"
  if (rule.includes("exception")) return "A10"

  return "UNKNOWN"
}

test("OWASP A01 - Broken Access Control", () => {
  expect(mapOwasp("access-control-bypass")).toBe("A01")
})

test("OWASP A02 - Security Misconfiguration", () => {
  expect(mapOwasp("config-exposed")).toBe("A02")
})

test("OWASP A03 - Software Supply Chain Failures", () => {
  expect(mapOwasp("supply-chain-risk")).toBe("A03")
})

test("OWASP A04 - Cryptographic Failures", () => {
  expect(mapOwasp("crypto-key")).toBe("A04")
})

test("OWASP A05 - Injection", () => {
  expect(mapOwasp("sql-injection")).toBe("A05")
})

test("OWASP A06 - Insecure Design", () => {
  expect(mapOwasp("design-flaw")).toBe("A06")
})

test("OWASP A07 - Authentication Failures", () => {
  expect(mapOwasp("auth-bypass")).toBe("A07")
})

test("OWASP A08 - Software or Data Integrity Failures", () => {
  expect(mapOwasp("integrity-error")).toBe("A08")
})

test("OWASP A09 - Security Logging and Alerting Failures", () => {
  expect(mapOwasp("logging-disabled")).toBe("A09")
})

test("OWASP A10 - Mishandling of Exceptional Conditions", () => {
  expect(mapOwasp("exception-error")).toBe("A10")
})