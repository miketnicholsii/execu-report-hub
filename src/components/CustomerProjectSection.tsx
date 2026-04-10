import { ProjectCard as ProjectCardType } from "@/data/types";
import { getCustomerGroups } from "@/lib/projectUtils";
import ProjectCard from "./ProjectCard";

interface Props {
  projects: ProjectCardType[];
  isExecutiveView: boolean;
}

export default function CustomerProjectSection({ projects, isExecutiveView }: Props) {
  const groups = getCustomerGroups(projects);

  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-4">Projects by Customer</h2>
      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.name} id={`customer-${group.name.replace(/\s+/g, "-").toLowerCase()}`}>
            <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
              {group.name}
              <span className="text-xs font-normal text-muted-foreground">({group.projects.length} project{group.projects.length !== 1 ? "s" : ""})</span>
            </h3>
            <div className="space-y-2">
              {group.projects.map((p) => (
                <ProjectCard key={p.id} project={p} isExecutiveView={isExecutiveView} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
