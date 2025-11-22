import { z } from "zod";

export const SceneSchema = z.object({
  sceneNumber: z.number(),
  locationId: z.string(),
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
    description: z.string().describe("Why this scene exists in the story. What it accomplishes."),
  }),

  outcome: z
      .string()
      .describe(
        "Immediate result and consequences of this scene (e.g., 'Protagonist now knows she's being surveilled', 'Trust between A and B reduced to 20').",
      )
      .min(100),

  summary: z
    .string()
    .min(500)
    .max(3500)
    .describe(
      "200-400 word scene narrative covering PLOT AND CONTEXT ONLY. Scale length to scene complexity—simple transitions need ~200 words; complex multi-beat scenes may need ~400. Required elements: (1) Opening context—location, characters, initial state; (2) Key non-erotic events and decisions; (3) Erotic placeholder if applicable: '[EROTIC ENCOUNTER: participants, duration, outcome—see eroticContent.progression]'; (4) Consequences and closing state. CLARITY RULE: Every sentence specifies WHO performs the action. This field must convey complete plot without eroticContent."
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

  physicalAftermath: z
    .string()
    .optional()
    .describe(
      "Physical consequences (e.g., 'Visible marks on B's wrists from restraints', 'A physically exhausted for next 6 hours', 'B's mana fully restored').",
    ),

  skillsDisplayed: z
    .array(z.object({
      character: z.string(),
      skill: z.string(),
      description: z.string().min(50),
    }))
    .optional(),

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
        .min(400)
        .max(4000)
        .describe(
          "150-500 word erotic narrative. Scale to encounter intensity—brief kiss/tension needs ~150 words; extended scene needs ~400-500. DO NOT repeat setting or character descriptions from summary. STRUCTURE: [ACTOR] [VERB] [RECIPIENT/BODY PART]. Required beats: (1) Initiation—who, how, first contact; (2) Escalation—positions, techniques, sensations; (3) Power dynamics—control shifts, resistance; (4) Resolution—climax, interruption, or continuation; (5) Immediate physical aftermath. Prioritize the receiving party's sensory experience. Write as reproducible erotic narrative, not telegraphic notes."
        ),

      pivotalMoments: z.array(z.object({
        moment: z.string().describe(
          "A concise label or title for the pivotal moment."
        ),
        verbatimText: z.string().max(250).describe(
          "A short, exact quote from the source text that captures this moment. Must be taken directly from the chapter without modification. Keep to 1-2 sentences maximum - choose the most impactful snippet, not the entire passage."
        ),
        whyPivotal: z.string().describe(
          "Explanation of why this moment matters for the story. Address how it changes character dynamics, advances the plot, shifts power balance, or establishes something that must be maintained in future chapters."
        ),
      })).max(5).describe(
        "The 3-5 most significant moments in this scene that future chapters must acknowledge or build upon. Prioritize moments that change relationships, reveal character, or create consequences."
      ),

      verbatimEroticText: z
        .array(z.string().min(10).max(250))
        .min(15)
        .max(30)
        .describe(
          "Extract 15-30 exact sentences that capture the erotic writing style. REQUIRED: Include lines showing (1) physical sensations, (2) power dynamics, (3) character reactions, (4) psychological states, (5) moments of resistance or surrender. These will help continuation LLM match tone.",
        ),

      // Mechanics & Dynamics
      powerDynamic: z
        .object({
          dominantParty: z.array(z.string()),
          submissiveParty: z.array(z.string()),
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

          powerShift: z
            .string()
            .optional()
            .describe(
              "How did the balance of power between participants change? (e.g., 'A gained psychological dominance over B—trust increased, dependency created', 'B asserted control, surprising A and equalizing their dynamic', 'Mutual vulnerability—both revealed weaknesses, trust increased for both', 'No significant shift'). Explain the mechanism.",
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
            subject: z.string(),
            method: z.string()
              .describe(
                "How the compulsion was exerted (e.g., 'Hypnotic eye contact', 'Pheromone release during kiss', 'Verbal command while subject aroused', 'Mind-reading + suggestion').",
              ),

            evidenceOfCompulsion: z
              .string()
              .describe(
                "CRITICAL: What textual evidence proves this is actual compulsion/mind control, not normal persuasion or flirting? Must reference explicit supernatural elements, unusual mental states, loss of agency, or magical mechanics. If you cannot cite clear evidence, DO NOT include this instance.",
              ),
            activationMechanism: z
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

            triggersUsed: z
              .array(z.string())
              .optional()
              .describe(
                "List of triggers used to during or to activate the compulsion."
              ),

            subjectExperience: z
              .array(z.string())
              .describe(
                "Verbatim excerpts of subject's internal experience (thoughts, sensations, emotions). Minimum 2-3 quotes.",
              ),

            awarenessLevel: z
              .enum([
                "Subject fully aware but unable to resist",
                "Subject aware but perceives actions as own desire",
                "Subject in trance with limited awareness",
                "Subject completely unaware in autopilot mode",
                "Subject retroactively aware and realizes after",
              ])
              .describe("Subject's cognitive state during compulsion."),

            resistanceAttempts: z
              .array(
                z.object({
                  attempt: z.string(),
                  success: z.boolean(),
                  consequence: z.string().optional(),
                }),
              )
              .optional()
              .describe("Did subject try to resist? What happened?"),

            memoryAlteration: z
              .object({
                altered: z.boolean(),
                nature: z
                  .string()
                  .optional()
                  .describe(
                    "What was changed (e.g., 'Remembers initiating—doesn't recall being commanded', 'Complete amnesia of event', 'Remembers as dream').",
                  ),
              })
              .optional(),

            compulsionEnded: z
              .object({
                how: z
                  .string()
                  .describe(
                    "How compulsion ended (e.g., 'Controller released them', 'Orgasm broke the spell', 'Time limit expired', 'Still ongoing').",
                  ),
                immediateReaction: z
                  .string()
                  .describe(
                    "Subject's first response after regaining will (e.g., 'Confusion and arousal', 'Anger and denial', 'Grateful submission', 'Panic and flight', 'No idea what happened').",
                  ),
              })
              .optional(),

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

      consentDynamic: z
        .string()
        .describe(
          "Nature of consent in this specific encounter. Be precise: 'Enthusiastic—both parties eager and verbally affirming', 'Negotiated beforehand—CNC scene with safeword established', 'Dubious—B consents due to financial pressure', 'Coerced—A threatens exposure if B refuses', 'Reluctant but willing—B agrees despite reservations'. Critical for tracking power dynamics.",
        ),

      seductionVsCompulsion: z
        .string()
        .optional()
        .describe(
          "Analyze the blend (e.g., '70% seduction, 30% compulsion—subject was already attracted, compulsion pushed past hesitation', '100% compulsion—no prior desire', '50/50—compulsion created desire that didn't exist').",
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

  tensionLevel: z
    .number()
    .min(0)
    .max(10)
    .describe(
      "End-of-scene tension. Reference: 2=normal day, 5=active problem, 7=crisis approaching, 9=imminent danger, 10=life-or-death moment in progress"
    ),

  sceneBreakRationale: z.string().optional()
    .describe("Why did you start a new scene here vs. continuing the previous one?"),
});
