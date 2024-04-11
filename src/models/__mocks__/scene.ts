// Mock setup for database interactions
export const mockSelect = jest.fn();
export const mockSelectDsc = jest.fn();
export const mockFrom = jest.fn(() => ({ orderBy: mockOrderBy }));
export const mockFromDsc = jest.fn(() => ({ orderBy: mockOrderByDsc }));
export const mockOrderBy = jest.fn();
export const mockOrderByDsc = jest.fn();

export const dbMock = {
  select: mockSelect.mockReturnValue({ from: mockFrom }),
};

export const dbMockDsc = {
  select: mockSelectDsc.mockReturnValue({ from: mockFromDsc }),
};

export const mockScenes = [
  { id: 1, name: "Scene One", order: 1, showId: 1 },
  { id: 2, name: "Scene Two", order: 2, showId: 1 },
];

export const mockScenesDesc = [
  { id: 2, name: "Scene Two", order: 2, showId: 1 },
  { id: 1, name: "Scene One", order: 1, showId: 1 },
];

mockOrderBy.mockResolvedValue(mockScenes);
mockOrderByDsc.mockResolvedValue(mockScenesDesc);
