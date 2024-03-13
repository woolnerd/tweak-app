#!/bin/bash

# Define SQLite database file path
DATABASE="your_database.db"

# SQLite commands to populate database with dummy data
cat <<EOF | sqlite3 $DATABASE
-- Populate fixture_profile table with dummy data
INSERT INTO fixture_profile (fixture_id, profile_id) VALUES
(1, 1),
(2, 2),
(3, 3);

-- Populate fixture table with dummy data
INSERT INTO fixture (id, name, manufacturer_id, fixture_profile_id, notes) VALUES
(1, 'Fixture 1', 1, 1, 'Notes for Fixture 1'),
(2, 'Fixture 2', 2, 2, 'Notes for Fixture 2'),
(3, 'Fixture 3', 3, 3, 'Notes for Fixture 3');

-- Populate profile table with dummy data
INSERT INTO profile (id, name, fixture_profile_id, mode, channels) VALUES
(1, 'Profile 1', 1, 'Mode 1', '{"1": "Dimmer", "2": "Color Temp", "3": "Strobe"}'),
(2, 'Profile 2', 2, 'Mode 2', '{"1": "Dimmer", "2": "Color Temp", "3": "Green/Magenta Point"}'),
(3, 'Profile 3', 3, 'Mode 3', '{"1": "Dimmer", "2": "Color Temp", "3": "Strobe"}');

-- Populate fixture_assignment table with dummy data
INSERT INTO fixture_assignment (id, fixture_id, profile_id, scene_id, channel, value) VALUES
(1, 1, 1, 1, 1, 100),
(2, 2, 2, 2, 2, 200),
(3, 3, 3, 3, 3, 255);

-- Populate scene table with dummy data
INSERT INTO scene (id, name, fixture_assignment_id) VALUES
(1, 'Scene 1', 1),
(2, 'Scene 2', 2),
(3, 'Scene 3', 3);
EOF
