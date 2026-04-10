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

  return (
    <div className="bg-card rounded-lg border print-avoid-break">
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

      {isExecutiveView && (
        <div className="px-4 pb-3 text-sm text-muted-foreground">
          {project.summary}
          {project.nextSteps.length > 0 && (
            <span className="ml-2 text-foreground font-medium">→ {project.nextSteps[0]}</span>
          )}
        </div>
      )}

      {!isExecutiveView && expanded && (
        <div className="px-4 pb-4 space-y-3 border-t pt-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-md border p-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Macro View</h4>
              <p className="text-sm text-foreground mb-2">{project.summary}</p>
              {project.keyDates.length > 0 && <p className="text-xs text-muted-foreground">Next milestone: {project.keyDates[0]}</p>}
            </div>
            <div className="rounded-md border p-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Micro View</h4>
              {project.openIssues.length > 0 ? (
                <ul className="text-sm text-foreground space-y-0.5">
                  {project.openIssues.slice(0, 3).map((d, i) => <li key={i} className="flex items-start gap-1.5"><span className="text-status-caution">•</span>{d}</li>)}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No active issues.</p>
              )}
            </div>
          </div>

          {project.nextSteps.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Next Steps</h4>
              <ul className="text-sm text-foreground space-y-0.5">
                {project.nextSteps.map((d, i) => <li key={i} className="flex items-start gap-1.5"><span className="text-primary">→</span>{d}</li>)}
              </ul>
            </div>
          )}

          <div className="no-print-detail space-y-3">
            {project.recentHighlights.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Recent Highlights</h4>
                <ul className="text-sm text-foreground space-y-0.5">
                  {project.recentHighlights.map((d, i) => <li key={i} className="flex items-start gap-1.5"><span className="text-status-on-track">✓</span>{d}</li>)}
                </ul>
              </div>
            )}

            {project.recentDeployments && project.recentDeployments.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Recent Deployments</h4>
                <ul className="text-sm text-foreground space-y-0.5">
                  {project.recentDeployments.map((d, i) => <li key={i} className="flex items-start gap-1.5"><span className="text-primary">🚀</span>{d}</li>)}
                </ul>
              </div>
            )}

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
        </div>
      )}
    </div>
  );
}
