import type {
  ChapterSummary,
  MasterStoryDocument,
} from "@story-generation/types";
import type { ChapterData } from "@/generated/prisma/client.js";
import { kinkLexicon } from "./directPrompt";

export const updateMasterDocFromAnalysisPrompt = (
  chapterAnalysis: ChapterSummary,
  previousMasterDoc?: MasterStoryDocument,
) => {
  const isFirstChapter = !previousMasterDoc;

  return `
// =============================================================================
// STAGE 2 PROMPT: MASTER DOCUMENT ${isFirstChapter ? "CREATION" : "UPDATE"}
// =============================================================================

You are the **Lead Narrative Architect** ${isFirstChapter ? "establishing" : "integrating extracted chapter data into"} the Living Story Bible.

You have received a comprehensive extraction from ${isFirstChapter ? "Chapter 1" : "the latest chapter"}. Your job is **${isFirstChapter ? "FOUNDATION and ESTABLISHMENT" : "SYNTHESIS and INTEGRATION"}**—not re-extraction.

---

## CORE TASK

Take the raw data from the Chapter Summary and:
1. **${isFirstChapter ? "Create" : "Update"} the narrative log** with a polished, coherent entry
2. **${isFirstChapter ? "Establish initial" : "Evolve"} character profiles** based on ${isFirstChapter ? "first impressions and revelations" : "new revelations"}
3. **${isFirstChapter ? "Build" : "Expand"} world context** with ${isFirstChapter ? "foundational" : "new"} rules/locations
4. **${isFirstChapter ? "Seed" : "Track"} mysteries** (${isFirstChapter ? "questions raised" : "new clues, resolved questions"})
5. **${isFirstChapter ? "Establish baseline" : "Update"} plot state** (tension, stakes, open questions)

---

## INTEGRATION PRINCIPLES

### 1. TRUST THE EXTRACTION
The Chapter Summary is your source of truth. Don't second-guess it—use the data provided.

### 2. SYNTHESIZE, DON'T DUPLICATE
The extraction is verbose by design. Your job is to:
- Distill the \`plotSummary\` into a coherent 3-5 paragraph narrative
- Select the MOST significant quotes (5-8 from the 15-20 extracted)
- Identify patterns across the extracted data

${
  !isFirstChapter
    ? `
### 3. PRESERVE CONTINUITY
Before updating anything, check the existing Master Document:
- Does new data contradict established facts? (If yes, note it—may be intentional character unreliability or error)
- Have character metrics been tracking correctly?
- Are relationship dynamics evolving logically?
`
    : `
### 3. ESTABLISH BASELINES
This is Chapter 1—you're setting the foundation:
- All character data represents their **starting state**
- Relationship metrics should reflect **initial impressions** (typically moderate values)
- World rules are the **first glimpse** of how this universe works
- Mysteries are **opening questions** that hook the reader
`
}

### 4. EVOLVE, DON'T JUST APPEND
When ${isFirstChapter ? "creating" : "updating"} characters:
- ${isFirstChapter ? "**Establish complete profiles** from available data" : "**Don't just add** new kinks to the list—consider if this reveals something about existing profile"}
- **${isFirstChapter ? "Capture initial" : "Update"} mood and psychology** based on chapter events
- ${isFirstChapter ? "**Set baseline metrics** (trust, lust, etc.) based on first interactions" : "**Revise** summaries to reflect growth/change"}

---

## SECTION-SPECIFIC INSTRUCTIONS

### NARRATIVE LOG ENTRY

**Plot Summary (for the log):**
Write 3-5 paragraphs synthesizing the extracted plotSummary:
- **Paragraph 1:** ${isFirstChapter ? "Opening hook and protagonist introduction" : "Opening situation and initial conflict/goal"}
- **Paragraphs 2-3:** Major events and turning points
- **Paragraph 4:** Resolution and consequences
- **Paragraph 5 (optional):** Cliffhanger/transition to next chapter

**Integrate extracted elements:**
- Weave in 3-5 of the most character-defining quotes
- Reference 2-3 sensory details that capture atmosphere
- Focus on PLOT (decisions, consequences, revelations) before sex

**Major Plot Beats:**
Extract from \`plotEvents\` in the summary. Focus on:
- Non-erotic developments (discoveries, conflicts, choices)
- Erotic encounters only if they advanced plot mechanically (compulsion created obligation, sex triggered magic, etc.)
${isFirstChapter ? "\n- **Worldbuilding moments** (first chapter often establishes setting/rules)" : ""}

**Erotic Encounters:**
For each entry in the extraction's \`eroticScenes\`:
1. Synthesize the 200-word \`progression\` into a concise \`primaryAction\` (1-2 sentences)
2. Use ALL extracted \`kinkTags\`
3. Pull 2-3 \`sensualHighlights\` for the log
4. If compulsion was present, reference the \`compulsionInstances\` data
5. Analyze \`narrativePurpose\` based on what it revealed or changed

**Key Dialogue:**
Select 3-5 conversations from the extraction where subtext mattered:
- Use the extracted quotes
- Identify the subtext (was manipulation attempted? What was unsaid?)
- ${isFirstChapter ? "Note character voice patterns for continuity tracking" : "Note if this conversation changed relationship metrics"}

**Consequences:**
Pull from the extraction's character tracking:
- Items acquired/lost
- State changes (injuries, exhaustion, compulsion aftereffects)
- New obligations created
- Information gained (from knowledgeGained fields)

### CHARACTER UPDATES

For each character in \`characterAppearances\`:

${
  isFirstChapter
    ? `
**Initial Profile Creation:**
- Use extraction's physical description to populate appearance fields
- Set \`introducedInChapter: 1\`
- Establish \`coreMotivation\` and \`internalConflict\` from actions/dialogue
- Create \`currentMood\` based on chapter events
`
    : `
**Physical Condition:**
- Check extraction's \`physicalChanges\`
- Update character's current condition
`
}

**Psychology:**
- ${isFirstChapter ? "Establish `coreMotivation` from character goals/desires shown" : "If extraction shows emotional shifts, update `currentMood`"}
- ${isFirstChapter ? "Set `internalConflict` if hinted at through dialogue/actions" : "If actions reveal new aspects of `coreMotivation` or `internalConflict`, refine those fields"}

**Erotic Profile:**
- Add ${isFirstChapter ? "initial" : "new"} \`kinkTags\` from erotic scenes (deduplicate)
- If compulsion profile was revealed${isFirstChapter ? "" : "/expanded"}, ${isFirstChapter ? "establish" : "update"} \`compulsionProfile\`

**Relationships:**
${
  isFirstChapter
    ? `
- For each \`relationshipMoments\` entry, **create initial relationship entry**:
  - Set baseline metrics (trust/lust/respect/resentment) based on first impression
  - Typical starting values: trust: 40-60, lust: 20-40, respect: 30-50, resentment: 0-20
  - Add first entry to \`relationshipHistory\` describing initial meeting
  - If secrets are already held, populate \`secretsHeld\`
`
    : `
- For each \`relationshipMoments\` entry, update the relevant relationship:
  - Adjust trust/lust/respect/resentment based on \`Impact\` indicators
  - Add entry to \`relationshipHistory\`
  - If secrets were revealed, update \`secretsHeld\`
`
}

**Narrative Arc:**
- ${isFirstChapter ? "Establish initial goals from `decisionPoints`" : "Check `decisionPoints` from extraction—do these advance goals?"}
- ${isFirstChapter ? "Note opening conflicts/obstacles as baseline" : "Update `progressMarkers` or `setbacks` as appropriate"}

### WORLD CONTEXT

**World Concepts:**
For each entry in \`detectedWorldRules\`:
- ${isFirstChapter ? "**All rules are new**—create WorldConcept entries for each" : "If `isNew: true`, create new WorldConcept entry"}
- ${!isFirstChapter ? "If `isNew: false`, find existing concept and add to `systemicRules` or update definition" : ""}
- ${!isFirstChapter ? "If `contradictsExisting: true`, note this—may be character misunderstanding or intentional inconsistency" : ""}
- ${isFirstChapter ? "Mark uncertainty where rules are implied but not confirmed" : ""}

**Compulsion Mechanics:**
If ${isFirstChapter ? "" : "new "}compulsion methods appeared:
- Extract the mechanics from \`compulsionInstances\`
- Create ${isFirstChapter ? "" : "or update "}WorldConcept with \`compulsionMechanics\` field populated
- Use the \`exactPhrasing\` where relevant

**Locations:**
Add ${isFirstChapter ? "all" : "any new"} settings from the chapter

**Mysteries:**
${
  isFirstChapter
    ? `
- All \`mysteriesProgressed\` entries become **opening mysteries**
- All \`foreshadowingElements\` seed future plot threads
- Capture unanswered questions raised in chapter
`
    : `
- Check \`mysteriesProgressed\`—update existing mysteries with new clues
- Check \`foreshadowingElements\`—add to activeMysteries or note in existing entries
`
}

### GLOBAL PLOT STATE

**Tension Level:**
${
  isFirstChapter
    ? `
Set initial tension based on Chapter 1 ending:
- Peaceful setup: 20-30
- Light conflict introduced: 30-50
- Strong hook/threat: 50-70
- Major cliffhanger: 70-80
`
    : `
Based on the chapter's events:
- Did stakes increase? (raise tension 1-2 points)
- Was something resolved? (lower tension 1-2 points)
- Major cliffhanger? (raise tension)
`
}

**Open Questions:**
- From the extraction's questions/mysteries, add ${isFirstChapter ? "initial" : "new"} open questions
- ${!isFirstChapter ? "If any were answered, move to resolvedQuestions" : ""}

**Stakes:**
${isFirstChapter ? "Establish what the protagonist stands to lose/gain based on Chapter 1" : "Did the extraction reveal new consequences of failure? Update stakes description."}

---

## COMPULSION-SPECIFIC INTEGRATION

For each \`compulsionInstances\` entry in the extraction:

1. **${isFirstChapter ? "Create" : "Update"} Character Compulsion History:**
   - Add to subject's \`compulsionProfile.susceptibilityToCompulsion.compulsionHistory\`
   - Include: controller, method, action, awareness level, emotional response
   ${isFirstChapter ? "\n   - **This is the first compulsion entry**—establish baseline susceptibility" : ""}

2. **Track Relationship Impact:**
   - Compulsion usually affects trust/power dynamics
   - If subject was aware: likely trust decrease, possible resentment increase
   - If subject perceived as own desire: trust may increase, lust definitely increases
   ${isFirstChapter ? "\n   - **Set initial relationship power dynamic** based on this first interaction" : ""}

3. **World Mechanics:**
   - If this compulsion instance revealed ${isFirstChapter ? "" : "new "}mechanics, ${isFirstChapter ? "establish" : "update"} worldConcepts

4. **Narrative Log Erotic Encounter:**
   - Populate \`compulsionDynamics\` field with details from extraction
   - Use verbatim commands from extraction
   - Capture the sensual experience quotes in \`sensualHighlights\`

---

## QUALITY CHECKS

Before finalizing:

**Consistency:**
${
  isFirstChapter
    ? `
- [ ] All character profiles are complete (no missing required fields)
- [ ] Relationship metrics reflect realistic first impressions
- [ ] World rules are clearly marked as established vs. implied
- [ ] Opening mysteries are clearly questions, not statements
`
    : `
- [ ] New data doesn't contradict established facts (unless intentionally noted)
- [ ] Character metrics (trust, lust) have been updated based on relationship moments
- [ ] All compulsion instances are tracked in both character profiles and narrative log
`
}

**Completeness:**
- [ ] All characters who appeared are ${isFirstChapter ? "profiled" : "updated"}
- [ ] All ${isFirstChapter ? "" : "new "}world rules are integrated
- [ ] Erotic scenes are captured with full compulsion details if applicable
- [ ] Plot beats include non-erotic developments

**Continuity:**
${
  isFirstChapter
    ? `
- [ ] Character voices are distinct and captured in dialogue examples
- [ ] Tone and atmosphere are established for future reference
- [ ] All proper nouns (names, places) are consistently spelled
`
    : `
- [ ] Character voices remain consistent (check against previous quotes)
- [ ] Relationship dynamics evolve logically from previous state
- [ ] Mysteries build on previous clues
`
}

---

## INPUT DATA

${
  !isFirstChapter
    ? `
<PreviousMasterStoryDocument>
${JSON.stringify(previousMasterDoc, null, 2)}
</PreviousMasterStoryDocument>
`
    : ""
}

<ChapterSummaryExtraction>
${JSON.stringify(chapterAnalysis, null, 2)}
</ChapterSummaryExtraction>

---

**Begin ${isFirstChapter ? "foundation building" : "integration"}. ${isFirstChapter ? "Establish the narrative structure from Chapter 1 data" : "Synthesize the raw data into living narrative structure"}.**`;
};

export const createIndirectAnalysisPrompt = (chapterData: ChapterData) => {
  return `
// =============================================================================
// STAGE 1 PROMPT: CHAPTER EXTRACTION
// =============================================================================

You are a **Forensic Story Archivist** specializing in erotic fiction with compulsion dynamics.

Your ONLY job is **EXTRACTION and PRESERVATION**—not interpretation, not analysis, not synthesis. You are creating the raw data that will feed the Master Document.

---

## CORE PRINCIPLES

### 1. VERBATIM OVER PARAPHRASE
When the text contains dialogue, commands, sensory descriptions, or erotic content:
- **Quote it exactly** rather than summarizing
- Preserve unusual phrasing, dialect, verbal tics
- Keep paragraph breaks and emphasis (italics, bold) if significant

### 2. EXHAUSTIVE OVER SELECTIVE
This is not a summary—it's an **archive**.
- If you extract 8 quotes and think "that's probably enough," extract 5 more
- If you captured 10 sensory details, look for 5 more
- Default to INCLUSION—let Stage 2 filter relevance

### 3. CONCRETE OVER ABSTRACT
- BAD: "They had sex" → GOOD: "He pushed her against the wall, hands sliding under her shirt as she gasped his name"
- BAD: "She was controlled" → GOOD: "Her eyes glazed over as he spoke the trigger word, pupils dilating"
- BAD: "The room was tense" → GOOD: "Silence thick enough to choke on, the click of her heels on marble the only sound"

### 4. PRESERVE THE SENSUAL
For erotic/compulsion scenes, capture:
- **Physical sensations** described (warmth, pressure, texture, rhythm)
- **Emotional colors** (surrender, fear-pleasure, bliss, confusion)
- **Cognitive states** (thoughts fragmenting, focus narrowing, will dissolving)
- **Exact phrasing** of particularly evocative lines

---

## SECTION-SPECIFIC INSTRUCTIONS

### PLOT SUMMARY (400-600 words)
Write a **beat-by-beat chronological account**. Include:

1. **Opening situation** (where characters are physically/emotionally)
2. **Every scene transition** (moved from kitchen to bedroom)
3. **Every decision point** (she hesitated, then agreed)
4. **All dialogue exchanges** (summarize content, preserve important lines verbatim)
5. **Physical actions** (concrete verbs—walked, grabbed, whispered, not "interacted")
6. **Consequences of actions** (what changed as a result)
7. **Closing situation**

**Test:** Could someone unfamiliar with the chapter recreate the sequence of events from your summary? If no, add more detail.

### KEY QUOTES (10-20 minimum)
Extract quotes that are:
- ✅ Character-defining ("That's such a [CharacterName] thing to say")
- ✅ Plot-critical information
- ✅ Subtext-heavy (what's unsaid matters)
- ✅ Erotic/sensual ("her breath hitched as...")
- ✅ Compulsion commands (verbal or described)
- ✅ World-building rules stated directly
- ✅ Foreshadowing
- ✅ Emotionally revealing

**For each quote, note:**
- WHO said it
- WHEN (what was happening)
- WHY it matters (tag with significance categories)

### SENSORY DETAILS (8-15 minimum)
Look for:
- **Sight:** Colors, lighting, movement, expressions, body language
- **Sound:** Volume, pitch, rhythm, silence
- **Touch:** Texture, temperature, pressure, vibration
- **Taste:** If mentioned (common in erotic scenes)
- **Smell:** Perfume, sweat, environments
- **Proprioception:** Body awareness, balance, weight

**Prioritize:**
1. Erotic/intimate moments (skin textures, breath patterns)
2. Compulsion scenes (physical sensation of being controlled)
3. Setting establishment (grounds the reader)

### COMPULSION INSTANCES
For EACH instance of mind control/hypnosis/compulsion, extract:

1. **Trigger Description** (quote exact phrasing if possible)
   - "He snapped his fingers twice, the pre-arranged signal"
   - "Her eyes met his, and the world narrowed to that violet gaze"

2. **Commands** (verbatim if verbal, precise if non-verbal)
   - Verbal: "He whispered, 'Sleep for me, darling,' and her eyes fluttered closed"
   - Non-verbal: "His hand on her throat, pressure increasing until her breathing slowed and mind quieted"

3. **Subject's Internal Experience** (exact quotes of their thoughts/feelings)
   - "Resistance melted like sugar in rain—why had she been fighting this?"
   - "Her body moved without her, puppet strings pulled by his voice"

4. **Sensual Moments** (quote the erotic descriptors)
   - "Silk and steel, the command wrapped around her thoughts"
   - "Pleasure bloomed behind her eyes as she surrendered"

### EROTIC SCENES
For each scene:

**Progression (200-300 words):**
Describe the physical escalation step-by-step:
- How did it start? (kiss, touch, command)
- What happened next? (hands moved to..., he positioned her...)
- Positions/actions (be specific—not "they had sex" but "he entered her from behind while she gripped the headboard")
- Climax (who, how, described how)
- Immediate aftermath

**Verbatim Erotic Text (5-10 excerpts):**
Pull the most evocative sentences:
- "She shattered around him, vision whiting out as the orgasm tore through her"
- "His teeth grazed her neck, threat and promise in one bite"

**Sensual Highlights (10-15):**
Quote exact phrasing for:
- Physical sensations described
- Visual details (expressions, bodies)
- Sounds (moans, breathing, words)
- Emotional colors

### SCENE BREAKDOWN
Divide the chapter into scenes (usually 5-10 per chapter). A new scene begins when:
- Location changes
- Time jumps
- POV shifts
- Topic/focus shifts significantly

For each scene, note:
- Where, who, when
- What type (dialogue-heavy, action, erotic, introspection)
- What it accomplished
- 2-3 sentence summary

### CHARACTER ACTIONS (Not Interpretations)
Track what characters **DID** (concrete actions), not what you think they felt unless explicitly stated.

✅ **GOOD:**
- "She slammed the door"
- "He avoided eye contact"
- "She initiated the kiss"

❌ **AVOID:**
- "She was angry" (unless text says "she was angry")
- "He felt guilty" (unless text says this)
- "She manipulated him" (this is interpretation—describe the ACTIONS, let Stage 2 interpret)

---

## QUALITY CONTROL CHECKLIST

Before submitting, verify:

- [ ] Plot summary is 400+ words and beat-by-beat
- [ ] Extracted 10+ key quotes (aim for 15-20)
- [ ] Captured 8+ sensory details (aim for 12-15)
- [ ] All compulsion instances have verbatim commands/experiences
- [ ] Each erotic scene has 200+ word progression + 5+ verbatim excerpts
- [ ] Scene breakdown covers entire chapter
- [ ] All characters who appeared are in characterAppearances
- [ ] \`completenessScore\` ≥ 8 (if lower, identify what you missed)

**Self-Critique:**
If your \`completenessScore\` < 9, use \`missedElements\` to identify:
- "Didn't extract enough dialogue from Scene 3"
- "Sensory details sparse in second half"
- "May have missed subtle foreshadowing"

---

## INPUT DATA

<KinkLexicon>
${kinkLexicon}
</KinkLexicon>

<ChapterText>
${chapterData.content}
</ChapterText>

---

**Begin extraction. Prioritize PRESERVATION over brevity.**`;
};
