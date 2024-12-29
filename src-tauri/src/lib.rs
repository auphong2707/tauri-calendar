mod db;
mod schema;
mod algo;

use db::{create_task, 
         delete_task, 
         get_task_list, 
         update_task, 
         get_original_task};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  println!("App is running!");
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      // Initialize the database
      db::init();

      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      create_task,
      get_task_list,
      update_task,
      delete_task,
      get_original_task
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
