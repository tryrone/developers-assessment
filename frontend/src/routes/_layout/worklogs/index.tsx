import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ClipboardList,
  Calendar,
  ArrowRight,
  Search,
  DollarSign,
  Clock,
  CheckCircle2,
} from "lucide-react";

import {
  worklogs,
  getFreelancer,
  getTotalHours,
  getTotalEarnings,
  formatCurrency,
  getWorklogDateRange,
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_layout/worklogs/")({
  component: WorklogsPage,
  head: () => ({
    meta: [{ title: "Worklogs - Payment Dashboard" }],
  }),
});

function WorklogsPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filter worklogs by date range
  const filteredWorklogs = useMemo(() => {
    return worklogs.filter((wl) => {
      const range = getWorklogDateRange(wl);
      if (startDate && range.latest < startDate) return false;
      if (endDate && range.earliest > endDate) return false;
      return true;
    });
  }, [startDate, endDate]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredWorklogs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredWorklogs.map((wl) => wl.id)));
    }
  };

  const selectedTotal = useMemo(() => {
    return filteredWorklogs
      .filter((wl) => selectedIds.has(wl.id))
      .reduce((sum, wl) => sum + getTotalEarnings(wl), 0);
  }, [filteredWorklogs, selectedIds]);

  const selectedHours = useMemo(() => {
    return filteredWorklogs
      .filter((wl) => selectedIds.has(wl.id))
      .reduce((sum, wl) => sum + getTotalHours(wl), 0);
  }, [filteredWorklogs, selectedIds]);

  const allSelected =
    filteredWorklogs.length > 0 && selectedIds.size === filteredWorklogs.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Worklogs</h1>
          <p className="text-muted-foreground">
            Review freelancer work and process payments
          </p>
        </div>
        {selectedIds.size > 0 && (
          <Link
            to="/payment-review"
            search={{ ids: Array.from(selectedIds).join(",") }}
          >
            <Button id="review-payment-btn" size="lg">
              Review Payment
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Worklogs</p>
              <p className="text-2xl font-bold">{filteredWorklogs.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Selected</p>
              <p className="text-2xl font-bold">
                {selectedIds.size}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  worklogs
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Selected Total</p>
              <p className="text-2xl font-bold">
                {formatCurrency(selectedTotal)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date Filter */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by date:</span>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="start-date" className="text-sm text-muted-foreground">
            From
          </label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-auto"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="end-date" className="text-sm text-muted-foreground">
            To
          </label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-auto"
          />
        </div>
        {(startDate || endDate) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Worklogs Table */}
      {filteredWorklogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No worklogs found</h3>
          <p className="text-muted-foreground">
            {startDate || endDate
              ? "Try adjusting your date filter"
              : "No worklogs available"}
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox
                  id="select-all"
                  checked={allSelected}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all worklogs"
                />
              </TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Freelancer</TableHead>
              <TableHead>Date Range</TableHead>
              <TableHead className="text-right">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Hours
                </span>
              </TableHead>
              <TableHead className="text-right">
                <span className="inline-flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" /> Earnings
                </span>
              </TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWorklogs.map((wl) => {
              const freelancer = getFreelancer(wl.freelancerId);
              const totalHours = getTotalHours(wl);
              const totalEarnings = getTotalEarnings(wl);
              const range = getWorklogDateRange(wl);
              const isSelected = selectedIds.has(wl.id);

              return (
                <TableRow
                  key={wl.id}
                  data-state={isSelected ? "selected" : undefined}
                >
                  <TableCell>
                    <Checkbox
                      id={`select-${wl.id}`}
                      checked={isSelected}
                      onCheckedChange={() => toggleSelection(wl.id)}
                      aria-label={`Select ${wl.taskName}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{wl.taskName}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{freelancer?.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatCurrency(freelancer?.rate ?? 0)}/hr
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {range.earliest} → {range.latest}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {totalHours}h
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {formatCurrency(totalEarnings)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      to="/worklogs/$worklogId"
                      params={{ worklogId: wl.id }}
                    >
                      <Button variant="ghost" size="sm" id={`view-${wl.id}`}>
                        View
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Bottom selection bar */}
      {selectedIds.size > 0 && (
        <div className="sticky bottom-4 mx-auto">
          <div className="flex items-center gap-6 rounded-xl border bg-card px-6 py-3 shadow-lg">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="font-medium">{selectedIds.size} selected</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="tabular-nums">{selectedHours}h</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2 text-sm font-semibold">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="tabular-nums">
                {formatCurrency(selectedTotal)}
              </span>
            </div>
            <div className="h-4 w-px bg-border" />
            <Link
              to="/payment-review"
              search={{ ids: Array.from(selectedIds).join(",") }}
            >
              <Button size="sm" id="review-payment-bottom-btn">
                Review Payment
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
