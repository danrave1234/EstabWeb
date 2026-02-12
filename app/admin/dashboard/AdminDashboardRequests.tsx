"use client"

import * as React from "react"
import { format } from "date-fns"
import { Eye } from "lucide-react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table"

interface AdminRequestsClientProps {
  initialRequests: any[]
}

export default function AdminDashboardRequests({ initialRequests }: AdminRequestsClientProps) {
  const [requests] = React.useState(initialRequests)

  return (
    <>
      <div className="rounded-md border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client / Email</TableHead>
              <TableHead>Project Subdomain</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Date Requested</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No pending requests found.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <Link href={`/admin/dashboard/requests/${request.id}`} className="block">
                      <div className="font-medium text-foreground">
                        {request.projects?.current_config?.brand?.name || request.projects?.subdomain || 'Unknown Project'}
                      </div>
                      <div className="text-xs text-muted-foreground">{request.profiles?.email}</div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
                      {request.projects?.subdomain || 'no-subdomain'}
                    </code>
                  </TableCell>
                  <TableCell className="capitalize">
                    {request.section_id ? request.section_id.replace(/-/g, ' ') : 'Full Site Snapshot'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(request.created_at), 'MMM d, yyyy HH:mm')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link 
                      href={`/admin/dashboard/requests/${request.id}`}
                      className="p-2 hover:bg-muted rounded-full transition-colors text-primary inline-block"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
