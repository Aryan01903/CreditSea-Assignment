"use client";

import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SalarySlipLink } from "@/components/dashboard/SalarySlipLink";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { Table, Td } from "@/components/ui/Table";
import { formatCurrency, formatDate } from "@/lib/format";
import { getLeads, queryKeys } from "@/lib/queries";

export function SalesView() {
  const { data: leads = [], isPending } = useQuery({
    queryKey: queryKeys.leads,
    queryFn: getLeads,
  });

  if (isPending) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="text-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales — Leads"
        subtitle="Registered borrowers who have not applied for a loan yet"
      />

      {leads.length === 0 ? (
        <EmptyState title="No leads" message="Every registered borrower has already applied." />
      ) : (
        <Table headers={["Borrower", "Registered", "Salary", "Employment", "Details", "Salary slip"]}>
          {leads.map((lead) => (
            <tr key={lead._id} className="hover:bg-gray-50">
              <Td>
                <p className="font-medium text-gray-900">{lead.name}</p>
                <p className="text-xs text-gray-500">{lead.email}</p>
              </Td>
              <Td>{formatDate(lead.createdAt)}</Td>
              <Td>
                {lead.personalDetails
                  ? formatCurrency(lead.personalDetails.monthlySalary)
                  : "—"}
              </Td>
              <Td>
                <span className="capitalize">{lead.personalDetails?.employmentMode ?? "—"}</span>
              </Td>
              <Td>
                {lead.personalDetails ? (
                  <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    Complete
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    Pending
                  </span>
                )}
              </Td>
              <Td>
                <SalarySlipLink url={lead.salarySlip} />
              </Td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}
