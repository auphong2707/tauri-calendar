use std::fs;
use std::path::Path;
use dirs_next::home_dir;

use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;

use crate::schema::tasks;
use crate::schema::active_tasks;
use crate::algo::get_arranged_tasks;
use chrono::Duration;

const DB_PATH: &str = "/.config/orion/database/sqlite";

// [INITIALIZATION]
// Get the path where the database file should be located
fn get_db_path() -> String {
    let home_dir = home_dir().unwrap();
    home_dir.to_str().unwrap().to_string() + DB_PATH
}

// Create the database file if it doesn't exist
pub fn init() {
    let db_path = get_db_path();
    let db_dir = Path::new(&db_path).parent().unwrap();

    if !Path::new(&db_path).exists() {
        // If the parent directory does not exist, create it
        if !db_dir.exists() {
            fs::create_dir_all(db_dir).unwrap();
        }
        // Create the database fileTask created successfully
        fs::File::create(&db_path).unwrap();
    }
}


// Establish the connection to the database
pub fn establish_db_connection() -> SqliteConnection {
    let db_path = get_db_path();
    SqliteConnection::establish(db_path.as_str())
        .unwrap_or_else(|_| panic!("Error connecting to {}", db_path))
}
// [END INITIALIZATION]



// [TABLE STRUCTURE]
#[derive(Queryable, Insertable, AsChangeset, Clone, serde::Deserialize, serde::Serialize, Selectable, Debug)]
#[diesel(table_name = tasks)]
pub struct Task {
    pub task_id: Option<i32>,
    pub task_title: String,
    pub task_group: String,
    pub have_deadline: bool,
    pub deadline_date: String,
    pub deadline_time: String,
    pub task_date: String,
    pub from_time: String,
    pub to_time: String,
    pub restrict: bool,
    pub duration: i32,
    pub max_splits: i32,
    pub task_description: String,
}

#[derive(Queryable, Insertable, AsChangeset, Selectable, serde::Deserialize, serde::Serialize, Debug)]
#[diesel(table_name = active_tasks)]
pub struct ActiveTask {
    pub active_task_id: Option<i32>,
    pub ref_task_id: i32,
    pub task_title: String,
    pub task_description: String,
    pub task_date: String,
    pub from_time: String,
    pub duration: i32,
    pub task_status: String,
}
// [END TABLE STRUCTURE]



// [CRUD OPERATIONS]
#[tauri::command]
pub fn create_task(task: Task) -> String {
    let mut connection = establish_db_connection();
    diesel::insert_into(tasks::table)
        .values(&task)
        .execute(&mut connection)
        .map(|_| "Task created successfully".to_string())
        .unwrap_or_else(|err| format!("Error creating task: {}", err));

    // Calculate tomorrow's date
    let tomorrow = chrono::Local::now().naive_local().date() + Duration::days(1);
    let tomorrow_str = tomorrow.to_string();

    // Fetch tasks with a date >= tomorrow
    let tasks: Vec<Task> = tasks::table
                        .filter(tasks::task_date.ge(tomorrow_str).or(tasks::restrict.eq(false)))
                        .select(Task::as_select())
                        .load::<Task>(&mut connection)
                        .expect("Error loading tasks");

    // Arrange the tasks
    let arranged_tasks = get_arranged_tasks(tasks, tomorrow);

    // Clear the active_tasks table
    diesel::delete(active_tasks::table)
        .execute(&mut connection)
        .expect("Error clearing active_tasks table");

    // Insert the arranged tasks into the active_tasks table
    diesel::insert_into(active_tasks::table)
        .values(&arranged_tasks)
        .execute(&mut connection)
        .expect("Error inserting arranged tasks into active_tasks table");

    "Task created successfully".to_string()
}

#[tauri::command]
pub fn get_task_list(date: &str) -> Vec<ActiveTask> {
    let mut connection = establish_db_connection();
    let active_tasks: Vec<ActiveTask> = active_tasks::table
        .filter(active_tasks::task_date.eq(date))
        .load::<ActiveTask>(&mut connection)
        .expect("Error loading active tasks");

    active_tasks
}

#[tauri::command]
pub fn update_task(updated_task: Task) -> String {
    use crate::schema::tasks::dsl::*;

    let mut connection = establish_db_connection();
    diesel::update(tasks.filter(task_id.eq(updated_task.task_id)))
        .set(&updated_task)
        .execute(&mut connection)
        .map(|_| "Task updated successfully".to_string())
        .unwrap_or_else(|err| format!("Failed to update task: {}", err))
}

#[tauri::command]
pub fn delete_task(delete_task_id: i32) -> String {
    use crate::schema::tasks::dsl::*;

    let mut connection = establish_db_connection();
    diesel::delete(tasks.filter(task_id.eq(delete_task_id)))
        .execute(&mut connection)
        .map(|_| "Task deleted successfully".to_string())
        .unwrap_or_else(|err| format!("Failed to delete task: {}", err))
}
// [END CRUD OPERATIONS]