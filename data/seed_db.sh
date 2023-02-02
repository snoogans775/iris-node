#!/usr/bin/env sh
sqlite3 --batch data/database.sqlite < data/init_db.sql &&
chmod a+rw data/database.sqlite