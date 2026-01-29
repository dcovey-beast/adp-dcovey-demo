import { Router } from 'express';
import { SalesforceConnection, SalesforceMetadata } from '../types';

const router = Router();

// In-memory connection state
let connectionState: SalesforceConnection = {
  connected: false,
};

// POST /api/salesforce/connect - Simulate OAuth connection
router.post('/connect', (req, res) => {
  const { environment } = req.body;
  
  // Simulate OAuth delay
  setTimeout(() => {
    connectionState = {
      connected: true,
      orgName: environment === 'sandbox' ? 'Acme Wealth - Sandbox' : 'Acme Wealth Management',
      orgId: '00D' + Math.random().toString(36).substring(2, 15),
      edition: 'Financial Services Cloud',
      username: 'admin@acmewealth.com',
      instanceUrl: environment === 'sandbox' ? 'https://acme--sandbox.my.salesforce.com' : 'https://acme.my.salesforce.com',
      connectedAt: new Date().toISOString(),
    };
    
    res.json(connectionState);
  }, 500);
});

// GET /api/salesforce/status - Get connection status
router.get('/status', (req, res) => {
  res.json(connectionState);
});

// GET /api/salesforce/metadata - Get Salesforce object schema
router.get('/metadata', (req, res) => {
  const metadata: SalesforceMetadata = {
    objects: [
      {
        name: 'Account',
        label: 'Account',
        fields: [
          { name: 'Name', label: 'Account Name', type: 'string', required: true },
          { name: 'Type', label: 'Account Type', type: 'picklist' },
          { name: 'TotalAUM__c', label: 'Total AUM', type: 'currency' },
          { name: 'NumberOfEmployees', label: 'Number of Employees', type: 'number' },
          { name: 'Phone', label: 'Phone', type: 'phone' },
          { name: 'Website', label: 'Website', type: 'url' },
          { name: 'BillingStreet', label: 'Billing Street', type: 'string' },
          { name: 'BillingCity', label: 'Billing City', type: 'string' },
          { name: 'BillingState', label: 'Billing State', type: 'string' },
          { name: 'BillingPostalCode', label: 'Billing Zip', type: 'string' },
          { name: 'Rating', label: 'Account Rating', type: 'picklist' },
          { name: 'Industry', label: 'Industry', type: 'picklist' },
        ],
      },
      {
        name: 'Contact',
        label: 'Contact',
        fields: [
          { name: 'FirstName', label: 'First Name', type: 'string' },
          { name: 'LastName', label: 'Last Name', type: 'string', required: true },
          { name: 'Email', label: 'Email', type: 'email' },
          { name: 'Phone', label: 'Phone', type: 'phone' },
          { name: 'MobilePhone', label: 'Mobile', type: 'phone' },
          { name: 'Title', label: 'Title', type: 'string' },
          { name: 'Department', label: 'Department', type: 'string' },
          { name: 'Birthdate', label: 'Birthdate', type: 'date' },
          { name: 'MailingStreet', label: 'Mailing Street', type: 'string' },
          { name: 'MailingCity', label: 'Mailing City', type: 'string' },
          { name: 'MailingState', label: 'Mailing State', type: 'string' },
          { name: 'MailingPostalCode', label: 'Mailing Zip', type: 'string' },
        ],
      },
      {
        name: 'FinServ__FinancialAccount__c',
        label: 'Financial Account',
        fields: [
          { name: 'Name', label: 'Account Name', type: 'string', required: true },
          { name: 'FinServ__AccountNumber__c', label: 'Account Number', type: 'string' },
          { name: 'FinServ__Balance__c', label: 'Balance', type: 'currency' },
          { name: 'FinServ__Status__c', label: 'Status', type: 'picklist' },
          { name: 'FinServ__ProductName__c', label: 'Product Name', type: 'string' },
          { name: 'FinServ__OpenDate__c', label: 'Open Date', type: 'date' },
          { name: 'FinServ__Custodian__c', label: 'Custodian', type: 'string' },
          { name: 'FinServ__PerformanceYTD__c', label: 'Performance YTD', type: 'percent' },
          { name: 'TotalReturn__c', label: 'Total Return', type: 'percent' },
          { name: 'ManagementFee__c', label: 'Management Fee', type: 'currency' },
        ],
      },
    ],
  };
  
  res.json(metadata);
});

// DELETE /api/salesforce/disconnect - Disconnect from Salesforce
router.delete('/disconnect', (req, res) => {
  connectionState = { connected: false };
  res.json({ success: true });
});

export default router;
