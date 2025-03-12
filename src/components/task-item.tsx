import type { Task } from "@doist/todoist-api-typescript";
import {
  CalendarIcon,
  CircleCheckIcon,
  CircleIcon,
  TagIcon,
} from "lucide-react";
import { Badge } from "./ui/badge";

export function TaskItem({ task }: { task: Task }) {
  return (
    <div className="ml-4 flex gap-2">
      {task.isCompleted ? (
        <CircleCheckIcon />
      ) : (
        <div>
          <CircleIcon
            className={`${task.priority > 1 && "stroke-3"} ${task.priority === 4 ? "fill-red-500/20 text-red-500" : task.priority === 3 ? "fill-orange-500/20 text-orange-500" : task.priority === 2 ? "fill-blue-500/20 text-blue-500" : "text-zinc-500"}`}
          />
        </div>
      )}
      <div>
        <p>{task.content}</p>
        {task.description && (
          <p className="text-muted-foreground text-sm">{task.description}</p>
        )}
        {task.due && (
          <Badge variant="secondary" className="mt-1 mr-2">
            <CalendarIcon className="text-muted-foreground" />
            Due {task.due.string}
          </Badge>
        )}
        {task.labels.map((label) => (
          <Badge variant="secondary" className="mt-1 mr-2">
            <TagIcon className="text-muted-foreground" />
            {label}
          </Badge>
        ))}
        {/* {task.priority > 1 && (
          <Badge variant="secondary" className="mr-2">
            Priority {5 - task.priority}
          </Badge>
        )} */}
      </div>
    </div>
  );
}
