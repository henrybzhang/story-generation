import z from "zod";

export const ChapterSummarySchema = z.object({
  // -------------------------
  // METADATA
  // -------------------------
  chapterNumber: z.number(),
  title: z.string(),
  wordCount: z.number(),

  context: z.object({
    timeElapsed: z.string().describe("Duration of events in this chapter."),
    timeOfDay: z.string().optional(),
    setting: z.array(z.string()).describe("All locations that appeared."),
    primaryPOV: z.array(z.string()).describe("Whose perspective(s) dominated."),
  }),

  scenes: z.array(
    z.object({
      sceneNumber: z.number(),
      location: z.string(),
      participants: z.array(z.string()),
      purpose: z.object({
        primary: z.enum([
          "Erotic encounter",
          "Plot advancement", 
          "Character introduction",
          "Mystery/revelation",
          "Relationship development",
          "World-building exposition",
          "Transition/pacing",
          "Setup/foreshadowing",
        ]),
        secondary: z.array(z.string()).optional(),
        description: z.string().describe("Specific details of what was accomplished"),
      }),
      consequences: z
        .array(z.string())
        .describe("All consequences of actions."),

      summary: z
        .string()
        .min(400)
        .describe(
          "400-600 word detailed, beat-by-beat narrative. Include: (1) Opening physical/emotional state, (2) Every scene transition and location change, (3) All decision points with alternatives considered, (4) Important dialogue content (summarized) with key verbatim lines, (5) Concrete physical actions with specific verbs, (6) If erotic: full escalation arc from initiation to aftermath, (7) Emotional progression and shifts in arousal/desire/tension, (8) Immediate consequences and character reactions, (9) Any subplot threads or world-building revelations, (10) Closing state. Write as if someone needs to recreate this scene from memory.",
        ),

      // PLOT METADATA
      plotBeats: z
        .array(
          z.object({
            type: z.enum([
              "Action",
              "Dialogue",
              "Internal",
              "Erotic",
              "Revelation",
              "Decision",
            ]),
            description: z
              .string()
              .describe("High-level bullet point of what happened."),
          }),
        )
        .describe("Quick scannable list of events in this scene."),

      // QUOTES & SENSORY (Nested here avoids needing 'context' fields)
      // Note: Do NOT include erotic dirty talk here; put that in eroticContent below.
      keyQuotes: z
        .array(
          z.object({
            speaker: z.string(),
            text: z
              .string()
              .describe("EXACT wording from text. Use quotation marks."),
            significance: z
              .string()
              .describe(
                "How this quote is significant and necessary to understanding the scene.",
              ),
          }),
        )
        .describe("Plot-relevant or character-defining non-erotic dialogue. Minimum 3 quotes."),

      sensoryDetails: z
        .array(
          z.object({
            sense: z.enum([
              "Sight",
              "Sound",
              "Touch",
              "Taste",
              "Smell",
              "Proprioception",
            ]),
            detail: z
              .string()
              .describe(
                "Exact phrasing from text if possible (e.g., 'the smell of sandalwood and sweat', 'cool silk against heated skin').",
              ),
            context: z.enum(["Atmosphere", "Character appearance", "Environment", "Non-sexual interaction"]),
          }),
        )
        .min(5)
        .describe(
          "NON-SEXUAL atmospheric details establishing mood and setting. Minimum 5. If detail relates to erotic activity, put it in eroticContent.sensualHighlights instead.",
        ),

      arousalArc: z
        .object({
          openingLevel: z.enum(["None", "Low", "Moderate", "High", "Peak"]),
          closingLevel: z.enum(["None", "Low", "Moderate", "High", "Peak"]),
          keyShifts: z.array(
            z.object({
              trigger: z.string().describe("What caused the shift"),
              fromLevel: z.string(),
              toLevel: z.string(),
              exactMoment: z.string().describe("Quote or describe the exact moment"),
            })
          ),
        })
        .optional()
        .describe("Track sexual/emotional tension progression. REQUIRED for any scene with romantic/erotic content or building sexual tension."),

      // -------------------------
      // EROTIC MODULE (Conditional)
      // -------------------------
      eroticContent: z
        .object({
          kinkTags: z
            .array(z.string())
            .describe(
              "From kink lexicon. Extract ALL applicable tags—be comprehensive.",
            ),
          initiator: z.string(),
          participants: z.array(z.string()),
          observers: z.array(z.string()).optional(),

          progression: z
            .string()
            .min(300)
            .describe(
              "300-500 word SENSUAL NARRATIVE (not checklist) covering: (1) Emotional context and mood, (2) Initiation psychology and who/how/why, (3) SPECIFIC physical escalation with exact body parts, positions, angles, (4) Integrated sensory details throughout, (5) Psychological shifts in control/arousal, (6) Inline dirty talk and dialogue, (7) Power dynamic moments, (8) Resistance attempts with verbatim quotes and responses, (9) Technique specifics (rhythm, pressure, movement), (10) Climax with exact sensations and reactions, (11) Immediate aftermath state. Write to enable scene recreation."
            ),

          verbatimEroticText: z
            .array(z.string().min(10).max(200))
            .min(15)
            .max(30)
            .describe(
              "Extract 15-30 exact sentences that capture the erotic writing style. REQUIRED: Include lines showing (1) physical sensations, (2) power dynamics, (3) character reactions, (4) psychological states, (5) moments of resistance or surrender. These will help continuation LLM match tone.",
            ),

          // Mechanics & Dynamics
          powerDynamic: z
            .object({
              dominantParty: z.string(),
              submissiveParty: z.string(),
              controlMechanics: z
                .object({
                  physicalTechniques: z.array(z.string()).describe("Specific physical actions used to maintain control"),
                  verbalTactics: z.array(z.string()).describe("What they SAY to maintain control"),
                  psychologicalPlays: z.array(z.string()).describe("Emotional manipulation tactics"),
                  timingStrategies: z.string().optional().describe("When they accelerate/pause/change rhythm"),
                  bodyLanguage: z.array(z.string()).optional().describe("Non-verbal dominance signals"),
                })
                .describe("Detailed breakdown of HOW control is established and maintained. Be specific."),
              resistanceAttempts: z
                .array(
                  z.object({
                    type: z.enum(["Verbal request", "Physical attempt", "Internal conflict expressed", "Boundary testing"]),
                    verbatimAttempt: z.string().describe("Exact quote or specific action"),
                    dominantResponse: z.string().describe("How they responded - both action AND any dialogue"),
                    effectivenessOfResistance: z.enum(["Successful pause", "Partially successful", "Ignored/overridden", "Used to heighten arousal"]),
                    psychologicalImpact: z.string().optional().describe("How this affected power dynamic or arousal"),
                  }),
                )
                .min(1)
                .optional()
                .describe("Every instance where submissive party tried to resist, slow down, or assert boundaries"),
              emotionalManipulation: z
                .array(z.string())
                .optional()
                .describe(
                  "Specific tactics: playing innocent, pretending not to understand, teasing, gaslighting, etc.",
                ),
            })
            .optional()
            .describe("REQUIRED if power exchange occurs. If you see dominance/submission dynamics but leave this empty, explain why in extractorNotes.") ,

          sensualHighlights: z
            .array(
              z.object({
                moment: z.string(),
                exactPhrasing: z.string().describe("Quote the text directly."),
                sense: z.enum([
                  "Sight",
                  "Sound",
                  "Touch",
                  "Taste",
                  "Smell",
                  "Emotion",
                  "Thought",
                ]),
                significance: z
                  .enum([
                    "Physical sensation",
                    "Power dynamic",
                    "Emotional state",
                    "Character insight",
                    "Technique detail",
                  ])
                  .optional(),
              }),
            )
            .describe(
              "List of 5-10 specific phrases describing physical sensation/touch/.",
            ),
          dirtyTalk: z
            .array(
              z.object({
                speaker: z.string(),
                line: z.string().describe("Verbatim quote."),
                tone: z.string(),
                subtext: z
                  .string()
                  .optional()
                  .describe("What's really being communicated"),
              }),
            ).describe("Minimum 3 dirty talk quotes."),

          compulsionInstances: z
            .array(
              z.object({
                controller: z.string(),
                subject: z.array(z.string()),
                method: z.string(),

                evidenceOfCompulsion: z
                  .string()
                  .describe(
                    "CRITICAL: What textual evidence proves this is actual compulsion/mind control, not normal persuasion or flirting? Must reference explicit supernatural elements, unusual mental states, loss of agency, or magical mechanics. If you cannot cite clear evidence, DO NOT include this instance.",
                  ),
                triggerDescription: z
                  .string()
                  .describe(
                    "Exact description of how compulsion was activated (preserve original phrasing).",
                  ),

                commands: z.array(
                  z.object({
                    verbatimCommand: z
                      .string()
                      .describe(
                        "EXACT words used if verbal, or precise description if non-verbal.",
                      ),
                    subjectResponse: z
                      .string()
                      .describe("How they reacted/complied."),
                  }),
                ),

                subjectExperience: z
                  .array(z.string())
                  .describe(
                    "Verbatim excerpts of subject's internal experience (thoughts, sensations, emotions). Minimum 2-3 quotes.",
                  ),

                sensualMoments: z
                  .array(z.string())
                  .describe(
                    "Specific sensual/erotic details from this compulsion instance. Quote exact phrasing where possible.",
                  ),

                outcome: z
                  .string()
                  .describe("What resulted from this compulsion."),
              }),
            )
            .optional()
            .describe(
              "ONLY extract instances where there is evidence of supernatural mind control/compulsion/hypnosis. Do NOT include: normal persuasion, flirting, seduction, dirty talk, or requests. Compulsion requires clear textual indicators like: magical activation, described mental fogginess/loss of control, explicit trigger words being activated, supernatural compliance, or narrator confirmation of mind control.",
            ),

          completionStatus: z.enum([
            "Interrupted",
            "Orgasm",
            "Denied",
            "Ongoing",
          ]),
        })
        .optional()
        .describe(
          "REQUIRED if scene contains ANY sexual/erotic content (kissing, sexual acts, sexual tension, nudity). Exhaustive extraction of erotic content. Preserve the EXPERIENCE, not just the mechanics."
        ),
      sceneBreakRationale: z.string().optional()
        .describe("Why did you start a new scene here vs. continuing the previous one?"),
    }),
  ),

  narrativeVoice: z
    .object({
      excerpts: z
        .array(z.string())
        .describe(
          "3-5 sentences that exemplify the narrator's voice/style. Preserve exact wording.",
        ),
      styleNotes: z
        .string()
        .describe(
          "Observations about prose style (e.g., 'Lyrical with long sentences', 'Terse and punchy', 'Heavy internal monologue', 'Sensory-rich').",
        ),
    })
    .optional()
    .describe("Preserve the writing style for continuation consistency."),

  // -------------------------
  // WORLD MECHANICS
  // -------------------------
  detectedWorldRules: z
    .array(
      z.object({
        rule: z.string(),
        context: z
          .string()
          .describe("Where in the chapter this rule appeared."),
        type: z.enum([
          "Magic System",
          "Technology",
          "Social Hierarchy",
          "Biology",
          "Compulsion Mechanic",
          "Law",
          "Economy",
          "Other",
        ]),
        exactPhrasing: z
          .string()
          .optional()
          .describe("If the text explicitly stated the rule, quote it."),
        isNew: z
          .boolean()
          .describe("Is this a rule that hasn't appeared before?"),
        contradictsExisting: z.boolean(),
      }),
    )
    .describe("Extract every world-building rule mentioned or demonstrated."),

  // -------------------------
  // CHARACTER DATA
  // -------------------------
  characterAppearances: z
    .array(
      z.object({
        name: z.string(),
        role: z
          .enum(["Major", "Supporting", "Minor", "Mentioned"])
          .describe("How much screentime they had."),

        actions: z
          .array(z.string())
          .describe("What they DID (not interpretation—concrete actions)."),

        emotionalStates: z
          .array(
            z.object({
              state: z.string(),
              triggeredBy: z.string().optional(),
            }),
          )
          .describe("Track emotional shifts within the chapter."),

        physicalChanges: z
          .array(z.string())
          .optional()
          .describe(
            "Injuries, exhaustion, appearance changes, arousal states.",
          ),

        knowledgeGained: z
          .array(z.string())
          .optional()
          .describe("New information this character learned."),

        decisionsPoints: z
          .array(
            z.object({
              decision: z.string(),
              alternatives: z.array(z.string()).optional(),
              reasoning: z.string().optional(),
            }),
          )
          .optional()
          .describe("Moments where character made a choice."),
      }),
    )
    .describe("Per-character extraction. Track everyone who appeared."),

  relationshipMoments: z
    .array(
      z.object({
        characters: z.array(z.string()).min(2),
        momentType: z.enum([
          "First Meeting",
          "Conflict",
          "Intimacy",
          "Betrayal",
          "Alliance",
          "Revelation",
          "Compulsion",
          "Seduction",
          "Other",
        ]),
        description: z.string(),
        trustImpact: z
          .enum([
            "Major Increase",
            "Increase",
            "Neutral",
            "Decrease",
            "Major Decrease",
          ])
          .optional(),
        lustImpact: z
          .enum([
            "Major Increase",
            "Increase",
            "Neutral",
            "Decrease",
            "Major Decrease",
          ])
          .optional(),
        powerShift: z.string().optional(),
      }),
    )
    .optional()
    .describe("Key relationship developments between character pairs."),

  foreshadowingElements: z
    .array(
      z.object({
        element: z.string().describe("What was hinted at."),
        exactPhrasing: z.string().describe("Quote the foreshadowing directly."),
        subtlety: z.enum(["Obvious", "Moderate", "Subtle", "Buried"]),
      }),
    )
    .optional(),

  mysteriesProgressed: z
    .array(
      z.object({
        mystery: z.string(),
        newClue: z.string(),
        revealedBy: z.string().optional(),
      }),
    )
    .optional(),

  // -------------------------
  // QUALITY CONTROL
  // -------------------------
  extractionMetrics: z.object({
    quotesExtracted: z.number().describe("Count of keyQuotes."),
    sensoryDetailsExtracted: z.number(),
    compulsionInstancesExtracted: z.number(),
    eroticScenesExtracted: z.number(),

    completenessScore: z
      .number()
      .min(0)
      .max(10)
      .describe(
        "Self-assessment: 1-3 = Rushed/missing data, 4-6 = Adequate, 7-8 = Thorough, 9-10 = Exhaustive. If below 8, you've missed something.",
      ),

    missedElements: z
      .array(z.string())
      .optional()
      .describe(
        "If completenessScore < 9, what did you likely miss? (Self-critique)",
      ),
  }),

  extractorNotes: z
    .array(z.string())
    .optional()
    .describe(
      "Free-form notes about unusual elements, ambiguities, or things requiring human clarification.",
    ),
});

export type ChapterSummary = z.infer<typeof ChapterSummarySchema>;