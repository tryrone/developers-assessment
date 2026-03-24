import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useState, useMemo } from "react"
import { toast } from "sonner"
import {
  ArrowLeft,
  X,
  DollarSign,
  Clock,
  Users,
  CheckCircle2,
  Trash2,
} from "lucide-react"

import {
  worklogs,
  getFreelancer,
  getTotalHours,
  getTotalEarnings,
  formatCurrency,
  type WorkLog,
  type Freelancer,
} from "@/data/mock"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type SearchParams = {
  ids?: string
}

export const Route = createFileRoute("/_layout/payment-review")({
  component: PaymentReviewPage,
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    ids: (search.ids as string) || "",
  }),
  head: () => ({
    meta: [{ title: "Payment Review - Payment Dashboard" }],
  }),
})

function PaymentReviewPage() {
  const { ids } = Route.useSearch()
  const navigate = useNavigate()
  const initialIds = ids ? ids.split(",").filter(Boolean) : []

  const [selectedWorklogIds, setSelectedWorklogIds] = useState<Set<string>>(
    () => new Set(initialIds)
  )

  const selectedWorklogs = useMemo(() => {
    return worklogs.filter((wl) => selectedWorklogIds.has(wl.id))
  }, [selectedWorklogIds])

  // Group by freelancer
  const groupedByFreelancer = useMemo(() => {
    const groups = new Map<
      string,
      { freelancer: Freelancer; worklogs: WorkLog[] }
    >()

    for (const wl of selectedWorklogs) {
      const freelancer = getFreelancer(wl.freelancerId)
      if (!freelancer) continue

      if (!groups.has(freelancer.id)) {
        groups.set(freelancer.id, { freelancer, worklogs: [] })
      }
      groups.get(freelancer.id)!.worklogs.push(wl)
    }

    return Array.from(groups.values())
  }, [selectedWorklogs])

  const totals = useMemo(() => {
    const hours = selectedWorklogs.reduce(
      (sum, wl) => sum + getTotalHours(wl),
      0
    )
    const earnings = selectedWorklogs.reduce(
      (sum, wl) => sum + getTotalEarnings(wl),
      0
    )
    return { hours, earnings, count: selectedWorklogs.length, freelancers: groupedByFreelancer.length }
  }, [selectedWorklogs, groupedByFreelancer])

  const removeWorklog = (id: string) => {
    setSelectedWorklogIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const removeFreelancer = (freelancerId: string) => {
    setSelectedWorklogIds((prev) => {
      const next = new Set(prev)
      const toRemove = worklogs
        .filter((wl) => wl.freelancerId === freelancerId)
        .map((wl) => wl.id)
      for (const id of toRemove) {
        next.delete(id)
      }
      return next
    })
  }

  const confirmPayment = () => {
    toast.success(
      `Payment of ${formatCurrency(totals.earnings)} confirmed for ${totals.freelancers} freelancer(s)!`,
      {
        description: `${totals.count} worklogs totalling ${totals.hours} hours processed.`,
      }
    )
    navigate({ to: "/worklogs" })
  }

  if (selectedWorklogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="rounded-full bg-muted p-4 mb-4">
          <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold">No worklogs selected</h2>
        <p className="text-muted-foreground mb-4">
          Go back to select worklogs for payment.
        </p>
        <Link to="/worklogs">
          <Button variant="outline">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Worklogs
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Back */}
      <Link to="/worklogs">
        <Button variant="ghost" size="sm" className="w-fit">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Worklogs
        </Button>
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payment Review</h1>
        <p className="text-muted-foreground mt-1">
          Review selected worklogs before confirming payment
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Freelancers</p>
              <p className="text-2xl font-bold">{totals.freelancers}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Worklogs</p>
              <p className="text-2xl font-bold">{totals.count}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Hours</p>
              <p className="text-2xl font-bold tabular-nums">{totals.hours}h</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Payout</p>
              <p className="text-2xl font-bold tabular-nums">
                {formatCurrency(totals.earnings)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grouped by Freelancer */}
      {groupedByFreelancer.map(({ freelancer, worklogs: fWorklogs }) => {
        const freelancerHours = fWorklogs.reduce(
          (sum, wl) => sum + getTotalHours(wl),
          0
        )
        const freelancerEarnings = freelancerHours * freelancer.rate

        return (
          <Card key={freelancer.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">{freelancer.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {freelancer.email} · {formatCurrency(freelancer.rate)}/hr
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => removeFreelancer(freelancer.id)}
                id={`remove-freelancer-${freelancer.id}`}
                aria-label={`Remove all worklogs for ${freelancer.name}`}
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                Remove Freelancer
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Entries</TableHead>
                    <TableHead className="text-right">Hours</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fWorklogs.map((wl) => {
                    const hours = getTotalHours(wl)
                    const earnings = getTotalEarnings(wl)
                    return (
                      <TableRow key={wl.id}>
                        <TableCell className="font-medium">
                          {wl.taskName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {wl.timeEntries.length} entries
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {hours}h
                        </TableCell>
                        <TableCell className="text-right tabular-nums font-semibold">
                          {formatCurrency(earnings)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => removeWorklog(wl.id)}
                            id={`remove-worklog-${wl.id}`}
                            aria-label={`Remove ${wl.taskName}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="justify-end border-t">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="tabular-nums">{freelancerHours}h</span>
                <span className="font-semibold tabular-nums text-lg">
                  {formatCurrency(freelancerEarnings)}
                </span>
              </div>
            </CardFooter>
          </Card>
        )
      })}

      {/* Confirm Section */}
      <Separator />
      <div className="flex items-center justify-between rounded-xl border bg-card p-6 shadow-sm">
        <div>
          <p className="text-sm text-muted-foreground">Total Selected Payout</p>
          <p className="text-3xl font-bold tabular-nums">
            {formatCurrency(totals.earnings)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {totals.count} worklogs · {totals.freelancers} freelancers · {totals.hours}h
          </p>
        </div>
        <Button
          size="lg"
          onClick={confirmPayment}
          id="confirm-payment-btn"
          className="text-base px-8"
        >
          <CheckCircle2 className="mr-2 h-5 w-5" />
          Confirm Payment
        </Button>
      </div>
    </div>
  )
}
