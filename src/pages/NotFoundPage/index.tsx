import { Link } from 'react-router';
import Notfound from '@/assets/svgs/404.svg?react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
    return (
        <div className="text-center mt-20">
            <Notfound className="size-96 mx-auto text-primary" />
            <h1 className="text-4xl font-bold text-foreground/70">Something went wrong</h1>
            <p className="text-xl mt-4 text-foreground/50">Sorry we were unable to find this page</p>
            <Link to="/">
                <Button
                    className="mt-4"
                    onClick={() => window.history.back()}
                >
                    Back to Previous
                </Button>
            </Link>
        </div>
    );
}
