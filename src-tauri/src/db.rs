use std::fs;
use std::path::Path;
use dirs_next::home_dir;

use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;

use crate::schema::tasks;

const DB_PATH: &str = "/.config/orion/database/sqlite";

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
        // Create the database file
        fs::File::create(&db_path).unwrap();
    }
}


// Establish the connection to the database
pub fn establish_db_connection() -> SqliteConnection {
    let db_path = get_db_path();
    SqliteConnection::establish(db_path.as_str())
        .unwrap_or_else(|_| panic!("Error connecting to {}", db_path))
}

#[derive(Queryable, Insertable, AsChangeset, Selectable, serde::Deserialize, serde::Serialize)]
#[diesel(table_name = tasks)]
pub struct Task {
    pub id: Option<i32>,
    pub task_title: String,
    pub task_group: Option<String>,
    pub have_deadline: Option<bool>,
    pub deadline_date: Option<String>,
    pub deadline_time: Option<String>,
    pub task_date: Option<String>,
    pub from_time: Option<String>,
    pub to_time: Option<String>,
    pub restrict: Option<bool>,
    pub duration: Option<i32>,
    pub max_splits: Option<i32>,
    pub task_description: Option<String>,
}

// CRUD operations
#[tauri::command]
pub fn create_task(task: Task) -> String {
    use crate::schema::tasks::dsl::*;

    let mut connection = establish_db_connection();
    diesel::insert_into(tasks)
        .values(&task)
        .execute(&mut connection)
        .map(|_| "Task created successfully".to_string())
        .unwrap_or_else(|err| format!("Error creating task: {}", err))
}

#[tauri::command]
pub fn get_task_list(date: &str) -> Vec<Task> {
    use crate::schema::tasks::dsl::*;

    let mut connection = establish_db_connection();
    tasks.select(Task::as_select())
        .filter(task_date.eq(date).and(restrict.eq(true)))
        .load::<Task>(&mut connection)
        .expect("Error loading tasks")
}

#[tauri::command]
pub fn update_task(updated_task: Task) -> String {
    use crate::schema::tasks::dsl::*;

    let mut connection = establish_db_connection();
    diesel::update(tasks.filter(id.eq(updated_task.id)))
        .set(&updated_task)
        .execute(&mut connection)
        .map(|_| "Task updated successfully".to_string())
        .unwrap_or_else(|err| format!("Failed to update task: {}", err))
}

#[tauri::command]
pub fn delete_task(task_id: i32) -> String {
    use crate::schema::tasks::dsl::*;

    let mut connection = establish_db_connection();
    diesel::delete(tasks.filter(id.eq(task_id)))
        .execute(&mut connection)
        .map(|_| "Task deleted successfully".to_string())
        .unwrap_or_else(|err| format!("Failed to delete task: {}", err))
}
