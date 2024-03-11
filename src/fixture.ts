interface Fixture {
  dimmerLevel: number;
}

interface Profile {
  channels: number;
}

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
