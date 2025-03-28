import { Card } from '@/app/ui/dashboard/cards';
import IncomeChart from '@/app/ui/dashboard/income-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { poppins } from '@/app/ui/fonts';
import { fetchCardData, fetchLatestInvoices } from '@/app/lib/data';
import { Suspense } from 'react';
import { IncomeChartSkeleton } from '@/app/ui/skeletons';

export default async function Page() {
  // const income = await fetchIncome();
  const latestInvoices = await fetchLatestInvoices();

  // Fetch specific data for each card
  const { totalFulfilledInvoices } = await fetchCardData('fulfilled');
  const { totalAwaitingInvoices } = await fetchCardData('awaiting');
  const { numberOfInvoices } = await fetchCardData('invoices');
  const { numberOfSellers } = await fetchCardData('sellers');

  return (
    <main className="rounded-xl bg-neutral-900 p-6">
      <h1
        className={`${poppins.className} mb-4 text-center text-xl text-white md:text-3xl`}
      >
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Earned" value={totalFulfilledInvoices} type="earned" />
        <Card
          title="In Progress"
          value={totalAwaitingInvoices}
          type="awaiting"
        /> 
        <Card title="All Invoices" value={numberOfInvoices} type="invoices" />
        <Card title="Total Sellers" value={numberOfSellers} type="sellers" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<IncomeChartSkeleton />}>
          <IncomeChart income={[]} />
        </Suspense> 
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>
    </main>
  );
}