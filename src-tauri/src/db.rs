use std::fs;
use std::path::Path;
use dirs_next::home_dir;
use chrono::NaiveTime;

use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;

use crate::schema::tasks;
use crate::schema::active_tasks;

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
#[derive(Queryable, Insertable, AsChangeset, Selectable, Clone, serde::Deserialize, serde::Serialize)]
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

#[derive(Queryable, Insertable, AsChangeset, Selectable, serde::Deserialize, serde::Serialize)]
#[diesel(table_name = active_tasks)]
pub struct ActiveTask {
    pub id: Option<i32>,
    pub task_title : String,
    pub task_description: Option<String>,
    pub task_date: Option<String>,
    pub from_time: Option<String>,
    pub duration: Option<i32>,
    pub task_status: Option<String>,
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

    if task.restrict.unwrap() {
        let cloned_task = task.clone();
        
        let cal_from_time = NaiveTime::parse_from_str(&task.from_time.unwrap(), "%H:%M").unwrap();
        let cal_to_time = NaiveTime::parse_from_str(&task.to_time.unwrap(), "%H:%M").unwrap();
        let cal_duration = (cal_to_time - cal_from_time).num_minutes() as i32;

        
        let active_task = ActiveTask {
            id: cloned_task.id,
            task_title: cloned_task.task_title,
            task_date: cloned_task.task_date,
            from_time: cloned_task.from_time,
            duration: Some(cal_duration),
            task_status: Some("Pending".to_string()),
            task_description: task.task_description,
        };

        diesel::insert_into(active_tasks::table)
            .values(&active_task)
            .execute(&mut connection)
            .map(|_| "Active task created successfully".to_string())
            .unwrap_or_else(|err| format!("Error creating active task: {}", err))
    }
    else {
        "This case is not implemented yet".to_string()
    }
}

#[tauri::command]
pub fn get_task_list(date: &str) -> Vec<ActiveTask> {
    let mut connection = establish_db_connection();
    active_tasks::table
        .filter(active_tasks::task_date.eq(date))
        .inner_join(tasks::table.on(tasks::id.eq(active_tasks::id)))
        .select((active_tasks::all_columns, tasks::task_title))
        
        .load::<(ActiveTask, String)>(&mut connection)
        .expect("Error loading tasks")
        .into_iter()
        .map(|(active_task, task_title)| {
            ActiveTask {
                id: active_task.id,
                task_title,
                task_description: active_task.task_description,
                task_date: active_task.task_date,
                from_time: active_task.from_time,
                duration: active_task.duration,
                task_status: active_task.task_status,
            }
        })
        .collect()
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
// [END CRUD OPERATIONS]