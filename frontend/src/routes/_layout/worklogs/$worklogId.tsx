import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  User,
  Calendar,
} from "lucide-react";

import {
  getWorklogById,
  getFreelancer,
  formatCurrency,
  type WorkLog,
  type Freelancer,
} from "@/data/mock";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_layout/worklogs/$worklogId")({
  component: WorklogDetailPage,
  head: () => ({
    meta: [{ title: "Worklog Details - Payment Dashboard" }],
  }),
});

function WorklogDetailPage() {
  const { worklogId } = Route.useParams();
  const worklog = getWorklogById(worklogId);

  if (!worklog) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-lg font-semibold">Worklog not found</h2>
        <p className="text-muted-foreground mb-4">
          The worklog you're looking for doesn't exist.
        </p>
        <Link to="/worklogs">
          <Button variant="outline">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Worklogs
          </Button>
        </Link>
      </div>
    );
  }

  const freelancer = getFreelancer(worklog.freelancerId);

  return <WorklogDetail worklog={worklog} freelancer={freelancer} />;
}

function WorklogDetail({
  worklog,
  freelancer,
}: {
  worklog: WorkLog;
  freelancer: Freelancer | undefined;
}) {
  const [includedEntries, setIncludedEntries] = useState<Set<string>>(
    () => new Set(worklog.timeEntries.map((e) => e.id))
  );

  const toggleEntry = (id: string) => {
    setIncludedEntries((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (includedEntries.size === worklog.timeEntries.length) {
      setIncludedEntries(new Set());
    } else {
      setIncludedEntries(new Set(worklog.timeEntries.map((e) => e.id)));
    }
  };

  const includedHours = useMemo(() => {
    return worklog.timeEntries
      .filter((e) => includedEntries.has(e.id))
      .reduce((sum, e) => sum + e.hours, 0);
  }, [worklog.timeEntries, includedEntries]);

  const includedEarnings = useMemo(() => {
    if (!freelancer) return 0;
    return includedHours * freelancer.rate;
  }, [includedHours, freelancer]);

  const totalHours = worklog.timeEntries.reduce((sum, e) => sum + e.hours, 0);

  const allIncluded = includedEntries.size === worklog.timeEntries.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Back button */}
      <Link to="/worklogs">
        <Button variant="ghost" size="sm" className="w-fit">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Worklogs
        </Button>
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {worklog.taskName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Worklog details and time entries
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Freelancer</p>
              <p className="font-semibold">{freelancer?.name ?? "Unknown"}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hourly Rate</p>
              <p className="font-semibold">
                {formatCurrency(freelancer?.rate ?? 0)}/hr
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Included Hours</p>
              <p className="font-semibold tabular-nums">
                {includedHours}h{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  / {totalHours}h
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Included Earnings</p>
              <p className="font-semibold tabular-nums text-lg">
                {formatCurrency(includedEarnings)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Time Entries ({includedEntries.size}/{worklog.timeEntries.length}{" "}
            included)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    id="select-all-entries"
                    checked={allIncluded}
                    onCheckedChange={toggleAll}
                    aria-label="Include all time entries"
                  />
                </TableHead>
                <TableHead>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> Date
                  </span>
                </TableHead>
                <TableHead className="text-right">Hours</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {worklog.timeEntries.map((entry) => {
                const isIncluded = includedEntries.has(entry.id);
                const amount = (freelancer?.rate ?? 0) * entry.hours;
                return (
                  <TableRow
                    key={entry.id}
                    data-state={isIncluded ? "selected" : undefined}
                    className={!isIncluded ? "opacity-50" : ""}
                  >
                    <TableCell>
                      <Checkbox
                        id={`entry-${entry.id}`}
                        checked={isIncluded}
                        onCheckedChange={() => toggleEntry(entry.id)}
                        aria-label={`Include entry from ${entry.date}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {entry.date}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium">
                      {entry.hours}h
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {entry.description}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">
                      {isIncluded ? formatCurrency(amount) : "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
