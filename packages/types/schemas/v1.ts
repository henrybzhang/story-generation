import z from "zod";

export const CURRENT_PROMPT_VERSION = "1.0.0";

const StableId = z
  .string()
  .regex(/^[a-z]+(-[a-z0-9]+){1,4}$/)
  .describe(
    "Kebab-case identifier. Format: category-descriptor (e.g., 'char-vivian', 'rel-marcus-vivian', 'loc-penthouse') Must be unique across all IDs in document.",
  );

export const WritingStyleProfileSchema = z.object({
  proseCharacteristics: z.object({
    sentenceStructure: z.enum([
      "Short and punchy",
      "Medium varied",
      "Long and flowing",
      "Mixed complexity",
    ]),

    paragraphLength: z.enum([
      "Brief (1-3 sentences)",
      "Standard (4-6 sentences)",
      "Extended (7+ sentences)",
      "Highly variable",
    ]),

    descriptiveDensity: z
      .enum([
        "Sparse/minimalist",
        "Moderate",
        "Rich and detailed",
        "Overwhelming sensory",
      ])
      .describe("How much sensory/descriptive detail is present"),

    dialogueStyle: z.object({
      formality: z.enum(["Casual", "Mixed", "Formal"]),
      verbosity: z.enum(["Terse", "Moderate", "Verbose"]),
      distinctiveness: z.enum([
        "All characters sound similar",
        "Some voice differentiation",
        "Strong voice differentiation",
      ]),
      taggingStyle: z
        .string()
        .describe(
          "How dialogue tags are used (e.g., 'Minimal tags, action-heavy', 'Standard said/asked', 'Elaborate adverbs')",
        ),
    }),

    narrativeDistance: z.enum([
      "Deep POV (character's thoughts/voice)",
      "Close third (some narrative voice)",
      "Distant third (more objective)",
      "Omniscient (knows all)",
    ]),

    tenseAndPerson: z.object({
      tense: z.enum(["Past", "Present", "Mixed"]),
      person: z.enum(["First", "Second", "Third", "Multiple POV"]),
    }),
  }),

  eroticWritingPatterns: z.object({
    explicitnessLevel: z.enum([
      "Euphemistic/fade-to-black",
      "Sensual but vague",
      "Explicit with some restraint",
      "Highly explicit/graphic",
      "Clinical/technical",
    ]),

    arousalBuildStyle: z
      .enum([
        "Sudden/immediate",
        "Gradual escalation",
        "Teasing/denial focused",
        "Psychological before physical",
      ])
      .describe("How sexual tension builds in scenes"),

    powerDynamicEmphasis: z
      .enum([
        "Subtle/background",
        "Moderate presence",
        "Central focus",
        "Overwhelming",
      ])
      .describe("How prominently D/s dynamics feature"),

    sensoryPriority: z
      .array(
        z.enum([
          "Touch/physical sensation",
          "Visual/appearance",
          "Sound/voice",
          "Smell/taste",
          "Emotional/psychological",
          "Power/control feelings",
        ]),
      )
      .describe("Order of emphasis in erotic scenes"),

    climaxPresentationStyle: z
      .string()
      .describe(
        "How orgasms are described (e.g., 'Metaphorical/poetic', 'Direct physical reactions', 'Emotional focus', 'Power exchange centered')",
      ),

    aftercareStyle: z.enum([
      "Minimal/skipped",
      "Brief acknowledgment",
      "Detailed emotional processing",
      "Extended intimacy focus",
    ]),
  }),

  voiceMarkers: z.object({
    characteristicPhrases: z
      .array(z.string())
      .describe(
        "Recurring phrases or sentence structures unique to this author",
      ),

    metaphorPatterns: z
      .array(z.string())
      .describe(
        "Types of comparisons used (e.g., 'Often uses ocean/water metaphors', 'Mechanical/technical comparisons')",
      ),

    internalMonologueStyle: z
      .string()
      .describe(
        "How character thoughts are presented (e.g., 'Stream of consciousness', 'Structured self-reflection', 'Fragmented anxiety', 'Rational analysis')",
      ),

    transitionTechniques: z
      .array(z.string())
      .describe(
        "How author moves between scenes or topics (e.g., 'Time jumps with white space', 'Smooth narrative bridges', 'Abrupt cuts')",
      ),
  }),

  representativeExcerpts: z
    .array(
      z.object({
        excerpt: z
          .string()
          .describe("50-150 word sample showcasing distinctive style"),
        context: z
          .string()
          .describe(
            "What this excerpt demonstrates (e.g., 'Erotic build-up', 'Character voice', 'Scene setting')",
          ),
        chapterSource: z.number(),
      }),
    )
    .min(5)
    .max(10)
    .describe(
      "Curated examples of author's voice for AI continuation reference",
    ),
});

// ---------------------------------------------------------
// EROTIC ENCOUNTER TEMPLATES (Pattern Recognition)
// ---------------------------------------------------------
export const EroticEncounterTemplateSchema = z.object({
  templateName: z
    .string()
    .describe(
      "Descriptive name for this pattern (e.g., 'Vivian's Teasing Denial Pattern', 'First-time Premature Climax Scenario')",
    ),

  frequency: z.number().describe("How many times this pattern has occurred"),

  chapterOccurrences: z
    .array(z.number())
    .describe("Which chapters featured this pattern"),

  participants: z.array(z.string()).describe("Characters typically involved"),

  typicalStructure: z.object({
    initiation: z.string().describe("How these encounters typically begin"),
    escalation: z.string().describe("Common progression pattern"),
    climaxPattern: z.string().describe("How the peak typically unfolds"),
    resolution: z.string().describe("Common aftermath/conclusion"),
  }),

  commonElements: z.object({
    setting: z.array(z.string()).describe("Typical locations"),
    kinks: z.array(z.string()).describe("Recurring kinks in this pattern"),
    powerDynamic: z.string().describe("Typical dominance/submission pattern"),
    emotionalTone: z
      .array(z.string())
      .describe(
        "Common emotions (e.g., 'Playful teasing', 'Anxious surrender', 'Desperate need')",
      ),
    physicalTechniques: z
      .array(z.string())
      .describe("Recurring physical actions"),
  }),

  variations: z
    .array(
      z.object({
        chapter: z.number(),
        difference: z
          .string()
          .describe("How this instance deviated from the template"),
      }),
    )
    .optional()
    .describe("Notable deviations that show pattern evolution"),

  narrativeFunction: z
    .string()
    .describe(
      "What this pattern typically accomplishes in the story (e.g., 'Humiliates protagonist to drive character development', 'Establishes Vivian's control')",
    ),
});

export const HistoricalContextSchema = z.object({
  storyTimelineStart: z
    .string()
    .describe(
      "When the story begins (e.g., 'Monday morning, October', 'Winter 2023')",
    ),

  timeElapsedTotal: z
    .string()
    .describe(
      "Total time passed in story (e.g., '2 weeks', '3 months', '1 year')",
    ),

  significantDates: z
    .array(
      z.object({
        date: z.string().describe("Specific date if known, or relative time"),
        event: z.string(),
        chapter: z.number(),
        importance: z.enum(["Critical", "Major", "Notable", "Minor"]),
      }),
    )
    .optional()
    .describe("Important events anchored in timeline"),

  seasonalContext: z
    .string()
    .optional()
    .describe("Time of year if relevant (for weather, holidays, etc.)"),

  timeJumps: z
    .array(
      z.object({
        betweenChapters: z
          .tuple([z.number(), z.number()])
          .describe("[previousChapter, nextChapter]"),
        duration: z.string(),
        whatHappenedOffscreen: z.string().optional(),
      }),
    )
    .optional()
    .describe("Track any significant time skips"),
});

// ---------------------------------------------------------
// 1. WORLD BUILDING (The Context)
// ---------------------------------------------------------
export const WorldConceptSchema = z.object({
  id: StableId,
  term: z.string().describe("The term or concept as it appears in the story."),
  category: z
    .enum([
      "Magic System",
      "Technology",
      "Social Hierarchy",
      "Biology",
      "Organization",
      "Economy",
      "Law",
      "Geography",
      "Culture",
      "Religion",
      "Other",
    ])
    .describe("Primary classification of this world-building element"),
  definition: z
    .string()
    .describe(
      "Clear, concise explanation of what this concept is and how it functions within the world. 2-4 sentences.",
    ),
  systemicRules: z
    .array(
      z.object({
        rule: z
          .string()
          .describe(
            "A specific, concrete rule governing this concept (e.g., 'Neural links require both parties to consent', 'Mana regenerates through sexual energy').",
          ),

        establishedInChapter: z
          .number()
          .optional()
          .describe("Chapter where this rule was first established."),

        violations: z
          .array(
            z.object({
              chapter: z.number(),
              description: z
                .string()
                .describe("What happened and who violated it."),
              consequence: z
                .string()
                .describe("What resulted from this violation."),
            }),
          )
          .optional()
          .describe(
            "Instances where this rule was bent or broken, tracking narrative tension.",
          ),

        exceptions: z
          .array(
            z.object({
              condition: z
                .string()
                .describe("Under what circumstances the exception applies."),
              explanation: z
                .string()
                .describe("Why this exception exists within the world logic."),
            }),
          )
          .optional()
          .describe(
            "Legitimate exceptions to the rule that maintain internal consistency.",
          ),
      }),
    )
    .describe(
      "Hard constraints and mechanics that govern this concept. These should remain consistent unless deliberately subverted.",
    ),

  narrativeRelevance: z
    .string()
    .describe(
      "Explain why this concept matters to the plot, characters, or themes. How does it create conflict, opportunity, or meaning?",
    ),

  impactOnEroticContent: z
    .string()
    .optional()
    .describe(
      "If applicable, how this world element specifically influences sexual dynamics, power exchange, or erotic content (e.g., 'Public sex is taboo but legally protected', 'Orgasms trigger magic').",
    ),

  firstIntroducedInChapter: z
    .number()
    .describe("Chapter number where this concept first appeared."),

  lastUpdatedInChapter: z
    .number()
    .describe(
      "Most recent chapter where significant new information about this concept was revealed.",
    ),

  relatedConcepts: z
    .array(z.string())
    .optional()
    .describe(
      "IDs of other WorldConcepts that interact with or depend on this one.",
    ),

  compulsionMechanics: z
    .object({
      method: z
        .enum([
          "Hypnosis",
          "Mind Control",
          "Magical Compulsion",
          "Pheromones",
          "Supernatural Charm",
          "Technological Control",
          "Seduction/Persuasion",
          "Drug/Potion",
          "Psychic Influence",
          "Other",
        ])
        .optional(),

      mechanicsDescription: z
        .string()
        .optional()
        .describe(
          "How this compulsion method works (e.g., 'Eye contact required for 5+ seconds', 'Pheromones affect arousal centers in brain', 'Verbal commands must be spoken in Latin').",
        ),

      limitations: z
        .array(z.string())
        .optional()
        .describe(
          "What this method CANNOT do (e.g., 'Cannot force self-harm', 'Wears off after orgasm', 'Doesn't work on willing subjects').",
        ),

      resistancePossible: z
        .boolean()
        .optional()
        .describe("Can targets resist or is compliance absolute?"),

      resistanceConditions: z
        .array(z.string())
        .optional()
        .describe(
          "Under what circumstances can someone resist (e.g., 'Strong emotional attachment to another', 'Magical training', 'Aware of the compulsion').",
        ),

      aftereffects: z
        .array(z.string())
        .optional()
        .describe(
          "What happens after compulsion ends (e.g., 'Full memory of actions', 'No memory but physical evidence', 'Lingering compliance for 24hrs', 'Craving to be controlled again').",
        ),

      detectionDifficulty: z
        .enum(["Obvious", "Subtle", "Undetectable"])
        .optional()
        .describe("Can others tell someone is being controlled?"),
    })
    .optional()
    .describe(
      "If this world concept involves mental/physical compulsion, detail the mechanics.",
    ),
});

export const ActiveMysterySchema = z.object({
  id: StableId,

  lastUpdatedInChapter: z
    .number()
    .describe(
      "Most recent chapter where significant new information about this mystery was revealed.",
    ),

  mysteryName: z
    .string()
    .describe(
      "Clear, descriptive title of the mystery (e.g., 'Why are employees disappearing after hours?', 'Who is the masked figure?').",
    ),

  introducedInChapter: z
    .number()
    .describe("Chapter where this mystery was first hinted at or established."),

  category: z
    .enum([
      "Character Identity",
      "Plot Mechanism",
      "Hidden Motive",
      "World Secret",
      "Relationship Dynamic",
      "Other",
    ])
    .describe("Type of mystery for organizational clarity."),

  cluesFound: z
    .array(
      z.object({
        chapter: z.number(),
        clue: z
          .string()
          .describe("The specific piece of information discovered."),
        discoveredBy: z.string().describe("Which character found this clue."),
        reliability: z
          .enum(["Confirmed", "Likely", "Uncertain", "Red Herring"])
          .describe("How trustworthy this clue appears to be."),
      }),
    )
    .describe("Chronological list of all discovered clues, even false leads."),

  suspicionLevel: z
    .enum(["Background", "Low", "Moderate", "High", "Critical", "Urgent"])
    .describe(
      "How pressing this mystery is to the characters. 'Background' = mentioned but not actively investigated.",
    ),

  currentTheories: z
    .array(
      z.object({
        heldBy: z.string().describe("Which character holds this theory."),
        theory: z
          .string()
          .describe("Their current explanation for the mystery."),
        confidence: z.enum([
          "Speculation",
          "Hypothesis",
          "Strong Belief",
          "Conviction",
        ]),
        evidenceSupporting: z.array(z.string()).optional(),
      }),
    )
    .describe(
      "Different characters may have competing theories about the same mystery.",
    ),

  status: z
    .enum([
      "Dormant",
      "Active",
      "Escalating",
      "Near Resolution",
      "Resolved",
      "Abandoned",
    ])
    .describe("Current narrative status."),

  resolution: z
    .object({
      chapter: z.number(),
      answer: z.string().describe("The actual explanation for the mystery."),
      resolvedBy: z.array(z.string()).describe("Which characters solved it."),
      consequencesOfResolution: z.array(z.string()),
    })
    .optional()
    .describe("Only populated when status is 'Resolved'."),

  redHerrings: z
    .array(z.string())
    .optional()
    .describe(
      "False leads that were deliberately planted or emerged naturally.",
    ),
});

export const WorldContextSchema = z.object({
  worldConcepts: z
    .array(WorldConceptSchema)
    .describe(
      "All systemic rules, magic systems, technologies, social structures, etc. that govern the story world.",
    ),

  activeMysteries: z
    .array(ActiveMysterySchema)
    .describe(
      "Unresolved questions driving reader engagement and plot progression.",
    ),

  locations: z
    .array(
      z.object({
        id: StableId,
        name: z
          .string()
          .describe("The location's name as it appears in story."),

        description: z
          .string()
          .describe(
            "Physical description: layout, aesthetics, sensory details. What would a character notice entering for the first time?",
          ),

        significance: z
          .string()
          .describe(
            "Why this place matters to the plot, themes, or character development. What makes it more than just a setting?",
          ),

        atmosphericTags: z
          .array(z.string())
          .describe(
            "Emotional/atmospheric descriptors (e.g., 'Oppressive', 'Luxurious', 'Sterile', 'Liminal', 'Intimate', 'Dangerous').",
          ),

        accessRestrictions: z
          .string()
          .optional()
          .describe(
            "Who can or cannot enter this location, and under what conditions.",
          ),

        connectedCharacters: z
          .array(
            z.object({
              characterName: z.string(),
              relationship: z
                .string()
                .describe(
                  "How they relate to this location (e.g., 'Owns it', 'Works here', 'Banned from', 'Hides here').",
                ),
            }),
          )
          .describe("Characters with meaningful ties to this location."),

        eroticSignificance: z
          .string()
          .optional()
          .describe(
            "If this location has particular relevance to erotic content (e.g., 'Public play risk', 'Soundproof', 'Contains bondage equipment').",
          ),

        firstAppearance: z.number(),
        lastAppearance: z.number(),
      }),
    )
    .describe("Recurring or significant locations that shape the narrative."),

  timeline: z
    .object({
      storyStartDate: z
        .string()
        .optional()
        .describe(
          "When the story begins, if specified (e.g., 'Modern day', '2157', 'Summer Solstice').",
        ),

      currentPointInTime: z
        .string()
        .optional()
        .describe("Where we are now in the chronology."),

      totalTimeElapsed: z
        .string()
        .describe(
          "How much time has passed from story start to current chapter (e.g., '3 days', '2 weeks', '6 months').",
        ),

      importantDates: z
        .array(
          z.object({
            date: z.string(),
            event: z.string(),
            significance: z.string(),
          }),
        )
        .optional()
        .describe(
          "Key dates that matter to the plot (deadlines, anniversaries, scheduled events).",
        ),
    })
    .describe("Chronological tracking to maintain temporal consistency."),
});

// ---------------------------------------------------------
// 2. CHARACTER DEEP DIVE (The "Why")
// ---------------------------------------------------------
export const CharacterAnalysisSchema = z.object({
  characterName: z
    .string()
    .describe(
      "Primary name used in narration. Use consistent spelling/capitalization.",
    ),

  id: StableId,

  lastUpdatedInChapter: z
    .number()
    .describe(
      "Most recent chapter where significant new information about this character was revealed.",
    ),

  status: z
    .enum([
      "Active",
      "Incapacitated",
      "Deceased",
      "Missing",
      "Departed",
      "Imprisoned",
    ])
    .describe(
      "Current narrative status affecting their ability to participate in scenes.",
    ),

  aliases: z
    .array(
      z.object({
        name: z.string(),
        context: z
          .string()
          .describe(
            "When/why this name is used (e.g., 'Online handle', 'Formal title', 'Intimate nickname').",
          ),
        knownBy: z
          .array(z.string())
          .optional()
          .describe("Which characters know them by this name."),
      }),
    )
    .describe("Alternative names, nicknames, codenames, or titles."),

  role: z
    .string()
    .describe(
      "Their narrative function (e.g., 'Protagonist', 'Antagonist', 'Mentor', 'Foil', 'Love Interest', 'Obstacle').",
    ),

  importance: z
    .enum(["Protagonist", "Major", "Supporting", "Minor", "Cameo"])
    .describe("Hierarchical importance to the overall narrative."),

  firstAppearance: z
    .number()
    .describe("Chapter number where they first appeared or were mentioned."),

  screenTime: z
    .number()
    .describe(
      "Total number of chapters where character had speaking lines OR internal POV. Mentioned-only doesn't count."
    ),

  lastAppearance: z
    .number()
    .optional()
    .describe("Most recent chapter featuring this character."),

  inventory: z
    .array(
      z.object({
        item: z.string(),
        significance: z
          .string()
          .describe(
            "Why this item matters (e.g., 'Weapon', 'Blackmail material', 'Sentimental value', 'Plot device').",
          ),
        acquiredInChapter: z.number().optional(),
      }),
    )
    .describe(
      "Significant items currently in their possession. Focus on plot-relevant objects, not mundane belongings.",
    ),

  physicalCondition: z
    .string()
    .describe(
      "Current physical state affecting capabilities (e.g., 'Exhausted, hasn't slept in 36 hours', 'Recovering from leg injury—reduced mobility', 'Mana-depleted, cannot cast spells', 'Peak physical condition'). Be specific about limitations.",
    ),

  appearance: z.object({
    basicDescription: z
      .string()
      .describe(
        "Age range, build, height, coloring. The fundamentals that don't change (e.g., 'Late 20s, athletic build, 5'9\", dark skin, natural black hair').",
      ),
    distinguishingFeatures: z
      .array(z.string())
      .describe(
        "Unique physical traits that make them recognizable (e.g., 'Scar across left eyebrow', 'Heterochromia—one green eye, one blue', 'Tattoo of a raven on right shoulder', 'Always wears silver ring').",
      ),
    style: z
      .string()
      .describe(
        "Fashion choices, grooming, aesthetic presentation (e.g., 'Corporate professional—tailored suits, minimal jewelry', 'Goth aesthetic, heavy makeup, leather', 'Deliberately unremarkable—blends into crowds').",
      ),
    physicalState: z
      .string()
      .describe("Current markings, injuries, exhaustion level, arousal level."),
    scent: z.string().describe("Their signature smell."),
    bodyLanguage: z
      .string()
      .optional()
      .describe(
        "Characteristic gestures, posture, movement patterns (e.g., 'Restless—always fidgeting', 'Military bearing, stands at attention', 'Fluid, dancer-like grace').",
      ),
    appearanceChanges: z
      .array(
        z.object({
          chapter: z.number(),
          change: z.string(),
          reason: z
            .string()
            .describe(
              "Why the change occurred (narrative or character motivation).",
            ),
          permanence: z.enum(["Temporary", "Permanent", "Unknown"]),
        }),
      )
      .optional()
      .describe(
        "Track visual changes that signal character development or plot events.",
      ),
  }),

  voice: z
    .string()
    .describe(
      "Speech patterns, accent, tone, verbal tics, vocabulary level (e.g., 'Clipped British accent, formal diction, rarely contracts words', 'Valley girl upspeak, uses \"like\" frequently', 'Deep baritone, slow deliberate speech, poetic vocabulary').",
    ),

  psychology: z.object({
    coreMotivation: z
      .string()
      .describe(
        "The fundamental drive beneath all their choices, independent of sexual desire (e.g., 'Prove herself to her deceased father', 'Accumulate enough wealth to retire by 40', 'Protect the innocent from exploitation', 'Achieve recognition as an artist'). One clear, specific goal.",
      ),

    coreFears: z
      .array(z.string())
      .optional()
      .describe(
        "Deep-seated fears that influence behavior (e.g., 'Abandonment', 'Loss of control', 'Being ordinary', 'Vulnerability').",
      ),

    internalConflict: z
      .string()
      .describe(
        "The primary psychological tension creating character complexity (e.g., 'Duty to family vs. Personal happiness', 'Desire for intimacy vs. Fear of vulnerability', 'Ambition vs. Morality'). Frame as opposing forces.",
      ),

    moralAlignment: z
      .string()
      .optional()
      .describe(
        "Their ethical framework (e.g., 'Lawful Good—follows rules and helps others', 'Chaotic Neutral—self-interested but not cruel', 'Pragmatic—ends justify means'). Can evolve.",
      ),

    currentMood: z
      .string()
      .describe(
        "Emotional state as of the most recent chapter (e.g., 'Paranoid and hypervigilant', 'Giddily optimistic', 'Numb and dissociated', 'Confident bordering on arrogant').",
      ),

    emotionalTrajectory: z
      .array(
        z.object({
          chapter: z.number(),
          mood: z.string(),
          trigger: z.string().describe("What caused this emotional state."),
        }),
      )
      .optional()
      .describe(
        "Track significant emotional shifts across chapters to show arc.",
      ),
  }),

  eroticProfile: z.object({
    orientation: z
      .string()
      .describe(
        "Sexual and romantic orientation (e.g., 'Heterosexual', 'Bisexual with female preference', 'Pansexual', 'Demisexual lesbian', 'Asexual but sex-favorable'). Be specific about nuances.",
      ),

    dynamicRole: z
      .string()
      .describe(
        "Preferred position in power exchange dynamics (e.g., 'Dominant with men, submissive with women', 'Service-oriented submissive', 'Switch with bratty tendencies', 'Dominant—strict and sadistic', 'Vanilla—no power exchange preference'). Note context-dependent variations.",
      ),

    kinkTags: z
      .array(z.string())
      .describe(
        "Specific kinks, fetishes, and preferences they engage with. Use precise terminology from the kink lexicon (e.g., 'Shibari', 'Praise kink', 'Orgasm denial', 'Exhibitionism', 'Breeding kink', 'Degradation').",
      ),

    eroticSignificance: z
      .string()
      .describe(
        "How their sexuality interfaces with the world's systemic rules or plot mechanics. Examples by genre: Fantasy—'Generates mana through orgasms, more powerful with trusted partners'; Sci-Fi—'Uploads data during neural-linked sex'; Contemporary—'Uses seduction to gather corporate intelligence'; Supernatural—'Feeds on sexual energy to sustain immortality'. Make it specific and mechanically clear.",
      ),

    sexualStyle: z
      .string()
      .describe(
        "Adjectives describing their characteristic behavior in intimate encounters (e.g., 'Methodical and attentive', 'Aggressive and demanding', 'Playful and teasing', 'Tender and worshipful', 'Detached and clinical', 'Wild and uninhibited'). Captures their personality in bed.",
      ),

    arousalPatterns: z
      .object({
        turnOns: z
          .array(z.string())
          .describe(
            "What arouses them (e.g., 'Competence', 'Being overpowered', 'Dirty talk', 'Visual stimulation').",
          ),
        turnOffs: z.array(z.string()).optional(),
        requiredForArousal: z
          .string()
          .optional()
          .describe(
            "If they need specific conditions to become aroused (e.g., 'Emotional connection', 'Element of danger', 'Submission to authority').",
          ),
      })
      .optional()
      .describe("Psychological patterns around desire."),

    sexualHistory: z
      .array(z.string())
      .optional()
      .describe(
        "Array of eroticEncounter IDs from NarrativeLog that involve these two characters. References the detailed encounter records in the narrative log.",
      ),

    evolutionNotes: z
      .array(
        z.object({
          chapter: z.number(),
          change: z
            .string()
            .describe(
              "How their erotic profile shifted (e.g., 'Discovered enjoyment of submission', 'Became more comfortable with dirty talk', 'Developed trauma response to bondage').",
            ),
        }),
      )
      .optional()
      .describe("Track how their sexuality develops through the story."),
  }),

  skills: z
    .array(
      z.object({
        skill: z
          .string()
          .describe(
            "Specific competency (e.g., 'Corporate law', 'Krav Maga', 'Seduction', 'Hacking', 'Potion brewing').",
          ),

        proficiency: z
          .enum(["Novice", "Competent", "Expert", "Master", "Legendary"])
          .describe(
            "Skill level affecting success probability and narrative impact.",
          ),

        relevance: z
          .string()
          .describe(
            "How this skill affects the plot or character arc (e.g., 'Used to gather intelligence', 'Creates physical intimidation factor', 'Source of self-worth').",
          ),

        limitations: z
          .string()
          .optional()
          .describe(
            "Constraints on this skill (e.g., 'Hacking requires time and equipment—not available in emergencies', 'Combat skills reduced due to injury').",
          ),

        development: z
          .array(
            z.object({
              chapter: z.number(),
              improvement: z.string(),
            }),
          )
          .optional()
          .describe("Track skill progression."),
      }),
    )
    .describe(
      "Competencies that make them effective or interesting. Focus on plot-relevant skills.",
    ),

  flaws: z
    .array(
      z.object({
        flaw: z
          .string()
          .describe(
            "Specific weakness, vice, or negative trait (e.g., 'Arrogance leads to underestimating opponents', 'Jealous and possessive in relationships', 'Addiction to painkillers').",
          ),
        impact: z.string().describe("How this flaw creates problems for them."),
        acknowledged: z
          .boolean()
          .describe("Does the character recognize this flaw in themselves?"),
      }),
    )
    .describe(
      "Character flaws that create realistic complexity and narrative conflict.",
    ),

  arc: z.object({
    shortTermGoal: z
      .string()
      .describe(
        "What they're actively working toward right now (e.g., 'Secure the promotion before annual review', 'Find out who's blackmailing her', 'Seduce the target to gain access'). Should be achievable within 1-5 chapters.",
      ),

    longTermDesire: z
      .string()
      .describe(
        "Their ultimate aspiration driving the overall character arc (e.g., 'Become CEO of the company', 'Escape her family's control', 'Find genuine love after years of manipulation', 'Master forbidden magic'). May not be achievable or even fully conscious.",
      ),

    characterQuestion: z
      .string()
      .optional()
      .describe(
        "The thematic question their arc explores (e.g., 'Can she maintain her morality while pursuing ruthless ambition?', 'Is vulnerability worth the risk of pain?', 'Does power corrupt inevitably?').",
      ),

    majorObstacles: z
      .array(
        z.object({
          obstacle: z.string(),
          type: z
            .enum(["External", "Internal", "Interpersonal"])
            .describe("Nature of the challenge."),
          introduced: z.number().optional(),
          status: z.enum(["Active", "Overcome", "Worsening"]).optional(),
        }),
      )
      .describe("Significant barriers between them and their goals."),

    progressMarkers: z
      .array(
        z.object({
          chapter: z.number(),
          milestone: z
            .string()
            .describe("A concrete achievement or turning point."),
          impactOnGoals: z
            .string()
            .describe("How this affected their trajectory."),
        }),
      )
      .optional()
      .describe("Positive developments showing growth or advancement."),

    setbacks: z
      .array(
        z.object({
          chapter: z.number(),
          failure: z
            .string()
            .describe("What went wrong or what they failed to achieve."),
          consequence: z.string().describe("Concrete results of this failure."),
          lessonLearned: z
            .string()
            .optional()
            .describe("Did they grow from this, or did it worsen their flaws?"),
        }),
      )
      .optional()
      .describe(
        "Failures and complications. Realistic characters don't succeed at everything.",
      ),

    arcStage: z
      .enum([
        "Introduction",
        "Rising Action",
        "Complication",
        "Crisis",
        "Climax",
        "Resolution",
        "Aftermath",
      ])
      .optional()
      .describe("Where they are in their narrative journey."),

    characterGrowth: z
      .array(
        z.object({
          chapter: z.number(),
          change: z
            .string()
            .describe("How they evolved (beliefs, behaviors, self-awareness)."),
          trigger: z.string().describe("What caused this growth."),
        }),
      )
      .optional()
      .describe(
        "Track actual character development—not just plot events happening TO them.",
      ),
  }),

  compulsionProfile: z
    .object({
      canCompel: z
        .boolean()
        .describe("Does this character have compulsion abilities?"),

      compulsionMethods: z
        .array(
          z.object({
            method: z.string().describe("Type of compulsion they can use."),
            proficiency: z.enum(["Novice", "Competent", "Expert", "Master"]),
            preferredTargets: z
              .string()
              .optional()
              .describe(
                "Who they typically use this on (e.g., 'Strangers only', 'Intimate partners', 'Anyone vulnerable').",
              ),
            ethicalBoundaries: z
              .string()
              .optional()
              .describe(
                "Their personal rules about using compulsion (e.g., 'Only for mutual pleasure', 'No permanent changes', 'Anything to achieve goals').",
              ),
          }),
        )
        .optional(),

      susceptibilityToCompulsion: z
        .object({
          vulnerabilityLevel: z
            .enum([
              "Immune",
              "Resistant",
              "Normal",
              "Highly Susceptible",
              "Completely Vulnerable",
            ])
            .describe("How easily they can be compelled."),

          vulnerabilityReasons: z
            .array(z.string())
            .optional()
            .describe(
              "Why they're susceptible (e.g., 'Latent submissive desires', 'Magical bloodline weakness', 'Technological implant exploitable', 'Trust issues make them guard down').",
            ),

          triggersList: z
            .array(
              z.object({
                id: StableId,
                triggerType: z.enum([
                  "Verbal command",
                  "Physical touch",
                  "Visual cue",
                  "Emotional state",
                  "Environmental condition",
                  "Combination",
                ]),
                specificTrigger: z
                  .string()
                  .describe(
                    "Exact trigger (e.g., specific phrase, gesture, location)",
                  ),
                effect: z.string().describe("What happens when triggered"),
                firstEstablished: z
                  .number()
                  .describe(
                    "Chapter where this trigger was established in the character",
                  ),
                authorizedCharacters: z
                  .array(z.string())
                  .optional()
                  .describe(
                    "List of character IDs that can use this trigger on this subject. Everyone can if this is empty",
                  ),
              }),
            )
            .optional()
            .describe(
              "Catalog all established triggers the character has for reference",
            ),

          resistanceEvolution: z
            .object({
              baselineResistance: z
                .string()
                .describe("Initial ability to resist (from early chapters)"),
              currentResistance: z
                .string()
                .describe("Current ability to resist"),
              factorsIncreasingResistance: z.array(z.string()).optional(),
              factorsDecreasingResistance: z.array(z.string()).optional(),
              momentaryBreakthroughs: z
                .array(
                  z.object({
                    chapter: z.number(),
                    description: z
                      .string()
                      .describe("When character briefly broke through control"),
                    lasted: z
                      .boolean()
                      .describe(
                        "Whether the breakthrough stuck or was overridden",
                      ),
                  }),
                )
                .optional(),
            })
            .optional()
            .describe("Track how resistance changes over time"),
        })
        .optional(),

      attitudeTowardCompulsion: z
        .object({
          asController: z
            .string()
            .optional()
            .describe(
              "How they feel about compelling others (e.g., 'Sees it as intimate gift', 'Pragmatic tool', 'Guilty pleasure', 'Necessary evil').",
            ),

          asSubject: z
            .string()
            .optional()
            .describe(
              "How they feel about being compelled (e.g., 'Secretly craves it', 'Fears and resists', 'Enjoys surrender', 'Humiliated but aroused').",
            ),
        })
        .optional(),
    })
    .optional()
    .describe(
      "Character's relationship to compulsion mechanics—both as wielder and target.",
    ),

  notableQuotes: z
    .array(
      z.object({
        chapter: z.number(),
        quote: z.string(),
        context: z.string(),
        significance: z
          .string()
          .describe("Why this line matters for characterization."),
      }),
    )
    .max(10)
    .describe("Dialogue that captures their voice or reveals character."),
});

export const RelationshipSchema = z.object({
  id: StableId,

  lastUpdatedInChapter: z
    .number()
    .describe(
      "Most recent chapter where significant new information about this relationship was revealed.",
    ),

  participants: z
    .array(z.string())
    .min(2)
    .describe(
      "Character IDs involved in this relationship. Usually 2, but can support polyamorous or group dynamics.",
    ),

  relationshipType: z
    .enum([
      "Romantic",
      "Sexual",
      "Romantic & Sexual",
      "Familial",
      "Professional",
      "Friendship",
      "Rivalry",
      "Enmity",
      "Mentor/Mentee",
      "Transactional",
      "Complicated",
    ])
    .describe("Primary category of relationship."),

  dynamicSummary: z
    .string()
    .describe(
      "One-sentence characterization of their current relationship dynamic (e.g., 'Forbidden attraction between boss and employee', 'Childhood friends with unresolved sexual tension', 'Bitter rivals forced to cooperate', 'Master/slave dynamic built on mutual respect').",
    ),

  relationshipArchetype: z
    .string()
    .optional()
    .describe(
      "Pattern this relationship follows (e.g., 'Innocent corrupted by experienced', 'Rivals to lovers', 'Obsessive pursuit', 'Forbidden fruit', 'Power exchange').",
    ),

  firstInteraction: z
    .number()
    .describe("Chapter number where these characters first met or interacted."),

  status: z
    .enum(["Active", "Dormant", "Estranged", "Ended", "Complicated", "Secret"])
    .describe("Current state. 'Complicated' = active but with unresolved conflicts or unclear boundaries. 'Secret' = active but hidden from others."),

  // ============================================
  // ASYMMETRIC DATA - Per-participant perspectives
  // ============================================
  participantPerspectives: z
    .array(
      z.object({
        characterId: z
          .string()
          .describe("The character id whose perspective this represents."),

        towardCharacterId: z
          .string()
          .optional()
          .describe(
            "If more than 2 participants, specify the character id this perspective is toward.",
          ),

        // Core metrics
        trust: z
          .number()
          .min(0)
          .max(100)
          .describe(
            "Emotional safety and reliability. 0 = Complete distrust, 100 = Absolute faith. Measures whether this character believes the other will act in their interest.",
          ),

        lust: z
          .number()
          .min(0)
          .max(100)
          .describe(
            "Physical desire and sexual attraction. 0 = No attraction, 100 = Overwhelming desire. Independent of trust.",
          ),

        respect: z
          .number()
          .min(0)
          .max(100)
          .describe(
            "Admiration for competence, character, or abilities. 0 = Complete contempt, 100 = Deep admiration.",
          ),

        resentment: z
          .number()
          .min(0)
          .max(100)
          .describe(
            "Accumulated grievances and grudges. 0 = No hard feelings, 100 = Consuming hatred. Tracks unresolved conflicts.",
          ),

        affection: z
          .number()
          .min(0)
          .max(100)
          .optional()
          .describe(
            "Emotional warmth and care beyond trust (e.g., love, fondness). Different from lust.",
          ),

        dependency: z
          .number()
          .min(0)
          .max(100)
          .optional()
          .describe(
            "How much this character needs the other (emotionally, financially, sexually, etc.). Can create unhealthy dynamics.",
          ),

        fear: z
          .number()
          .min(0)
          .max(100)
          .optional()
          .describe(
            "Level of fear or intimidation felt toward the other character. 0 = No fear, 100 = Terrified.",
          ),

        // Character-specific perception
        perceivedRelationship: z
          .string()
          .optional()
          .describe(
            "How this character would describe the relationship (may differ from reality or other's perception).",
          ),

        desires: z
          .string()
          .optional()
          .describe(
            "What this character wants from the relationship (e.g., 'Wants commitment', 'Wants to dominate completely', 'Wants to escape').",
          ),

        fears: z
          .string()
          .optional()
          .describe(
            "What this character fears about the relationship (e.g., 'Fears abandonment', 'Fears losing control', 'Fears discovery').",
          ),
      }),
    )
    .describe(
      "Per-participant feelings and knowledge. Each participant gets their own perspective entry.",
    ),

  // ============================================
  // SHARED/MUTUAL PROPERTIES
  // ============================================

  powerDynamic: z
    .string()
    .describe(
      "Who holds leverage and what kind (e.g., 'B holds financial power over A', 'A has blackmail material on B', 'Balanced—mutual dependence', 'Formal hierarchy: B is A's boss'). Be specific about the source of power.",
    ),

  powerDynamicHistory: z
    .array(
      z.object({
        chapter: z.number(),
        dominantParty: z
          .string()
          .describe(
            "Character ID of who typically holds dominance, or 'balanced' if equal.",
          ),
        dominanceStyle: z
          .string()
          .optional()
          .describe(
            "How they typically exert control (e.g., 'Playful mockery', 'Stern commands', 'Subtle manipulation').",
          ),
        balanceDescription: z
          .string()
          .describe(
            "e.g., 'Complete control', 'Mostly dominant', 'Balanced', 'Power struggle', 'Shifting'.",
          ),
        keyMoment: z
          .string()
          .describe("What established or shifted this balance."),
      }),
    )
    .optional()
    .describe("Track how power balance evolves over time."),

  consentDynamic: z
    .string()
    .optional()
    .describe(
      "If this is a sexual/erotic relationship, describe the nature of consent (e.g., 'Enthusiastic and negotiated', 'Dubious—power imbalance makes true consent questionable', 'Coerced through blackmail', 'CNC—consensual non-consent established in advance').",
    ),

  boundaries: z
    .array(
      z.object({
        boundary: z.string().describe("The limit or rule established."),
        setBy: z
          .string()
          .optional()
          .describe("Character ID who established this boundary."),
        establishedInChapter: z.number().optional(),
        violated: z.boolean().describe("Whether this boundary was broken."),
        violatedInChapter: z.number().optional(),
        violatedBy: z
          .string()
          .optional()
          .describe("Character ID who violated it."),
        consequence: z
          .string()
          .optional()
          .describe("What happened as a result of violation."),
      }),
    )
    .describe("Explicit or implicit limits set within this relationship."),

  // ============================================
  // RELATIONSHIP HISTORY & EVOLUTION
  // ============================================

  relationshipHistory: z
    .array(
      z.object({
        chapter: z.number(),
        event: z.string().describe("What happened between them."),
        initiatedBy: z
          .string()
          .optional()
          .describe("Character ID who initiated the event."),
        significance: z
          .enum(["Minor", "Moderate", "Major", "Defining"])
          .optional(),
        // Deltas can be specified per-character if asymmetric impact
        impactOnParticipants: z
          .array(
            z.object({
              characterId: z
                .string()
                .describe("Character ID who experienced this impact."),
              trustDelta: z
                .number()
                .optional()
                .describe("Change in trust (-100 to +100)."),
              lustDelta: z.number().optional(),
              respectDelta: z.number().optional(),
              resentmentDelta: z.number().optional(),
              affectionDelta: z.number().optional(),
              note: z
                .string()
                .optional()
                .describe("Character-specific reaction."),
            }),
          )
          .optional(),
      }),
    )
    .optional()
    .describe(
      "Chronological log of key relationship events showing evolution.",
    ),

  intimacyProgression: z
    .array(
      z.object({
        chapter: z.number(),
        milestone: z
          .string()
          .describe(
            "e.g., 'First kiss', 'First sexual encounter', 'First compulsion', 'Emotional vulnerability shown', 'Said I love you'.",
          ),
        context: z.string().describe("Circumstances of this milestone."),
        initiatedBy: z.string().optional().describe("Character ID."),
        mutuallyDesired: z
          .boolean()
          .optional()
          .describe("Was this wanted by both parties?"),
      }),
    )
    .optional()
    .describe("Track progression of physical and emotional intimacy."),

  conflictLog: z
    .array(
      z.object({
        chapter: z.number(),
        conflictType: z.enum([
          "Misunderstanding",
          "Value clash",
          "Betrayal",
          "Jealousy",
          "Power struggle",
          "External pressure",
          "Boundary violation",
          "Other",
        ]),
        description: z.string(),
        resolution: z.string().optional(),
        resolvedInChapter: z.number().optional(),
        lingersAsResentment: z
          .boolean()
          .optional()
          .describe("Did this conflict leave lasting damage?"),
      }),
    )
    .optional()
    .describe("Track conflicts and their resolutions."),

  secretsAndLies: z
    .array(
      z.object({
        secretHolder: z.string().describe("Character ID keeping the secret."),
        secretKeptFrom: z.string().describe("Character ID in the dark."),
        secretContent: z.string().describe("What is being hidden."),
        doesOtherKnowTheyKnow: z
          .boolean()
          .describe("Is this knowledge secret, or known to be known?"),
        leverage: z
          .string()
          .optional()
          .describe("How this knowledge could be used."),
        establishedInChapter: z.number(),
        revealed: z.boolean(),
        revealedInChapter: z.number().optional(),
        howRevealed: z
          .string()
          .optional()
          .describe("Confessed, discovered, third party revealed, etc."),
        impactOnRelationship: z.string().optional(),
      }),
    )
    .optional()
    .describe("Track deceptions between participants and their revelations."),

  // ============================================
  // COMPULSION-SPECIFIC (if applicable)
  // ============================================

  compulsionDynamics: z
    .object({
      compellerCharacterId: z
        .string()
        .optional()
        .describe("Character ID of who holds compulsion power."),

      subjectCharacterId: z
        .string()
        .optional()
        .describe("Character ID of who is subject to compulsion."),

      compulsionEstablished: z
        .number()
        .optional()
        .describe("Chapter where compulsion dynamic began."),

      activeEffects: z
        .array(
          z.object({
            effect: z
              .string()
              .describe(
                "Current compulsion effect (e.g., 'Cannot lie to compeller', 'Aroused by specific trigger', 'Obeys direct commands').",
              ),
            establishedInChapter: z.number(),
            permanence: z.enum([
              "Temporary",
              "Semi-permanent",
              "Permanent",
              "Unknown",
            ]),
            canBeResisted: z.boolean(),
            resistanceConditions: z
              .string()
              .optional()
              .describe("Under what circumstances resistance is possible."),
          }),
        )
        .optional(),

      compulsionHistory: z
        .array(
          z.object({
            chapter: z.number(),
            action: z
              .string()
              .describe("What the subject was compelled to do."),
            method: z.string(),
            context: z.string(),
            triggerList: z
              .array(
                z.object({
                  triggerId: z
                    .string()
                    .describe("Trigger ID used to compel the subject."),
                  effectiveness: z.enum([
                    "Complete success",
                    "Partial",
                    "Resisted",
                    "Failed",
                  ]),
                }),
              )
              .optional()
              .describe("List of triggers used to compel the subject."),
            subjectAwareness: z.enum([
              "Fully Aware",
              "Partially Aware",
              "Unaware",
              "Retroactively Aware",
            ]),
            subjectResponse: z
              .string()
              .describe(
                "How the subject felt during/after (e.g., 'Conflicted arousal', 'Violated but craving more', 'Blissfully compliant').",
              ),
            resistanceAttempted: z.boolean().optional(),
            resistanceSuccessful: z.boolean().optional(),
            lastingEffects: z.array(z.string()).optional(),
          }),
        )
        .optional(),

      consentFramework: z
        .string()
        .optional()
        .describe(
          "The established understanding around compulsion use (e.g., 'Pre-negotiated CNC', 'Non-consensual control', 'Consensual surrender', 'Coerced initial consent').",
        ),
    })
    .optional()
    .describe(
      "Track compulsion-specific dynamics if this relationship involves mind control, hypnosis, or similar mechanics.",
    ),

  // ============================================
  // EROTIC SPECIFICS (if applicable)
  // ============================================

  eroticDynamics: z
    .object({
      sexualCompatibility: z
        .string()
        .optional()
        .describe(
          "How well their desires and styles mesh (e.g., 'Highly compatible—both enjoy power exchange', 'Friction—different libido levels', 'Complementary—one's kinks match other's desires').",
        ),

      establishedActivities: z
        .array(z.string())
        .optional()
        .describe(
          "Sexual activities they've engaged in together (e.g., 'Oral sex', 'Bondage', 'Penetrative sex', 'Orgasm denial').",
        ),

      unexploredTensions: z
        .array(z.string())
        .optional()
        .describe(
          "Sexual tensions or desires that haven't been acted on yet (e.g., 'A wants to try dominance reversal', 'Unspoken interest in adding third party').",
        ),

      sexualHistory: z
        .array(z.string())
        .optional()
        .describe(
          "Array of eroticEncounter IDs from NarrativeLog that involve these two characters. References the detailed encounter records in the narrative log.",
        ),

      exclusivity: z
        .string()
        .optional()
        .describe(
          "Status of sexual exclusivity (e.g., 'Monogamous', 'Open', 'One-sided expectation', 'Undefined').",
        ),
    })
    .optional()
    .describe("Track sexual dynamics if this is an erotic relationship."),

  interactionPatterns: z
    .array(
      z.object({
        context: z
          .string()
          .describe(
            "Type of interaction (e.g., 'Sexual encounters', 'Public settings', 'Private conversations').",
          ),
        typicalBehavior: z
          .string()
          .describe("How they usually behave in this context."),
        exceptions: z
          .array(
            z.object({
              chapter: z.number(),
              deviation: z.string(),
            }),
          )
          .optional(),
      }),
    )
    .optional()
    .describe("Recurring behavioral patterns in different contexts."),

  communicationStyle: z
    .object({
      dominant: z
        .string()
        .optional()
        .describe("How the dominant party typically speaks/acts."),
      submissive: z
        .string()
        .optional()
        .describe("How the submissive party typically responds."),
      keyPhrases: z
        .array(
          z.object({
            speaker: z.string().describe("Character ID of the speaker."),
            phrase: z.string(),
            function: z
              .string()
              .describe("What this phrase typically accomplishes."),
          }),
        )
        .optional()
        .describe("Recurring dialogue patterns."),
    })
    .optional()
    .describe("Communication patterns between participants."),

  boundaryTesting: z
    .object({
      frequency: z.enum([
        "Never",
        "Rare",
        "Occasional",
        "Frequent",
        "Constant",
      ]),
      submissivePushback: z
        .array(z.string())
        .describe("Ways the submissive tries to resist or negotiate."),
      dominantResponse: z
        .array(z.string())
        .describe("How the dominant typically handles resistance."),
    })
    .optional()
    .describe("Track boundary testing and negotiation patterns."),

  evolutionTrajectory: z
    .string()
    .optional()
    .describe("How this dynamic has changed over analyzed chapters."),

  // ============================================
  // NARRATIVE PLANNING
  // ============================================

  futureProjection: z
    .string()
    .optional()
    .describe(
      "Where this relationship seems to be heading based on current trajectory (e.g., 'Moving toward romantic commitment', 'Likely to explode into confrontation', 'Gradual dissolution', 'Deepening obsession').",
    ),

  narrativePotential: z
    .array(z.string())
    .optional()
    .describe(
      "Story opportunities this relationship creates (e.g., 'Betrayal when secret revealed', 'Alliance against common enemy', 'Jealousy from third party').",
    ),

  unresolved: z
    .array(z.string())
    .optional()
    .describe(
      "Open questions or tensions that need resolution (e.g., 'A doesn't know B is married', 'Power imbalance unsustainable long-term', 'Mutual attraction unacknowledged').",
    ),
});

// ---------------------------------------------------------
// 3. NARRATIVE LOG (The Plot Engine)
// ---------------------------------------------------------
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
        id: StableId,

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

  narratorNotes: z
    .array(z.string())
    .optional()
    .describe(
      "Meta-observations about writing craft, genre conventions followed/subverted, or structural choices.",
    ),

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
    compulsionEvents: z.array(
      z.object({
        type: z.enum([
          "New Trigger",
          "Trigger Used",
          "Resistance Change",
          "Session Started",
          "Session Ended",
        ]),
        details: z.string(),
      }),
    ),
  }),
});

// ---------------------------------------------------------
// 4. MASTER DOCUMENT
// ---------------------------------------------------------
export const MasterStoryDocumentSchema = z.object({
  meta: z.object({
    storyTitle: z
      .string()
      .describe("Title of the story as established or inferred."),

    author: z.string().optional().describe("Author name if known."),

    genre: z
      .string()
      .describe(
        "Detected primary genre (e.g., 'Dark Fantasy Erotica', 'Cyberpunk Romance', 'Contemporary BDSM Drama', 'Supernatural Thriller'). Can be compound.",
      ),

    subgenres: z
      .array(z.string())
      .optional()
      .describe(
        "Additional genre elements (e.g., 'Mystery', 'Political Intrigue', 'Slow Burn').",
      ),

    narrativeTone: z
      .string()
      .describe(
        "Overall tonal quality (e.g., 'Dark and psychologically intense', 'Playful and sex-positive', 'Gritty and realistic', 'Romantic with edge of danger').",
      ),

    centralThemes: z
      .array(z.string())
      .describe(
        "Major thematic concerns explored (e.g., 'Power and consent', 'Identity and authenticity', 'Trauma and healing', 'Corruption of innocence', 'Freedom vs. security').",
      ),

    contentWarnings: z
      .array(z.string())
      .optional()
      .describe(
        "Sensitive content that appears in the story (e.g., 'Non-consent', 'Violence', 'Substance abuse', 'Emotional abuse', 'Dubious consent').",
      ),

    lastAnalyzedChapter: z
      .number()
      .describe("Most recent chapter number processed."),

    totalChaptersAnalyzed: z
      .number()
      .describe("Count of chapters in the narrative log."),

    analysisVersion: z
      .string()
      .optional()
      .describe("Version of the analysis schema used, for future migrations."),

    writingStyleProfile: WritingStyleProfileSchema,
  }),

  globalPlotState: z.object({
    mainConflict: z
      .string()
      .describe(
        "The central conflict driving the overall narrative (e.g., 'Protagonist must expose corporate conspiracy while navigating dangerous attraction to suspect', 'Character must escape magical enslavement without losing herself').",
      ),

    stakes: z
      .string()
      .describe(
        "What is at risk if the protagonist fails? What will be lost? Be concrete (e.g., 'Her life and the lives of 200 employees', 'His soul—literal magical consumption', 'Her career, reputation, and freedom').",
      ),

    tensionLevel: z
      .number()
      .min(0)
      .max(10)
      .describe(
        "Current overall story tension. 0 = Resolved/peaceful, 10 = Maximum crisis.",
      ),

    currentPhase: z
      .enum([
        "Setup/Introduction",
        "Rising Action",
        "Complication",
        "Midpoint Shift",
        "Escalation",
        "Crisis",
        "Climax",
        "Falling Action",
        "Resolution",
        "Denouement",
      ])
      .optional()
      .describe("Where the story is in overall narrative structure."),

    subplots: z
      .array(
        z.object({
          id: StableId,
          name: z.string().describe("Title or description of subplot."),
          status: z.enum(["Active", "Paused", "Resolved", "Abandoned"]),
          keyCharacters: z.array(z.string()).describe("Primary participants."),
          summary: z.string().describe("What this subplot is about."),
          connection: z
            .string()
            .describe("How this subplot relates to main plot or themes."),
          introducedInChapter: z.number(),
          resolvedInChapter: z.number().optional(),
        }),
      )
      .optional()
      .describe("Secondary narrative threads running parallel to main plot."),

    propheciesAndPredictions: z
      .array(
        z.object({
          prediction: z.string(),
          source: z
            .string()
            .describe("Who made this prediction or where it came from."),
          chapter: z.number(),
          fulfilled: z
            .boolean()
            .optional()
            .describe("Whether the prediction has come to pass."),
          fulfillmentDetails: z.string().optional(),
        }),
      )
      .optional()
      .describe("Track prophecies, predictions, or foreshadowed events."),
  }),

  characters: z
    .array(CharacterAnalysisSchema)
    .describe(
      "Complete character database. Each significant character should have an entry.",
    ),
  relationships: z
    .array(RelationshipSchema)
    .describe("All relationships in the story."),

  worldContext: WorldContextSchema,

  narrativeLog: z
    .array(NarrativeLogSchema)
    .describe("Chronological chapter-by-chapter record of story events."),

  foreshadowing: z
    .array(
      z.object({
        introducedInChapter: z.number(),

        hint: z
          .string()
          .describe(
            "The specific foreshadowing element (e.g., 'A mentions she hasn't seen her sister in months—unusual for them', 'Camera lingers on locked drawer', 'B's hand trembles when touching weapon').",
          ),

        subtlety: z
          .enum(["Obvious", "Moderate", "Subtle", "Buried"])
          .describe(
            "How noticeable this hint is. 'Buried' = only clear on reread.",
          ),

        potentialPayoff: z
          .string()
          .describe(
            "What this might be setting up (e.g., 'Sister is dead/missing', 'Drawer contains evidence of crime', 'B has trauma related to violence').",
          ),

        payoffChapter: z
          .number()
          .optional()
          .describe("If already resolved, which chapter paid this off."),

        payoffDescription: z
          .string()
          .optional()
          .describe("How the foreshadowing was resolved."),
      }),
    )
    .optional()
    .describe(
      "Elements planted for future payoff. Track both unresolved and resolved foreshadowing.",
    ),

  storyBible: z
    .object({
      establishedFacts: z
        .array(
          z.object({
            fact: z.string(),
            establishedInChapter: z.number(),
            category: z.enum([
              "Character",
              "World",
              "Plot",
              "Relationship",
              "Other",
            ]),
          }),
        )
        .describe(
          "Canon facts that must remain consistent (e.g., 'A has brown eyes', 'Magic requires verbal incantation', 'B and C are siblings').",
        ),

      continuityNotes: z
        .array(z.string())
        .describe(
          "Important consistency tracking (e.g., 'Character A's car was destroyed in Ch. 3—cannot reappear', 'Timeline: Story begins Monday, currently Thursday evening').",
        ),
    })
    .describe("Consistency tracking for future continuation."),

  writerGuidance: z
    .object({
      strengthsDetected: z
        .array(z.string())
        .optional()
        .describe(
          "What this story does well (e.g., 'Compelling power dynamics', 'Rich world-building', 'Complex character psychology', 'Erotic tension building').",
        ),

      areasForDevelopment: z
        .array(z.string())
        .optional()
        .describe(
          "Potential improvements (e.g., 'Some plot beats feel rushed', 'Character B underdeveloped compared to A', 'Pacing slows in middle chapters').",
        ),

      genreConventions: z
        .array(
          z.object({
            convention: z.string(),
            adherence: z.enum(["Follows", "Subverts", "Ignores"]),
            effect: z.string().optional(),
          }),
        )
        .optional()
        .describe("How the story engages with genre expectations."),
    })
    .optional()
    .describe("Meta-analysis for the author or continuation AI."),

  eroticEncounterTemplates: z.array(EroticEncounterTemplateSchema),
  historicalContext: HistoricalContextSchema,

  validationMetadata: z.object({
    allCharacterIds: z.array(z.string()),
    allLocationIds: z.array(z.string()),
    allRelationshipIds: z.array(z.string()),
    allWorldConceptIds: z.array(z.string()),
    allSubPlotIds: z.array(z.string()),
    allOpenQuestionIds: z.array(z.string()),
    allResolvedQuestionIds: z.array(z.string()),
    orphanedReferences: z.array(
      z.object({
        field: z.string(),
        referencedId: z.string(),
        issue: z.string(),
      }),
    ),
  }),
});

export const scoreSchema = z.object({
  value: z
    .number()
    .describe(
      "The score out of 100 that describes how well the analysis reflected the story.",
    ),
  rationale: z.string().describe("The rationale for the score."),
});

export type MasterStoryDocument = z.infer<typeof MasterStoryDocumentSchema>;
export type CharacterSheet = z.infer<typeof CharacterAnalysisSchema>;
export type ChapterOutline = z.infer<typeof NarrativeLogSchema>;
export type Score = z.infer<typeof scoreSchema>;
