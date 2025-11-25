export const dateFormate = (value: string) => {
    const dateString = value;
    // Parse the date string into a Date object
    const date = new Date(dateString);

    // Define options for toLocaleDateString
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    };

    // Format the date
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
};
// utils/dateUtils.ts
export const stringToDate = (dateString: string): Date => {
    return new Date(dateString);
};

export const formatDateTime = (value: string): string => {
    const date = new Date(value);

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    };

    return date.toLocaleString('en-US', options);
};
