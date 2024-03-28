import { Database } from "@/db/types/database"

export const mockInsertDb: Database = {
  insert: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  returning: jest.fn(() => Promise.resolve(mockManufacturer)),
}

export const mockGetByIdDb: Database = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn(() => Promise.resolve(mockManufacturer)),
}

export const mockGetAllDb: Database = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn(()=> Promise.resolve(mockManufacturerArray)),
  where: jest.fn(() => Promise.resolve(mockManufacturer))
}

export const mockUpdateDb: Database = {
  returning: jest.fn(() => Promise.resolve(mockManufacturer)),
  update: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
}

export const mockDeleteDb: Database = {
  returning: jest.fn(() => Promise.resolve(mockManufacturer)),
  update: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
}

export const mockManufacturer = {
  id: 1,
  name: 'Arri',
  website: 'www.arri.com',
  notes: 'Test notes',
};

export const mockManufacturerArray = [
  {
    id: 1,
    name: 'Arri',
    website: 'www.arri.com',
    notes: 'Test notes',
  },
  {
    id: 2,
    name: 'Astera',
    website: 'www.astera.com',
    notes: 'Test notes2',
  },
];
