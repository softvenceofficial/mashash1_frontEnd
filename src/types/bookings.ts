type TBookingStatus = 'In-process' | 'Complete' | 'Cancel';

export type TBookingItem = {
    id: string;
    date: string;
    time: string;
    name: string;
    status: TBookingStatus;
};
