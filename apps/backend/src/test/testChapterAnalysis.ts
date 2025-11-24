import type { ChapterAnalysis } from "@story-generation/types";
import type {
  ChapterAnalysisAssertionResult,
  ChapterAnalysisTestAssertion,
  ChapterAnalysisTestResult,
} from "@/src/types/test";
import { completeTestSuite } from "./test_cases/complete";

export function runChapterAnalysisAssertion(
  assertion: ChapterAnalysisTestAssertion,
  doc: ChapterAnalysis,
): ChapterAnalysisAssertionResult {
  const { type, params } = assertion.assertion;

  try {
    switch (type) {
      case "character_exists": {
        const name = (params.name as string).toLowerCase();
        const found = doc.characterAppearances.some(
          (c) => c.name.toLowerCase() === name,
        );
        return {
          assertionId: assertion.id,
          passed: found,
          message: found
            ? `Character "${params.name}" found`
            : `Character "${params.name}" not found`,
        };
      }

      case "scene_count": {
        const count = parseInt(params.count as string, 10);
        const scenes = doc.scenes || [];
        const found = scenes.length === count;
        return {
          assertionId: assertion.id,
          passed: found,
          message: found
            ? `Scene count is ${scenes.length}`
            : `Scene count is ${scenes.length}, expected ${count}`,
        };
      }

      case "foreshadowing_exists": {
        const hint = (params.hint as string).toLowerCase();
        const foreshadowing = doc.foreshadowingElements || [];
        const found = foreshadowing.some((f) =>
          JSON.stringify(f).toLowerCase().includes(hint),
        );
        return {
          assertionId: assertion.id,
          passed: found,
          message: found
            ? `Foreshadowing about "${params.hint}" found`
            : `Foreshadowing about "${params.hint}" not found`,
        };
      }

      case "quote_exists": {
        const quote = (params.quote as string).toLowerCase();
        const quotes = [
          ...doc.scenes.flatMap((scene) =>
            scene.keyQuotes.map((q) => q.text.toLowerCase()),
          ),
          ...doc.scenes.flatMap(
            (scene) =>
              scene.eroticContent?.dirtyTalk.map((q) => q.line.toLowerCase()) ??
              [],
          ),
        ];
        const found = quotes.some((q) => q.toLowerCase().includes(quote));
        return {
          assertionId: assertion.id,
          passed: found,
          message: found
            ? `Quote "${params.quote}" found`
            : `Quote "${params.quote}" not found`,
        };
      }

      case "erotic_text_exists": {
        const text = (params.text as string).toLowerCase();
        const eroticTexts = doc.scenes.flatMap(
          (scene) =>
            scene.eroticContent?.verbatimEroticText.map((q) =>
              q.toLowerCase(),
            ) ?? [],
        );
        const found = eroticTexts.some((q) => q.toLowerCase().includes(text));
        return {
          assertionId: assertion.id,
          passed: found,
          message: found
            ? `Text "${params.text}" found`
            : `Text "${params.text}" not found`,
        };
      }

      default:
        return {
          assertionId: assertion.id,
          passed: false,
          message: `Unknown assertion type: ${type}`,
        };
    }
  } catch (error) {
    return {
      assertionId: assertion.id,
      passed: false,
      message: `Error running assertion: ${error}`,
    };
  }
}

export function runChapterAnalysisTests(
  chapterNumber: number,
  doc: ChapterAnalysis,
): ChapterAnalysisTestResult {
  const testSuite = completeTestSuite[chapterNumber];

  if (!testSuite) {
    return {
      chapterNumber,
      totalTests: 0,
      passed: 0,
      failed: 0,
      criticalFailures: 0,
      passRate: 100,
      results: [],
      overallPass: true,
    };
  }

  const results: ChapterAnalysisAssertionResult[] = testSuite.assertions.map(
    (assertion) => runChapterAnalysisAssertion(assertion, doc),
  );

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  const criticalFailures = testSuite.assertions.filter(
    (assertion, index) =>
      assertion.severity === "Critical" && !results[index]?.passed,
  ).length;

  const passRate = (passed / results.length) * 100;

  return {
    chapterNumber: testSuite.chapterNumber,
    totalTests: results.length,
    passed,
    failed,
    criticalFailures,
    passRate,
    results,
    overallPass: criticalFailures === 0 && passRate >= 80,
  };
}

export function generateChapterAnalysisTestReport(
  result: ChapterAnalysisTestResult,
  fullReport = false,
): string {
  const lines: string[] = [
    `## Chapter ${result.chapterNumber} Test Results`,
    "",
    `**Overall: ${result.overallPass ? "✅ PASS" : "❌ FAIL"}**`,
    "",
    `- Total Tests: ${result.totalTests}`,
    `- Passed: ${result.passed}`,
    `- Failed: ${result.failed}`,
    `- Critical Failures: ${result.criticalFailures}`,
    `- Pass Rate: ${result.passRate.toFixed(1)}%`,
    "",
  ];

  if (result.failed > 0) {
    lines.push("### Failed Tests", "");
    result.results
      .filter((r) => !r.passed)
      .forEach((r) => {
        lines.push(`- **${r.assertionId}**: ${r.message}`);
      });
    lines.push("");
  }

  if (result.passed > 0 && fullReport) {
    lines.push("### Passed Tests", "");
    result.results
      .filter((r) => r.passed)
      .forEach((r) => {
        lines.push(`- ✅ ${r.assertionId}`);
      });
  }

  return lines.join("\n");
}
