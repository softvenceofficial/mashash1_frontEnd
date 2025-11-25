import { Card, CardContent } from '@/components/ui/card';
import { Dot } from 'lucide-react';
import ClockIcon from '@/assets/svgs/clock.svg?react';
import { Badge } from '@/components/ui/badge';
import type { TBookingItem } from '@/types';

export const BookingHistoryCard = ({
    payload: { date, name, status, time },
}: {
    payload: TBookingItem;
}) => (
    <Card>
        <CardContent>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ClockIcon className="text-primary size-6" />
                    {date}
                    <Dot className="text-gray-500 size-8" />
                    {time}
                </div>
                <Badge
                    variant={
                        status === 'In-process'
                            ? 'inProcess'
                            : status === 'Complete'
                            ? 'complete'
                            : status === 'Cancel'
                            ? 'cancel'
                            : 'default'
                    }
                >
                    {status}
                </Badge>
            </div>
            <h2 className="text-lg font-semibold">{name}</h2>
        </CardContent>
    </Card>
);
