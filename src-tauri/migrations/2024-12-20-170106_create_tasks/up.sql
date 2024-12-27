-- Your SQL goes here
CREATE TABLE tasks (
    task_id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_title TEXT NOT NULL,
    task_group TEXT NOT NULL,
    have_deadline BOOLEAN DEFAULT 0 NOT NULL,
    deadline_date TEXT NOT NULL,        -- Store as ISO-8601 format (e.g., YYYY-MM-DD)
    deadline_time TEXT NOT NULL,        -- Store as HH:MM (24-hour format)
    restrict BOOLEAN DEFAULT 0 NOT NULL,
    task_date TEXT NOT NULL,            -- ISO-8601 format
    from_time TEXT NOT NULL,            -- HH:MM (start time)
    to_time TEXT NOT NULL,              -- HH:MM (end time)
    duration INTEGER NOT NULL,          -- In minutes
    max_splits INTEGER NOT NULL,        -- Maximum number of splits allowed
    task_description TEXT NOT NULL
);

CREATE TABLE active_tasks (
    active_task_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ref_task_id INTEGER REFERENCES tasks(id) NOT NULL,
    task_title TEXT NOT NULL,
    task_description TEXT NOT NULL,
    task_date TEXT NOT NULL,            -- ISO-8601 format
    from_time TEXT NOT NULL,            -- HH:MM (start time)
    duration INTEGER NOT NULL,          -- In minutes
    task_status TEXT NOT NULL           -- "active" or "ended"
);