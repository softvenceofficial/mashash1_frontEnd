/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Utility function to simulate an asynchronous API call.
 * It returns a Promise that resolves with the provided data after a delay.
 * @template T The type of data to be returned.
 * @param {T} data - The data to be returned by the mock API.
 * @param {number} [delay=500] - The delay in milliseconds before resolving the promise.
 * @param {boolean} [success=true] - Whether the mock call should succeed or fail.
 * @returns {Promise<T>} A promise that resolves with the data or rejects with an error.
 */

export const simulateApiResponse = <T>(
  data: T,
  delay: number = 500,
  success: boolean = true
): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve(data);
      } else {
        reject(new Error("Mock API Error: Something went wrong."));
      }
    }, delay);
  });
};

export interface Payment {
  invoice: string;
  customerName: string;
  date: string;
  amount: number;
  status: "Paid" | "Unpaid" | "Save";
  paymentMethod: "Credit Card" | "Bank Transfer" | "PayPal" | "Other";
}

const mockPayments: Payment[] = [
  {
    invoice: "INV-000001",
    customerName: "David Johnson",
    date: "05 Feb, 2025",
    amount: 635,
    status: "Unpaid",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV-000001",
    customerName: "Emily Carter",
    date: "06 Feb, 2025",
    amount: 635,
    status: "Save",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV-000001",
    customerName: "Michael Smith",
    date: "07 Feb, 2025",
    amount: 635,
    status: "Paid",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV-000001",
    customerName: "Sarah Thompson",
    date: "08 Feb, 2025",
    amount: 635,
    status: "Save",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV-000001",
    customerName: "Jessica Lee",
    date: "09 Feb, 2025",
    amount: 635,
    status: "Save",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV-000001",
    customerName: "Matthew Brown",
    date: "10 Feb, 2025",
    amount: 635,
    status: "Paid",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV-000001",
    customerName: "Olivia Wilson",
    date: "11 Feb, 2025",
    amount: 635,
    status: "Unpaid",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV-000001",
    customerName: "James Garcia",
    date: "12 Feb, 2025",
    amount: 635,
    status: "Paid",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV-000001",
    customerName: "James Garcia",
    date: "13 Feb, 2025",
    amount: 635,
    status: "Paid",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV-000001",
    customerName: "David Johnson",
    date: "05 Feb, 2025",
    amount: 635,
    status: "Unpaid",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV-000001",
    customerName: "Emily Carter",
    date: "06 Feb, 2025",
    amount: 635,
    status: "Save",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV-000001",
    customerName: "Michael Smith",
    date: "07 Feb, 2025",
    amount: 635,
    status: "Paid",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV-000001",
    customerName: "Sarah Thompson",
    date: "08 Feb, 2025",
    amount: 635,
    status: "Save",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV-000001",
    customerName: "Jessica Lee",
    date: "09 Feb, 2025",
    amount: 635,
    status: "Save",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV-000001",
    customerName: "Matthew Brown",
    date: "10 Feb, 2025",
    amount: 635,
    status: "Paid",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV-000001",
    customerName: "Olivia Wilson",
    date: "11 Feb, 2025",
    amount: 635,
    status: "Unpaid",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV-000001",
    customerName: "James Garcia",
    date: "12 Feb, 2025",
    amount: 635,
    status: "Paid",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV-000001",
    customerName: "James Garcia",
    date: "13 Feb, 2025",
    amount: 635,
    status: "Paid",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV-000001",
    customerName: "David Johnson",
    date: "05 Feb, 2025",
    amount: 635,
    status: "Unpaid",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV-000001",
    customerName: "Emily Carter",
    date: "06 Feb, 2025",
    amount: 635,
    status: "Save",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV-000001",
    customerName: "Michael Smith",
    date: "07 Feb, 2025",
    amount: 635,
    status: "Paid",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV-000001",
    customerName: "Sarah Thompson",
    date: "08 Feb, 2025",
    amount: 635,
    status: "Save",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV-000001",
    customerName: "Jessica Lee",
    date: "09 Feb, 2025",
    amount: 635,
    status: "Save",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV-000001",
    customerName: "Matthew Brown",
    date: "10 Feb, 2025",
    amount: 635,
    status: "Paid",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV-000001",
    customerName: "Olivia Wilson",
    date: "11 Feb, 2025",
    amount: 635,
    status: "Unpaid",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV-000001",
    customerName: "James Garcia",
    date: "12 Feb, 2025",
    amount: 635,
    status: "Paid",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV-000001",
    customerName: "James Garcia",
    date: "13 Feb, 2025",
    amount: 635,
    status: "Paid",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV-000001",
    customerName: "David Johnson",
    date: "05 Feb, 2025",
    amount: 635,
    status: "Unpaid",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV-000001",
    customerName: "Emily Carter",
    date: "06 Feb, 2025",
    amount: 635,
    status: "Save",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV-000001",
    customerName: "Michael Smith",
    date: "07 Feb, 2025",
    amount: 635,
    status: "Paid",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV-000001",
    customerName: "Sarah Thompson",
    date: "08 Feb, 2025",
    amount: 635,
    status: "Save",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV-000001",
    customerName: "Jessica Lee",
    date: "09 Feb, 2025",
    amount: 635,
    status: "Save",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV-000001",
    customerName: "Matthew Brown",
    date: "10 Feb, 2025",
    amount: 635,
    status: "Paid",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV-000001",
    customerName: "Olivia Wilson",
    date: "11 Feb, 2025",
    amount: 635,
    status: "Unpaid",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV-000001",
    customerName: "James Garcia",
    date: "12 Feb, 2025",
    amount: 635,
    status: "Paid",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV-000001",
    customerName: "James Garcia",
    date: "13 Feb, 2025",
    amount: 635,
    status: "Paid",
    paymentMethod: "Bank Transfer",
  },
];

export const paymentApi = {
  /**
   * Simulates fetching a list of payments with pagination.
   * @param {object} params - Filters and pagination parameters
   * @returns {Promise<{ data: Payment[], total: number }>}
   */
  getPayments: async ({
    search,
    page = 1,
    limit = 10,
    date,
  }: {
    search?: string;
    page?: number;
    limit?: number;
    date?: string;
  } = {}): Promise<{ data: Payment[]; total: number }> => {
    let filteredPayments: Payment[] = [...mockPayments];

    // Apply search filter
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredPayments = filteredPayments.filter(
        (pay) =>
          pay.customerName.toLowerCase().includes(searchTerm) ||
          pay.invoice.toLowerCase().includes(searchTerm) ||
          pay.status.toLowerCase().includes(searchTerm) ||
          pay.paymentMethod.toLowerCase().includes(searchTerm)
      );
    }

    // Apply date filter
    if (date) {
      const selectedDate = new Date(date);
      filteredPayments = filteredPayments.filter((inv) => {
        const invoiceDate = new Date(inv.date);
        return (
          invoiceDate.getFullYear() === selectedDate.getFullYear() &&
          invoiceDate.getMonth() === selectedDate.getMonth() &&
          invoiceDate.getDate() === selectedDate.getDate()
        ); // Match by year, month, and day
      });
    }

    // Calculate pagination
    const total = filteredPayments.length;
    const startIndex = (page - 1) * limit;
    const paginatedPayments = filteredPayments.slice(
      startIndex,
      startIndex + limit
    );

    return simulateApiResponse({ data: paginatedPayments, total });
  },

  /**
   * Simulates fetching a single payment by invoice number.
   * @param {string} invoiceNumber
   * @returns {Promise<Payment>}
   */
  getPaymentByInvoice: async (invoiceNumber: string): Promise<Payment> => {
    const payment = mockPayments.find((pay) => pay.invoice === invoiceNumber);
    if (payment) {
      return simulateApiResponse(payment);
    }
    return simulateApiResponse(null as any, 500, false);
  },
};
