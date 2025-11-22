import z from "zod";

export const NarrativeLogSchema = z.object({
  chapterNumber: z.number(),

  title: z
    .string()
    .describe(
      "Chapter title if provided, or descriptive title based on primary content.",
    ),

  wordCount: z
    .number()
    .optional()
    .describe("Approximate word count for pacing analysis."),

  setting: z
    .string()
    .describe(
      "Primary location(s) where this chapter takes place. Reference location IDs if applicable.",
    ),

  timeOfDay: z
    .string()
    .optional()
    .describe(
      "When this chapter occurs (e.g., 'Late night', 'Dawn', '2:00 PM Tuesday').",
    ),

  timePassed: z
    .string()
    .describe(
      "How much time elapsed during this chapter (e.g., 'Two hours', 'Three days', 'Immediately follows previous chapter').",
    ),

  primaryPOV: z
    .array(z.string())
    .describe(
      "Whose perspective(s) dominate this chapter. List character names whose internal thoughts we access.",
    ),

  narrativeMode: z
    .enum([
      "First Person",
      "Third Person Limited",
      "Third Person Omniscient",
      "Second Person",
      "Multiple POV",
    ])
    .optional()
    .describe("Point of view style used."),

  plotSummary: z
    .string()
    .max(4500)
    .describe(
      "**CRITICAL: Story-first summary.** Describe plot progression, character choices, and consequences as if erotic content didn't exist. What actually *happened*? What decisions were made? What changed? Focus on: investigations, conflicts, revelations, relationships evolving, plans executed/failed, information gained/lost. 3-5 sentences minimum. Ask: 'Could this summary appear in a mainstream publication?'",
    ),

  majorPlotBeats: z
    .array(
      z.object({
        beat: z
          .string()
          .describe(
            "Specific plot event (e.g., 'Protagonist discovers hidden camera in her office', 'Alliance between A and B fractures over resource dispute', 'Character escapes custody').",
          ),

        beatType: z
          .enum([
            "Revelation",
            "Conflict",
            "Decision",
            "Consequence",
            "Setback",
            "Victory",
            "Discovery",
            "Confrontation",
            "Escape",
            "Betrayal",
            "Alliance",
            "Other",
          ])
          .optional()
          .describe("Category of plot beat for structure analysis."),

        participants: z
          .array(z.string())
          .describe("Characters directly involved in this beat."),

        outcome: z
          .string()
          .describe(
            "Immediate result of this event (e.g., 'Protagonist now knows she's being surveilled', 'Trust between A and B reduced to 20').",
          ),

        consequences: z
          .array(z.string())
          .describe(
            "Ripple effects—what will happen *because* of this beat (e.g., 'Protagonist must now act as if unaware', 'B will seek new ally', 'Security will be increased').",
          ),

        reversibility: z
          .enum([
            "Irreversible",
            "Difficult to Reverse",
            "Potentially Reversible",
          ])
          .optional()
          .describe(
            "Can this beat be undone, or are the consequences permanent?",
          ),
      }),
    )
    .describe(
      "Key NON-EROTIC plot events. These are the spine of your story. Minimum 2-3 per chapter even in sex-heavy chapters.",
    ),

  eroticEncounters: z
    .array(
      z.object({
        id: z.string(),

        matchesTemplate: z
          .string()
          .optional()
          .describe("ID of EroticEncounterTemplate if this follows a pattern"),

        participants: z
          .array(z.string())
          .describe(
            "All characters actively involved in the sexual encounter.",
          ),

        observers: z
          .array(z.string())
          .optional()
          .describe("Characters who witness but don't participate."),

        setting: z
          .string()
          .describe(
            "Where this encounter takes place and relevant environmental factors (e.g., 'Private bedroom—soundproof', 'Public park—high risk of discovery', 'Virtual reality simulation').",
          ),

        kinkTags: z
          .array(z.string())
          .describe(
            "Precise terminology from kink lexicon describing activities and dynamics (e.g., 'Rope bondage', 'Edging', 'Praise kink', 'Voyeurism', 'Temperature play', 'Power exchange'). Be comprehensive.",
          ),

        primaryAction: z
          .string()
          .describe(
            "One-sentence summary of the sexual activity (e.g., 'A dominates B through extended orgasm denial', 'A and B have desperate, emotionally-charged sex after near-death experience').",
          ),

        compulsionDynamics: z
          .object({
            controller: z.string().describe("Who wielded the compulsion."),
            subject: z.array(z.string()).describe("Who was compelled."),

            method: z
              .string()
              .describe(
                "Specific compulsion method used (e.g., 'Hypnotic eye contact', 'Pheromone release during kiss', 'Verbal command while subject aroused', 'Mind-reading + suggestion').",
              ),

            triggerMechanism: z
              .string()
              .describe(
                "What activated the compulsion (e.g., 'Spoken trigger word from last session', 'Physical touch to temple', 'Subject's arousal reached threshold').",
              ),

            commandsGiven: z
              .array(
                z.object({
                  command: z.string().describe("Exact instruction given."),
                  compliance: z.enum([
                    "Immediate",
                    "Gradual",
                    "Partial",
                    "Resisted",
                  ]),
                  subjectExperience: z
                    .string()
                    .describe(
                      "What the subject felt during compliance (e.g., 'Overwhelming need to obey', 'Dreamlike haze', 'Fighting but body moving anyway', 'Blissful absence of will').",
                    ),
                }),
              )
              .optional(),

            triggersUsed: z
              .array(z.string())
              .optional()
              .describe(
                "What triggered the compulsion (e.g., 'Spoken trigger word from last session', 'Physical touch to temple', 'Subject's arousal reached threshold').",
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

            pleasureEnhancement: z
              .string()
              .optional()
              .describe(
                "If compulsion amplified pleasure, describe the mechanism (e.g., 'Nervous system directly stimulated', 'Inhibitions removed—deeper orgasm', 'Pain receptors converted to pleasure').",
              ),

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
                    "Subject's first response after regaining will (e.g., 'Confusion and arousal', 'Anger and denial', 'Grateful submission', 'Panic and flight').",
                  ),
              })
              .optional(),
          })
          .optional()
          .describe(
            "Track compulsion mechanics in erotic scenes—emphasis on sensual experience and power exchange, not violation. Only include if compulsion actually occurred",
          ),


        mutualDesirePresent: z
          .boolean()
          .optional()
          .describe(
            "Separate from compulsion: would subject have wanted this without control? Track the seduction vs. compulsion blend.",
          ),

        seductionVsCompulsion: z
          .string()
          .optional()
          .describe(
            "Analyze the blend (e.g., '70% seduction, 30% compulsion—subject was already attracted, compulsion pushed past hesitation', '100% compulsion—no prior desire', '50/50—compulsion created desire that didn't exist').",
          ),
      }),
    ),

  sensualHighlights: z
    .array(
      z.object({
        moment: z
          .string()
          .describe(
            "Specific sensual detail (e.g., 'Controller's breath on subject's neck as command was whispered', 'Subject's pupils dilating as compulsion took hold').",
          ),
        sensoryDetail: z
          .string()
          .describe("Texture, temperature, scent, sound, or visual detail."),
        emotionalColor: z
          .string()
          .describe(
            "Emotional tone of this moment (e.g., 'Intoxicating surrender', 'Terrifying pleasure', 'Dreamlike compliance').",
          ),
      }),
    )
    .min(8)
    .describe(
      "Capture the SENSUAL aspects—the feel, the atmosphere, the erotic charge—separate from mechanics.",
    ),

  initiator: z
    .string()
    .describe(
      "Who initiated this encounter and how (e.g., 'A—direct verbal proposition', 'B—seductive manipulation', 'Mutual escalation from flirting').",
    ),

  consentDynamic: z
    .string()
    .describe(
      "Nature of consent in this specific encounter. Be precise: 'Enthusiastic—both parties eager and verbally affirming', 'Negotiated beforehand—CNC scene with safeword established', 'Dubious—B consents due to financial pressure', 'Coerced—A threatens exposure if B refuses', 'Reluctant but willing—B agrees despite reservations'. Critical for tracking power dynamics.",
    ),

  systemicInteraction: z
    .string()
    .describe(
      "Did this sexual encounter trigger world mechanics or plot devices? Examples: Fantasy—'A channeled mana through orgasm, restoring 40% magic capacity'; Sci-Fi—'Neural link during sex allowed A to upload virus to B's implant'; Contemporary—'Hidden camera recorded encounter, creating blackmail material'; Supernatural—'A fed on B's sexual energy, extending lifespan by 3 months'. If no systemic interaction: 'None—purely interpersonal'.",
    ),

  powerShift: z
    .string()
    .describe(
      "How did the balance of power between participants change? (e.g., 'A gained psychological dominance over B—trust increased, dependency created', 'B asserted control, surprising A and equalizing their dynamic', 'Mutual vulnerability—both revealed weaknesses, trust increased for both', 'No significant shift'). Explain the mechanism.",
    ),

  emotionalDynamics: z
    .object({
      beforeScene: z
        .string()
        .describe("Emotional state of participants entering the scene."),
      duringScene: z
        .string()
        .describe(
          "Emotional experience during (e.g., 'A: triumphant; B: humiliated but aroused').",
        ),
      afterScene: z
        .string()
        .describe(
          "Emotional aftermath (e.g., 'A: satisfied but guilty; B: conflicted—craving more despite resentment').",
        ),
    })
    .describe("Track emotional journey through the encounter."),

  emotionalAftermath: z
    .string()
    .describe(
      "Longer-term emotional consequences for participants (e.g., 'B now associates pleasure with submission to A', 'A feels guilt that may affect future encounters', 'Both experience newfound intimacy').",
    ),

  physicalAftermath: z
    .string()
    .optional()
    .describe(
      "Physical consequences (e.g., 'Visible marks on B's wrists from restraints', 'A physically exhausted for next 6 hours', 'B's mana fully restored').",
    ),

  narrativePurpose: z
    .string()
    .describe(
      "Why this scene exists in the story beyond arousal. What does it accomplish? Examples: 'Establishes D/s dynamic that will define their relationship', 'Shows A's willingness to use sex as weapon', 'Reveals B's trauma response to intimacy', 'Creates blackmail leverage for antagonist', 'Demonstrates A's growing trust in B', 'Subverts reader expectations about A's sexuality'. Be specific about narrative function.",
    ),

  characterDevelopment: z
    .string()
    .describe(
      "What did we learn about the characters through this scene? (e.g., 'A revealed vulnerability beneath dominant facade', 'B's praise kink connects to childhood need for validation', 'A capable of tenderness despite cruel exterior'). Focus on revelation, not just action.",
    ),

  thematicRelevance: z
    .string()
    .optional()
    .describe(
      "How this scene connects to story themes (e.g., 'Explores theme of power corrupting through A's casual cruelty', 'Illustrates possibility of genuine connection in transactional world').",
    ),

  skillsDisplayed: z
    .array(z.string())
    .optional()
    .describe(
      "Competencies demonstrated (e.g., 'A's expert rope work', 'B's sexual manipulation techniques', 'A's attentiveness to partner's signals').",
    ),

  callbacksAndForeshadowing: z
    .array(z.string())
    .optional()
    .describe("References to past events or hints about future developments.")
    .describe(
      "Detailed analysis of sexual/erotic scenes. Track mechanics, consent, power, and narrative purpose.",
    ),

  keyDialogue: z
    .array(
      z.object({
        speakers: z
          .array(z.string())
          .describe("Characters participating in this conversation."),

        location: z
          .string()
          .optional()
          .describe(
            "Where this conversation takes place, if relevant to meaning.",
          ),

        topic: z
          .string()
          .describe(
            "Surface-level subject of conversation (e.g., 'Discussing quarterly reports', 'Negotiating scene boundaries', 'Arguing about loyalty').",
          ),

        subtext: z
          .string()
          .describe(
            "The hidden meaning, manipulation, power play, or unspoken emotion beneath the words (e.g., 'A is testing B's loyalty while appearing casual', 'Sexual tension masked as professional discussion', 'B deflecting from real issue—afraid of vulnerability').",
          ),

        emotionalSubtext: z
          .string()
          .optional()
          .describe(
            "Feelings that aren't stated (e.g., 'A desperately wants reassurance but can't ask', 'B is terrified but projecting confidence').",
          ),

        manipulationAttempt: z
          .object({
            manipulator: z.string(),
            target: z.string(),
            technique: z
              .string()
              .describe(
                "Method used (e.g., 'Gaslighting', 'Guilt-tripping', 'Seduction', 'Intimidation').",
              ),
            success: z.boolean(),
          })
          .optional()
          .describe(
            "If someone is trying to influence or control another through conversation.",
          ),

        references: z
          .array(z.string())
          .optional()
          .describe(
            "Callbacks to previous events, dialogue, or shared history that add meaning.",
          ),

        quotableLines: z
          .array(z.string())
          .optional()
          .describe(
            "Specific lines that are particularly revealing or well-crafted.",
          ),

        outcomeOfConversation: z
          .string()
          .optional()
          .describe(
            "What changed because of this dialogue (e.g., 'Agreement reached', 'A now suspects B is lying', 'Sexual tension escalated to action').",
          ),
      }),
    )
    .describe(
      "Significant conversations that reveal character, advance plot, or build tension. Focus on meaningful exchanges, not every line.",
    ),

  consequences: z.object({
    itemsAcquired: z
      .array(
        z.object({
          item: z.string(),
          acquiredBy: z.string(),
          method: z
            .string()
            .describe(
              "How they got it (e.g., 'Stolen', 'Gifted', 'Purchased', 'Found').",
            ),
          significance: z.string().optional(),
        }),
      )
      .describe("New possessions gained this chapter."),

    itemsLost: z
      .array(
        z.object({
          item: z.string(),
          lostBy: z.string(),
          method: z
            .string()
            .describe(
              "How it was lost (e.g., 'Confiscated', 'Destroyed', 'Traded away', 'Stolen').",
            ),
          impact: z
            .string()
            .optional()
            .describe("What losing this item means."),
        }),
      )
      .optional()
      .describe("Items removed from characters' possession."),

    stateChanges: z
      .array(
        z.object({
          character: z.string(),
          change: z
            .string()
            .describe(
              "New status/condition (e.g., 'Injured—broken ribs', 'Magically exhausted', 'Promoted to VP', 'Addicted to substance', 'Pregnant').",
            ),
          permanence: z.enum(["Temporary", "Long-term", "Permanent"]),
          mechanicalEffect: z
            .string()
            .optional()
            .describe("How this affects their capabilities."),
        }),
      )
      .describe(
        "Physical, mental, social, or magical status changes affecting character capabilities.",
      ),

    newObligations: z
      .array(
        z.object({
          character: z.string().describe("Who is now obligated."),
          obligation: z.string().describe("What they must do or provide."),
          toWhom: z.string().describe("Who holds the obligation."),
          consequences: z
            .string()
            .describe("What happens if they fail to fulfill it."),
          duration: z
            .string()
            .optional()
            .describe("How long this obligation lasts."),
        }),
      )
      .describe(
        "Promises, debts, pacts, contracts, or agreements that create future pressure.",
      ),

    informationGained: z
      .array(
        z.object({
          character: z.string().describe("Who learned this information."),
          information: z.string().describe("What they learned."),
          source: z.string().describe("Where/who they learned it from."),
          reliability: z
            .enum([
              "Confirmed True",
              "Likely True",
              "Uncertain",
              "Possibly False",
              "Confirmed False",
            ])
            .describe("How trustworthy this information is."),
          significance: z
            .string()
            .describe("Why this knowledge matters to plot or character."),
          whoElseKnows: z
            .array(z.string())
            .optional()
            .describe("Other characters aware of this information."),
        }),
      )
      .describe(
        "New knowledge acquired that affects future decisions or reveals plot.",
      ),

    informationLost: z
      .array(
        z.object({
          character: z.string(),
          information: z
            .string()
            .describe(
              "What knowledge is no longer available (e.g., 'Memory of yesterday erased', 'Document destroyed before reading').",
            ),
          howLost: z.string(),
        }),
      )
      .optional()
      .describe("Knowledge that characters had but no longer have access to."),

    worldStateChanges: z
      .array(z.string())
      .optional()
      .describe(
        "Changes to the broader world state (e.g., 'Company announces layoffs', 'War declared', 'New law passed', 'Magical ward falls').",
      ),
  }),

  symbolism: z
    .array(
      z.object({
        symbol: z.string(),
        meaning: z.string().describe("What this represents thematically."),
        recurrence: z
          .string()
          .optional()
          .describe("If this symbol has appeared before."),
      }),
    )
    .optional()
    .describe("Symbolic elements that add thematic depth."),

  tensionLevel: z
    .number()
    .min(0)
    .max(10)
    .describe(
      "End-of-chapter tension. Reference: 2=normal day, 5=active problem, 7=crisis approaching, 9=imminent danger, 10=life-or-death moment in progress"
    ),

  pacing: z
    .enum(["Slow/Contemplative", "Steady", "Brisk", "Rapid", "Breakneck"])
    .optional()
    .describe("Narrative tempo of this chapter."),

  cliffhanger: z
    .object({
      description: z.string(),
      type: z.enum(["Revelation", "Danger", "Decision", "Arrival", "Other"]),
    })
    .optional()
    .describe("If chapter ends on cliffhanger, describe it."),

  chapterDelta: z.object({
    newCharacters: z
      .array(z.string())
      .describe("Character IDs introduced this chapter"),
    newLocations: z.array(z.string()),
    newWorldRules: z.array(z.string()),
    relationshipsChanged: z.array(
      z.object({
        relationshipId: z.string(),
        changeType: z.enum(["Created", "Metrics", "Status", "Major Event"]),
      }),
    ),
    mysteriesAffected: z.array(
      z.object({
        mysteryId: z.string(),
        change: z.enum(["Introduced", "Clue Added", "Escalated", "Resolved"]),
      }),
    ),
  }),
});