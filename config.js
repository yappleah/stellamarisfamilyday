const CONFIG = {
  SUPABASE_URL: 'https://yvzrwopqylimchzpbxqg.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2enJ3b3BxeWxpbWNoenBieHFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTEzNDgsImV4cCI6MjA3ODM2NzM0OH0.FwqHGigLlpLcSe-ar477rf7Cszzr-ptqgjbiBAe6Tuo',

  SITE: {
    name: "Stella Maris Lights of Hope",
    supportEmail: "stellamarisfamilyday@gmail.com"
  },
  ADMIN: {
    email: "stellamarisfamilyday@gmail.com",
    password: "admin123"
  },
  EVENT: {
    date: "Sunday, December 7, 2025 | 4:00 PM – 6:00 PM",
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
          </ul>
          After making the transfer, please email a copy of the bank transfer information or the transfer reference number to Frederick Williams: <a href="mailto:fredandwill1@gmail.com">fredandwill1@gmail.com</a>`
    }
  },
};
