const CONFIG = {
  SUPABASE_URL: 'https://eppezsyplvtwldhuchsy.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwcGV6c3lwbHZ0d2xkaHVjaHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMzMxMjQsImV4cCI6MjA2ODgwOTEyNH0.5JP6V_n5HNLjeehG7f0ioL8GMy9ZnUynL6x57RnnZGg',

  // Public variables
  PRICING: {
    adult_ticket: 5000,
    child_ticket: 2500
  },
  SITE: {
    name: "Stella Maris Family Day",
    supportEmail: "stellamarisfamilyday@gmail.com"
  },
  ADMIN: {
    email: "stellamarisfamilyday@gmail.com",
    password: "admin123"
  },
  EVENT: {
    date: "Sunday, December 7, 2025 | 12:00 PM – 6:00 PM",
    cutoffDate: "2025-11-29",
  },
  PAYMENT: {
    methods: {
      cash: "Cash/Cheque",
      bank_transfer: "Bank Transfer"
    },
    instructions: {
      cash: `Cash should be paid at the Stella Maris Church office (a receipt will be provided) and Cheques should be made payable to <strong>STELLA MARIS CHURCH</strong>.`,
      bank_transfer: `Bank transfer to the Stella Maris CIBC account. Please use the following details:<br>
          <ul>
            <li><strong>Bank Name:</strong> CIBC</li>
            <li><strong>Account Name:</strong> Stella Maris Church</li>
            <li><strong>Account Number:</strong> 1002355932 (Savings)</li>
            <li><strong>Branch:</strong> Manor Park</li>
            <li><strong>Reference:</strong> Your full name or order number</li>
          </ul>`
    }
  },
  IMAGES_DIR: 'images/',
    IMAGES: [
      'funday1.jpg',
      'funday2.jpg',
      'funday3.jpg',
      'funday4.jpeg',
      'funday5.jpeg',
      'funday6.jpg',
      'funday7.jpg'
    ],
};
