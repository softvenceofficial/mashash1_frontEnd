import { BookingHistoryCard } from '@/components/Dashboard/Cards/BookingHistoryCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { TBookingItem } from '@/types';

export default function BookingHistory() {
    const bookings: TBookingItem[] = [
        {
            id: '1',
            date: 'Tue July 20',
            time: '8:30 AM',
            name: 'Dental Appointment',
            status: 'In-process',
        },
        {
            id: '2',
            date: 'Tue July 20',
            time: '8:30 AM',
            name: 'Fitness Training',
            status: 'Cancel',
        },
        {
            id: '3',
            date: 'Tue July 20',
            time: '8:30 AM',
            name: 'Yoga Class',
            status: 'In-process',
        },
        {
            id: '4',
            date: 'Tue July 20',
            time: '8:30 AM',
            name: 'Therapy Session',
            status: 'Complete',
        },
        {
            id: '5',
            date: 'Tue July 20',
            time: '8:30 AM',
            name: 'Business Meeting',
            status: 'Complete',
        },
        {
            id: '6',
            date: 'Tue July 20',
            time: '8:30 AM',
            name: 'Car Service',
            status: 'In-process',
        },
        {
            id: '7',
            date: 'Tue July 20',
            time: '8:30 AM',
            name: 'Interview Prep',
            status: 'In-process',
        },
        {
            id: '8',
            date: 'Tue July 20',
            time: '8:30 AM',
            name: 'Client Consultation',
            status: 'Cancel',
        },
        {
            id: '9',
            date: 'Tue July 20',
            time: '8:30 AM',
            name: 'Haircut Appointment',
            status: 'In-process',
        },
        {
            id: '10',
            date: 'Tue July 20',
            time: '8:30 AM',
            name: 'Massage Therapy',
            status: 'Complete',
        },
        {
            id: '11',
            date: 'Tue July 20',
            time: '8:30 AM',
            name: 'Eye Check-up',
            status: 'In-process',
        },
        {
            id: '12',
            date: 'Tue July 20',
            time: '8:30 AM',
            name: 'Nutrition Coaching',
            status: 'Complete',
        },
    ];

    return (
        <section>
            <h3 className="text-2xl font-semibold mb-10">Booking History</h3>

            <Tabs defaultValue="all" className="w-full">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="confirm">Confirm</TabsTrigger>
                    <TabsTrigger value="in-process">In-process</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="grid grid-cols-3 gap-6">
                    {bookings.map(item => (
                        <BookingHistoryCard key={item.id} payload={item} />
                    ))}
                </TabsContent>
                <TabsContent value="confirm" className="grid grid-cols-3 gap-6">
                    {bookings.map(
                        item =>
                            item.status === 'Complete' && (
                                <BookingHistoryCard key={item.id} payload={item} />
                            )
                    )}
                </TabsContent>
                <TabsContent value="in-process" className="grid grid-cols-3 gap-6">
                    {bookings.map(
                        item =>
                            item.status === 'In-process' && (
                                <BookingHistoryCard key={item.id} payload={item} />
                            )
                    )}
                </TabsContent>
            </Tabs>
        </section>
    );
}
