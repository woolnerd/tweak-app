# Schema Documentation

## Tables and Their Definitions

### manufacturers

- **id**: `integer` - Primary key, auto-incremented.
- **name**: `text` - Name of the manufacturer, must be unique.
- **notes**: `text` - Optional notes, defaults to an empty string.
- **website**: `text` - Manufacturer's website, defaults to an empty string.

### scenes

- **id**: `integer` - Primary key, auto-incremented.
- **name**: `text` - Name of the scene.
- **order**: `integer` - Unique order value for the scene.
- **showId**: `integer` - Foreign key referencing the `shows` table.
- **timeRate**: `integer` - Time rate of the scene, defaults to 5.

### shows

- **id**: `integer` - Primary key, auto-incremented.
- **name**: `text` - Name of the show, defaults to an empty string.
- **createdAt**: `text` - Creation timestamp, defaults to current time.
- **updatedAt**: `text` - Update timestamp, defaults to current time.

### profiles

- **id**: `integer` - Primary key, auto-incremented.
- **name**: `text` - Name of the profile, defaults to an empty string.
- **channels**: `text` - Channels in JSON format, defaults to `{}`.
- **fixtureId**: `integer` - Foreign key referencing the `fixtures` table.
- **channelPairs16Bit**: `text` - 16-bit channel pairs, defaults to `[]`.

### patches

- **id**: `integer` - Primary key, auto-incremented.
- **startAddress**: `integer` - Start address for the patch.
- **fixtureId**: `integer` - Foreign key referencing the `fixtures` table.
- **profileId**: `integer` - Foreign key referencing the `profiles` table.
- **showId**: `integer` - Foreign key referencing the `shows` table.

### fixtures

- **id**: `integer` - Primary key, auto-incremented.
- **name**: `text` - Name of the fixture.
- **notes**: `text` - Optional notes.
- **manufacturerId**: `integer` - Foreign key referencing `manufacturers`.
- **colorTempRangeLow**: `integer` - Low color temperature range.
- **colorTempRangeHigh**: `integer` - High color temperature range.

### fixture_assignments

- **id**: `integer` - Primary key, auto-incremented.
- **channel**: `integer` - Channel number assigned to a fixture.
- **fixtureId**: `integer` - Foreign key referencing `fixtures`.
- **profileId**: `integer` - Foreign key referencing `profiles`.
- **patchId**: `integer` - Foreign key referencing `patches` (cascade delete).

### scenes_to_fixture_assignments

- **fixtureAssignmentId**: `integer` - Foreign key referencing `fixture_assignments` (cascade delete).
- **sceneId**: `integer` - Foreign key referencing `scenes` (cascade delete).
- **values**: `text` - Assignment values, defaults to `[]`.

## Indexes and Relationships

### manufacturers

- **manufacturerIdIndex**: Index on the `manufacturerId` field.

### fixtures

- **manufacturerId**: Foreign key reference to `manufacturers`.
- **manufacturerIdIndex**: Index on `manufacturerId` for faster lookup.

### patches

- **fixtureId**: Foreign key reference to `fixtures`.
