import type { Task } from "@doist/todoist-api-typescript";
import {
  differenceInCalendarDays,
  formatRelative,
  isBefore,
  isSameDay,
  parseISO,
} from "date-fns";
import {
  CalendarIcon,
  CircleCheckIcon,
  CircleIcon,
  ListTreeIcon,
  MessageSquare,
  RefreshCwIcon,
  TagIcon,
} from "lucide-react";
import { Badge } from "./ui/badge";

function isOverdue(task: Task) {
  if (!task.due) {
    // can't be overdue without a due date
    return true;
  } else if (task.due.datetime) {
    // if time provided, just check if it's before now
    return isBefore(parseISO(task.due.datetime), new Date());
  } else {
    // only date was provided
    if (isSameDay(parseISO(task.due.date), new Date())) {
      // if on the same day, not overdue yet
      return false;
    } else {
      // otherwise check if it's before now
      return isBefore(parseISO(task.due.date), new Date());
    }
  }
}

function getDateCategory(task: Task) {
  if (!task.due) {
    return "indef";
  } else if (isOverdue(task)) {
    return "overdue";
  }

  const daysAway = differenceInCalendarDays(
    parseISO(task.due.datetime ?? task.due.date),
    new Date(),
  );

  if (daysAway === 0) {
    return "today";
  } else if (daysAway === 1) {
    return "tmr";
  } else if (daysAway >= 2 && daysAway <= 7) {
    return "soon";
  } else if (daysAway >= 8) {
    return "far";
  }
}

function toTitleCase(str: string) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function toSortaSentenceCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function TaskItem({ task, tasks }: { task: Task; tasks: Task[] }) {
  const dateCategory = getDateCategory(task);

  return (
    <div className="ml-4 flex gap-2">
      <a href={task.url} target="_blank">
        {task.isCompleted ? (
          <CircleCheckIcon />
        ) : (
          <CircleIcon
            className={`${task.priority > 1 && "stroke-3"} ${task.priority === 4 ? "fill-red-700/20 text-red-700/80 dark:text-red-600/80" : task.priority === 3 ? "fill-orange-500/20 text-orange-500/80 dark:text-orange-500/80" : task.priority === 2 ? "fill-blue-700/20 text-blue-700/80 dark:text-blue-600/80" : "text-zinc-500/80"}`}
          />
        )}
      </a>

      <div>
        <p>{task.content}</p>

        {task.description && (
          <p className="text-muted-foreground text-sm">{task.description}</p>
        )}

        {task.due && (
          <Badge
            variant="secondary"
            className={`mt-1 mr-2 font-normal ${dateCategory === "overdue" ? "bg-red-500/20 text-red-800 dark:text-red-200" : dateCategory === "today" ? "bg-green-500/20 text-green-800 dark:text-green-200" : dateCategory === "tmr" ? "bg-yellow-500/20 text-yellow-800 dark:text-yellow-200" : dateCategory === "soon" ? "bg-purple-500/20 text-purple-800 dark:text-purple-200" : ""}`}
          >
            <CalendarIcon className="opacity-50" />
            {toSortaSentenceCase(
              formatRelative(
                parseISO(task.due.datetime ?? task.due.date),
                new Date(),
              ).replace("at 12:00 AM", ""),
            )}
          </Badge>
        )}

        {task.due?.isRecurring && (
          <Badge variant="secondary" className="mt-1 mr-2 font-normal">
            <RefreshCwIcon className="opacity-50" />
            {toTitleCase(task.due.string)}
          </Badge>
        )}

        {task.parentId && (
          <Badge variant="secondary" className="mt-1 mr-2 font-normal">
            <ListTreeIcon className="opacity-50" />
            {tasks.find((t) => t.id === task.parentId)?.content}
          </Badge>
        )}

        {task.commentCount > 0 && (
          <Badge variant="secondary" className="mt-1 mr-2 font-normal">
            <MessageSquare className="opacity-50" />
            {task.commentCount}
          </Badge>
        )}

        {task.labels.map((label) => (
          <Badge variant="secondary" className="mt-1 mr-2">
            <TagIcon className="text-muted-foreground" />
            {label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
