import { ProjectCard as ProjectCardType } from "@/data/types";
import { getHealthColor, getPhaseColor } from "@/lib/projectUtils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Props {
  project: ProjectCardType;
  isExecutiveView: boolean;
}

export default function ProjectCard({ project, isExecutiveView }: Props) {
  const [expanded, setExpanded] = useState(!isExecutiveView);
  const health = getHealthColor(project.health);
  const phaseColor = getPhaseColor(project.phase);

  const displayName = project.site ? `${project.customer} – ${project.site}` : project.customer;

  return (
    <div className="bg-card rounded-lg border print-avoid-break">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 flex-wrap min-w-0">
          {!isExecutiveView && (
            expanded ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
          <div className="min-w-0">
            <div className="font-semibold text-foreground truncate">{project.project}</div>
            {project.system && <div className="text-xs text-muted-foreground">{project.system}</div>}
          </div>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${phaseColor}`}>{project.phase}</span>
          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${health.bg} ${health.text} ${health.border}`}>
            {project.health}
          </span>
          {project.owner && <span className="text-xs text-muted-foreground">Owner: {project.owner}</span>}
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{project.lastUpdated}</span>
      </div>

      {/* Executive one-liner */}
      {isExecutiveView && (
        <div className="px-4 pb-3 text-sm text-muted-foreground">
          {project.summary}
          {project.nextSteps.length > 0 && (
            <span className="ml-2 text-foreground font-medium">→ {project.nextSteps[0]}</span>
          )}
        </div>
      )}

      {/* Detailed body */}
      {!isExecutiveView && expanded && (
        <div className="px-4 pb-4 space-y-3 border-t pt-3">
          {/* Summary */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Summary</h4>
            <p className="text-sm text-foreground">{project.summary}</p>
          </div>

          {/* Key Dates */}
          {project.keyDates.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Key Dates</h4>
              <ul className="text-sm text-foreground space-y-0.5">
                {project.keyDates.map((d, i) => <li key={i} className="flex items-start gap-1.5"><span className="text-muted-foreground">•</span>{d}</li>)}
              </ul>
            </div>
          )}

          {/* Open Issues */}
          {project.openIssues.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Open Issues / Risks</h4>
              <ul className="text-sm text-foreground space-y-0.5">
                {project.openIssues.map((d, i) => <li key={i} className="flex items-start gap-1.5"><span className="text-status-caution">•</span>{d}</li>)}
              </ul>
            </div>
          )}

          {/* Next Steps */}
          {project.nextSteps.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Next Steps</h4>
              <ul className="text-sm text-foreground space-y-0.5">
                {project.nextSteps.map((d, i) => <li key={i} className="flex items-start gap-1.5"><span className="text-primary">→</span>{d}</li>)}
              </ul>
            </div>
          )}

          {/* Recent Highlights */}
          {project.recentHighlights.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Recent Highlights</h4>
              <ul className="text-sm text-foreground space-y-0.5">
                {project.recentHighlights.map((d, i) => <li key={i} className="flex items-start gap-1.5"><span className="text-status-on-track">✓</span>{d}</li>)}
              </ul>
            </div>
          )}

          {/* Recent Deployments */}
          {project.recentDeployments && project.recentDeployments.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Recent Deployments</h4>
              <ul className="text-sm text-foreground space-y-0.5">
                {project.recentDeployments.map((d, i) => <li key={i} className="flex items-start gap-1.5"><span className="text-primary">🚀</span>{d}</li>)}
              </ul>
            </div>
          )}

          {/* RM Tickets */}
          {project.rmTickets.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">RM / Redmine References</h4>
              <div className="space-y-1">
                {project.rmTickets.map((t) => (
                  <div key={t.id} className="text-sm flex items-center gap-2">
                    <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-status-info-bg text-status-info font-medium">{t.id}</span>
                    <span className="text-foreground">{t.description}</span>
                    <span className="text-xs text-muted-foreground">— {t.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
