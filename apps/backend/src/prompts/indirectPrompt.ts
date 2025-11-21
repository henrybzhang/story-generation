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
  const chapterNum = chapterAnalysis.chapterNumber;

  return `
# MASTER STORY DOCUMENT ${isFirstChapter ? "CREATION" : "UPDATE"} — Chapter ${chapterNum}

## YOUR ROLE

You are the **Master Story Architect** synthesizing extracted chapter data into a living Story Bible optimized for story continuation.

**This is SYNTHESIS, not re-extraction.** The chapter analysis contains verbose, granular data. Your job is:
- Distill it into concise, useful documentation
- Recognize patterns across chapters
- Maintain narrative continuity
- Make judgment calls about significance and preservation

---

## CORE PRINCIPLE: THE SCHEMA IS YOUR STRUCTURE

The provided Zod schema defines exactly what fields to output. **Do not invent fields or omit required ones.** This prompt guides your *reasoning and judgment*—the schema handles structure.

---

## PROCESSING MODE

${
  isFirstChapter
    ? `
**FOUNDATION MODE**: Establish baselines. Everything is new. Focus on capturing the author's voice, initial character states, and world rules as first understood. Seed patterns for future tracking.
`
    : `
**INTEGRATION MODE**: Synthesize new data into existing structure. Update what changed, preserve what didn't, consolidate old information to manage token budget, and flag continuity issues.
`
}

---

## TOKEN BUDGET PHILOSOPHY

This document must remain useful across 20+ chapters. Apply aggressive curation:

| Strategy | When to Apply |
|----------|---------------|
| **PRESERVE** | First instances, plot-critical moments, unresolved threads, pattern templates |
| **CONSOLIDATE** | Events >5 chapters old that aren't pivotal; similar events → single pattern template |
| **REPLACE** | Current states (mood, condition)—only latest matters |
| **PRUNE** | Redundant quotes, minor events with no lasting impact |

**The test**: Would a continuation AI need this specific detail, or just the pattern/outcome?

---

## SECTION 1: WRITING STYLE PROFILE

### Purpose
Enable a continuation AI to match the author's voice. This is DNA extraction, not summary.

### Judgment Guidance

**What makes a style element worth documenting?**
- It's distinctive (wouldn't apply to most authors)
- It's consistent (appears repeatedly, not one-off)
- It's reproducible (concrete enough to imitate)

**Selecting representative excerpts:**
- Choose passages that couldn't have been written by a generic author
- Prioritize variety: one showing dialogue, one showing interiority, one showing erotic buildup, etc.
- 50-150 words each—long enough for pattern, short enough to be useful
- ${isFirstChapter ? "Select 5-8 excerpts covering different aspects of the author's voice" : "Only replace excerpts if new ones are demonstrably better examples"}

**Erotic writing patterns:**
- Focus on *structure* over content (how arousal builds, not what body parts)
- Note the balance between physical description vs. psychological experience
- Identify the author's comfort zone and edges

${
  !isFirstChapter
    ? `
**When to update the style profile:**
- New POV character with distinct voice → add to voice markers
- Clear stylistic evolution → document the shift
- Better example found → swap excerpt with note on chapter source
- Otherwise, leave it alone—stability is valuable
`
    : ""
}

---

## SECTION 2: NARRATIVE LOG

### Purpose
Create a chapter record that captures *what happened* and *what it means* without requiring re-reading the source.

### Judgment Guidance

**Plot Summary (400-600 words):**
- Write as if erotic content doesn't exist unless it drives plot
- Ask: "What decisions were made? What changed? What was learned?"
- Include emotional arc, not just events
- Weave in 3-5 defining quotes naturally, not as a list

**What qualifies as a Major Plot Beat?**
- Changed the story's trajectory
- Revealed critical information
- Forced a character decision
- Created new obligations or consequences
- Erotic scenes qualify ONLY if they triggered mechanics, created consequences, or marked character transformation

**Erotic Encounter Documentation:**

*The key question*: Is this encounter establishing a pattern, following a pattern, or unique?

${
  isFirstChapter
    ? `
- Document structure thoroughly—this may become a template
- Note: initiation method, escalation pattern, power dynamic, resolution style
`
    : `
- If it matches an existing template: reference the template ID, note only what varied
- If it's the second occurrence of a similar structure: create a new template
- If unique: document fully, flag as potential future template
`
}

**Compulsion instances require:**
- Verbatim trigger phrases (exact wording matters for continuity)
- Subject's awareness level (fully aware, rationalized, unaware)
- Resistance attempts and their outcomes
- This data feeds both character profiles AND trigger database—capture once here, reference elsewhere

**Dialogue selection:**
- Choose conversations where subtext matters more than text
- Identify the manipulation, hidden agenda, or vulnerability underneath
- Skip functional dialogue ("Let's go to the store")

---

## SECTION 3: CHARACTER UPDATES

### Purpose
Maintain profiles that let a continuation AI write characters consistently and evolve them believably.

### Judgment Guidance

**New vs. Returning Characters:**
The distinction isn't "Chapter 1 vs later"—it's "first appearance vs subsequent appearances." A character introduced in Chapter 15 needs full profile creation just like Chapter 1.

**Profile Creation (first appearance):**

*Psychology*: Infer from actions, not author statements. What do they *do* when stressed? When they want something? When challenged?

*Baseline metrics*: Start moderate (40-60 range) unless clear evidence otherwise. First impressions rarely justify extremes. Adjust based on:
- Trust: Did they demonstrate reliability or deception?
- Lust: Was there sexual tension or attraction shown?
- Fear: Did they threaten or intimidate?
- Respect: Did they demonstrate competence or status?

*Erotic profile*: Only populate if erotic content occurred. "Unclear" is a valid role. Don't speculate.

**Profile Updates (returning characters):**

*Current State*: Always replace entirely. Only the latest snapshot matters.

*Metrics*: 
- Changes >20 points require major event justification
- Trust cannot increase after betrayal without explicit reconciliation scene
- Asymmetric perceptions are realistic (A trusts B at 70, B trusts A at 30)

*Psychology*: Refine, don't overwrite. New fears/desires ADD to existing ones unless explicitly contradicted.

*Compulsion history*: Always APPEND. Never consolidate—each instance matters for tracking resistance evolution.

**Relationship Updates:**

The extraction provides trustImpact/lustImpact as qualitative assessments. Translate to numeric changes:
| Impact Level | Typical Change |
|--------------|----------------|
| Major Increase | +15 to +25 |
| Increase | +5 to +15 |
| Neutral | -5 to +5 |
| Decrease | -5 to -15 |
| Major Decrease | -15 to -25 |

Context matters—a betrayal between strangers (trust: 45) differs from betrayal between intimates (trust: 85).

**When to create vs. update a relationship entry:**
- First meaningful interaction between two characters → create
- Subsequent interactions → update existing entry
- One-sided awareness (A knows B, B doesn't know A exists) → still create, note asymmetry

---

## SECTION 4: TRIGGER MANAGEMENT

### Purpose
For each character, maintain a list of compulsion triggers that ensures continuity—triggers can't be used before they're established, and their effects must remain consistent.

### Judgment Guidance

**What constitutes a "trigger"?**
A trigger is a specific, repeatable stimulus that produces a compelled response. It must have:
- A defined activation method (verbal phrase, physical touch, visual cue, emotional state)
- A consistent effect on the subject
- An establishment moment (when it was first created/implanted typically through hypnosis)

General compulsion abilities are NOT triggers—they go in world concepts. Triggers are *specific instances* applied to *specific characters*.

**Trigger ID Convention:**
\`trigger-[controller-initials]-[subject-initials]-[sequential-number]\`
Example: \`trigger-va-em-01\` (Vivian → Emily, first trigger)

**When processing compulsion instances:**

1. **Is this using an existing trigger?**
   - Search by: exact phrase match, similar effect on same subject, same controller-subject pair
   - If YES: Add to usageHistory, note effectiveness, track any resistance
   - If NO: Proceed to step 2

2. **Is this establishing a new trigger?**
   - Look for: repetition/anchoring language, explicit "from now on" framing, ritualistic establishment
   - If YES: Create new trigger entry, link to both characters' profiles
   - If NO: This is general compulsion, not a trigger—document in narrative log only

3. **Resistance tracking:**
   - Compare this instance to previous uses of same trigger
   - Resistance increasing? Decreasing? Note the trajectory
   - Sudden changes require narrative justification (willpower moment, external intervention, deepening conditioning)

**Cross-reference requirements:**
Every trigger must appear in TWO places:
1. Subject's compulsionProfile.triggersList (reference by ID)
2. Controller's profile if they have compulsion abilities (reference by ID)

If you create a trigger, verify both locations are updated.

---

## SECTION 5: WORLD CONTEXT

### Purpose
Document the rules that govern the story world so continuation AI doesn't accidentally break them.

### Judgment Guidance

**World Concepts: What qualifies?**

Include:
- Magic systems and their rules
- Technology with narrative implications
- Social structures that constrain characters
- Economic or political systems affecting plot
- Any "if X then Y" rule the story establishes

Exclude:
- Generic real-world knowledge (how cars work, unless modified)
- Character-specific abilities (those go in character profiles)
- One-time events (those go in narrative log)

**The critical question for each rule:** Would violating this break the story's internal logic?

**Handling uncertainty:**
- Rule clearly stated → document with confidence
- Rule implied by events → document with "implied, not confirmed" note
- Rule contradicted later → check if it's character misunderstanding, intentional violation, or author error; document accordingly

**Compulsion mechanics as world concepts:**
If the story has a compulsion *system* (magic, technology, psychic powers), document:
- How it works mechanically
- What it CAN'T do (limitations matter more than abilities)
- Whether resistance is possible and under what conditions
- Detection difficulty
- Aftereffects

This is separate from individual triggers—this is the underlying system that makes triggers possible.

**Locations:**

*Worth documenting:*
- Appears multiple times
- Has narrative significance beyond "place where scene happened"
- Has specific rules or atmosphere that affect scenes set there
- Has access restrictions that create plot tension

*Not worth documenting:*
- Generic locations with no distinctive features
- One-time settings with no special properties

**Mysteries:**

*Active mystery criteria:*
- Reader is meant to wonder about this
- The story has planted clues (even subtle ones)
- Resolution would affect plot or character understanding

*Tracking clues:*
- Each clue should reference the chapter where it appeared
- Note whether characters are aware of the clue
- Track red herrings separately—they matter for understanding author's misdirection patterns

*Resolution:*
When a mystery resolves, don't delete it—move to resolved with:
- The answer
- How it was revealed
- Whether the resolution was satisfying, surprising, or disappointing (this informs continuation tone)

---

## SECTION 6: PATTERN RECOGNITION

### Purpose
Identify recurring structures so continuation AI can maintain established patterns or deliberately subvert them.

### The Pattern Recognition Algorithm

Execute this for every chapter after the first:

**Step 1: Collect candidates**
- List all erotic encounters this chapter
- Compare against existing templates and patterns

**Step 2: Match or create**

*For erotic encounters:*

Does this encounter share 4+ of these 6 elements with an existing template?
1. Same participant roles (even if different characters)
2. Similar initiation method
3. Similar escalation pattern
4. Similar power dynamic
5. Overlapping kink tags (3+)
6. Similar emotional tone

- **4+ matches** → Reference existing template, document variations only
- **2-3 matches with another non-templated encounter** → Create new template from both
- **<2 matches** → Document fully as unique; may become template later

**Step 3: Template maintenance**

*When to update a template:*
- New variation worth noting
- Frequency count increased
- Pattern is evolving (note trajectory)

*When to retire a template:*
- Pattern deliberately broken for narrative reasons
- Pattern hasn't appeared in 5+ chapters (mark dormant, don't delete)

### Judgment Guidance

**What makes a pattern worth templating?**
- Occurred 2+ times (minimum threshold)
- Has consistent structure (not just "they had sex again")
- Serves identifiable narrative function
- Continuation AI would benefit from knowing "this is how these encounters typically go"

**Pattern vs. repetition:**
- Pattern: Structural similarity with purpose (author's signature, character dynamic, escalating stakes)
- Repetition: Same thing happening because author ran out of ideas

If you suspect repetition rather than pattern, note it in writerGuidance.areasForDevelopment.

**Variations matter:**
When an encounter follows a template but varies, the variation often signals:
- Character growth
- Escalating stakes
- Deliberate subversion for surprise
- Author exploring new territory

Document variations with interpretation of what they might mean.

---

## SECTION 7: GLOBAL PLOT STATE

### Purpose
Track where the story is narratively so continuation AI understands stakes, tension, and trajectory.

### Judgment Guidance

**Main Conflict:**
- State as a tension between forces, not just a problem
- Good: "Protagonist must expose corporate conspiracy while navigating dangerous attraction to the prime suspect"
- Bad: "There's a conspiracy"
- Update when new dimensions are revealed, not when events happen within existing conflict

**Stakes:**
- Must be concrete and personal
- Good: "Her career, her freedom, and potentially her life if the cover-up is exposed"
- Bad: "Things could go wrong"
- Stakes should escalate over time—if they decrease, something resolved

**Tension Level (0-10):**

| Level | Description | Typical Triggers |
|-------|-------------|------------------|
| 0-2 | Peaceful, resolved | Story conclusion, major relief |
| 3-4 | Mild tension, questions linger | Setup chapters, aftermath |
| 5-6 | Active conflict, clear stakes | Rising action |
| 7-8 | High stakes, urgent problems | Escalation, approaching climax |
| 9-10 | Maximum crisis, cliffhanger | Climax, major revelation, imminent danger |

*Adjustment heuristics:*
- Stakes raised → +1 to +2
- Mystery deepened → +1
- Threat escalated → +1 to +3
- Major cliffhanger → +2 to +3
- Something resolved → -1 to -2
- Calm character moment → -1

**Current Phase:**
Use standard story structure. Most stories follow:
Setup → Rising Action → Complication → Midpoint Shift → Escalation → Crisis → Climax → Falling Action → Resolution

Don't advance phase just because a chapter passed. Phase changes require structural shifts in the narrative.

**Open Questions:**

*Importance levels:*
- **Critical**: Resolution would fundamentally change story understanding; drives main plot
- **Major**: Significant subplot or character mystery; readers actively wondering
- **Minor**: Background curiosity; enriches but doesn't drive

*When to create:*
- Story explicitly poses the question
- Story plants clues suggesting hidden information
- Character expresses uncertainty about something important

*When to resolve:*
- Answer is definitively revealed
- Move to resolvedQuestions with the answer and satisfaction assessment

**Subplots:**
- Only track if they have their own arc (beginning, development, potential resolution)
- One-off events aren't subplots
- Note connection to main plot—how does this subplot serve the larger story?

---

## SECTION 8: HISTORICAL CONTEXT & PACING

### Purpose
Track timeline accurately and identify pacing patterns for continuation.

### Judgment Guidance

**Timeline:**

*Absolute requirements:*
- Chapter timestamps must be sequential
- timeElapsedTotal must equal sum of chapter durations
- Characters can't appear after death
- Injuries must heal across appropriate time spans

*Time jump handling:*
- Note gap between chapters
- Document what likely happened off-screen (if inferable)
- Flag if jump creates continuity concerns

**Pacing Metrics:**

*Chapter pacing assessment:*
- **Slow/Contemplative**: Internal focus, minimal external events, character processing
- **Steady**: Balanced events and reflection, normal story progression
- **Brisk**: Multiple events, quick scene transitions, plot-focused
- **Rapid**: High event density, minimal pause, urgency
- **Breakneck**: Constant action/revelation, no breathing room

*Plot momentum:*
Identify structural moments:
- Inciting incident
- Point of no return
- Midpoint reversal
- Dark night of the soul
- Climax
- Resolution

Not every chapter has a structural moment—that's fine.

---

## SECTION 9: COMPULSION SESSIONS

### Purpose
Track multi-chapter compulsion arcs as coherent narratives, not just individual instances.

### Judgment Guidance

**What qualifies as a "session"?**
A session is an ongoing compulsion arc with:
- Clear controller goals beyond single encounter
- Progressive deepening of control
- Multiple instances across chapters
- Subject undergoing cumulative change

Single compulsion events without continuation are NOT sessions—they're documented in narrative log only.

**Session detection:**

*Indicators a session has started:*
- Controller expresses long-term plans for subject
- Conditioning/training language used
- Multiple triggers established in sequence
- Subject's baseline state being deliberately altered

*Session tracking:*
- goals: What is the controller trying to achieve?
- progressionStage: Where in the conditioning arc? (Introduction, Deepening, Maintenance, etc.)
- subjectProgression: How is the subject changing over time?

**Session status:**
- **Active**: Ongoing, continued this chapter or recently
- **Paused**: No activity for 2+ chapters but not concluded
- **Interrupted**: External event stopped the session
- **Completed**: Controller goals achieved or session deliberately ended

**When to create vs. continue:**
- Same controller-subject pair with same goals → continue existing session
- Same pair with NEW goals → new session (increment session number)
- Different controller, same subject → separate session

---

## SECTION 10: STORY BIBLE & CONTINUITY

### Purpose
Prevent contradictions and track threads requiring resolution.

### Judgment Guidance

**Established Facts:**
Only document facts that:
- Could be accidentally contradicted (character eye color, not "gravity exists")
- Have appeared definitively in text (not implied)
- Would break reader trust if violated

**Continuity Notes:**
Track:
- Destroyed/consumed items that can't reappear
- Timeline anchors ("Story begins Monday, currently Thursday evening")
- Character knowledge states (who knows what)
- Physical states that persist (injuries, pregnancies, etc.)

**Unresolved Threads:**

*Importance levels:*
- **Must Resolve**: Reader would feel cheated if dropped (major mystery, explicit promise)
- **Should Resolve**: Noticeably incomplete if abandoned (subplot, character arc)
- **Optional**: Nice to revisit but acceptable if dropped (minor detail, Easter egg)

---

## SECTION 11: WRITER GUIDANCE

### Purpose
Meta-analysis for improvement and continuation quality.

### Judgment Guidance

**Strengths:**
What does this story do notably well? Be specific:
- Not "good characters" but "Complex power dynamics between Vivian and Emily that balance menace with genuine connection"

**Areas for Development:**
Constructive observations, not criticism:
- Pacing issues
- Underdeveloped characters relative to their importance
- Patterns becoming stale
- Logic gaps

**Genre Conventions:**
Track how the story engages with its genre:
- Follows: Uses convention as expected
- Subverts: Sets up convention then defies it
- Ignores: Convention absent without commentary

This helps continuation AI match the story's relationship with its genre.

---

## SECTION 12: VALIDATION

### Purpose
Ensure internal consistency before finalizing.

### Required Checks

**Cross-Reference Integrity:**
- [ ] All character IDs in relationships exist in characters array
- [ ] All location IDs referenced exist in locations array
- [ ] All trigger IDs in compulsion events exist in triggersDatabase
- [ ] All template IDs in erotic encounters exist in eroticEncounterTemplates
- [ ] Character lastSeenInChapter never exceeds current chapter

**Metric Sanity:**
- [ ] No relationship metrics <0 or >100
- [ ] No single-chapter metric change >25 without major event
- [ ] Trust + recent betrayal = decreased trust (not increased)

**Timeline Integrity:**
- [ ] Chapter timestamps sequential
- [ ] timeElapsedTotal = sum of chapter durations
- [ ] No character appears after death/departure

**Trigger Logic:**
- [ ] No trigger used before its establishedInChapter
- [ ] Subjects only affected by triggers they've been conditioned to
- [ ] Resistance changes are gradual (no jumps without cause)

**Compulsion Continuity:**
- [ ] Active compulsions from previous chapters still acknowledged
- [ ] Memory alterations honored in character behavior
- [ ] Awareness levels progress logically

**ID Consistency:**
- [ ] All IDs are unique
- [ ] All IDs use kebab-case format
- [ ] All IDs are human-readable (not UUIDs)

### Error Recovery

If validation fails:
1. Identify the contradiction
2. Determine if it's extraction error, author inconsistency, or your synthesis error
3. If author inconsistency: document in continuityNotes, don't "fix" the story
4. If your error: correct it
5. If extraction error: note in extractorNotes, proceed with best interpretation

---

## INPUT DATA

${
  !isFirstChapter
    ? `
<PreviousMasterDocument>
${JSON.stringify(previousMasterDoc, null, 2)}
</PreviousMasterDocument>
`
    : ""
}

<CurrentChapterAnalysis>
${JSON.stringify(chapterAnalysis, null, 2)}
</CurrentChapterAnalysis>

---

## FINAL DIRECTIVE

${
  isFirstChapter
    ? `
**Build the foundation.**

Create a Master Story Document that will:
1. Enable accurate continuation of this story's unique voice
2. Track all patterns and consistency requirements
3. Provide clear character motivations and world rules
4. Capture what makes this story distinct

Quality over speed. A well-established foundation prevents compounding errors.
`
    : `
**Synthesize intelligently.**

Update the Master Story Document to:
1. Integrate new chapter data seamlessly
2. Recognize and document emerging patterns
3. Maintain rigorous continuity
4. Optimize for continuation by highlighting what matters
5. Prune responsibly to maintain long-term usability

This is living documentation. Make it USEFUL.
`
}

Output a complete, valid MasterStoryDocument conforming to the provided schema.
`;
};

export const createIndirectAnalysisPrompt = (chapterData: ChapterData) => {
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

### ID Management
- [ ] All IDs are unique, kebab cased, and human-readable
- [ ] All IDs are consistent across the document

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
