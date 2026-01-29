import { Router } from 'express';
import { AddeparEntity } from '../types';

const router = Router();

// GET /api/addepar/entities - Get Addepar entity types and their attributes
router.get('/entities', (req, res) => {
  const entities: AddeparEntity[] = [
    {
      type: 'Household',
      label: 'Household',
      attributes: [
        { name: 'id', label: 'Household ID', type: 'string', description: 'Unique identifier' },
        { name: 'name', label: 'Household Name', type: 'string', description: 'Family or group name' },
        { name: 'totalAUM', label: 'Total AUM', type: 'currency', description: 'Total assets under management' },
        { name: 'primaryContact', label: 'Primary Contact', type: 'string', description: 'Main point of contact' },
        { name: 'riskProfile', label: 'Risk Profile', type: 'string', description: 'Risk tolerance level' },
        { name: 'investmentStrategy', label: 'Investment Strategy', type: 'string', description: 'Primary strategy' },
        { name: 'createdDate', label: 'Created Date', type: 'date', description: 'Account creation date' },
        { name: 'lastReviewDate', label: 'Last Review Date', type: 'date', description: 'Most recent review' },
        { name: 'advisorName', label: 'Advisor Name', type: 'string', description: 'Assigned advisor' },
        { name: 'numberOfAccounts', label: 'Number of Accounts', type: 'number', description: 'Total accounts' },
        { name: 'taxStatus', label: 'Tax Status', type: 'string', description: 'Tax filing status' },
        { name: 'jurisdiction', label: 'Jurisdiction', type: 'string', description: 'Tax jurisdiction' },
      ],
    },
    {
      type: 'Entity',
      label: 'Entity',
      attributes: [
        { name: 'id', label: 'Entity ID', type: 'string', description: 'Unique identifier' },
        { name: 'legalName', label: 'Legal Name', type: 'string', description: 'Official legal name' },
        { name: 'entityType', label: 'Entity Type', type: 'string', description: 'Trust, LLC, Corporation, etc.' },
        { name: 'totalValue', label: 'Total Value', type: 'currency', description: 'Total entity value' },
        { name: 'taxId', label: 'Tax ID', type: 'string', description: 'EIN or SSN' },
        { name: 'formationDate', label: 'Formation Date', type: 'date', description: 'Date entity was formed' },
        { name: 'registrationState', label: 'Registration State', type: 'string', description: 'State of registration' },
        { name: 'trustee', label: 'Trustee', type: 'string', description: 'Trustee name if applicable' },
        { name: 'status', label: 'Status', type: 'string', description: 'Active, Inactive, etc.' },
      ],
    },
    {
      type: 'Owner',
      label: 'Owner',
      attributes: [
        { name: 'id', label: 'Owner ID', type: 'string', description: 'Unique identifier' },
        { name: 'firstName', label: 'First Name', type: 'string', description: 'First name' },
        { name: 'lastName', label: 'Last Name', type: 'string', description: 'Last name' },
        { name: 'email', label: 'Email', type: 'email', description: 'Email address' },
        { name: 'phone', label: 'Phone', type: 'phone', description: 'Primary phone' },
        { name: 'mobilePhone', label: 'Mobile Phone', type: 'phone', description: 'Mobile number' },
        { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', description: 'Birth date' },
        { name: 'ssn', label: 'SSN', type: 'string', description: 'Social Security Number' },
        { name: 'citizenship', label: 'Citizenship', type: 'string', description: 'Country of citizenship' },
        { name: 'ownershipPercentage', label: 'Ownership %', type: 'percent', description: 'Ownership stake' },
        { name: 'address', label: 'Address', type: 'string', description: 'Street address' },
        { name: 'city', label: 'City', type: 'string', description: 'City' },
        { name: 'state', label: 'State', type: 'string', description: 'State' },
        { name: 'zipCode', label: 'Zip Code', type: 'string', description: 'Postal code' },
      ],
    },
    {
      type: 'Account',
      label: 'Account',
      attributes: [
        { name: 'id', label: 'Account ID', type: 'string', description: 'Unique identifier' },
        { name: 'accountNumber', label: 'Account Number', type: 'string', description: 'Account number' },
        { name: 'accountName', label: 'Account Name', type: 'string', description: 'Account name' },
        { name: 'accountType', label: 'Account Type', type: 'string', description: 'IRA, 401k, Brokerage, etc.' },
        { name: 'custodian', label: 'Custodian', type: 'string', description: 'Financial institution' },
        { name: 'balance', label: 'Balance', type: 'currency', description: 'Current balance' },
        { name: 'marketValue', label: 'Market Value', type: 'currency', description: 'Current market value' },
        { name: 'cashBalance', label: 'Cash Balance', type: 'currency', description: 'Available cash' },
        { name: 'openDate', label: 'Open Date', type: 'date', description: 'Account open date' },
        { name: 'status', label: 'Status', type: 'string', description: 'Active, Closed, etc.' },
        { name: 'performanceYTD', label: 'Performance YTD', type: 'percent', description: 'Year-to-date return' },
        { name: 'performanceITD', label: 'Performance ITD', type: 'percent', description: 'Inception-to-date return' },
        { name: 'managementFee', label: 'Management Fee', type: 'currency', description: 'Annual fee' },
        { name: 'assetAllocation', label: 'Asset Allocation', type: 'string', description: 'Current allocation' },
        { name: 'benchmarkIndex', label: 'Benchmark Index', type: 'string', description: 'Comparison index' },
      ],
    },
  ];
  
  res.json(entities);
});

export default router;
