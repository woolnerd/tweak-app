import Fixture from './fixture';

const fixture = new Fixture('123');

describe('new fixture', () => {
  it('has initial dimmer value of 0', () => {
    expect(fixture.dimmerLevel).toBe(0);
  });

  it('has an id', () => {
    expect(fixture.id).toBe('123');
  });

  it('dimmer level to be set to 50', () => {
    fixture.dimmerLevel = 50;

    expect(fixture.dimmerLevel).toBe(50);
  });
});
