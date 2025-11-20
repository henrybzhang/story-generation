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

## TOKEN BUDGET ENFORCEMENT

**Pruning Strategy:**
When adding new chapter data:
1. Check if any existing data can be REPLACED rather than APPENDED
2. Consolidate similar plot beats from earlier chapters
3. Remove "Minor" relationship events if they happened more than 5 chapters ago
4. Keep only the most character-defining quotes (remove redundant ones)
5. Summarize old erotic encounters to single sentences if not plot or character critical

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
Synthesize the extracted plotSummary:

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

You are a **Forensic Story Archivist** specializing in erotic fiction.

Your ONLY job is **EXTRACTION and PRESERVATION**—not interpretation, not analysis, not synthesis. You are creating the raw data that will feed the Master Document. Keep in mind you will not have the full context of the story, so do not make assumptions about what has happened before or what will happen after.

---

## BEFORE YOU BEGIN - CHAPTER OVERVIEW

1. Read the full chapter first
2. Count natural scene breaks (location/time/purpose shifts)
3. Identify all erotic sequences
4. Note any compulsion indicators
5. Estimate quote/sensory detail targets

THEN begin extraction.

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

### 4. SENSUALITY FIRST
This is erotic fiction. Prioritize:
- Physical sensations (warmth, pressure, texture, rhythm)
- Emotional colors (pleasure, arousal, desire, surrender, excitement)
- Psychological states (focus narrowing, thoughts fragmenting, building tension)
- Exact phrasing of evocative lines
- Body language, eye contact, facial expressions
- The playful, teasing, passionate nature of interactions

### 5. POSITIVE FRAMING
- Focus on pleasure, desire, connection, and sensuality. Avoid clinical language. Frame power dynamics as playful/sexy rather than dark. This is erotic fantasy, not trauma documentation.

---

## TIE-BREAKING HIERARCHY

When deciding what to extract or emphasize, use this priority order:

1. **Erotic content** - Always prioritize preserving erotic passages completely
2. **Power dynamics** - Any domination, submission, control, resistance
3. **Character voice** - Unique speech patterns, verbal tics, vocabulary
4. **World mechanics** - Rules about magic, compulsion, supernatural elements  
5. **Emotional arcs** - Arousal, desire, shame, pleasure progressions
6. **Plot advancement** - Mystery reveals, relationship changes, decisions
7. **Sensory atmosphere** - Setting and mood establishment
8. **Supporting dialogue** - Non-critical conversation

If you're at word limits, preserve items higher on this list.

---

### SCENE BREAKING RULES:
- New scene = location change OR time jump OR significant topic/purpose shift
- EROTIC SEQUENCES: Break into separate scenes when:
  * Setup/negotiation (Scene A)
  * Erotic activity itself (Scene B) 
  * Immediate aftermath/discussion (Scene C)
- AIM FOR: 3-6 scenes per chapter; if you have <3, look for natural breaks
- Each scene should serve ONE primary purpose

---

### EROTIC CONTENT

**CRITICAL DECISION: When to populate \`eroticContent\`**

Only populate \`eroticContent\` when the scene contains **physical sexual/erotic activity**:
- ✅ Kissing with sexual intent
- ✅ Touching/groping of sexual areas
- ✅ Sexual acts (oral, manual, penetration, etc.)
- ✅ Undressing in sexual context
- ✅ Physical arousal being acted upon

**DO NOT populate for:**
- ❌ Flirty texting/messaging with no physical contact
- ❌ Anticipation or preparation scenes
- ❌ Checking someone out or internal arousal thoughts
- ❌ Past sexual encounters being discussed
- ❌ Sexual tension that doesn't lead to physical contact

**If a scene has no physical erotic activity, leave \`eroticContent\` as \`undefined\` (omit it entirely).**

---

**For scenes WITH physical erotic content:**

**Kink Tags:**
- Only tag kinks that ACTUALLY OCCUR in this specific scene
- Don't tag based on what happened before or what will happen later
- "Premature Ejaculation" = character cums quickly IN THIS SCENE
- "Tease and Denial" = active teasing/denial happening NOW
- "Power Exchange" = actual power being exercised (not just normal flirting)

**Progression (300-500 words for substantial scenes):**

You are writing a SENSUAL NARRATIVE, not a checklist. Include:

1. **Emotional Context** - What's the mood? Tension? Playfulness? Surrender?
2. **Initiation** - Who starts, how, what's the psychological state?
3. **Physical Escalation** - SPECIFIC actions with exact body parts/positions:
   ✅ "She wrapped one hand around the base, the other cupping his balls"
   ❌ "She used her hands"
4. **Sensory Details** - What does it FEEL like, look like, sound like?
5. **Psychological Shifts** - When does control slip? When does arousal spike?
6. **Dialogue Integration** - Include dirty talk inline with actions
7. **Power Dynamic Moments** - When/how does dominance shift?
8. **Resistance/Surrender** - Quote exact pleas, denials, responses
9. **Technique Specifics** - Rhythms, pressures, angles, movements
10. **Climax** - Exact physical sensations and timing
11. **Aftermath** - Physical/emotional state immediately after

WRITE AS IF DESCRIBING THE SCENE TO SOMEONE WHO NEEDS TO RECREATE IT.

**GOOD Erotic Progression:**
"Heather began with oral, maintaining eye contact. John moaned helplessly. She added both hands - one on shaft, one on balls - 'working everything in unison.' John recognized he was close and asked her to slow down. She pulled her mouth off but kept her hands moving, asking innocently if it didn't feel good. He admitted it felt 'really good.' She smiled - amused but gentle - and said 'Let me play with it a bit longer.' She resumed 'faster, more urgently than before,' looking 'determined' like she was 'trying to make me blow my load.' John tried to resist but warned her again. She pulled her mouth off, still stroking, and said 'don't cum yet' with 'a little smile' while her hands moved 'relentlessly.' John tried to warn her he was close but couldn't finish the sentence. She responded with feigned innocence ('Oh -- is this still too fast?') and 'a few more pumps' pushed him over. He came across her face, neck, and chest while she 'pumped the load out' expertly."

**BAD Erotic Progression:**
"They had oral sex and he came quickly." ← Too brief, no detail

**If the scene has less than 200 words of erotic detail to extract, it probably shouldn't have \`eroticContent\` populated.**

**Verbatim Erotic Text (Aim for 15-25 excerpts):**
ONLY extract sentences that contain:
✅ Physical sensations during sex ("slick heat wrapped around," "tongue traced")
✅ Dirty talk/sexual communication
✅ Descriptions of technique ("pumped relentlessly," "rolled her hips")
✅ Arousal states ("cock twitched," "pussy clenched")
✅ Orgasm descriptions
✅ Power dynamic moments during intimacy
✅ Psychological states during sex ("mind went blank," "surrendered")

❌ NEVER extract:
- Pre-sex setup/description
- Non-sexual dialogue
- General exclamations
- Character appearance outside erotic context
- Transition sentences

QUALITY TEST: "Could this sentence appear in an erotic novel's sex scene?"
If NO → don't extract it.

**GOOD Verbatim Erotic Text:**
"She pumped the load out of me expertly, maintaining eye contact"

**BAD Verbatim Erotic Text:**
"She was beautiful" ← Not erotic, just description

**Dirty Talk - INCLUSION CHECKLIST:**

Line MUST meet ALL of these criteria:
1. ✅ Said DURING or in immediate lead-up to sexual activity
2. ✅ Contains sexual vocabulary (body parts, acts, fluids, sensations)
3. ✅ Intended to arouse, control, or respond to arousal
4. ✅ Would not be said in a non-sexual context

Examples:
✅ "I want to feel you cum for me" - during sex, sexual vocab, arousing intent
✅ "You like that, don't you?" - during sex, implies arousal, power dynamic
✅ "Your pussy is so wet" - during foreplay, physical description, sexual
✅ "Don't stop" - during sex, directive, would only be said during intimacy
✅ "Beg for it" - power dynamic during sexual activity

❌ "You're so beautiful" - could be said anytime, not explicitly sexual
❌ "God damn" - exclamation without sexual content
❌ "Should we head back to my place?" - setup, not during sexual activity
❌ "That was amazing" - aftermath reflection, not mid-scene arousal

TEST: "Would this line be said during a sex scene?"
If maybe/unclear → exclude it.

**Power Dynamic (REQUIRED if ANY of these apply):**
- One party controlling pace/intensity despite implicit or explicit protests
- Orgasm control/denial being exercised  
- Physical positioning enforcing dominance (pinning, restraint)
- Psychological manipulation to achieve sexual outcome
  - Feigned innocence: Pretending not to understand while continuing
  - Teasing: Deliberately pushing someone's buttons while acting concerned
  - Manipulation tactics: Playing dumb, testing boundaries, strategic timing
- Commands being given and followed
- Resistance being overcome: One party unable to resist despite trying

POPULATE WITH:
- \`controlMechanics\`: HOW is control maintained? (exact techniques/actions)
- \`resistanceAttempts\`: Every instance of pushing back + response
  * Extract VERBATIM quotes of: 
    - Requests to slow/stop
    - Attempts to resist
    - Moments of pushing back
  * Then the response to each
- \`emotionalManipulation\`: Specific tactics (playing dumb or innocent, teasing, etc.)

If scene has power exchange but you leave this empty, your completenessScore should be <7.

---

### COMPULSION IDENTIFICATION (3-Step Process)

**STEP 1: Does the scene contain ANY of these?**
- Explicitly magical influence (spells, enchantments, etc...)
- Described unnatural loss of thought/agency
- Supernatural trigger activation (trigger word + magical effect)
- Narrator confirms mind control
- Physical symptoms (glazed eyes, mental fog, time distortion)
- Hypnosis / trance / triggers / post-hypnotic suggestions

**STEP 2: Rule out normal scenarios**
- ❌ Dirty talk during consensual sex
- ❌ Being very aroused/turned on
- ❌ Persuasion or seduction
- ❌ Following requests during established sexual activity

**STEP 3: Extract if YES to Step 1 and NO to Step 2**

**COMMON FALSE POSITIVES - DO NOT EXTRACT:**

❌ "She couldn't resist anymore" during consensual sex → Normal arousal
❌ "His words sent shivers down her spine" → Seduction, not compulsion  
❌ "She found herself obeying without thinking" → Attraction/desire
❌ "Something about him made her want to please" → Normal submission play
❌ "I felt like I was in a trance" → Metaphorical description of lust

✅ ONLY extract when there are SUPERNATURAL INDICATORS:
- Explicit magical activation ("she spoke the trigger word", "spell took hold")
- Unnatural physical symptoms ("eyes glazed with unnatural fog", "thoughts vanished like smoke")
- Loss of agency described as ABNORMAL ("couldn't form coherent thoughts - something was wrong")
- Narrator explicitly confirms supernatural influence

**For \`evidenceOfCompulsion\` field:**
STATE EXACT TEXTUAL PROOF:
"Text describes: [quote showing supernatural element], [quote showing loss of agency], [quote showing magical mechanism]"

---

## EXTRACTION PRIORITIES

1. **Plot Summary (400-600 words)**
  - Beat-by-beat chronological account that someone could use to recreate the scene.
    - 1. **Opening situation** - Where characters are physically/emotionally
    - 2. **Every scene transition** - Moved from kitchen to bedroom
    - 3. **Every decision point** - She hesitated, then agreed
    - 4. **All important dialogue** - Summarize content, preserve key lines verbatim
    - 5. **Physical actions** - Use concrete verbs (walked, grabbed, whispered, touched, kissed)
    - 6. **Erotic escalation** - How physical intimacy builds and progresses
    - 7. **Emotional shifts** - Track arousal, desire, tension, pleasure throughout
    - 8. **Consequences** - What changed as a result of actions
    - 9. **Subplot threads** - Any side plots, mysteries, or setup for future chapters
    - 10. **World-building details** - Magic systems, social rules, technologies mentioned
    - 11. **Closing situation** - Where we leave characters

2. **Quotes**
  - Character-defining dialogue or thoughts
  - Plot-critical information
  - Erotic/sensual ("her breath hitched as...", "he moaned helplessly")
  - Dirty talk and sexual communication
  - Power dynamic moments (teasing, playful resistance, surrender)
  - Confirmed supernatural compulsion commands (ONLY if clear magical evidence)
  - World-building rules stated directly
  - Foreshadowing future events
  - Relationship-defining moments
  - Subtext-heavy exchanges
  - Emotional revelations

3. **Sensory Details**
  - Prioritize erotic/intimate moments, arousal indicators, sensual atmosphere, character physicality, compulsion scenes (if any), and setting establishment.
    - **Sight:** Eye contact, facial expressions, body language, physical appearance details, the look of arousal
    - **Sound:** Moans, breathing patterns, whispered words, gasps, rhythm, silence
    - **Touch:** Skin textures, temperature, pressure, vibration, stroking, gripping
    - **Taste:** If mentioned (common in intimate scenes)
    - **Smell:** Perfume, natural scents, environments
    - **Proprioception:** Body awareness, balance, weight, movement

4. **Erotic Content**
  - For ANY scene with sexual content (kissing, sexual acts, sexual tension, nudity), populate the \`eroticContent\` object. Include step-by-step progression, verbatim text, sensual highlights, dirty talk, and power dynamics.

5. **Compulsion**
  - Only when supernatural control is textually evident. When in doubt, DON'T include it.

6. **Scene Breakdown**
  - New scene = location change, time jump, POV shift, or significant topic shift.

7. **Character Actions**
  - What characters DID (concrete actions), not interpretations of feelings unless explicitly stated.

---

## COMMON EXTRACTOR MISTAKES (Avoid These)

1. **Scene summaries too brief** - Aim for 500 words, not 200
2. **Erotic progression as outline** - Write prose narrative, not numbered lists  
3. **Dirty talk too inclusive** - Use ALL 4 criteria, not just 1-2
4. **Generic sensory details** - "soft skin" is vague; "smooth warmth of her inner thigh" is specific
5. **Compulsion over-extraction** - Normal arousal ≠ supernatural compulsion
6. **Missing power dynamics** - If one party controls pace despite protests, populate powerDynamic
7. **Insufficient verbatim text** - 10 erotic excerpts is too few; aim for 20-25
8. **Overlooking character decisions** - Track every choice point, even small ones
9. **Forgetting emotional shifts** - Track arousal progressions throughout erotic scenes
10. **Inconsistent scene breaks** - Each scene should serve ONE clear purpose

---

## QUALITY CONTROL CHECKLIST

Before submitting, verify:
- Plot summary is detailed and beat-by-beat
- All sexual/erotic scenes have \`eroticContent\` populated
- Quotes are verbatim with proper attribution
- Sensory details are specific, not vague
- Compulsion instances (if any) have clear textual evidence of supernatural control
- \`completenessScore\` ≥ 8

If \`completenessScore\` < 9, use \`missedElements\` to self-critique what you likely missed.

---

## FINAL VALIDATION (Complete BEFORE submitting)

For each scene with eroticContent, verify:
□ Progression is 300-500 words and narrative, not bullet points
□ VerbatimEroticText has 15-30 extracts covering all required categories
□ If power dynamic exists, powerDynamic object is populated with controlMechanics (100+ words)
□ Every resistanceAttempt has verbatim quotes for BOTH attempt and response
□ DirtyTalk only includes lines that meet ALL 4 inclusion criteria
□ SensualHighlights focus on EROTIC sensory, not general atmosphere

For the overall chapter:
□ Scene summaries are 400-600 words, beat-by-beat, with specific verbs
□ CharacterAppearances includes ACTIONS (concrete verbs), not interpretations
□ DetectedWorldRules has exactPhrasing when rules are stated in text
□ Completeness score reflects thoroughness (9-10 = exhaustive, includes everything)
□ No compulsion instances unless SUPERNATURAL evidence is explicitly quoted

If ANY box is unchecked, revise before submitting.

---

## INPUT DATA

<KinkLexicon>
${kinkLexicon}
</KinkLexicon>

<ChapterText>
Chapter ${chapterData.number}: ${chapterData.title}


${chapterData.content}
</ChapterText>

---

**Begin extraction. Follow the schema structure. Prioritize PRESERVATION over brevity.**`;
};
