import { faker } from '@faker-js/faker';

export interface MockHousehold {
  id: string;
  name: string;
  totalAUM: number;
  primaryContact: string;
  riskProfile: string;
  investmentStrategy: string;
  createdDate: string;
  lastReviewDate: string;
  advisorName: string;
  numberOfAccounts: number;
  taxStatus: string;
  jurisdiction: string;
}

export interface MockOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobilePhone: string;
  dateOfBirth: string;
  ssn: string;
  citizenship: string;
  ownershipPercentage: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export const generateHouseholds = (count: number): MockHousehold[] => {
  const households: MockHousehold[] = [];
  
  for (let i = 0; i < count; i++) {
    households.push({
      id: `HH-${faker.string.alphanumeric(8)}`,
      name: `${faker.person.lastName()} Family`,
      totalAUM: faker.number.float({ min: 500000, max: 50000000, precision: 0.01 }),
      primaryContact: faker.person.fullName(),
      riskProfile: faker.helpers.arrayElement(['Conservative', 'Moderate', 'Aggressive', 'Very Aggressive']),
      investmentStrategy: faker.helpers.arrayElement(['Growth', 'Income', 'Balanced', 'Capital Preservation']),
      createdDate: faker.date.past({ years: 5 }).toISOString(),
      lastReviewDate: faker.date.recent({ days: 90 }).toISOString(),
      advisorName: faker.person.fullName(),
      numberOfAccounts: faker.number.int({ min: 1, max: 12 }),
      taxStatus: faker.helpers.arrayElement(['Single', 'Married Filing Jointly', 'Married Filing Separately', 'Head of Household']),
      jurisdiction: faker.location.state({ abbreviated: true }),
    });
  }
  
  return households;
};

export const generateOwners = (count: number): MockOwner[] => {
  const owners: MockOwner[] = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    owners.push({
      id: `OWN-${faker.string.alphanumeric(8)}`,
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName }),
      phone: faker.phone.number(),
      mobilePhone: faker.phone.number(),
      dateOfBirth: faker.date.birthdate({ min: 18, max: 85, mode: 'age' }).toISOString(),
      ssn: `${faker.number.int({ min: 100, max: 999 })}-${faker.number.int({ min: 10, max: 99 })}-${faker.number.int({ min: 1000, max: 9999 })}`,
      citizenship: 'United States',
      ownershipPercentage: faker.number.float({ min: 1, max: 100, precision: 0.01 }),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode(),
    });
  }
  
  return owners;
};
