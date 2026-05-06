const clone = (value) => JSON.parse(JSON.stringify(value));

const COMPANY_BLUEPRINTS = [
  {
    id: 'google',
    name: 'Google',
    focus: 'Systems & Algorithms focus',
    active: true,
    tags: [
      { label: 'Tier 1', cls: 'tag-tier' },
      { label: 'Elite Difficulty', cls: 'tag-elite' },
    ],
    diff: 'Difficulty Level: Elite',
    stars: 5,
    topics: ['Distributed Systems', 'Graph Algorithms', 'Dynamic Programming', 'Big O Optimization'],
    culture: [
      { title: 'Googliness', desc: 'Show curiosity, collaboration, and calm decision making in ambiguity.' },
      { title: 'Intellectual Humility', desc: 'Explain tradeoffs clearly and be comfortable refining your first answer.' },
      { title: 'Ambiguity', desc: 'Demonstrate that you can bring structure to open-ended technical problems.' },
    ],
    questions: [
      { text: 'Design a global load balancer for a video platform.', type: 'System Design', typeClass: 'qt-sys', seen: 42 },
      { text: 'Given a stream of integers, maintain the running median.', type: 'Coding', typeClass: 'qt-code', seen: 18 },
      { text: 'Tell me about a time you challenged a senior engineer constructively.', type: 'Behavioral', typeClass: 'qt-beh', seen: 65 },
    ],
    cta: 'Includes 3 coding rounds and 1 system design challenge.',
  },
  {
    id: 'amazon',
    name: 'Amazon',
    focus: 'Leadership Principles focus',
    active: false,
    tags: [{ label: 'High Difficulty', cls: 'tag-high' }],
    diff: 'Difficulty Level: High',
    stars: 4,
    topics: ['Leadership Principles', 'System Design', 'Coding', 'Behavioral'],
    culture: [
      { title: 'Customer Obsession', desc: 'Start from user pain and work backwards to the architecture.' },
      { title: 'Ownership', desc: 'Speak like you own the outcome beyond your immediate module.' },
      { title: 'Invent and Simplify', desc: 'Show how you reduce operational or cognitive complexity.' },
    ],
    questions: [
      { text: 'Design a recommendation system for a large marketplace.', type: 'System Design', typeClass: 'qt-sys', seen: 38 },
      { text: 'Tell me about a time you failed and what changed after.', type: 'Behavioral', typeClass: 'qt-beh', seen: 72 },
      { text: 'Find the kth largest element in an array efficiently.', type: 'Coding', typeClass: 'qt-code', seen: 25 },
    ],
    cta: 'Includes Leadership Principle deep-dives and coding rounds.',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    focus: 'API and payments systems focus',
    active: false,
    tags: [{ label: 'Elite Difficulty', cls: 'tag-elite' }],
    diff: 'Difficulty Level: Elite',
    stars: 5,
    topics: ['API Design', 'Distributed Payments', 'Data Consistency', 'Security'],
    culture: [
      { title: 'User Empathy', desc: 'Explain why clean docs and simple APIs lower integration friction.' },
      { title: 'Precision', desc: 'Be exact about money movement, retries, idempotency, and auditability.' },
      { title: 'Global Scale', desc: 'Think in terms of compliance, latency, and high-volume reliability.' },
    ],
    questions: [
      { text: 'Design a payment processing system at scale.', type: 'System Design', typeClass: 'qt-sys', seen: 31 },
      { text: 'How would you handle distributed transactions safely?', type: 'System Design', typeClass: 'qt-sys', seen: 27 },
      { text: 'Implement a rate limiter for a public API.', type: 'Coding', typeClass: 'qt-code', seen: 19 },
    ],
    cta: 'Includes API design and distributed systems challenges.',
  },
  {
    id: 'meta',
    name: 'Meta',
    focus: 'Product and social graph focus',
    active: false,
    tags: [{ label: 'Very High Difficulty', cls: 'tag-vhigh' }],
    diff: 'Difficulty Level: Very High',
    stars: 4,
    topics: ['Social Graphs', 'Feed Ranking', 'ML Systems', 'Product Sense'],
    culture: [
      { title: 'Move Fast', desc: 'Show how you ship small, learn quickly, and keep quality intact.' },
      { title: 'Be Bold', desc: 'Talk about thoughtful risks with measurable upside.' },
      { title: 'Build Social Value', desc: 'Connect your work back to meaningful user outcomes.' },
    ],
    questions: [
      { text: 'Design a large-scale feed ranking pipeline.', type: 'System Design', typeClass: 'qt-sys', seen: 44 },
      { text: 'How would you detect fake accounts at scale?', type: 'System Design', typeClass: 'qt-sys', seen: 33 },
      { text: 'Tell me about a product decision you disagreed with.', type: 'Behavioral', typeClass: 'qt-beh', seen: 28 },
    ],
    cta: 'Includes product sense and social graph design challenges.',
  },
];

function inferTrack(targetRole = 'Senior Software Engineer') {
  const role = targetRole.toLowerCase();

  if (role.includes('front')) {
    return {
      title: 'Frontend Systems Road Map',
      subtitle: 'An 8-week intensive path focused on scalable UI architecture, performance, and staff-level execution.',
      activePhaseTitle: 'Frontend Architecture and Performance',
      focus: 'Focus: Rendering performance, state strategy, and design systems',
      insight: 'Spend extra time on rendering diagnostics, bundle budgets, and SSR tradeoffs.',
      gaps: ['Performance profiling', 'Design systems ownership', 'Accessibility at scale'],
      nextLesson: 'Rendering performance and state boundaries',
    };
  }

  if (role.includes('data') || role.includes('ml')) {
    return {
      title: 'Data and ML Leadership Road Map',
      subtitle: 'An 8-week plan focused on modeling depth, platform reliability, and stakeholder communication.',
      activePhaseTitle: 'ML Platform and Experimentation',
      focus: 'Focus: Pipelines, experimentation, and production reliability',
      insight: 'Push deeper on feature stores, evaluation metrics, and cross-functional narrative building.',
      gaps: ['Experiment design', 'Model monitoring', 'Data platform leadership'],
      nextLesson: 'Production ML architecture fundamentals',
    };
  }

  if (role.includes('backend') || role.includes('platform') || role.includes('infra')) {
    return {
      title: 'Backend Leadership Road Map',
      subtitle: 'An 8-week plan focused on distributed systems, reliability, and senior-level technical ownership.',
      activePhaseTitle: 'Scalable Services and Reliability',
      focus: 'Focus: Scalability, resilience, and platform engineering',
      insight: 'Double down on consistency models, failure isolation, and operational playbooks.',
      gaps: ['Concurrency patterns', 'Observability strategy', 'Large-scale system design'],
      nextLesson: 'Failure isolation and resilience patterns',
    };
  }

  return {
    title: 'Senior Engineering Launchpad',
    subtitle: 'A detailed 8-week trajectory designed to move you into senior and staff-level roles.',
    activePhaseTitle: 'System Design Deep-dive',
    focus: 'Focus: Scalability, availability, and reliability',
    insight: 'Spend 15% more time on consistency models and architecture tradeoff communication.',
    gaps: ['Leadership storytelling', 'Distributed systems depth', 'Cross-team influence'],
    nextLesson: 'System design fundamentals',
  };
}

function createRoadmapPhases(track) {
  return [
    {
      status: 'done',
      title: 'Week 1: Algorithmic Foundations',
      focus: 'Solidify DSA patterns and complexity analysis.',
      week: 'Week 1',
      tag: 'Completed',
      tasks: [
        { done: true, name: 'Master Two-Pointer & Sliding Window', desc: 'Solve 10 problems focusing on efficient array/string traversal.' },
        { done: true, name: 'Review Big O Analysis', desc: 'Ensure you can explain time/space tradeoffs for every solution.' },
        { done: true, name: 'HashMap & Heap Deep Dive', desc: 'Focus on frequency counting and top-k element patterns.' },
        { done: true, name: 'Tree & Graph Traversal', desc: 'Master DFS/BFS and recursion-to-iteration conversions.' },
      ],
    },
    {
      status: 'active',
      title: 'Week 2-3: ' + track.activePhaseTitle,
      focus: track.focus,
      week: 'Week 2-3',
      tag: 'Active Stage',
      tasks: [
        { done: false, active: true, name: 'Distributed Systems Patterns', desc: 'Study Load Balancers, Caching, and Database Sharding strategies.' },
        { done: false, name: 'Database Consistency Models', desc: 'Understand ACID vs BASE and when to choose SQL vs NoSQL.' },
        { done: false, name: 'API Design Best Practices', desc: 'Design RESTful and GraphQL APIs with versioning and idempotency.' },
        { done: false, name: 'System Design Case Study', desc: 'Complete a full architecture design for a system like TinyURL or WhatsApp.' },
      ],
      insight: track.insight,
    },
    {
      status: 'locked',
      title: 'Week 4: Concurrency & Performance',
      focus: 'Focus on multi-threading, async patterns, and latency optimization.',
      week: 'Week 4',
      tag: null,
      tasks: [
        { done: false, name: 'Async/Await & Promises', desc: 'Master non-blocking I/O and event loop mechanics.' },
        { done: false, name: 'Optimistic vs Pessimistic Locking', desc: 'Understand concurrency control in distributed environments.' },
        { done: false, name: 'Profiling & Bottlenecks', desc: 'Learn to use tools to identify CPU and memory leaks.' },
        { done: false, name: 'CDN & Static Assets', desc: 'Optimize content delivery for global users.' },
      ],
    },
    {
      status: 'locked',
      title: 'Week 5-6: Leadership & Project Ownership',
      focus: 'Move from individual contributor to technical leader.',
      week: 'Week 5-6',
      tag: null,
      tasks: [
        { done: false, name: 'Conflict Resolution Stories', desc: 'Draft STAR stories about constructive technical disagreements.' },
        { done: false, name: 'Code Review Excellence', desc: 'Practice giving high-signal, empathetic feedback on complex PRs.' },
        { done: false, name: 'Architecture Decision Records (ADR)', desc: 'Learn to document "the why" behind technical choices.' },
        { done: false, name: 'Mentorship Framework', desc: 'Define how you support the growth of junior-to-mid level peers.' },
      ],
    },
    {
      status: 'locked',
      title: 'Week 7: Behavioral Mastery',
      focus: 'Refine your personal narrative and leadership principles.',
      week: 'Week 7',
      tag: null,
      tasks: [
        { done: false, name: 'Top 10 STAR Stories', desc: 'Finalize metrics-driven responses for failure, impact, and ambiguity.' },
        { done: false, name: 'Company Values Alignment', desc: 'Map your career history to the Leadership Principles of target companies.' },
        { done: false, name: 'Mock Behavioral Session', desc: 'Record yourself and check for speech pace and confidence.' },
        { done: false, name: 'Resume Tailoring', desc: 'Ensure your resume highlights high-scope ownership and scale.' },
      ],
    },
    {
      status: 'locked',
      title: 'Week 8: Final Prep & Simulations',
      focus: 'Simulate high-pressure loops and polish delivery.',
      week: 'Week 8',
      tag: null,
      tasks: [
        { done: false, name: 'Back-to-Back Mock Interviews', desc: 'Run 4 hours of simulations to build mental stamina.' },
        { done: false, name: 'Edge Case Deep Dive', desc: 'Practice handling "What if..." constraints in system design.' },
        { done: false, name: 'Salary Negotiation Prep', desc: 'Research market rates and define your total compensation goals.' },
        { done: false, name: 'Review Tech Stack Fundamentals', desc: 'Quick refresh on core language and framework internals.' },
      ],
    },
  ];
}

function calculateRoadmapProgress(phases = []) {
  const tasks = phases.flatMap((phase) => phase.tasks || []);
  if (!tasks.length) {
    return { completedTasks: 0, totalTasks: 0, completionPercent: 0 };
  }

  const completedTasks = tasks.filter((task) => task.done).length;
  const completionPercent = Math.round((completedTasks / tasks.length) * 100);

  return {
    completedTasks,
    totalTasks: tasks.length,
    completionPercent,
  };
}

function buildRoadmapPayload(options = {}) {
  const { targetRole = 'Senior Software Engineer', experience = 'mid', currentSkills = [] } = options;
  const track = inferTrack(targetRole);
  const phases = createRoadmapPhases(track);
  const stats = calculateRoadmapProgress(phases);

  return {
    title: track.title,
    subtitle: track.subtitle,
    targetRole,
    experience,
    currentSkills,
    timelineWeeks: 8,
    currentStreakDays: 0,
    readinessGrade: stats.completionPercent >= 50 ? 'A-' : 'B+',
    nextLesson: track.nextLesson,
    skillGaps: track.gaps,
    completionPercent: stats.completionPercent,
    stats: {
      timeline: '8 Weeks',
      completion: `${stats.completionPercent}%`,
      currentStreak: '0 Days',
      readiness: stats.completionPercent >= 50 ? 'A-' : 'B+',
      completedTasks: stats.completedTasks,
      totalTasks: stats.totalTasks,
    },
    phases,
  };
}

function updateRoadmapTask(roadmapPayload, phaseIndex, taskIndex, completed) {
  const payload = clone(roadmapPayload);

  if (!payload.phases?.[phaseIndex]?.tasks?.[taskIndex]) {
    return payload;
  }

  payload.phases[phaseIndex].tasks[taskIndex].done = completed;
  payload.phases[phaseIndex].tasks[taskIndex].active = false;

  payload.phases.forEach((phase, index) => {
    const allDone = (phase.tasks || []).every((task) => task.done);

    if (allDone) {
      phase.status = 'done';
      if (phase.tag !== null) {
        phase.tag = 'Completed';
      }
      return;
    }

    if (index === phaseIndex || payload.phases.slice(0, index).every((previousPhase) => (previousPhase.tasks || []).every((task) => task.done))) {
      phase.status = 'active';
      if (phase.tag !== null) {
        phase.tag = 'Active Stage';
      }
      const nextTask = (phase.tasks || []).find((task) => !task.done);
      if (nextTask) {
        nextTask.active = true;
      }
    } else {
      phase.status = 'locked';
      if (phase.tag !== null) {
        phase.tag = null;
      }
      (phase.tasks || []).forEach((task) => {
        task.active = false;
      });
    }
  });

  const stats = calculateRoadmapProgress(payload.phases);
  payload.completionPercent = stats.completionPercent;
  payload.stats = {
    ...payload.stats,
    completion: `${stats.completionPercent}%`,
    completedTasks: stats.completedTasks,
    totalTasks: stats.totalTasks,
  };

  return payload;
}

function buildResumeAnalysisFallback(resumeText = '') {
  const text = resumeText.toLowerCase();
  const includesNumbers = /\b\d+(\.\d+)?(%|x|k|m)?\b/.test(text);
  const includesLeadership = /(lead|mentor|owner|ownership|stakeholder|cross-functional|managed|directed)/.test(text);
  const includesArchitecture = /(system design|distributed|architecture|microservice|scalab|cloud|infra|database)/.test(text);
  const includesImpactVerbs = /(built|launched|improved|reduced|increased|delivered|optimized|scaled|engineered|implemented)/.test(text);

  // Dynamic base score based on word count (length sanity check)
  const words = text.split(/\s+/).filter(w => w.length > 2);
  
  // Base score: shorter resumes are penalized, but very long ones aren't necessarily better
  // Aim for a base between 45 and 65
  let score = Math.min(65, Math.max(45, Math.round(words.length / 4))); 
  
  if (includesNumbers) score += 12; // High signal: Quantified impact
  if (includesLeadership) score += 8; // Medium signal: Leadership
  if (includesArchitecture) score += 10; // Medium signal: Technical depth
  if (includesImpactVerbs) score += 5; // Low signal: Action verbs
  
  // Bonus for modern keywords
  if (text.includes('react') || text.includes('node') || text.includes('python') || text.includes('aws')) score += 5;

  // Add some consistency based on text hash
  const charSum = resumeText.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  score += (charSum % 4);

  // Cap at 92 for fallbacks to leave room for perfection
  score = Math.min(score, 92);

  const strengths = [];
  const weaknesses = [];

  if (includesArchitecture) {
    strengths.push('Demonstrates technical depth with mentions of architecture and system-level concepts.');
  } else {
    weaknesses.push('Technical depth could be more explicit; consider adding more about system design and constraints.');
  }

  if (includesNumbers) {
    strengths.push('Quantified impact is present, which significantly boosts recruiter and ATS confidence.');
  } else {
    weaknesses.push('Results lack quantification; adding specific metrics (%, $, time saved) would improve visibility.');
  }

  if (includesLeadership) {
    strengths.push('Leadership and ownership signals are clearly articulated in your experience.');
  } else {
    weaknesses.push('Leadership presence is subtle; use stronger verbs like "Led", "Architected", or "Spearheaded".');
  }

  if (words.length < 150) {
    weaknesses.push('Resume content is quite brief; expanding on your key projects and responsibilities is recommended.');
  }

  return {
    score,
    strengths: strengths.length ? strengths : ['General technical experience is documented.'],
    weaknesses: weaknesses.length ? weaknesses : ['Content could be more focused on high-impact achievements.'],
    improvements: [
      'Quantify your impact: Use specific numbers for scale, performance, and business value.',
      'Sharpen your "Senior" narrative: Focus more on why decisions were made, not just what was built.',
      'ATS Keyword Optimization: Ensure core technologies from target job descriptions are present.',
    ],
    keywords_missing: ['distributed systems', 'scalability', 'technical leadership', 'stakeholder management'],
    recommendations: [
      'Add a summary section that explicitly states your target role and core expertise.',
      'Focus the first 3 bullets of each role on your most impressive, high-scope achievements.',
      'Ensure formatting is clean and parsable by standard ATS systems.',
    ],
  };
}

function buildAnalyticsPayload(options = {}) {
  const resumeScore = options.resumeScore || 74;
  const roadmapProgress = options.roadmapProgress || 0;
  const interviewScore = options.interviewScore || 0;
  const targetRole = options.targetRole || 'Software Engineer';
  const latestResume = options.latestResume || null;
  const roadmap = options.roadmap || null;

  // Base competency score combines resume, roadmap, and interview performance
  let competencyScore = Math.round((resumeScore * 0.4) + (roadmapProgress * 0.4));
  if (interviewScore > 0) {
    competencyScore = Math.round((resumeScore * 0.3) + (roadmapProgress * 0.3) + (interviewScore * 0.4));
  }
  competencyScore = Math.max(60, Math.min(94, competencyScore));

  // Generate dynamic radar data
  const baseValue = (competencyScore / 100) * 0.9;
  const you = [
    Math.min(0.95, baseValue + 0.1), // Algorithms
    Math.min(0.95, baseValue + (roadmapProgress > 40 ? 0.05 : -0.05)), // System Design
    Math.min(0.95, baseValue + 0.02), // Backend
    Math.min(0.95, baseValue - 0.05), // Frontend
    Math.min(0.95, baseValue), // Database
    Math.min(0.95, baseValue - 0.2 + (roadmapProgress / 500)), // Concurrency
    Math.min(0.95, baseValue - 0.1), // Security
    Math.min(0.95, baseValue - 0.15 + (roadmapProgress / 400) + (interviewScore / 1000)), // Leadership
  ];

  let insight = roadmapProgress < 20 
    ? "You've got a strong start. Focus on the early phases of your road map to build core technical fluency."
    : roadmapProgress < 50
    ? "Your technical foundations are solidifying. The next big lift is tackling intermediate complexity and system design."
    : "You are reaching advanced levels of readiness. Polish your leadership narratives and architecture tradeoffs.";

  if (latestResume?.analysis?.weaknesses?.length > 0) {
     insight = `Your resume analysis indicates a need to focus on: ${latestResume.analysis.weaknesses[0].toLowerCase()}. Prioritize this in your upcoming sessions.`;
  }

  const competencies = [
    {
      name: 'Technical Core',
      badge: competencyScore > 80 ? 'Expert' : 'Advanced',
      badgeClass: competencyScore > 80 ? 'badge-adv' : 'badge-adv',
      skills: [
        { name: 'System Design', pct: Math.round(you[1] * 100), cls: '' },
        { name: 'Algorithms & Data Structures', pct: Math.round(you[0] * 100), cls: '' },
        { name: 'Backend Architecture', pct: Math.round(you[2] * 100), cls: '' },
      ],
    },
    {
      name: 'Leadership & Strategy',
      badge: roadmapProgress > 60 ? 'Advanced' : 'Intermediate',
      badgeClass: roadmapProgress > 60 ? 'badge-adv' : 'badge-int',
      skills: [
        { name: 'Technical Ownership', pct: Math.round(you[7] * 100 + 10), cls: roadmapProgress < 40 ? 'orange' : '' },
        { name: 'Communication', pct: Math.round(you[7] * 100), cls: roadmapProgress < 30 ? 'yellow' : '' },
        { name: 'Mentorship', pct: Math.round(you[7] * 100 - 5), cls: roadmapProgress < 50 ? 'yellow' : '' },
      ],
    },
  ];

  let gaps = [];
  if (roadmap?.skillGaps && roadmap.skillGaps.length > 0) {
    gaps = roadmap.skillGaps.slice(0, 3).map((gap, index) => ({
      badge: index === 0 ? 'Critical Gap' : 'Priority Gap',
      badgeClass: index === 0 ? 'gb-critical' : 'gb-priority',
      title: gap,
      desc: `Identified as a key area to bridge between your current level and ${targetRole}.`,
      resource: { icon: index % 2 === 0 ? 'play' : 'book', name: `Guide to ${gap.split(' ')[0]}` }
    }));
  } else {
    // Fallback if no roadmap exists
    const allGaps = [
      {
        badge: 'Critical Gap',
        badgeClass: 'gb-critical',
        title: 'Distributed System Design',
        desc: 'Target roles demand deeper sharding, reliability, and CAP tradeoff fluency.',
        resource: { icon: 'play', name: 'Scalability Course' },
        threshold: 50
      },
      {
        badge: 'Priority Gap',
        badgeClass: 'gb-priority',
        title: 'Concurrency Patterns',
        desc: 'Improve fluency with async execution, backpressure, and race condition prevention.',
        resource: { icon: 'book', name: 'Concurrency Guide' },
        threshold: 60
      },
      {
        badge: 'Secondary Gap',
        badgeClass: 'gb-secondary',
        title: 'Behavioral Interviewing',
        desc: 'Refine concise, metric-driven leadership stories for senior-level rounds.',
        resource: { icon: 'mic', name: 'AI Mock Interview' },
        threshold: 70
      }
    ];
    gaps = allGaps.filter(g => roadmapProgress < g.threshold).slice(0, 3);
  }

  return {
    radar: {
      labels: ['Algorithms', 'System Design', 'Backend', 'Frontend', 'Database', 'Concurrency', 'Security', 'Leadership'],
      you,
      benchmark: [0.9, 0.9, 0.9, 0.82, 0.88, 0.78, 0.8, 0.75],
    },
    competencyScore,
    marketReadiness: {
      role: targetRole,
      matchPercent: Math.max(55, Math.min(94, competencyScore - (9 - roadmapProgress / 20))),
    },
    insight,
    competencies,
    gaps,
  };
}

function buildDashboardPayload(options = {}) {
  const { user = {}, resumeScore = 84, roadmapProgress = 32, readinessPercent = 75, recentActivity = [] } = options;
  const firstName = user.firstName || (user.email ? user.email.split('@')[0] : 'User');

  const defaultActivity = [
    {
      type: 'practice',
      name: 'Completed a targeted interview drill',
      meta: `Readiness is now ${readinessPercent}% after your latest practice session.`,
    },
    {
      type: 'resume',
      name: 'Resume refinement insight unlocked',
      meta: `ATS score currently sits at ${resumeScore}/100 with clear room for leadership framing.`,
    },
    {
      type: 'roadmap',
      name: 'Road Map milestone updated',
      meta: `${roadmapProgress}% of your road map is now complete.`,
    },
  ];

  return {
    firstName,
    subtitle: `You are making solid progress toward your ${user.targetRole || 'Senior Software Engineer'} goal.`,
    activeJourney: {
      label: 'Active Journey',
      title: 'Continue your preparation',
      description: `You were last working on "${options.nextLesson || 'System design fundamentals'}". Keep momentum with one focused session today.`,
      action: { label: 'Start Next Lesson', route: '/roadmap' },
    },
    recommendedStep: {
      title: 'Recommended Next Step',
      description: `Practice a mock interview focused on ${options.mockFocus || 'behavioral and system design'} questions.`,
      estimatedTime: '45 min',
      focus: options.mockFocus || 'Behavioral',
      route: '/interview',
    },
    stats: {
      resumeScore,
      roadmapProgress,
      readinessLevel: readinessPercent >= 80 ? 'Very High' : readinessPercent >= 65 ? 'High' : 'Growing',
      readinessPercent,
    },
    recentActivity: recentActivity.length > 0 ? recentActivity : defaultActivity,
  };
}

function buildCompanyPrepSummaries() {
  return COMPANY_BLUEPRINTS.map((company) => ({
    id: company.id,
    name: company.name,
    focus: company.focus,
    active: company.active,
    tags: clone(company.tags),
  }));
}

function buildCompanyPrepDetail(companyId) {
  const company = COMPANY_BLUEPRINTS.find((item) => item.id === companyId) || COMPANY_BLUEPRINTS[0];
  return clone(company);
}

function buildInterviewOpening(role = 'Senior Software Engineer', company = 'Google') {
  return {
    sessionLabel: `${company} ${role}`.trim(),
    question: `Welcome to your ${company} mock interview for the ${role} role. Start by telling me about a project that best represents your senior-level impact.`,
    tips: ['Lead with scope, ownership, and measurable outcomes.', 'Keep the first answer to roughly 90 seconds.'],
    metrics: {
      accuracy: 80,
      confidence: 74,
      speechPace: 'Optimal (145 wpm)',
      keyTerms: ['ownership', 'impact'],
    },
  };
}

function buildInterviewTurn(options = {}) {
  const { response = '', role = 'Senior Software Engineer', company = 'Google', turnNumber = 1 } = options;
  const trimmed = response.trim();
  const responseLength = trimmed.split(/\s+/).filter(Boolean).length;
  const accuracy = Math.max(60, Math.min(96, 62 + Math.round(responseLength / 3)));
  const confidence = Math.max(55, Math.min(93, 58 + Math.round(responseLength / 4)));
  const rating = Math.max(3, Math.min(5, Math.round((accuracy + confidence) / 38)));

  const questionBank = [
    `What tradeoff did you make on that project, and how did you communicate it to stakeholders?`,
    `How would you redesign that system if traffic doubled overnight at ${company}?`,
    `What is one leadership lesson from that work that makes you a stronger ${role}?`,
  ];

  const nextQuestion = questionBank[(turnNumber - 1) % questionBank.length];
  const keyTerms = ['architecture', 'stakeholders', 'latency', 'ownership', 'reliability']
    .filter((term) => trimmed.toLowerCase().includes(term))
    .slice(0, 3);

  return {
    feedback_on_previous: responseLength >= 60
      ? 'Strong structure. Your answer showed ownership and context well; tighten the ending with one explicit metric.'
      : 'Good start. Add more measurable impact and be more explicit about the decision you personally drove.',
    question: nextQuestion,
    rating,
    tips: [
      'Name the constraint before explaining the decision.',
      'Close with the business or user impact.',
    ],
    accuracy,
    confidence,
    speechPace: 'Optimal (145 wpm)',
    keyTerms: keyTerms.length ? keyTerms : ['impact', 'ownership'],
  };
}

function buildProgressPayload(options = {}) {
  const resumeScore = options.resumeScore || 84;
  const roadmapProgress = options.roadmapProgress || 32;
  const readinessPercent = options.readinessPercent || 87;
  const sessions = options.sessions || [];

  // Skill breakdown based on resume and roadmap
  const skillsBreakdown = [
    { name: 'Coding', score: Math.round(readinessPercent * 0.9), total: 100 },
    { name: 'System Design', score: Math.round(roadmapProgress * 1.2), total: 100 },
    { name: 'Behavioral', score: Math.round(resumeScore * 0.8), total: 100 },
    { name: 'Leadership', score: Math.round((resumeScore + roadmapProgress) / 2.5), total: 100 },
  ].map(s => ({ ...s, score: Math.min(s.total, Math.max(20, s.score)) }));

  // Interview history from actual sessions or fallback
  const history = sessions.length > 0 
    ? sessions.map(s => ({
        date: s.startedAt,
        score: s.ratings?.accuracy || 70,
        role: s.role,
        company: s.company
      }))
    : [
        { date: '2026-04-20', score: 65, role: 'Software Engineer', company: 'Practice' },
        { date: '2026-04-25', score: 72, role: 'Software Engineer', company: 'Practice' },
        { date: '2026-05-01', score: 78, role: 'Software Engineer', company: 'Mock' },
      ];

  return {
    stats: {
      readiness: readinessPercent,
      totalPracticeHours: 124 + sessions.length * 2,
      conceptsMastered: 42 + Math.floor(roadmapProgress / 2),
      currentStreakDays: 0,
      roadmapProgress,
      resumeScore,
    },
    weeklyImprovement: {
      technical: [61, 66, 70, 74, 81, 86, 92, 88],
      behavioral: [52, 58, 63, 68, 72, 76, 79, 82],
      peakReadiness: Math.max(readinessPercent, 92.4),
    },
    skillsBreakdown,
    interviewHistory: history,
    benchmarks: {
      you: readinessPercent,
      average: 65,
      top10: 88,
      targetRole: options.targetRole || 'Senior Software Engineer'
    },
    activityHeatmap: [
      0.3, 0.5, 0.7, 0.4, 0.6, 0.8,
      0.2, 0.4, 0.8, 0.9, 0.3, 0.6,
      0.5, 0.2, 0.4, 0.7, 0.9, 0.8,
      0.3, 0.5, 0.6, 0.7, 0.8, 0.4,
      0.2, 0.3, 0.6, 0.7, 0.9, 0.8,
    ],
    achievements: [
      {
        name: 'Mastered dynamic programming fundamentals',
        desc: 'Solved 15 consecutive DP problems with strong explanation quality.',
        time: '2h ago',
      },
      {
        name: 'Completed a full Amazon mock interview',
        desc: 'Earned a strong-hire style recommendation in a simulated loop.',
        time: 'Yesterday',
      },
      {
        name: 'Improved medium-problem solve time',
        desc: 'Reduced average resolution time by roughly 40% over the last two weeks.',
        time: '3 days ago',
      },
    ],
    insight: {
      text: roadmapProgress < 50 
        ? 'Technical performance is compounding well. Shift the next three sessions toward leadership principles and narrative clarity.'
        : 'You are showing strong leadership signals. Focus on refining your system design tradeoffs to reach the next level.',
      skills: [
        { name: 'System Design', level: roadmapProgress > 60 ? 'Expert' : 'Advanced' },
        { name: 'DSA Fundamentals', level: 'Expert' },
        { name: 'Behavioral', level: resumeScore > 80 ? 'Advanced' : 'Intermediate' },
      ],
    },
    nextSteps: [
      { title: 'System Design Drill', desc: 'Focus on distributed caching patterns.', icon: '⚡' },
      { title: 'Behavioral Prep', desc: 'Refine your "Conflict Resolution" STAR story.', icon: '🎤' },
      { title: 'Algorithm Deep Dive', desc: 'Master advanced graph traversals.', icon: '🧩' },
    ]
  };
}

function buildCompanyInsightsFallback(companyName = 'Google', role = 'Senior Software Engineer') {
  const company = COMPANY_BLUEPRINTS.find((item) => item.name.toLowerCase() === companyName.toLowerCase()) || COMPANY_BLUEPRINTS[0];

  return {
    company_info: {
      name: company.name,
      difficulty: company.diff,
      focus: company.focus,
    },
    role_expectations: {
      role,
      top_topics: clone(company.topics),
      culture: clone(company.culture),
    },
    common_questions: clone(company.questions),
    culture_fit_tips: company.culture.map((item) => `${item.title}: ${item.desc}`),
    technical_focus: clone(company.topics),
  };
}

function buildSkillGapFallback(currentSkills = [], targetRole = 'Senior Software Engineer') {
  const track = inferTrack(targetRole);
  const normalizedSkills = currentSkills.map((skill) => skill.toLowerCase());
  const gaps = track.gaps
    .filter((gap) => !normalizedSkills.some((skill) => skill.includes(gap.toLowerCase().split(' ')[0])))
    .map((gap, index) => ({
      skill: gap,
      importance: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
      resources: [`Targeted practice plan for ${gap}`, `Mock interview drill for ${gap}`],
    }));

  return {
    gaps,
    priority_order: gaps.map((gap) => gap.skill),
    estimated_weeks: 8,
    learning_resources: gaps.flatMap((gap) => gap.resources),
  };
}

module.exports = {
  calculateRoadmapProgress,
  buildAnalyticsPayload,
  buildCompanyInsightsFallback,
  buildCompanyPrepDetail,
  buildCompanyPrepSummaries,
  buildDashboardPayload,
  buildInterviewOpening,
  buildInterviewTurn,
  buildProgressPayload,
  buildResumeAnalysisFallback,
  buildRoadmapPayload,
  buildSkillGapFallback,
  updateRoadmapTask,
};