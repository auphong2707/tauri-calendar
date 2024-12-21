-- Your SQL goes here
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_title TEXT NOT NULL,
    task_group TEXT,
    deadline_date TEXT,        -- Store as ISO-8601 format (e.g., YYYY-MM-DD)
    deadline_time TEXT,        -- Store as HH:MM (24-hour format)
    task_date TEXT,            -- ISO-8601 format
    from_time TEXT,            -- HH:MM (start time)
    to_time TEXT,              -- HH:MM (end time)
    restrict BOOLEAN DEFAULT 0,
    task_description TEXT
);
