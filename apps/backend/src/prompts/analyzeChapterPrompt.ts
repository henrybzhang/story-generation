import type { ChapterData } from "@/generated/prisma/client";
import { CHARACTERS_TO_IGNORE, kinkLexicon } from "./extraPrompts";

export const createAnalyzeChapterPrompt = (chapterData: ChapterData) => {
  return `
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

## CHARACTER FILTERING

${CHARACTERS_TO_IGNORE}

Omit these characters from the \`characters\` array and as primary participants in \`relationships\`. They may appear in narrative context (continuity notes, location descriptions) if they impact the story.

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

${CHARACTERS_TO_IGNORE}

---

**Begin extraction. Follow the schema structure. Prioritize PRESERVATION over brevity.**`;
};
