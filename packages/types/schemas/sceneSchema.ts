import { z } from "zod";

export const SceneSchema = z.object({
  sceneNumber: z.number(),
  sourceTextLength: z.enum(["Short", "Medium", "Long"]).describe(
    "Approximate length of this scene in source text. Short = 400-800 words, Medium = 800-1200 words, Long = 1200+ words. Determines appropriate extraction depth."
  ),
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
      "Setup/foreshadowing",
    ]),
    secondary: z.array(z.string()).optional(),
    description: z.string().describe("Why this scene exists in the story. What it accomplishes."),
  }),

  outcome: z
      .string()
      .describe(
        "State changes resulting from this scene in 2-4 concise sentences. Format: [Character gains/loses/learns X]. [Relationship between A-B shifts to Y]. [Plot element Z is now active/resolved]. Do NOT summarize what happened in the scene—only capture what is DIFFERENT afterward. Examples: 'Mitch learned the Cost of Knowledge rule and that revealing his nature makes him vulnerable. Lauren-Matt alliance tentatively formed with artifact deal pending. Interrupted before energy exchange completed.' or 'Sophie gained confidence after successful negotiation. Trust between Sophie-Drake increased significantly. New quest: locate the missing artifact.'"
      )
      .max(800),

  summary: z
    .string()
    .describe(
      "Beat-by-beat chronological account. Scale length to scene complexity: 200-300 words for short scenes, 400-600 for medium, 600-900 for long/complex scenes."
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
    .describe(
      "NON-SEXUAL atmospheric details establishing mood and setting. Minimum 3 details, target 5-10 details for most scenes. Include character appearance, environment, atmosphere, and non-sexual interactions. If scene is legitimately sparse (phone call, etc...), 3 is acceptable. If detail relates to erotic activity, put it in eroticContent.sensualHighlights instead.",
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
        .describe(
          "Sensual narrative of the encounter. Scale to scene length: 150-250 words for brief encounters, 300-500 for medium, 500-800 for extended scenes. If exceeding 800 words, check for missed scene breaks."
        ),

      pivotalMoments: z.array(z.object({
        moment: z.string().describe(
          "A concise label or title for the pivotal moment."
        ),
        verbatimText: z.string().max(800).describe(
          "A short, EXACT quote from the source text that captures this moment. Must be taken directly from the chapter without modification. Keep to 1-2 sentences maximum - choose the most impactful snippet, not the entire passage."
        ),
        whyPivotal: z.string().describe(
          "Explanation of why this moment matters for the story. Address how it changes character dynamics, advances the plot, shifts power balance, or establishes something that must be maintained in future chapters."
        ),
      })).max(5).describe(
        "The 3-5 most significant moments in this scene that future chapters must acknowledge or build upon. Prioritize moments that change relationships, reveal character, or create consequences."
      ),

      verbatimEroticText: z
        .array(z.string())
        .describe(
          "Verbatim erotic sentences or short quotes. " +
          "Extract ONLY sentences containing explicit sexual acts, arousal, or intimate sexual touching. " +
          "Each array entry is a single sentence or brief quote (typically 10-30 words). " +
          "DO NOT include context, setup, or non-sexual physical contact."
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
                "EXACT description of how compulsion was activated (preserve original phrasing).",
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
