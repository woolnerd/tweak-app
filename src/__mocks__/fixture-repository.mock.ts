import { Fixture } from '@/services/db/entities/fixture';

export class MockFixtureRepository {
  private fixtures: Fixture[] = [];

  async save(fixture: Fixture): Promise<Fixture> {
    this.fixtures.push(fixture);
    return fixture;
  }

  async findOne(id: number): Promise<Fixture | undefined> {
    return this.fixtures.find((fixture) => fixture.id === id);
  }
}
