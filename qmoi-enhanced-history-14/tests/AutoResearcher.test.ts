import { AutoResearcher } from "../src/services/AutoResearcher";

test("researchTopic stores and returns content", async () => {
  const ar = new AutoResearcher();
  expect(ar.detectKnowledgeGap("x")).toBe(true);
  const _res = await ar.researchTopic("x");
  expect(_res).toContain("Auto-researched content for x");
  expect(ar.detectKnowledgeGap("x")).toBe(false);
  expect(ar.getKnowledge("x")).toBe(_res);
});
