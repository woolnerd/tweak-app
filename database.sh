#!/bin/bash

# Define SQLite database file path
DATABASE="your_database.db"

# SQLite commands to create tables
cat <<EOF | sqlite3 $DATABASE

CREATE TABLE fixture_profile(
  id INTEGER PRIMARY KEY,
  fixture_id INTEGER,
  profile_id INTEGER,
  FOREIGN KEY (fixture_id) REFERENCES Fixture(fixture_id),
  FOREIGN KEY (profile_id) REFERENCES Profile(profile_id)
);

CREATE TABLE fixture(
  id INTEGER PRIMARY KEY,
  name TEXT,
  manufacturer_id INTEGER,
  fixture_profile_id INTEGER,
  notes TEXT
);

CREATE TABLE profile(
  id INTEGER PRIMARY KEY,
  name TEXT,
  fixture_profile_id INTEGER,
  mode TEXT,
  channels JSONB
);

CREATE TABLE fixture_assignment(
  id INTEGER PRIMARY KEY,
  fixture_id INTEGER,
  profile_id INTEGER,
  scene_id INTEGER,
  channel INTEGER,
  value INTEGER,
  FOREIGN KEY (profile_id) REFERENCES Profile(profile_id),
  FOREIGN KEY (scene_id) REFERENCES Scene(scene_id),
  FOREIGN KEY (fixture_id) REFERENCES Fixture(fixture_id)
);

CREATE TABLE scene(
  id INTEGER PRIMARY KEY,
  name TEXT,
  fixture_assignment_id INTEGER,
  FOREIGN KEY (fixture_assignment_id) REFERENCES FixtureAssignment(fixture_assignment_id)
);
EOF
