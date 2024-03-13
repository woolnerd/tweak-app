interface Fixture {
  dimmerLevel: number;
}

interface Profile {
  channels: number;
}
/**
 * A fixture has many profiles
 * a profile belongs to a fixture
 * it is the profile that determines the footprint
 * Like the universe, there is a fixture as a WorkingUnit,
 * and a fixture as DataStore.
 * Because when instantiating a WorkingUnit, I don't need to load
 * all of the profiles, but just the selected profile.
 *
 *
 * Database stores all of our fixtures and profiles
 *
 * Tables for:
 *
 * Fixture has many Profiles
 * Profile belongs to Fixture
 * UniversePatch has many profiles
 * UniversePatch has many Fixtures through profiles
 * UniverseValues/Scene
 *
 */
class Fixture {
  dimmerLevel: number;
  profiles: Profile[];
  id: string;

  constructor(id: string) {
    this.dimmerLevel = 0;
    this.profiles = [];
    this.id = id;
  }

  get() {
    return this.dimmerLevel;
  }

  set(dimmerLevel: number) {
    this.dimmerLevel = dimmerLevel;
  }
}

export default Fixture;
