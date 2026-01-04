import { AutoResearcher } from "../src/services/AutoResearcher";

test("researchTopic stores and returns content", async () => {
  const ar = new AutoResearcher();
  expect(ar.detectKnowledgeGap("x")).toBe(true);
  const res = await ar.researchTopic("x");
  expect(res).toContain("Auto-researched content for x");
  expect(ar.detectKnowledgeGap("x")).toBe(false);
  expect(ar.getKnowledge("x")).toBe(res);
});
