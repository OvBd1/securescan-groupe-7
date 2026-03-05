function calculateSecurityScore(vulnerabilities) {
  let score = 100

  vulnerabilities.forEach(v => {
    if (v.severity === "CRITICAL") score -= 40
    if (v.severity === "HIGH") score -= 20
    if (v.severity === "MEDIUM") score -= 10
    if (v.severity === "LOW") score -= 5
  })

  return Math.max(score, 0)
}

test("score = 100 si aucune vulnérabilité", () => {
  const vulnerabilities = []

  const score = calculateSecurityScore(vulnerabilities)

  expect(score).toBe(100)
})

test("une vulnérabilité HIGH diminue le score", () => {
  const vulnerabilities = [
    { severity: "HIGH" }
  ]

  const score = calculateSecurityScore(vulnerabilities)

  expect(score).toBe(80)
})

test("plusieurs vulnérabilités diminuent davantage le score", () => {
  const vulnerabilities = [
    { severity: "HIGH" },
    { severity: "LOW" }
  ]

  const score = calculateSecurityScore(vulnerabilities)

  expect(score).toBe(75)
})