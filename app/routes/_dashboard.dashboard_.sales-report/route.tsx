import type { LoaderFunctionArgs } from "@remix-run/node";
import type { DateRange } from "react-day-picker";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { useState } from "react";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { getSession } from "~/app/cookie.server";
import { Calendar } from "~/app/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/app/components/ui/popover";
import { Button } from "~/app/components/ui/button";
import { cn } from "~/app/lib/utils";
import { getSalesReport } from "~/app/lib/data/sales";
import SalesReportTable from "./table";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/app/components/ui/card";
import { calculateGrandTotal, calculateProfit } from "./utils";

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request);
    if (!session) {
        return;
    }

    const url = new URL(request.url);

    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    if (!from || !to) {
        return null;
    }

    const salesReport = await getSalesReport(
        session.groupId,
        new Date(from).toISOString(),
        new Date(to).toISOString()
    );
    if (!salesReport) {
        return null;
    }

    return json({ salesReport });
}

export default function SalesReport() {
    const loaderData = useLoaderData<typeof loader>();

    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 20),
    });

    const [searchParams, setSearchParams] = useSearchParams();

    function clickHandler(date: DateRange | undefined) {
        setSearchParams((prev) => {
            prev.set("from", date?.from);
            return prev;
        });

        setSearchParams((prev) => {
            prev.set("to", date?.to);
            return prev;
        });
    }

    const grandTotal = calculateGrandTotal(loaderData?.salesReport);
    const profit = calculateProfit(loaderData?.salesReport);

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className={cn("grid gap-2")}>
                <Popover>
                    <div className="flex items-center gap-4">
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                    "w-[300px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                    date.to ? (
                                        <>
                                            {format(date.from, "LLL dd, y")} -{" "}
                                            {format(date.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(date.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Pick a date</span>
                                )}
                            </Button>
                        </PopoverTrigger>

                        <Button onClick={() => clickHandler(date)}>
                            Create sales
                        </Button>
                    </div>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Sales Report</CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                    <SalesReportTable sales={loaderData?.salesReport} />
                </CardContent>
                <CardFooter>
                    <div>
                        <div className="flex items-center gap-2">
                            <span>GRAND TOTAL</span>
                            <span>{grandTotal}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span>Profit</span>
                            <span>{profit}</span>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </main>
    );
}
