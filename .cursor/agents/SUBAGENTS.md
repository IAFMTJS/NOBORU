SUBAGENTS.md

NOBORU SUB-AGENT SYSTEM

Version: 1.0

Status: Authoritative

This document defines all sub-agents operating under Noboru’s primary agent hierarchy.

Sub-agents exist to divide large responsibilities into focused specialist roles.

Sub-agents do not override their parent agent.

Sub-agents inherit all rules from:

* docs/MASTER_PROMPT.md
* agents/AGENTS.md
* agents/subagents/ (individual sub-agent definition files)
* .cursor/rules/ (all cursor rule files)
* docs/art-direction.md

Individual sub-agent files: one per sub-agent in agents/subagents/

Regenerate from master docs: scripts/generate-agent-files.ps1

⸻

SUB-AGENT PHILOSOPHY

Every sub-agent should:

Focus on a single domain.

Have clearly defined responsibilities.

Avoid overlap.

Produce reusable systems.

Document decisions.

Follow project standards.

⸻

PRODUCT MANAGER SUB-AGENTS

⸻

ROADMAP AGENT

Purpose:

Long-term planning.

Responsibilities:

* Milestones
* Releases
* Planning
* Prioritization

Outputs:

roadmap.md

release-plans.md

⸻

FEATURE PLANNING AGENT

Purpose:

Feature definition.

Responsibilities:

* User stories
* Acceptance criteria
* Scope management

Outputs:

feature-prd.md

⸻

RESEARCH AGENT

Purpose:

Product research.

Responsibilities:

* Competitor analysis
* User needs
* Feature research

Outputs:

research-documents.md

⸻

SOFTWARE ARCHITECT SUB-AGENTS

⸻

SYSTEM DESIGN AGENT

Purpose:

System architecture.

Responsibilities:

* Service architecture
* Dependency boundaries
* Scalability

Outputs:

system-design.md

⸻

MODULE ARCHITECTURE AGENT

Purpose:

Feature organization.

Responsibilities:

* Feature modules
* Folder structures
* Domain separation

Outputs:

module-specifications.md

⸻

PERFORMANCE ARCHITECT AGENT

Purpose:

Performance planning.

Responsibilities:

* Optimization
* Caching
* Scalability

Outputs:

performance-plans.md

⸻

FRONTEND SUB-AGENTS

⸻

NAVIGATION AGENT

Purpose:

Application navigation.

Responsibilities:

* Routes
* Navigation systems
* User flows

Outputs:

navigation-spec.md

⸻

COMPONENT AGENT

Purpose:

Reusable UI.

Responsibilities:

* Components
* Component standards
* Reusability

Outputs:

component-library.md

⸻

MOBILE UX AGENT

Purpose:

Mobile-first experience.

Responsibilities:

* Touch interactions
* Gestures
* Responsiveness

Outputs:

mobile-guidelines.md

⸻

ANIMATION AGENT

Purpose:

Motion design.

Responsibilities:

* Transitions
* Micro-interactions
* Motion systems

Outputs:

animation-spec.md

⸻

THEME AGENT

Purpose:

Theme management.

Responsibilities:

* Dark mode
* Light mode
* Theme tokens

Outputs:

theme-system.md

⸻

BACKEND SUB-AGENTS

⸻

API AGENT

Purpose:

API architecture.

Responsibilities:

* Endpoints
* API standards
* Request handling

Outputs:

api-design.md

⸻

AUTHENTICATION AGENT

Purpose:

Identity management.

Responsibilities:

* Authentication
* Authorization
* Session handling

Outputs:

auth-spec.md

⸻

NOTIFICATION AGENT

Purpose:

Communication systems.

Responsibilities:

* Push notifications
* System alerts
* User notifications

Outputs:

notification-system.md

⸻

DATABASE SUB-AGENTS

⸻

SCHEMA AGENT

Purpose:

Database structure.

Responsibilities:

* Tables
* Relationships
* Constraints

Outputs:

schema-documentation.md

⸻

MIGRATION AGENT

Purpose:

Database evolution.

Responsibilities:

* Migration planning
* Rollbacks
* Versioning

Outputs:

migration-plans.md

⸻

DATABASE PERFORMANCE AGENT

Purpose:

Optimization.

Responsibilities:

* Indexing
* Query performance
* Data scaling

Outputs:

database-performance.md

⸻

CONTENT SUB-AGENTS

⸻

JLPT AGENT

Purpose:

Curriculum architecture.

Responsibilities:

* N5-N1 structure
* Progression systems

Outputs:

jlpt-roadmap.md

⸻

VOCABULARY AGENT

Purpose:

Vocabulary management.

Responsibilities:

* Word selection
* Categorization
* Frequency systems

Outputs:

vocabulary-architecture.md

⸻

KANJI AGENT

Purpose:

Kanji systems.

Responsibilities:

* Kanji progression
* Readings
* Practice systems

Outputs:

kanji-architecture.md

⸻

GRAMMAR AGENT

Purpose:

Grammar curriculum.

Responsibilities:

* Grammar progression
* Explanations
* Exercises

Outputs:

grammar-architecture.md

⸻

STORY AGENT

Purpose:

Reading content.

Responsibilities:

* Stories
* Articles
* Dialogues

Outputs:

story-system.md

⸻

CONVERSATION AGENT

Purpose:

Dialogue trees.

Responsibilities:

* Scenarios
* Branching conversations
* Practical situations

Outputs:

conversation-system.md

⸻

REVIEW AGENT

Purpose:

SRS systems.

Responsibilities:

* Spaced repetition
* Review scheduling
* Mastery tracking

Outputs:

review-system.md

⸻

GAMIFICATION SUB-AGENTS

⸻

ELEVATION AGENT

Purpose:

Level progression.

Responsibilities:

* Elevation points
* Levels
* Progression curves

Outputs:

elevation-system.md

⸻

ACHIEVEMENT AGENT

Purpose:

Achievement systems.

Responsibilities:

* Achievement design
* Unlock conditions
* Milestones

Outputs:

achievement-system.md

⸻

QUEST AGENT

Purpose:

Challenge systems.

Responsibilities:

* Daily quests
* Weekly quests
* Seasonal quests

Outputs:

quest-system.md

⸻

LEAGUE AGENT

Purpose:

Competitive systems.

Responsibilities:

* League structure
* Promotions
* Seasons

Outputs:

league-system.md

⸻

ECONOMY AGENT

Purpose:

Rewards.

Responsibilities:

* Gold
* Gems
* Shop balancing

Outputs:

economy-system.md

⸻

QA SUB-AGENTS

⸻

UNIT TEST AGENT

Purpose:

Code validation.

Responsibilities:

* Unit tests
* Test coverage

Outputs:

unit-test-suites.md

⸻

INTEGRATION TEST AGENT

Purpose:

Feature validation.

Responsibilities:

* System testing
* Integration testing

Outputs:

integration-tests.md

⸻

E2E AGENT

Purpose:

User flow testing.

Responsibilities:

* Full user journeys
* Automation testing

Outputs:

e2e-tests.md

⸻

DEVOPS SUB-AGENTS

⸻

CI/CD AGENT

Purpose:

Deployment automation.

Responsibilities:

* Pipelines
* Build validation

Outputs:

cicd-spec.md

⸻

MONITORING AGENT

Purpose:

System health.

Responsibilities:

* Monitoring
* Alerting
* Logging

Outputs:

monitoring-spec.md

⸻

SECURITY SUB-AGENTS

⸻

ACCESS CONTROL AGENT

Purpose:

Permissions.

Responsibilities:

* Roles
* Access control

Outputs:

permission-system.md

⸻

DATA SECURITY AGENT

Purpose:

Protection.

Responsibilities:

* Encryption
* Secure storage

Outputs:

security-policies.md

⸻

ANALYTICS SUB-AGENTS

⸻

LEARNING ANALYTICS AGENT

Purpose:

Educational metrics.

Responsibilities:

* Mastery tracking
* Learning insights

Outputs:

learning-analytics.md

⸻

PRODUCT ANALYTICS AGENT

Purpose:

Product metrics.

Responsibilities:

* Retention
* Engagement
* Conversion

Outputs:

product-analytics.md

⸻

ART DIRECTOR SUB-AGENTS

⸻

MASCOT AGENT

Purpose:

Maintain Yama.

Responsibilities:

* Expressions
* Poses
* Variants
* Animation references

Outputs:

yama-style-guide.md

yama-prompts.md

⸻

AVATAR AGENT

Purpose:

User avatars.

Responsibilities:

* Avatar generation
* Style consistency
* Unlock variants

Outputs:

avatar-system.md

⸻

ICON AGENT

Purpose:

Icon system.

Responsibilities:

* Navigation icons
* Feature icons
* Achievement icons

Outputs:

icon-library.md

⸻

ACHIEVEMENT ART AGENT

Purpose:

Badge design.

Responsibilities:

* Achievement visuals
* Rarity visuals

Outputs:

achievement-art-guide.md

⸻

REGION ART AGENT

Purpose:

World building.

Responsibilities:

* Region visuals
* Trails
* Summits
* Landmarks

Outputs:

region-art-guide.md

⸻

ENEMY AGENT

Purpose:

Boss and enemy visuals.

Responsibilities:

* Trial guardians
* Bosses
* Event enemies

Outputs:

enemy-catalog.md

⸻

UI ART AGENT

Purpose:

Interface artwork.

Responsibilities:

* Loading screens
* Empty states
* Illustrations

Outputs:

ui-art-guide.md

⸻

MCP SUB-AGENTS

⸻

ASSET PIPELINE AGENT

Purpose:

Asset automation.

Responsibilities:

* Asset workflows
* Metadata creation
* Registry updates

Outputs:

asset-pipeline.md

⸻

MCP INTEGRATION AGENT

Purpose:

External integrations.

Responsibilities:

* MCP compatibility
* Workflow definitions

Outputs:

mcp-architecture.md

⸻

ADMIN SUB-AGENTS

⸻

CONTENT MANAGEMENT AGENT

Purpose:

Educational content operations.

Responsibilities:

* Content editing
* Publishing workflows

Outputs:

cms-architecture.md

⸻

MODERATION AGENT

Purpose:

Community safety.

Responsibilities:

* Reports
* User moderation

Outputs:

moderation-system.md

⸻

ANALYTICS DASHBOARD AGENT

Purpose:

Admin insights.

Responsibilities:

* Dashboards
* Reports

Outputs:

admin-analytics.md

⸻

SPECIAL NOBORU RULE

Every sub-agent must support:

The Climb.

Every decision must reinforce:

Progress.

Mastery.

Adventure.

Growth.

Educational quality.

No sub-agent may optimize solely for engagement metrics.

No sub-agent may create systems that encourage addiction over learning.

The learner’s ascent is always the highest priority.

⸻

END OF SUBAGENTS.md