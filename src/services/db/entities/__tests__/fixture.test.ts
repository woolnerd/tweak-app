// fixture.repository.mock.ts
import { Fixture } from '../fixture';
import { MockFixtureRepository } from '@/__mocks__/fixture-repository.mock';

describe('Fixture entity', () => {
  let mockFixtureRepository: MockFixtureRepository;

  beforeEach(() => {
    mockFixtureRepository = new MockFixtureRepository();
  });

  it('should create a new fixture', async () => {
    const fixture = new Fixture();
    fixture.id = 1;
    fixture.name = 'Test Fixture';
    fixture.notes = 'Test notes';

    await mockFixtureRepository.save(fixture);
    const retrievedFixture = await mockFixtureRepository.findOne(1);

    expect(retrievedFixture).toBeDefined();
    expect(retrievedFixture!.name).toBe(fixture.name);
    expect(retrievedFixture!.notes).toBe(fixture.notes);
  });
});
