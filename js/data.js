/* =========================================================
   THE TREE
   Node types: 'q' (question), 'step' (do this, then continue),
               'end' (verdict). Every option may carry a
               'judgement' string — a call no tool made for you.
   Options and steps may also carry an image reference (thumb,
   or the larger `image` block) pointing at files in /images.
   ========================================================= */

var START = "start";

var NODES = {

  start: {
    type: "q",
    eyebrow: "Question 1 — why are we looking?",
    q: "Have you seen something or told that something is wrong?",
    why: "This is the first step because if someone has told you something is wrong that could be a breach in planning or licensing law. There are different 'types' of breach in law, and they are not the same story: doing it without permission, and doing it differently from the permission you hold.",
    options: [
      { label: "Yes — someone says the rules are being broken", note: "Unauthorised works, a build that doesn't match the drawings, ignored conditions, trading outside permitted hours.", to: "breach_which" },
      { label: "No — this is a proposal, application or decision", note: "Something going through the system rather than round it and it could be interesting.", to: "notice" }
    ],
    bookRef: "If you have a copy of Morrison's Essential Public Affairs for journalists, the chapters on Planning policy and Environmental protection and Transport, environment, leisure and culture are the most relevant."
  },

  notice: {
    type: "q",
    eyebrow: "Question 2 — where the lead came from",
    q: "Have you actually seen a physical notice — lamppost, hoarding, shop window?",
    why: "A notice in the street is a common starting point for a story! It gives you a document to read and valuable information to move forward. Without one you are searching speculatively, which is a different route.",
    options: [
      { label: "Yes — I'm standing in front of one", note: "Photograph it, including the small print and the dates.", to: "colour" },
      { label: "No — I'm searching speculatively", note: "Nothing physical yet. I've heard a rumour or think there should be one!", to: "which" }
    ]
  },

  colour: {
    type: "q",
    eyebrow: "Question 3 — reading the notice",
    q: "What colour is it?",
    why: "Colour is the fastest reliable way to see what the notice is about. Pale blue means licensing - that colour is required as a matter of law. Everything else probably means it's related to planning. But you should check the wording rather than trusting the paper.",
    options: [
      {
        label: "Pale blue",
        note: "Legally mandated colour (and size) under the Licensing Act 2003, displayed for 28 consecutive days. Check that date",
        thumb: "images/licensing-notice-example.jpg",
        to: "lic_notice"
      },
      {
        label: "White, yellow or something else",
        note: "Common practice, not a legal colour requirement — so confirm from the wording, not the colour.",
        thumb: "images/planning-notice-example.jpg",
        to: "plan_notice",
        judgement: "You read the notice and decided what it actually was. Colour narrowed it; the wording settled it. You checked the dates to make sure it was in scope"
      }
    ],
    bookRef: "Morrison has more on the Licensing Act 2003 in Section 17.3.5 'The licensing of pubs and clubs, and drinking by-laws?' (9th Edition)"
  },

  /* ---------- licensing, from a notice ---------- */
  lic_notice: {
    type: "step",
    eyebrow: "Licensing notice",
    q: "Take the details off the notice before you walk away",
    body: "A licensing notice covers a wide range of business activities, but the physical notice gives you the specifics: what they want to do, the applicant's name, and the strict deadline for public objections (representations). Always check which council issued it—licensing is administered borough by borough, and you may have wandered off patch. Finally, check the format. By law, premises licence notices must be printed on pale blue A4 paper. If it’s white, the licensing authority may treat the publicity requirement as unmet — which can mean the application is invalid and has to be re-advertised, restarting the clock on the 28-day representation period.",
    image: {
      src: "images/licensing-notice-example.jpg",
      alt: "A pale blue Licensing Act 2003 public notice taped inside a pub window, giving the applicant, the premises, the activities applied for and the deadline for representations.",
      caption: "Pale blue, Licensing Act 2003 — the colour and size are a legal requirement, not whatever was on the printer!"
    },
    capture: [
      { key: "premises", label: "Premises name and address" },
      { key: "borough", label: "Council" },
      { key: "repdate", label: "Deadline for representations (from the notice)" }
    ],
    to: "lic_type",
    bookRef: "Take a look at the following <a href=\"https://www.local.gov.uk/publications/licensing-act-2003-councillors-handbook-england-and-wales-0\">Licensing Act 2003: Councillors' Handbook (England and Wales)</a>"
  },

  lic_type: {
    type: "q",
    eyebrow: "Licensing",
    q: "Is it marked as an application, a variation, or a review?",
    why: "The exact term on the notice is critical for judging the value of the story. For example, a 'Review' guarantees conflict—under the Licensing Act 2003, this means a 'responsible authority' (like the police) or local residents have already formally complained about the venue. Whatever the application type, your next immediate step is to research the names and businesses involved. Run them through local media archives and search engines to see if a backstory already exists. You are looking for previous noise complaints, crime incidents, or a history of neighbourhood tensions. Add anything you find to your notebook.",
    options: [
      { label: "Review", note: "Somebody with standing (usually the police, environmental health, or local residents) has asked for the licence to be reconsidered.", to: "money_lic" },
      { label: "Variation", note: "An existing licence being changed — hours, capacity, layout, conditions.", to: "lic_variation" },
      { label: "New application", note: "A new premises licence being sought.", to: "lic_calendar" }
    ]
  },

  lic_calendar: {
    type: "step",
    eyebrow: "Licensing — no shortcut",
    body: "Open that councils own committee calendar and find the licensing sub-committee or hearing panel. No aggregator exists for licensing, so this can be a council-by-council crawl. Agenda papers normally appear on the meeting page ahead of the hearing rather than on the day.",
    q: "Find the hearing on the borough's committee calendar",
    capture: [{ key: "hearing", label: "Hearing date, if listed" }],
    to: "lic_scheduled"
  },

  lic_objections: {
    type: "q",
    eyebrow: "Licensing",
    q: "Are there objections on the agenda — police, environmental health, or resident representations?",
    why: "An uncontested application is paperwork. A contested one has named parties (people you can speak to), a hearing (activity you can report on), and different perspectives to consider. ",
    options: [
      { label: "Yes — representations have been lodged", note: "The papers will usually name who objected and on what grounds.", to: "money_lic" },
      { label: "No, or the papers aren't up yet", note: "Nothing to hang a story on today.", to: "lic_diarise", judgement: "You decided 'no objections yet' rather than 'no story ever'. Those are different, and only the diary tells them apart." }
    ]
  },

  lic_variation: {
    type: "end",
    kind: "routine",
    title: "Medium potential — worth a bit more digging",
    lead: "A variation is only interesting if you know what is changing and why. Longer hours, bigger capacity and outdoor areas are the ones that generate residential opposition.",
    actions: [
      "Get the current licence and the proposed one and compare the conditions line by line.",
      "Ask the licensing team whether this premises has a history — previous representations, warnings, review applications.",
      "Look at previous coverage, speak to residents' association or the ward councillors and ask if anyone has noticed."
    ],
    tail: "If it has history, it stops being a story about the variation and becomes more about possible patterns in submissions like this.",
    bookRef: ""
  },

  money_lic: {
    type: "step",
    eyebrow: "Before you write it — who is this?",
    q: "Check who's actually behind the premises",
    body: "The name on the licence is a person, but the money behind a premises is often a company, and that's the part worth ten minutes on Companies House before you ring anyone. Run the licensee and any named directors: are they still active on this company, do they have other dissolved companies (phoenixing — the same operator closing one company and opening an identical one to shed debts or a bad record is a pattern worth knowing before the interview, not after), and does the registered address match the premises or somewhere else entirely. Not every premises has a company behind it — plenty are sole traders, in which case there's nothing to search and that's fine.",
    capture: [{ key: "directors", label: "Directors / company name found, if any" }],
    to: "lic_story",
    bookRef: "Companies House's free search (find-and-update.company-information.service.gov.uk) covers UK-registered companies only. For guidance on reading a filing history and spotting dissolved-and-reopened patterns, see the Companies House 'Life of a company' guidance series on Gov.uk."
  },

  lic_story: {
    type: "end",
    kind: "story",
    title: "This could be an interesting licensing story",
    lead: "Reviews and contested applications exist because somebody with standing has said the premises are the cause of or risk creating a problem; crime, disorder, underage sales, noise, public nuisance. The complaint is already documented and the parties are already identified.",
    actions: [
      "Council licensing team — ask for the review application and the supporting papers.",
      "Police licensing unit — are they the applicant, or have they made a representation?",
      "Environmental health, if noise or nuisance is in the grounds.",
      "The people who objected — their evidence is usually more vivid than the paperwork.",
      "The licensee, always. They have a right of reply and they will have a version you haven't heard.",
      "Check the agenda page for whether the hearing is open to the public, and go if it is."
    ],
    tail: "The decision is only half of it. Who, what and why are the story.",
    bookRef: ""
  },

  lic_diarise: {
    type: "end",
    kind: "routine",
    title: "Routine for now — keep digging for a little bit but the main action is to put it in the diary ",
    lead: "Nothing to write today. Revisit when the time is right.",
    actions: [
      "Put the deadline for representations and the hearing date if you have one in your diary.",
      "Set a second reminder a few days before the hearing, when the agenda papers usually go up.",
      "If the premises is in an area with form — late-night economy, student housing, a residents' group that campaigns — flag it to whoever covers that."
    ],
    bookRef: ""
  },

  /* ---------- planning, from a notice ---------- */
  plan_notice: {
    type: "step",
    eyebrow: "Planning notice",
    q: "Take the reference number before you walk away",
    body: "The application reference is the key to everything else. Without it you are searching a portal by address and hoping. Note the comment deadline too — the statutory minimum display and comment period is 21 days, but it varies by council and application type.",
    image: {
      src: "images/planning-notice-example.jpg",
      alt: "A white planning site notice cable-tied to a lamppost, giving the application number, the proposal, the consultation period and the case officer's details.",
      caption: "The notice will look something like this. There's no mandated colour, but it will usually be white."
    },
    capture: [
      { key: "ref", label: "Application reference number" },
      { key: "site", label: "Site address" },
      { key: "deadline", label: "Comment deadline on the notice" }
    ],
    to: "plan_lookup",
    bookRef: ""
  },

  plan_lookup: {
    type: "step",
    eyebrow: "Planning",
    q: "Look the reference up",
    body: "Try <a href=\"https://www.planningalerts.app\" target=\"_blank\" rel=\"noopener\">PlanningAlerts.app</a> first. It's free, but there may be gaps. For example, it covers nine out of ten of Greater Manchester's councils (sorry Salford reporters!). Armed with more details, you should also visit the council's planning portal to look at documentation.",
    to: "plan_contentious",
    bookRef: ""
  },

  plan_contentious: {
    type: "q",
    eyebrow: "Planning — the judgement call",
    q: "Is it contentious?",
    why: "Look for red flags: height, greenbelt, heritage, scale, loss of trees/parking, or visible local objection. No portal will answer this for you. It is a reporting judgement about a place you are supposed to know.",
    options: [
      { label: "Yes — one of those applies", note: "Or the comments section is already filling up.", to: "money_plan", judgement: "You judged this contentious. No field in any database says 'contentious' — you decided it, and you should be able to say why." },
      { label: "No — it's routine", note: "Householder extensions, signage, changes of use nobody minds.", to: "appeal_q", judgement: "You judged this routine. Worth being honest that 'routine' sometimes means 'nobody has noticed yet'." }
    ],
    bookRef: "Morrison has some useful context on some of the issues in the section \"Other issues affecting major developments\" 14.3 in the 9th Edition."
  },

  money_plan: {
    type: "step",
    eyebrow: "Before you write it — who is this?",
    q: "Check who's actually behind the application",
    body: "The 'applicant' named on a planning application is very often just the planning agent — the architect or consultant who submitted it — not the person or company who will own or benefit from the development. Run the applicant and agent through Companies House: active directorships, dissolved companies at the same address, and any pattern of a company being closed and reopened under a new name (phoenixing). Then check the Land Registry for who actually owns the site — the price paid, and the registered owner, are often the more revealing document than the application itself. If the owner is an overseas entity, standard title search won't show a beneficial owner; you need the Register of Overseas Entities instead.",
    capture: [{ key: "owner", label: "Site owner / applicant company found, if any" }],
    to: "plan_story",
    bookRef: "Companies House's free search (find-and-update.company-information.service.gov.uk) covers UK-registered companies. HM Land Registry title data can be bought cheaply per title. For overseas-owned land, see the Register of Overseas Entities, introduced by the Economic Crime (Transparency and Enforcement) Act 2022."
  },

  plan_story: {
    type: "end",
    kind: "story",
    title: "This is the planning story",
    lead: "A contested application comes with a paper trail and named participants on both sides. Most of the reporting is already written down somewhere — your job is to read it and then ring people.",
    actions: [
      "The planning officer's report and recommendation. Where the committee departs from it, that gap is the story.",
      "Ward councillor — and check whether they have called the application in.",
      "Objectors and the objection letters, which are usually public on the portal.",
      "The developer or their agent, for the design and access statement and a comment.",
      "Cross-check designations on <a href=\"https://www.planning.data.gov.uk\" target=\"_blank\" rel=\"noopener\">planning.data.gov.uk</a> — listed building, conservation area, greenbelt, flood risk.",
      "Check whether a similar scheme on this site, or by the same applicant, was previously refused and taken to appeal — that's usable precedent either way.",
      "The committee date, and whether the meeting is webcast."
    ],
    tail: "Two dates matter: the comment deadline, and the committee meeting. Miss the first and your readers cannot act on the story.",
    bookRef: ""
  },

  plan_filler: {
    type: "end",
    kind: "routine",
    title: "Filler at best",
    lead: "Note it and move on. It becomes a story only if the objections arrive or the site turns out to have history.",
    actions: [
      "Note the case officer's name and the comment deadline.",
      "Make a note in your diary to check just before the deadline to see whether objections landed.",
      "If it is one of several similar applications in the same ward, the pattern is the story, not the application."
    ],
    bookRef: ""
  },

  /* ---------- speculative search ---------- */
  which: {
    type: "q",
    eyebrow: "Speculative search",
    q: "Planning or licensing?",
    why: "The tooling is completely different. Planning has aggregators. Licensing has none.",
    options: [
      { label: "Planning", note: "Applications, appeals, designations.", to: "plan_alerts" },
      { label: "Licensing", note: "Premises licences, variations, reviews.", to: "lic_crawl" }
    ],
    bookRef: ""
  },

  plan_alerts: {
    type: "step",
    eyebrow: "Planning",
    q: "Set a postcode or ward alert",
    body: "<a href=\"https://www.planningalerts.app\" target=\"_blank\" rel=\"noopener\">PlanningAlerts.app</a> lets you browse or subscribe by postcode or ward, free. It covers 9 of the 10 Greater Manchester boroughs — not Salford, which needs its own portal. Alerts are the only version of this that works on a slow week, because they arrive whether or not you remember to look.",
    capture: [{ key: "patch", label: "Postcode or ward you're watching" }],
    to: "plan_flagged",
    bookRef: "It may also be worth checking <a href=\"https://www.planningportal.co.uk/planning/planning-applications/consent-types/introduction\">The Planning Portal: Introduction to Consent Types</a> to get background on what you need planning consent for."
  },

  plan_flagged: {
    type: "q",
    eyebrow: "Planning",
    q: "Anything in the list that looks large-scale or controversial?",
    why: "You are scanning descriptions written by planners for planners. The signal is usually in the numbers — units, storeys, hectares — not the adjectives.\n\nSome applications cross the strict legal threshold into Major Development (e.g., 10+ homes or large commercial spaces). This triggers a completely different set of rules. It demands greater scrutiny, mandatory reports from statutory bodies like Highways or the Environment Agency, and almost guarantees the final decision will be debated in public by a planning committee.",
    options: [
      { label: "Yes — something stands out", note: "Scale, sensitive location, or a familiar objector name.", to: "plan_designations", judgement: "You spotted it in a list that gave you no help. That is local knowledge doing the work, not the search." },
      { label: "No — nothing obvious", note: "Which may just mean nothing has been submitted yet.", to: "appeal_q" }
    ],
    bookRef: ""
  },

  plan_designations: {
    type: "step",
    eyebrow: "Planning",
    q: "Cross-check the designations",
    body: "<a href=\"https://www.planning.data.gov.uk\" target=\"_blank\" rel=\"noopener\">planning.data.gov.uk</a> will confirm listed building, conservation area, greenbelt and flood-risk status for the site. It does not track live applications, appeals or licensing — it is for verifying what the site <em>is</em>, not what is happening to it.",
    to: "plan_story",
    bookRef: "See Morrison, Chapter 14 for the strict definitions of Conservation Areas, Listed Buildings, and Green Belt protections. Alternatively, you can search the National Heritage List for England (NHLE) directly via Historic England."
  },

  appeal_q: {
    type: "q",
    eyebrow: "Planning",
    q: "Is there something refused or enforced against, where you are chasing the appeal?",
    why: "Refusals and enforcement notices that go to appeal both produce a full written decision by an inspector — a free, quotable, on-the-record document with reasoning in it. But they're different instruments with different deadlines, so it's worth knowing which one you're chasing before you search.",
    options: [
      { label: "Yes — an application was refused and it's on appeal", note: "Or looking for precedent that a similar scheme was allowed.", to: "appeal_search" },
      { label: "Yes — an enforcement notice is being appealed", note: "A different route (section 174, not section 78) but the same Inspectorate and the same kind of written decision.", to: "appeal_search" },
      { label: "No", note: "Nothing live and nothing refused or enforced against.", to: "plan_filler" }
    ],
    bookRef: "Morrison outlines the role of the Planning Inspectorate (PINS) and the appeal process in Chapter 14. Appeals are vital for reporters because they take the decision out of the hands of local councillors and rely purely on planning law."
  },

  appeal_search: {
    type: "step",
    eyebrow: "Planning — appeals",
    q: "Search the appeal decisions",
    body: "<a href=\"https://www.planningprecedent.co.uk\" target=\"_blank\" rel=\"noopener\">planningprecedent.co.uk</a> gives free full-text search of every England appeal decision, no login. The Planning Inspectorate's own Appeals Casework Portal is the official source but needs a case reference. Full-text search is the useful one for finding precedent by wording rather than by case number. Note whether this is a section 78 appeal (against a refusal) or a section 174 appeal (against an enforcement notice) — the reference format and the deadline for lodging differ, though the search and the procedure once it's live are the same.",
    capture: [{ key: "appeal", label: "Appeal or case reference" }],
    to: "appeal_story",
    bookRef: "While Morrison covers the theory, the most practical overview of how developers actually file these appeals is the <a href='https://www.gov.uk/appeal-planning-decision' target='_blank' rel='noopener'>Gov.uk Planning Inspectorate guide</a>."
  },

  appeal_story: {
    type: "end",
    kind: "story",
    title: "This is an appeal story — and the council no longer controls it",
    lead: "Once a case is at appeal, there is no committee meeting to watch for and no councillor to lobby. The decision rests entirely with a Planning Inspector, working from the original application, the refusal or enforcement notice, and whatever is submitted during the appeal itself. That changes what you should be chasing.",
    actions: [
      "Find the appeal start date on the Planning Inspectorate's Appeals Casework Portal — or ask the council for the start letter if it isn't public yet.",
      "Establish the procedure: written representations, an informal hearing, or a public inquiry. Each has a different timescale and a different opportunity for you or residents to take part — check which on the portal rather than assuming.",
      "Find the deadline for third-party comments on the case itself. These go to the Planning Inspectorate now, not the council, and a comment already made to the council during the original application is not automatically resubmitted to the Inspectorate.",
      "Re-read the original refusal reasons or enforcement notice grounds — the inspector engages directly with these, so they remain the best guide to what's actually contested.",
      "Contact the appellant (or their agent) and the original objectors. Both sides often restate their case at appeal, sometimes with new evidence that wasn't before the council.",
      "If it's a public inquiry, these are rare — reserved for the largest or most contested schemes — and worth attending in person. Check the venue and date on the portal."
    ],
    tail: "A council decision can be revisited by committee or challenged politically. An inspector's decision can only be challenged through the High Court, on a point of law. That's a much higher bar, and it's why an appeal story carries more finality than most planning stories.",
    bookRef: "See the Planning Inspectorate's 'Procedural Guide: planning appeals — England' on Gov.uk for the current written representations, hearing and inquiry timescales — these have changed before, so check the current version rather than relying on a remembered figure."
  },

  lic_crawl: {
    type: "step",
    eyebrow: "Licensing — no shortcut",
    q: "Crawl the boroughs one at a time",
    body: "There is no aggregator for licensing. Go to democracy.&lt;council&gt;.gov.uk or the borough's Modern.gov calendar and look for the licensing sub-committee or hearing panel. Ten boroughs, ten calendars. Bookmark all ten once and this becomes a ten-minute job rather than an afternoon.",
    capture: [
      { key: "premises", label: "Premises name or address, if you have one" },
      { key: "borough", label: "Borough you're checking" }
    ],
    to: "lic_scheduled",
    bookRef: "For a refresher on how council sub-committees and hearing panels operate, review Morrison's early chapters on local government structures. Licensing panels are quasi-judicial, meaning they operate strictly on evidence, not just political opinion."
  },

  lic_scheduled: {
    type: "q",
    eyebrow: "Licensing",
    q: "Is a sub-committee or hearing panel scheduled this week?",
    why: "Hearings only get scheduled when something is contested. The existence of a hearing is itself the signal.",
    options: [
      { label: "Yes", note: "Open the agenda and read the papers.", to: "lic_objections" },
      { label: "No", note: "Quiet week in that borough.", to: "lic_diarise" }
    ],
    bookRef: "Morrison covers the mechanics of licensing in his chapters on leisure and environmental protection (usually Chapter 17). A scheduled hearing means the negotiation failed, and the dispute is now public."
  },

  /* ---------- the dead end that isn't ---------- */
  breach_which: {
    type: "q",
    eyebrow: "Suspected breach",
    q: "Planning or licensing?",
    why: "Each has its own processes, different documents, different phone numbers. Both are enforced by the council, but beyond that, they don't have much in common.",
    options: [
      { label: "Planning", note: "Building works, extensions, change of use, signage, site operations.", to: "breach_history" },
      { label: "Licensing", note: "Hours, noise, capacity, door staff, alcohol sales, market and street trading, outdoor areas.", to: "lic_conditions" }
    ],
  },

  breach_history: {
    type: "step",
    eyebrow: "Planning breach — do this before anything else",
    q: "Find out what, if anything, was actually permitted",
    body: "Section 171A of the Town and Country Planning Act 1990 defines a breach two ways: development carried out <em>without</em> the required permission, or failing to comply with a condition or limitation attached to a permission that was granted. Those are different stories. A two-storey extension where one storey was approved is not the same allegation as a build with no permission at all — the first has a decision notice and approved drawings you can put alongside a photograph, the second has nothing on file to compare against. So search the address on the borough's planning portal, or <a href=\"https://www.planningalerts.app\" target=\"_blank\" rel=\"noopener\">PlanningAlerts.app</a>, and pull the decision notice, the approved drawings and the full condition list before you ring anyone.",
    capture: [
      { key: "site", label: "Site address" },
      { key: "ref", label: "Reference of any permission you find" },
      { key: "permitted", label: "What the permission actually allowed" }
    ],
    to: "breach_compare",
    bookRef: "See Morrison’s section on Planning Control and Enforcement in Chapter 14. It explains the legal weight of planning conditions, which is exactly the baseline you are trying to establish before reporting a breach."
  },

  breach_compare: {
    type: "q",
    eyebrow: "Planning breach",
    q: "Put the approved drawings next to what's on the ground. What do you have?",
    why: "This comparison is the entire reporting task on this branch. Everything downstream depends on which of these three you are actually looking at.",
    options: [
      {
        label: "A permission exists, and what's being built departs from it",
        note: "Extra storey, bigger footprint, different use, different materials.",
        to: "money_breach",
        judgement: "You compared a drawing to a building and decided they differ. That is a judgement — and the developer's answer will be that you misread the drawing, so be sure."
      },
      {
        label: "A permission exists, and the building matches it",
        note: "The structure is as approved — but that is not the end of it.",
        to: "breach_conditions_end"
      },
      {
        label: "Nothing on the portal at all",
        note: "No application, no decision notice, no history.",
        to: "breach_none",
        judgement: "You searched and found nothing. Absence of a record is not evidence of wrongdoing, and treating it as such is the most common way this story goes wrong."
      }
    ],
    bookRef: "Textbooks won't teach you how to read architectural plans, but Chapter 14 of Morrison reinforces why these approved documents are legally binding. If you need a refresher on site plans, the <a href='https://www.planningportal.co.uk/' target='_blank' rel='noopener'>Planning Portal</a> has good plain-English guides."
  },

  money_breach: {
    type: "step",
    eyebrow: "Before you write it — who is this?",
    q: "Check who's actually behind the site",
    body: "The owner on the ground and the applicant on the original permission may not be the same entity — sites change hands, and the current owner may not be who you're picturing. Check HM Land Registry for the current registered proprietor, then run that name (and the original applicant, if different) through Companies House: active directorships, dissolved companies at the same address, and any phoenixing pattern. If the registered proprietor is an overseas entity, standard title data won't show a beneficial owner — check the Register of Overseas Entities instead.",
    capture: [{ key: "owner", label: "Site owner / company found, if any" }],
    to: "breach_departure",
    bookRef: "HM Land Registry title data can be bought cheaply per title. Companies House's free search covers UK-registered companies only. For overseas-owned land, see the Register of Overseas Entities, introduced by the Economic Crime (Transparency and Enforcement) Act 2022."
  },

  breach_departure: {
    type: "end",
    kind: "story",
    title: "Departure from an approved permission — the strongest version of this story",
    lead: "This is the one you can actually evidence. The approved drawings are public, the decision notice is public, and the difference is photographable. You are not asking readers to take a neighbour's word for it.",
    actions: [
      "Download the decision notice, the approved drawings and the conditions. Note the drawing numbers — the permission is granted by reference to specific numbered plans.",
      "Photograph the site from the same aspect as the approved elevation. Side by side is the whole story.",
      "Check whether a variation was later approved — a section 73 application, or a non-material amendment. Developers often have consent for the change and nobody noticed it go through.",
      "Ring the council's planning enforcement team and ask whether a case is open on the address.",
      "Ask when the works were substantially completed. Enforcement is time-limited: within 10 years where substantial completion took place on or after 25 April 2024, but only 4 years where it took place before that date. 'The council can no longer act' is itself the story.",
      "Put it to the owner or developer, with the drawing number, and give them a real opportunity to respond."
    ],
    tail: "The likeliest innocent explanation is an amendment you haven't found. Rule it out before you publish, not after.",
    bookRef: "Morrison Chapter 14 covers enforcement notices, but a warning: older editions will not reflect the April 2024 changes to the 4-year/10-year immunity rules (brought in by the Levelling-up and Regeneration Act). For the exact legal timelines, always refer to current Gov.uk Planning Practice Guidance."
  },

  breach_conditions_end: {
    type: "end",
    kind: "routine",
    title: "The building matches — so read the conditions, not the drawings",
    lead: "Most planning permissions are granted subject to conditions, and failing to comply with a condition is a breach in law just as much as building without permission. Nothing about the structure looking right tells you the conditions are being met.",
    actions: [
      "Read the full condition list on the decision notice. The ones that get broken are hours of operation, delivery times, landscaping, materials, parking provision, occupancy restrictions and noise limits.",
      "Look for conditions requiring something to be submitted and approved before use begins — a drainage scheme, a management plan. These are quietly ignored more often than anything else.",
      "If a condition is being breached, that is enforceable by a breach of condition notice, which is a different instrument from an enforcement notice. Ask the council which, if either, they have served.",
      "If nothing is being breached, say so and move on. Not every complaint is a story."
    ],
    tail: "Condition breaches are the least glamorous and most reliably true planning stories on any patch.",
    bookRef: "Morrison Chapter 14 outlines the specific enforcement tools local authorities have, including 'stop notices' and 'breach of condition notices'. Understanding the difference between these instruments is vital to accurately reporting what the council is actually doing."
  },

  breach_none: {
    type: "end",
    kind: "human",
    title: "No digital shortcut exists here — and no record is not the same as no permission",
    lead: "Enforcement is not published. No portal, alert or aggregator will confirm or deny that a case is open. But before you treat an empty portal as evidence: plenty of lawful work never appears on it. Permitted development rights allow some works with no application at all, some need only prior approval, and an owner may hold a lawful development certificate confirming what they've done is lawful. Permitted development rights are themselves subject to limits and conditions — and are restricted in conservation areas, on listed buildings and where an Article 4 direction applies — so the question is always which, not whether.",
    actions: [
      "Phone the council's planning enforcement team. Ask whether a case is open on the address, and ask directly whether the works could be permitted development.",
      "If you are told they cannot comment on a live case, that answer still tells you a case exists. Get it in writing.",
      "File an FOI for enforcement notices served on the address and the number of complaints received about it.",
      "Ask the owner whether they hold a lawful development certificate or prior approval. If they do, the story is over — and you have avoided publishing something false.",
      "Talk to whoever complained. They usually have dates, photographs and a case reference the council would not give you.",
      "Establish when the works were finished. Immunity runs to 10 years where substantial completion was on or after 25 April 2024, and 4 years where it was before."
    ],
    tail: "This branch is the reason the flowchart exists. Every tool on the other branches is a way of reading documents somebody chose to publish. This one is reporting.",
    bookRef: "Planning rules do allow for changes without permission. Your source may not know this. See Chapter 15 of Morrison."
  },

  lic_conditions: {
    type: "step",
    eyebrow: "Licensing breach — do this before anything else",
    q: "Get the licence and read its conditions",
    body: "You do not have to ask a press officer for this. Each licensing authority must keep a register of the premises licences it has issued, must make it available for inspection by any person during office hours without payment, and must supply a copy of an entry on request — it may charge a reasonable fee for the copy. So the conditions, the permitted hours and the designated premises supervisor are all obtainable as of right. Get them before you accept anyone's account of what the premises is and is not allowed to do.",
    capture: [
      { key: "premises", label: "Premises name and address" },
      { key: "borough", label: "Borough" },
      { key: "licence", label: "Licence number, if the register gives one" }
    ],
    to: "lic_ten_check",
    bookRef: "For background on what conditions a council can legally apply, revisit Morrison's section on the Licensing Act 2003. You can also look up the Home Office's 'Revised guidance issued under section 182 of the Licensing Act 2003' for the definitive rules on mandatory conditions."
  },

  lic_ten_check: {
    type: "q",
    eyebrow: "Licensing breach — before you judge it",
    q: "Could a Temporary Event Notice cover what you're seeing?",
    why: "A TEN lets a premises trade outside its normal licence conditions for a short period — longer hours, live music, a marquee in the car park — without varying the licence itself. It's the single most common innocent explanation for what looks like a breach, and it's the reason to check now rather than after you've already decided this is a story.",
    options: [
      { label: "There's a TEN on record covering this date", note: "Check the register — TENs sit alongside premises licences and are open to inspection the same way.", to: "lic_notbreach", judgement: "A TEN existing doesn't automatically mean the activity fell within it — check what the notice actually covers before you close this off." },
      { label: "No TEN on record, or it doesn't cover this", note: "Nothing filed for this date, or the TEN doesn't stretch to what's actually happening.", to: "lic_breach_check" }
    ],
    bookRef: "Sections 100–110 of the Licensing Act 2003 cover temporary event notices. The Home Office's section 182 guidance sets out the limits — a fixed number of TENs per year, per premises, and per person."
  },

  lic_breach_check: {
    type: "q",
    eyebrow: "Licensing breach",
    q: "Does what's happening actually depart from the licence?",
    why: "Hours, capacity, door supervision, outdoor drinking areas, live music, off-sales. Compare the complaint to the document rather than to your assumption of what a pub is allowed to do.",
    options: [
      { label: "Yes — it's outside what the licence permits", note: "Trading later, louder, or bigger than the conditions allow.", to: "money_licbreach", judgement: "You read the conditions and decided the premises is outside them. Licence conditions are drafted loosely and licensees read them generously — expect a fight over interpretation." },
      { label: "No, or the licence covers it", note: "The activity is permitted, whatever the neighbours think of it.", to: "lic_notbreach" }
    ],
    bookRef: "Remember the four statutory licensing objectives (prevention of crime, public safety, public nuisance, protection of children). As Morrison notes, any breach you identify usually needs to map directly back to one of these four objectives for the council to take action."
  },

  money_licbreach: {
    type: "step",
    eyebrow: "Before you write it — who is this?",
    q: "Check who's actually behind the premises",
    body: "Same check as anywhere else in this tool a story is about to be written: run the licensee and named directors through Companies House before you put the allegation to them. Look for other active or dissolved companies at the same address, and for a pattern of a company being closed and an identical one opened shortly after (phoenixing) — that context changes how a denial from 'a new operator' should be read.",
    capture: [{ key: "directors", label: "Directors / company name found, if any" }],
    to: "lic_breach",
    bookRef: "Companies House's free search (find-and-update.company-information.service.gov.uk) covers UK-registered companies only — a sole trader won't appear."
  },

  lic_breach: {
    type: "end",
    kind: "story",
    title: "Operating outside the licence",
    lead: "You have a public document and a departure from it. The route from here is that a breach is also the trigger for a review — and a review turns a private complaint into a public hearing with papers anyone can read.",
    actions: [
      "Council licensing enforcement — ask whether the premises has been visited, warned, or had conditions varied.",
      "Police licensing unit — they are a responsible authority and can apply for a review themselves.",
      "Environmental health, where noise or nuisance is involved.",
      "Ask whether a review application has been made, or whether residents are preparing one. That is the moment the story acquires a date, an agenda and named parties.",
      "Put it to the licensee. They have a right of reply and often a document you haven't seen."
    ],
    tail: "The enforcement history is the harder half and usually needs an FOI. The licence itself is free and immediate.",
    bookRef: "See Morrison's sections on licensing for the powers held by 'responsible authorities' (like the police, environmental health, and trading standards). They are the heavy hitters who can initiate a formal review."
  },

  lic_notbreach: {
    type: "end",
    kind: "routine",
    title: "Not a licensing breach — so what is it?",
    lead: "If the licence permits it, the complaint is about something else. That doesn't mean there is no story; it means you were looking in the wrong regime.",
    actions: [
      "Statutory nuisance sits with environmental health, not licensing, and has its own complaint and abatement process.",
      "A change in how the premises is used — restaurant to bar, say — may be a planning matter rather than a licensing one.",
      "If residents are unhappy with a lawfully operating premises, the story may be the licensing policy itself: cumulative impact, saturation, late-night levy.",
      "Diarise it. Repeated complaints about a compliant premises is a pattern, and patterns are where the review applications come from."
    ],
    bookRef: "If the issue is noise, smells, or rubbish rather than a strict licensing breach, Morrison's chapter on Environmental Protection explains the 'statutory nuisance' process governed by the Environmental Protection Act 1990."
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { NODES: NODES, START: START };
}
