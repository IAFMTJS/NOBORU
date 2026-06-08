# Generates governance agent definitions and Cursor-runnable subagent files.

$governance = @(
    "docs/MASTER_PROMPT.md",
    ".cursor/agents/AGENTS.md",
    ".cursor/agents/SUBAGENTS.md",
    ".cursor/rules/architecture.mdc"
)

$coreDir = Join-Path $PSScriptRoot "..\.cursor\agents\core"
$subDir = Join-Path $PSScriptRoot "..\.cursor\agents\subagents"
$cursorDir = Join-Path $PSScriptRoot "..\.cursor\agents"

function Get-AgentSlug {
    param([string]$File)
    return ($File -replace '\.md$', '').ToLower()
}

function Get-CursorDescription {
    param(
        [string]$Title,
        [string]$Purpose,
        [string[]]$Responsibilities,
        [string]$ParentAgent = "",
        [string[]]$SubAgents = @()
    )

    $scope = ($Responsibilities | Select-Object -First 4) -join ', '
    $prefix = if ($ParentAgent) { "Noboru $Title under $ParentAgent." } else { "Noboru $Title." }
    $delegate = if ($SubAgents.Count -gt 0) {
        $names = ($SubAgents | ForEach-Object { ($_ -replace '\.md$', '') -replace '-agent$', '' }) -join ', '
        " May delegate to: $names."
    } else { "" }

    return "$prefix Use when working on: $scope.$delegate"
}

function Write-AgentFile {
    param(
        [string]$Path,
        [string]$Title,
        [string]$Role,
        [string]$Purpose,
        [string[]]$Responsibilities,
        [string]$Authority = "Medium",
        [string[]]$Outputs,
        [string]$SuccessMetric = "",
        [string]$ParentAgent = "",
        [string[]]$SubAgents = @()
    )

    $resp = ($Responsibilities | ForEach-Object { "* $_" }) -join "`n"
    $out = ($Outputs | ForEach-Object { "* $_" }) -join "`n"
    $gov = ($governance | ForEach-Object { "* $_" }) -join "`n"
    $subs = if ($SubAgents.Count -gt 0) {
        ($SubAgents | ForEach-Object { "* .cursor/agents/subagents/$($_)" }) -join "`n"
    } else { "* See .cursor/agents/SUBAGENTS.md" }

    $parentLine = if ($ParentAgent) { "**Parent Agent:** $ParentAgent`n`n" } else { "" }
    $metricLine = if ($SuccessMetric) { "`n## Success Metric`n`n$SuccessMetric`n" } else { "" }

    @"
# $Title

Version: 1.0

Status: Authoritative

${parentLine}## Role

$Role

## Purpose

$Purpose

## Responsibilities

$resp

## Authority

$Authority

## Outputs

$out
$metricLine
## Sub-Agents

$subs

## Governance

$gov
"@ | Out-File -FilePath $Path -Encoding utf8 -Force
}

function Write-CursorSubagentFile {
    param(
        [string]$Path,
        [string]$Name,
        [string]$Description,
        [string]$Title,
        [string]$Role,
        [string]$Purpose,
        [string[]]$Responsibilities,
        [string]$Authority,
        [string[]]$Outputs,
        [string]$SuccessMetric = "",
        [string]$ParentAgent = "",
        [string[]]$SubAgents = @(),
        [bool]$Readonly = $false,
        [bool]$IsBackground = $false
    )

    $resp = ($Responsibilities | ForEach-Object { "- $_" }) -join "`n"
    $out = ($Outputs | ForEach-Object { "- $_" }) -join "`n"
    $gov = ($governance | ForEach-Object { "- $_" }) -join "`n"
    $subs = if ($SubAgents.Count -gt 0) {
        ($SubAgents | ForEach-Object { "- /$((Get-AgentSlug $_))" }) -join "`n"
    } else { "- See .cursor/agents/SUBAGENTS.md for related specialists." }

    $parentSection = if ($ParentAgent) {
@"

## Parent Agent

$ParentAgent - you operate under this agent and do not override its decisions.
"@
    } else { "" }

    $metricSection = if ($SuccessMetric) {
@"

## Success Metric

$SuccessMetric
"@
    } else { "" }

    $delegateSection = if ($SubAgents.Count -gt 0) {
@"

## Delegation

When work falls outside your direct responsibilities, delegate to these subagents:

$subs
"@
    } else { "" }

    $readonlyLine = if ($Readonly) { "true" } else { "false" }
    $backgroundLine = if ($IsBackground) { "true" } else { "false" }

    @"
---
name: $Name
description: $Description
model: inherit
readonly: $readonlyLine
is_background: $backgroundLine
---

You are the **$Title**, a specialist in the Noboru Japanese learning platform.

## Role

$Role

## Purpose

$Purpose
$parentSection

## Responsibilities

$resp

## Authority

$Authority - follow layered architecture (UI -> Service -> Repository -> Database). Never bypass parent agents or global governance.

## Outputs

$out
$metricSection
$delegateSection

## When invoked

1. Read mandatory governance documents before making changes.
2. Stay within your domain - do not duplicate work owned by other agents.
3. Produce reusable systems in the correct module paths, not one-off implementations.
4. Document non-obvious decisions and known limitations.
5. Return a structured summary: what you did, what you verified, what remains, and any blockers.

## Mandatory governance

$gov

## Architecture constraints

- Build domains and systems, not temporary pages or features.
- Educational content is sacred - never hardcode lessons, vocabulary, kanji, or grammar in UI.
- Gamification reads educational progress; it never owns it.
- Core learning features must support offline operation.
- TypeScript strict mode - no untyped responses.
- Every user-owned resource requires RLS and authorization validation.

## Prime directive

Every decision must support **The Climb**. Educational quality wins over engagement metrics.
"@ | Out-File -FilePath $Path -Encoding utf8 -Force
}

$coreAgents = @(
    @{
        File = "product-manager-agent.md"
        Title = "Product Manager Agent"
        Role = "Product Leadership"
        Purpose = "Own the product vision and roadmap."
        Responsibilities = @("Product strategy", "Feature prioritization", "User stories", "User journeys", "Release planning", "Feature validation", "Success metrics")
        Authority = "High"
        Outputs = @("PRDs", "Roadmaps", "Feature specifications", "Milestone plans", "Success criteria")
        SuccessMetric = "Every feature supports measurable learning progress."
        SubAgents = @("roadmap-agent.md", "feature-planning-agent.md", "research-agent.md")
    },
    @{
        File = "software-architect-agent.md"
        Title = "Software Architect Agent"
        Role = "Technical Leadership"
        Purpose = "Design scalable systems."
        Responsibilities = @("System architecture", "Folder structures", "Service boundaries", "Technical standards", "Scalability planning", "Performance planning")
        Authority = "High"
        Outputs = @("Architecture documents", "Technical specifications", "Module blueprints", "Dependency maps")
        SuccessMetric = "Architecture remains clear as the codebase grows."
        SubAgents = @("system-design-agent.md", "module-architecture-agent.md", "performance-architect-agent.md")
    },
    @{
        File = "frontend-agent.md"
        Title = "Frontend Agent"
        Role = "User Interface Development"
        Purpose = "Create world-class user experiences."
        Responsibilities = @("Screens", "Components", "Navigation", "Interactions", "Responsiveness", "Accessibility")
        Authority = "Medium"
        Outputs = @("Pages", "Components", "Animations", "User interactions", "Frontend architecture")
        SuccessMetric = "Every screen feels native on mobile."
        SubAgents = @("navigation-agent.md", "component-agent.md", "mobile-ux-agent.md", "animation-agent.md", "theme-agent.md")
    },
    @{
        File = "backend-agent.md"
        Title = "Backend Agent"
        Role = "Business Logic Development"
        Purpose = "Create reliable backend systems."
        Responsibilities = @("APIs", "Services", "Domain logic", "Authentication integration", "Data workflows")
        Authority = "Medium"
        Outputs = @("Services", "APIs", "Business rules", "Data orchestration")
        SuccessMetric = "Backend remains modular and testable."
        SubAgents = @("api-agent.md", "authentication-agent.md", "notification-agent.md")
    },
    @{
        File = "database-agent.md"
        Title = "Database Agent"
        Role = "Data Architecture"
        Purpose = "Protect educational progress and system integrity."
        Responsibilities = @("Schema design", "Relationships", "Migrations", "Indexes", "Performance optimization", "RLS policies")
        Authority = "High"
        Outputs = @("Database schemas", "Migration plans", "Relationship diagrams", "Performance strategies")
        SuccessMetric = "No schema changes require major rewrites."
        SubAgents = @("schema-agent.md", "migration-agent.md", "database-performance-agent.md")
    },
    @{
        File = "content-agent.md"
        Title = "Content Agent"
        Role = "Educational Content Leadership"
        Purpose = "Ensure educational excellence."
        Responsibilities = @("JLPT structure", "Vocabulary organization", "Kanji systems", "Grammar systems", "Story content", "Dialogue systems")
        Authority = "High"
        Outputs = @("Learning architecture", "Curriculum plans", "Content structures", "Educational standards")
        SuccessMetric = "Every lesson supports measurable progress."
        SubAgents = @("jlpt-agent.md", "vocabulary-agent.md", "kanji-agent.md", "grammar-agent.md", "story-agent.md", "conversation-agent.md", "review-agent.md")
    },
    @{
        File = "gamification-agent.md"
        Title = "Gamification Agent"
        Role = "Progression Design"
        Purpose = "Increase motivation without harming learning."
        Responsibilities = @("Elevation system", "Levels", "Achievements", "Quests", "Leagues", "Rewards")
        Authority = "Medium"
        Outputs = @("Progression systems", "Reward systems", "Achievement structures", "Season systems")
        SuccessMetric = "Gamification supports learning. Never replaces learning."
        SubAgents = @("elevation-agent.md", "achievement-agent.md", "quest-agent.md", "league-agent.md", "economy-agent.md")
    },
    @{
        File = "qa-agent.md"
        Title = "QA Agent"
        Role = "Quality Assurance"
        Purpose = "Prevent regressions and failures."
        Responsibilities = @("Test planning", "Validation", "Bug prevention", "Release verification")
        Authority = "High"
        Outputs = @("Test plans", "Regression suites", "Quality reports")
        SuccessMetric = "Stable releases."
        SubAgents = @("unit-test-agent.md", "integration-test-agent.md", "e2e-agent.md")
    },
    @{
        File = "devops-agent.md"
        Title = "DevOps Agent"
        Role = "Infrastructure Management"
        Purpose = "Maintain deployment quality."
        Responsibilities = @("CI/CD", "Deployments", "Monitoring", "Logging", "Environment management")
        Authority = "Medium"
        Outputs = @("Pipelines", "Infrastructure docs", "Deployment strategies")
        SuccessMetric = "Reliable deployments."
        SubAgents = @("cicd-agent.md", "monitoring-agent.md")
    },
    @{
        File = "security-agent.md"
        Title = "Security Agent"
        Role = "Application Security"
        Purpose = "Protect users and data."
        Responsibilities = @("Security reviews", "Access control", "Data protection", "Permission systems", "Threat analysis")
        Authority = "High"
        Outputs = @("Security architecture", "Audit reports", "Security policies")
        SuccessMetric = "Security built into every feature."
        SubAgents = @("access-control-agent.md", "data-security-agent.md")
    },
    @{
        File = "accessibility-agent.md"
        Title = "Accessibility Agent"
        Role = "Accessibility Leadership"
        Purpose = "Ensure universal usability."
        Responsibilities = @("WCAG compliance", "Keyboard support", "Screen reader support", "Reduced motion support")
        Authority = "Medium"
        Outputs = @("Accessibility standards", "Accessibility audits")
        SuccessMetric = "Every feature remains accessible."
        SubAgents = @()
    },
    @{
        File = "analytics-agent.md"
        Title = "Analytics Agent"
        Role = "Learning Insights"
        Purpose = "Measure educational effectiveness."
        Responsibilities = @("Analytics architecture", "Event tracking", "Retention tracking", "Mastery tracking")
        Authority = "Medium"
        Outputs = @("Event models", "Analytics plans", "Insight dashboards")
        SuccessMetric = "Data improves learning outcomes."
        SubAgents = @("learning-analytics-agent.md", "product-analytics-agent.md")
    },
    @{
        File = "art-director-agent.md"
        Title = "Art Director Agent"
        Role = "Visual Leadership"
        Purpose = "Protect Noboru's visual identity."
        Responsibilities = @("Art direction", "Style guides", "Asset consistency", "Asset approval", "Visual quality")
        Authority = "High"
        Outputs = @("Art direction", "Asset standards", "Visual guidelines")
        SuccessMetric = "Every asset feels like it belongs to Noboru."
        SubAgents = @("mascot-agent.md", "avatar-agent.md", "icon-agent.md", "achievement-art-agent.md", "region-art-agent.md", "enemy-agent.md", "ui-art-agent.md")
    },
    @{
        File = "community-agent.md"
        Title = "Community Agent"
        Role = "Community Systems"
        Purpose = "Design healthy social experiences."
        Responsibilities = @("Friends", "Challenges", "Leagues", "Community events")
        Authority = "Medium"
        Outputs = @("Social systems", "Challenge systems", "Community features")
        SuccessMetric = "Social systems support motivation."
        SubAgents = @()
    },
    @{
        File = "admin-agent.md"
        Title = "Admin Agent"
        Role = "Administrative Systems"
        Purpose = "Provide operational control."
        Responsibilities = @("Admin tools", "Moderation", "Content management", "Asset management")
        Authority = "Medium"
        Outputs = @("Admin architecture", "Management workflows")
        SuccessMetric = "Everything manageable without developer intervention."
        SubAgents = @("content-management-agent.md", "moderation-agent.md", "analytics-dashboard-agent.md")
    },
    @{
        File = "mcp-agent.md"
        Title = "MCP Agent"
        Role = "Automation and Integration"
        Purpose = "Manage future MCP workflows."
        Responsibilities = @("MCP architecture", "Asset automation", "Integration workflows", "Automation pipelines")
        Authority = "Medium"
        Outputs = @("MCP specifications", "Workflow diagrams", "Integration plans")
        SuccessMetric = "External systems remain modular."
        SubAgents = @("asset-pipeline-agent.md", "mcp-integration-agent.md")
    }
)

$subAgents = @(
    @{ File = "roadmap-agent.md"; Title = "Roadmap Agent"; Parent = "Product Manager Agent"; Purpose = "Long-term planning."; Responsibilities = @("Milestones", "Releases", "Planning", "Prioritization"); Outputs = @("docs/mvp-roadmap.md", "release-plans.md") },
    @{ File = "feature-planning-agent.md"; Title = "Feature Planning Agent"; Parent = "Product Manager Agent"; Purpose = "Feature definition."; Responsibilities = @("User stories", "Acceptance criteria", "Scope management"); Outputs = @("docs/prd.md", "feature-prd.md") },
    @{ File = "research-agent.md"; Title = "Research Agent"; Parent = "Product Manager Agent"; Purpose = "Product research."; Responsibilities = @("Competitor analysis", "User needs", "Feature research"); Outputs = @("research-documents.md"); Readonly = $true; IsBackground = $true },
    @{ File = "system-design-agent.md"; Title = "System Design Agent"; Parent = "Software Architect Agent"; Purpose = "System architecture."; Responsibilities = @("Service architecture", "Dependency boundaries", "Scalability"); Outputs = @(".cursor/rules/architecture.mdc", "architecture documents") },
    @{ File = "module-architecture-agent.md"; Title = "Module Architecture Agent"; Parent = "Software Architect Agent"; Purpose = "Feature module design."; Responsibilities = @("Folder structures", "Feature boundaries", "Module blueprints"); Outputs = @("features/ structure", "module blueprints") },
    @{ File = "performance-architect-agent.md"; Title = "Performance Architect Agent"; Parent = "Software Architect Agent"; Purpose = "Performance planning."; Responsibilities = @("Load targets", "Caching strategy", "Bundle optimization"); Outputs = @(".cursor/rules/performance.mdc", "performance strategies") },
    @{ File = "navigation-agent.md"; Title = "Navigation Agent"; Parent = "Frontend Agent"; Purpose = "App navigation."; Responsibilities = @("Bottom nav", "Route structure", "Information architecture"); Outputs = @("lib/navigation/", "docs/information-architecture.md") },
    @{ File = "component-agent.md"; Title = "Component Agent"; Parent = "Frontend Agent"; Purpose = "UI component system."; Responsibilities = @("ShadCN components", "Design system components", "Reusability"); Outputs = @("components/ui/", "docs/design-system.md") },
    @{ File = "mobile-ux-agent.md"; Title = "Mobile UX Agent"; Parent = "Frontend Agent"; Purpose = "Mobile-first experience."; Responsibilities = @("Thumb reachability", "Touch targets", "Responsive layouts"); Outputs = @(".cursor/rules/uiux.mdc", "mobile UX patterns") },
    @{ File = "animation-agent.md"; Title = "Animation Agent"; Parent = "Frontend Agent"; Purpose = "Motion design."; Responsibilities = @("Framer Motion", "Transitions", "Feedback animations"); Outputs = @(".cursor/rules/animations.mdc", "animation patterns") },
    @{ File = "theme-agent.md"; Title = "Theme Agent"; Parent = "Frontend Agent"; Purpose = "Theme system."; Responsibilities = @("Dark mode", "Light mode", "Design tokens"); Outputs = @("app/globals.css", "tailwind.config.ts") },
    @{ File = "api-agent.md"; Title = "API Agent"; Parent = "Backend Agent"; Purpose = "API design."; Responsibilities = @("Route handlers", "Validation", "Typed responses"); Outputs = @("app/api/", "docs/api-specification.md") },
    @{ File = "authentication-agent.md"; Title = "Authentication Agent"; Parent = "Backend Agent"; Purpose = "Auth workflows."; Responsibilities = @("Supabase Auth", "Session management", "Guest mode"); Outputs = @("features/authentication/", "auth flows") },
    @{ File = "notification-agent.md"; Title = "Notification Agent"; Parent = "Backend Agent"; Purpose = "User notifications."; Responsibilities = @("Push notifications", "In-app notifications", "Reminder scheduling"); Outputs = @("features/notifications/", "notification system") },
    @{ File = "schema-agent.md"; Title = "Schema Agent"; Parent = "Database Agent"; Purpose = "Database schema."; Responsibilities = @("Table design", "Relationships", "RLS policies"); Outputs = @("docs/database-schema.md", "supabase/migrations/") },
    @{ File = "migration-agent.md"; Title = "Migration Agent"; Parent = "Database Agent"; Purpose = "Schema migrations."; Responsibilities = @("Migration files", "Rollback plans", "Version control"); Outputs = @("supabase/migrations/", "migration plans") },
    @{ File = "database-performance-agent.md"; Title = "Database Performance Agent"; Parent = "Database Agent"; Purpose = "Query performance."; Responsibilities = @("Indexes", "Query optimization", "Connection pooling"); Outputs = @("performance strategies", "index plans") },
    @{ File = "jlpt-agent.md"; Title = "JLPT Agent"; Parent = "Content Agent"; Purpose = "JLPT curriculum structure."; Responsibilities = @("N5-N1 structure", "Level progression", "Region mapping"); Outputs = @("docs/jlpt-content-architecture.md") },
    @{ File = "vocabulary-agent.md"; Title = "Vocabulary Agent"; Parent = "Content Agent"; Purpose = "Vocabulary systems."; Responsibilities = @("Word lists", "Readings", "Meanings", "JLPT tagging"); Outputs = @("features/vocabulary/", "vocabulary content") },
    @{ File = "kanji-agent.md"; Title = "Kanji Agent"; Parent = "Content Agent"; Purpose = "Kanji systems."; Responsibilities = @("Kanji data", "Readings", "Radicals", "Stroke order"); Outputs = @("features/kanji/", "kanji content") },
    @{ File = "grammar-agent.md"; Title = "Grammar Agent"; Parent = "Content Agent"; Purpose = "Grammar systems."; Responsibilities = @("Grammar points", "Examples", "JLPT levels"); Outputs = @("features/grammar/", "grammar content") },
    @{ File = "story-agent.md"; Title = "Story Agent"; Parent = "Content Agent"; Purpose = "Story content."; Responsibilities = @("Narrative lessons", "Region stories", "Character dialogue"); Outputs = @("story content", "narrative systems") },
    @{ File = "conversation-agent.md"; Title = "Conversation Agent"; Parent = "Content Agent"; Purpose = "Dialogue systems."; Responsibilities = @("Conversation practice", "Dialogue trees", "Speech patterns"); Outputs = @("dialogue content", "conversation systems") },
    @{ File = "review-agent.md"; Title = "Review Agent"; Parent = "Content Agent"; Purpose = "SRS and review logic."; Responsibilities = @("Spaced repetition", "Review queues", "Mastery thresholds"); Outputs = @("features/review/", "SRS algorithms") },
    @{ File = "elevation-agent.md"; Title = "Elevation Agent"; Parent = "Gamification Agent"; Purpose = "Elevation progression."; Responsibilities = @("XP system", "Level thresholds", "Trail advancement"); Outputs = @("elevation system", "progression rules") },
    @{ File = "achievement-agent.md"; Title = "Achievement Agent"; Parent = "Gamification Agent"; Purpose = "Achievement system."; Responsibilities = @("Badges", "Milestones", "Unlock conditions"); Outputs = @("features/achievements/", "achievement definitions") },
    @{ File = "quest-agent.md"; Title = "Quest Agent"; Parent = "Gamification Agent"; Purpose = "Daily quests."; Responsibilities = @("Quest generation", "Daily goals", "Reward assignment"); Outputs = @("quest system", "daily quest rules") },
    @{ File = "league-agent.md"; Title = "League Agent"; Parent = "Gamification Agent"; Purpose = "Competitive leagues."; Responsibilities = @("League structure", "Ranking", "Seasons"); Outputs = @("features/leagues/", "league system") },
    @{ File = "economy-agent.md"; Title = "Economy Agent"; Parent = "Gamification Agent"; Purpose = "In-app economy."; Responsibilities = @("Currency", "Shop items", "Reward balance"); Outputs = @("features/shop/", "economy-system.md") },
    @{ File = "unit-test-agent.md"; Title = "Unit Test Agent"; Parent = "QA Agent"; Purpose = "Code validation."; Responsibilities = @("Unit tests", "Test coverage"); Outputs = @("unit-test-suites", "features/*/tests/") },
    @{ File = "integration-test-agent.md"; Title = "Integration Test Agent"; Parent = "QA Agent"; Purpose = "Feature validation."; Responsibilities = @("System testing", "Integration testing"); Outputs = @("integration-tests", "tests/") },
    @{ File = "e2e-agent.md"; Title = "E2E Agent"; Parent = "QA Agent"; Purpose = "User flow testing."; Responsibilities = @("Full user journeys", "Automation testing"); Outputs = @("e2e-tests", "Playwright suites") },
    @{ File = "cicd-agent.md"; Title = "CI/CD Agent"; Parent = "DevOps Agent"; Purpose = "Deployment automation."; Responsibilities = @("Pipelines", "Build validation"); Outputs = @("cicd-spec.md", "GitHub Actions") },
    @{ File = "monitoring-agent.md"; Title = "Monitoring Agent"; Parent = "DevOps Agent"; Purpose = "System health."; Responsibilities = @("Monitoring", "Alerting", "Logging"); Outputs = @("monitoring-spec.md", "docs/deployment.md"); Readonly = $true },
    @{ File = "access-control-agent.md"; Title = "Access Control Agent"; Parent = "Security Agent"; Purpose = "Permissions."; Responsibilities = @("Roles", "Access control", "RLS review"); Outputs = @("permission-system.md", "security policies"); Readonly = $true },
    @{ File = "data-security-agent.md"; Title = "Data Security Agent"; Parent = "Security Agent"; Purpose = "Data protection."; Responsibilities = @("Encryption", "Secure storage", "PII handling"); Outputs = @("security-policies.md", ".cursor/rules/security.mdc"); Readonly = $true },
    @{ File = "learning-analytics-agent.md"; Title = "Learning Analytics Agent"; Parent = "Analytics Agent"; Purpose = "Educational metrics."; Responsibilities = @("Mastery tracking", "Learning insights"); Outputs = @("learning-analytics.md", "features/analytics/") },
    @{ File = "product-analytics-agent.md"; Title = "Product Analytics Agent"; Parent = "Analytics Agent"; Purpose = "Product metrics."; Responsibilities = @("Retention", "Engagement", "Conversion"); Outputs = @("product-analytics.md", "event models") },
    @{ File = "mascot-agent.md"; Title = "Mascot Agent"; Parent = "Art Director Agent"; Purpose = "Maintain Yama."; Responsibilities = @("Expressions", "Poses", "Variants", "Animation references"); Outputs = @("assets/mascots/", "docs/art-direction.md") },
    @{ File = "avatar-agent.md"; Title = "Avatar Agent"; Parent = "Art Director Agent"; Purpose = "User avatars."; Responsibilities = @("Avatar generation", "Style consistency", "Unlock variants"); Outputs = @("assets/avatars/", "avatar-system.md") },
    @{ File = "icon-agent.md"; Title = "Icon Agent"; Parent = "Art Director Agent"; Purpose = "Icon system."; Responsibilities = @("Navigation icons", "Feature icons", "Achievement icons"); Outputs = @("assets/icons/", "icon-library.md") },
    @{ File = "achievement-art-agent.md"; Title = "Achievement Art Agent"; Parent = "Art Director Agent"; Purpose = "Badge design."; Responsibilities = @("Achievement visuals", "Rarity visuals"); Outputs = @("assets/achievements/", "achievement-art-guide.md") },
    @{ File = "region-art-agent.md"; Title = "Region Art Agent"; Parent = "Art Director Agent"; Purpose = "World building."; Responsibilities = @("Region visuals", "Trails", "Summits", "Landmarks"); Outputs = @("assets/regions/", "region-art-guide.md") },
    @{ File = "enemy-agent.md"; Title = "Enemy Agent"; Parent = "Art Director Agent"; Purpose = "Boss and enemy visuals."; Responsibilities = @("Trial guardians", "Bosses", "Event enemies"); Outputs = @("assets/enemies/", "assets/bosses/", "enemy-catalog.md") },
    @{ File = "ui-art-agent.md"; Title = "UI Art Agent"; Parent = "Art Director Agent"; Purpose = "Interface artwork."; Responsibilities = @("Loading screens", "Empty states", "Illustrations"); Outputs = @("assets/ui/", "assets/loading/", "ui-art-guide.md") },
    @{ File = "asset-pipeline-agent.md"; Title = "Asset Pipeline Agent"; Parent = "MCP Agent"; Purpose = "Asset automation."; Responsibilities = @("Asset workflows", "Metadata creation", "Registry updates"); Outputs = @("docs/asset-pipeline.md", "docs/asset-registry.md") },
    @{ File = "mcp-integration-agent.md"; Title = "MCP Integration Agent"; Parent = "MCP Agent"; Purpose = "External integrations."; Responsibilities = @("MCP compatibility", "Workflow definitions"); Outputs = @("services/mcp/", "mcp-architecture.md") },
    @{ File = "content-management-agent.md"; Title = "Content Management Agent"; Parent = "Admin Agent"; Purpose = "Educational content operations."; Responsibilities = @("Content editing", "Publishing workflows"); Outputs = @("docs/admin-panel-spec.md", "cms-architecture.md") },
    @{ File = "moderation-agent.md"; Title = "Moderation Agent"; Parent = "Admin Agent"; Purpose = "Community safety."; Responsibilities = @("Reports", "User moderation"); Outputs = @("moderation-system.md", "admin moderation tools") },
    @{ File = "analytics-dashboard-agent.md"; Title = "Analytics Dashboard Agent"; Parent = "Admin Agent"; Purpose = "Admin insights."; Responsibilities = @("Dashboards", "Reports"); Outputs = @("admin-analytics.md", "admin dashboards") }
)

foreach ($agent in $coreAgents) {
    $govPath = Join-Path $coreDir $agent.File
    $cursorPath = Join-Path $cursorDir $agent.File
    $slug = Get-AgentSlug $agent.File
    $description = Get-CursorDescription -Title $agent.Title -Purpose $agent.Purpose -Responsibilities $agent.Responsibilities -SubAgents $agent.SubAgents

    Write-AgentFile -Path $govPath -Title $agent.Title -Role $agent.Role -Purpose $agent.Purpose -Responsibilities $agent.Responsibilities -Authority $agent.Authority -Outputs $agent.Outputs -SuccessMetric $agent.SuccessMetric -SubAgents $agent.SubAgents
    Write-CursorSubagentFile -Path $cursorPath -Name $slug -Description $description -Title $agent.Title -Role $agent.Role -Purpose $agent.Purpose -Responsibilities $agent.Responsibilities -Authority $agent.Authority -Outputs $agent.Outputs -SuccessMetric $agent.SuccessMetric -SubAgents $agent.SubAgents
}

foreach ($sub in $subAgents) {
    $govPath = Join-Path $subDir $sub.File
    $cursorPath = Join-Path $cursorDir $sub.File
    $slug = Get-AgentSlug $sub.File
    $description = Get-CursorDescription -Title $sub.Title -Purpose $sub.Purpose -Responsibilities $sub.Responsibilities -ParentAgent $sub.Parent
    $readonly = if ($sub.Readonly) { $sub.Readonly } else { $false }
    $background = if ($sub.IsBackground) { $sub.IsBackground } else { $false }

    Write-AgentFile -Path $govPath -Title $sub.Title -Role "Sub-Agent" -Purpose $sub.Purpose -Responsibilities $sub.Responsibilities -Authority "Specialist" -Outputs $sub.Outputs -ParentAgent $sub.Parent
    Write-CursorSubagentFile -Path $cursorPath -Name $slug -Description $description -Title $sub.Title -Role "Sub-Agent" -Purpose $sub.Purpose -Responsibilities $sub.Responsibilities -Authority "Specialist" -Outputs $sub.Outputs -ParentAgent $sub.Parent -Readonly $readonly -IsBackground $background
}

Write-Output "Generated $($coreAgents.Count) core + $($subAgents.Count) sub governance files and $($coreAgents.Count + $subAgents.Count) Cursor subagents."
