import { Link } from "@remix-run/react";
import { MoveLeft } from "lucide-react";
import { Button } from "~/app/components/ui/button";

export default function NotFound() {
    return (
        <main className="items-top flex min-h-[calc(100vh-2.5rem-2rem)] px-8 pt-[10%]">
            <div>
                <p className="text-sm font-medium text-primary">404 error</p>
                <h1 className="mt-3 text-2xl font-semibold text-accent-foreground md:text-3xl">
                    We can’t find that page
                </h1>
                <p className="mt-4 text-muted-foreground">
                    Sorry, the page you are looking for doesn't exist or has
                    been moved.
                </p>

                <div className="mt-6 flex items-center gap-x-3">
                    <Button
                        className="flex items-center gap-x-2"
                        variant="secondary"
                    >
                        <MoveLeft />

                        <span>Go back</span>
                    </Button>

                    <Link to="/dashboard">
                        <Button>Take me home</Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
