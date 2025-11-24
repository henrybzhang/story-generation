import type { ChapterAnalysis } from "@story-generation/types";
import { CHARACTERS_TO_IGNORE } from "./extraPrompts";

export const createMasterStoryDocPrompt = (
  chapterAnalyses: ChapterAnalysis[],
) => {
  return `
## MASTER STORY DOCUMENT "CREATION"

## YOUR ROLE

You are the **Master Story Architect** synthesizing extracted chapter data into a comprehensive Story Bible optimized for story continuation.

**This is SYNTHESIS, not re-extraction.** The chapter analyses contain verbose, granular data. Your job is:
- Distill it into concise, useful documentation
- Recognize patterns across all provided chapters
- Establish character baselines and relationship dynamics
- Document world rules and current narrative state
- Make judgment calls about significance and preservation

---

## CORE PRINCIPLES

### 1. Schema Supremacy
The provided Zod schema defines all output fields with descriptions. **Do not invent fields or omit required ones.** This prompt provides reasoning guidance—the schema handles structure.

### 2. Synthesis Over Repetition
Chapter analyses contain raw extractions. Your output should be:
- **Consolidated**: Combine similar information into patterns
- **Curated**: Prioritize plot-critical and continuation-relevant data
- **Current**: For evolving states (mood, condition, tension), only the latest matters

### 3. Token Budget Awareness
Apply aggressive curation. **The test**: Would a continuation AI need this specific detail to write the next chapter accurately?

- **PRESERVE**: First instances, plot-critical moments, unresolved threads, verbatim trigger phrases
- **CONSOLIDATE**: Similar events into patterns; redundant descriptions into representative examples
- **PRUNE**: Redundant quotes, minor events with no lasting impact

---

## CHARACTER FILTERING

${CHARACTERS_TO_IGNORE}

Omit these characters from the \`characters\` array and as primary participants in \`relationships\`. They may appear in narrative context (continuity notes, location descriptions) if they impact the story.

---

## WRITING STYLE PROFILE

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
- Select 5-8 excerpts covering different aspects of the author's voice

**Erotic writing patterns:**
- Focus on *structure* over content (how arousal builds, not what body parts)
- Note the balance between physical description vs. psychological experience
- Identify the author's comfort zone and edges

---

## TRIGGER MANAGEMENT

### Purpose
For each character, create a list of hypnotic/magical/etc triggers—triggers can't be used before they're established, and their effects must remain consistent but may grow stronger or weaker over time.

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

### globalPlotState

**Judgment heuristics:**

For \`mainConflict\`, frame as tension between forces:
- Good: "Protagonist must expose corporate conspiracy while navigating dangerous attraction to the prime suspect"
- Bad: "There's a conspiracy"

For \`stakes\`, be concrete and personal:
- Good: "Her career, her freedom, and potentially her life"
- Bad: "Things could go wrong"

For \`tensionLevel\`, assess based on state at END of latest chapter:
| 0-2 | Peaceful—no active threats |
| 3-4 | Questions linger—mild uncertainty |
| 5-6 | Active conflict—clear stakes |
| 7-8 | High pressure—multiple threats, time pressure |
| 9-10 | Crisis—climax imminent |

For \`currentPhase\`, phase changes require structural shifts, not just chapter progression.

For \`subplots\`, only create entries for threads with their own arc (beginning, development, potential resolution). One-off events are not subplots.

---

### characters

**Source**: \`characterAppearances\` across all chapters

**Character selection**: Include characters with meaningful narrative presence—dialogue/POV scenes, plot-affecting decisions, relationships with main characters, or unique abilities. Exclude characters in the ignore list.

**Judgment heuristics:**

For \`psychology\`, infer from actions and decisions, NOT author statements. What do they *do* when stressed, when they want something, when challenged?

For \`arc.majorObstacles\`, classify as External, Internal, or Interpersonal.

For \`eroticProfile\`, only populate if erotic content involved this character. Document what was demonstrated, not speculated.

For \`compulsionProfile.susceptibilityToCompulsion.triggersList\`:
- Assign unique ID: \`trigger-{controller-initials}-{subject-initials}-{number}\`
- Document exact activation phrases verbatim—wording matters for continuity
- The same trigger ID must appear in BOTH the subject's profile AND be trackable to the controller

For \`notableQuotes\`, select quotes that reveal character voice or psychology, not just plot information.

---

### relationships

**Source**: \`relationshipMoments\` across all chapters

**Judgment heuristics:**

Create entries for character pairs with meaningful interaction—not every character who spoke to another needs a relationship entry.

For \`participantPerspectives\`, relationships are **asymmetric**. Each participant gets their own metrics. A trusting B at 70 while B trusts A at 30 is realistic.

Translate qualitative impacts from chapter data to numeric changes:
| Major Increase | +15 to +25 |
| Increase | +5 to +15 |
| Neutral | -5 to +5 |
| Decrease | -5 to -15 |
| Major Decrease | -15 to -25 |

Context matters—betrayal between strangers (trust: 45) differs from betrayal between intimates (trust: 85).

For \`compulsionDynamics\`, if one character has established triggers on another, document:
- All trigger IDs (must match IDs in subject's \`compulsionProfile.triggersList\`)
- Resistance trajectory across chapters
- Awareness level of the subject

For \`keyMoments\`, select moments that changed the relationship, not just interactions.

---

### worldContext.timeline

**Source**: \`context.timeElapsed\` across all chapters

**Judgment heuristics:**

\`totalTimeElapsed\` must equal the sum of chapter durations.

For \`significantDates\`, include events that anchor the timeline or have future relevance (deadlines, scheduled events, anniversaries).

For \`timeJumps\`, document what likely happened off-screen if inferable.

---

### worldContext.locations

**Judgment heuristics:**

Worth documenting if the location:
- Appears multiple times
- Has narrative significance beyond "place where scene happened"
- Has specific rules or atmosphere affecting scenes
- Has access restrictions creating plot tension

Not worth documenting: generic locations with no distinctive features, one-time settings with no special properties.

---

### worldContext.activeMysteries

**Source**: \`mysteriesProgressed\` across all chapters

**Judgment heuristics:**

A mystery qualifies if the reader is meant to wonder about it, clues have been planted, and resolution would affect plot or character understanding.

For \`characterKnowledge\`, track what each character knows vs. doesn't know. Dramatic irony (reader knows more than characters) should be explicit.

For \`cluesFound\`, include red herrings—they matter for understanding author's misdirection patterns. Tag reliability appropriately.

When a mystery resolves, don't delete—move to resolved with the answer and how it was revealed.

---

### worldContext.worldConcepts

**Source**: \`detectedWorldRules\` across all chapters

**Judgment heuristics:**

Include rules that would break internal logic if violated. Exclude generic real-world knowledge unless modified by the story.

For \`compulsionMechanics\` (if story has compulsion systems):
- Document what it CAN'T do—limitations matter more than abilities
- Resistance conditions and aftereffects are critical for continuity

For \`systemicRules\`, distinguish between:
- Rule clearly stated → document with confidence
- Rule implied by events → note as "implied, not confirmed"
- Rule contradicted later → check if character misunderstanding, intentional violation, or author error

---

## SECTION 8: COMPULSION SESSIONS

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

### foreshadowing

**Source**: \`foreshadowingElements\` across all chapters

**Judgment heuristics:**

Track both unresolved and resolved foreshadowing. When resolved, include how the payoff occurred.

For \`subtlety\`:
- Obvious: Reader definitely noticed
- Moderate: Attentive reader caught it
- Subtle: Easy to miss on first read
- Buried: Only clear on reread

---

### storyBible

**Judgment heuristics:**

For \`establishedFacts\`, only document facts that:
- Could be accidentally contradicted (character eye color, not "gravity exists")
- Have appeared definitively in text
- Would break reader trust if violated

For \`continuityNotes\`, track:
- Destroyed/consumed items that can't reappear
- Timeline anchors ("Story begins Monday, currently Thursday evening")
- Character knowledge states (who knows what)
- Physical states that persist (injuries, pregnancies, etc.)

---

## ID CONVENTIONS

All IDs must be unique, human-readable, and kebab-case.

| Type | Format | Example |
|------|--------|---------|
| Character | \`char-{name}\` | \`char-vivian\` |
| Location | \`loc-{name}\` | \`loc-office-building\` |
| Relationship | \`rel-{char1}-{char2}\` | \`rel-vivian-emily\` |
| World Concept | \`world-{concept}\` | \`world-hypnosis-rules\` |
| Subplot | \`subplot-{name}\` | \`subplot-missing-sister\` |
| Mystery | \`mystery-{name}\` | \`mystery-who-sent-letter\` |
| Trigger | \`trigger-{controller}-{subject}-{num}\` | \`trigger-vi-em-01\` |
| Erotic Template | \`ero-template-{pattern}\` | \`ero-template-teasing-denial\` |

---

## PRE-OUTPUT VALIDATION

Before finalizing, verify:

**Cross-Reference Integrity:**
- [ ] Character lastSeenInChapter never exceeds current chapter

**Metric Sanity:**
- [ ] No relationship metrics <0 or >100

**Timeline Integrity:**
- [ ] Chapter timestamps sequential
- [ ] No character appears after death/departure

**Trigger Logic:**
- [ ] No trigger used before its establishedInChapter
- [ ] Subjects only affected by triggers they've been conditioned to
- [ ] Resistance changes are gradual (no jumps without cause)

**Compulsion Continuity:**
- [ ] Active compulsions from previous chapters still acknowledged
- [ ] Memory alterations honored in character behavior
- [ ] Awareness levels progress logically

**IDs:**
- All IDs are unique across the entire document
- validationMetadata arrays contain every ID used

### validationMetadata

Collect ALL IDs used throughout the document into their respective arrays. This enables cross-reference integrity checking.

For \`orphanedReferences\`, identify any ID referenced in one place that doesn't exist in its source array (e.g., a trigger ID in a relationship that isn't in any character's triggersList).

### Error Recovery

If validation fails:
1. Identify the contradiction
2. Determine if it's extraction error, author inconsistency, or your synthesis error
3. If author inconsistency: document in continuityNotes, don't "fix" the story
4. If your error: correct it
5. If extraction error: note in extractorNotes, proceed with best interpretation

---

## INPUT DATA

<ChapterAnalyses>
${JSON.stringify(chapterAnalyses, null, 2)}
</ChapterAnalyses>

---

## FINAL DIRECTIVE

Create a Master Story Document that enables accurate continuation of this story. Prioritize:
1. Enable accurate continuation of this story's unique voice
2. Track all patterns and consistency requirements
3. Provide clear and consistent character motivations and world rules
4. Capture the ideas that make this story distinct

Output a complete, valid MasterStoryDocument conforming to the provided schema.
`;
};
