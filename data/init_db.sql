DROP TABLE IF EXISTS intruders;
CREATE TABLE intruder(
        timestamp integer NOT NULL,
        unique_identifier integer NOT NULL,
        latitude real NOT NULL,
        longitude real NOT NULL,
        altitude real NOT NULL,
        heading real NOT NULL,
        horizontal_velocity real NOT NULL,
        vertical_velocity real NOT NULL,
        range real NOT NULL
); 

DROP TABLE IF EXISTS telemetry;
CREATE TABLE telemetry(
        timestamp integer NOT NULL,
        latitude real NOT NULL,
        longitude real NOT NULL,
        altitude real NOT NULL,
        heading real NOT NULL 
);