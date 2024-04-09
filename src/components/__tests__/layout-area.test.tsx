import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { LayoutArea } from '../layout-area';
import * as fixtureUtils from '@/util/fixture-cache';
import ScenesToFixtureAssignments from '@/models/scene-to-fixture-assignments';

// Mock the external dependencies
jest.mock('@/models/scene-to-fixture-assignments');
jest.mock('@/util/fixture-cache');
jest.mock('@/db/client');

describe('LayoutArea', () => {
  // Setup common props to reuse
  const commonProps = { selectedSceneId: 1, goToOut: false };

  // Mock data to return from our mocked functions
  const mockFixtureResponse = [
    { fixtureAssignmentId: 1, channel: 1, values: '[]', title: 'Test Fixture' }
  ];

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Setup our mocks
    ScenesToFixtureAssignments.prototype.getFixturesAndAssignments = jest.fn().mockResolvedValue(mockFixtureResponse);
    fixtureUtils.getManualFixtureKeys = jest.fn().mockResolvedValue(['key1', 'key2']);
    fixtureUtils.getAllFixturesFromSceneKeys = jest.fn().mockResolvedValue(mockFixtureResponse);
  });

  it('renders correctly', async () => {
    const { getByText } = render(<LayoutArea {...commonProps} />);

    // Wait for async operations to complete
    await waitFor(() => {
      expect(getByText('Test Fixture')).toBeTruthy();
    });
  });

  // Add more tests here to cover other scenarios, like error handling, empty states, etc.
});
