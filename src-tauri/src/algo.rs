use chrono::{NaiveDate, NaiveTime, Duration};
use crate::db::{Task, ActiveTask};

fn calculate_duration(from_time: &str, to_time: &str) -> i32 {
    let from_time = NaiveTime::parse_from_str(from_time, "%H:%M").unwrap();
    let to_time = NaiveTime::parse_from_str(to_time, "%H:%M").unwrap();
    let duration = to_time.signed_duration_since(from_time).num_minutes();
    duration as i32
}

#[derive(Clone, Debug)]
struct TimeSpace {
    date: NaiveDate,
    start_time: NaiveTime,
    duration: i32,
}

fn is_ok_to_add_task(free_time_vec: &mut Vec<TimeSpace>, task_duration: i32, num_split: i32) -> bool {
    free_time_vec.sort_by(|a, b| b.duration.cmp(&a.duration));
    let time_base = task_duration / (num_split + 1);

    let mut sum_duration = 0;

    if free_time_vec.len() < num_split as usize {
        return false;
    }

    println!("Pass check 1");
    println!("Free time vec: {:?}", free_time_vec);

    for index in 0..num_split as usize {
        sum_duration += free_time_vec[index].duration;
        if free_time_vec[index].duration < time_base {
            return false;
        }
    }

    println!("Pass check 2");

    sum_duration >= task_duration
}

fn arrange_free_time(from_date: NaiveDate,
                     arranged_tasks: &Vec<ActiveTask>,
                     task_duration: i32,
                     num_split: i32
                    ) -> (Vec<TimeSpace>, NaiveDate)
{
    println!("Arranged tasks: {:?}", arranged_tasks);

    let mut free_time_vec: Vec<TimeSpace> = Vec::new();
    let mut current_index = 0;
    let mut mut_date = from_date;
    let mut time_array: Vec<TimeSpace> = Vec::new();

    while !is_ok_to_add_task(&mut free_time_vec, task_duration, num_split) {
        time_array.clear();
        let mut new_index = current_index;

        for index in current_index..arranged_tasks.len() {
            let task_date = NaiveDate::parse_from_str(
                arranged_tasks[index].task_date.as_ref().unwrap(),
                "%Y-%m-%d",
            )
            .unwrap();

            if mut_date < task_date {
                break;
            }
    
            let duration = arranged_tasks[index].duration.unwrap();
    
            let time_space = TimeSpace {
                date: task_date,
                start_time: NaiveTime::parse_from_str(
                    arranged_tasks[index].from_time.as_ref().unwrap(),
                    "%H:%M",
                )
                .unwrap(),
                duration,
            };
    
            time_array.push(time_space);
            new_index = index + 1;
        }
        
        current_index = new_index;
        time_array.push(TimeSpace {
            date: mut_date,
            start_time: NaiveTime::from_hms_opt(23, 59, 59).expect("Invalid time"),
            duration: 0,
        });
        time_array.sort_by(|a, b| a.start_time.cmp(&b.start_time));

        println!("Time array: {:?}", time_array);

        let mut start_time_pointer = NaiveTime::from_hms_opt(0, 0, 0).expect("Invalid time");
        for time_space in &time_array {
            let free_time_duration: i32 = time_space.start_time.signed_duration_since(start_time_pointer).num_minutes() as i32;

            if free_time_duration > 0 {
                let free_time = TimeSpace {
                    date: mut_date,
                    start_time: start_time_pointer,
                    duration: free_time_duration,
                };

                free_time_vec.push(free_time);
            }

            start_time_pointer = time_space.start_time + Duration::minutes(time_space.duration as i64);
        }
        
        println!("Free time vec: {:?}", free_time_vec);

        mut_date = mut_date + Duration::days(1);
        println!("Check is ok to add task: {:?}", is_ok_to_add_task(&mut free_time_vec, task_duration, num_split));
    }

    free_time_vec.truncate(num_split as usize);
    free_time_vec.reverse();
    mut_date = mut_date - Duration::days(1);

    (free_time_vec, mut_date)
}

pub fn get_arranged_tasks(tasks: Vec<Task>, from_date: NaiveDate) -> Vec<ActiveTask> {
    println!("Start arranging tasks\n");

    let mut active_tasks: Vec<ActiveTask> = Vec::new();
    let mut automatic_tasks: Vec<Task> = Vec::new();

    println!("Start filtering tasks\n");

    for task in tasks {
        if task.restrict.unwrap_or(false) {
            let active_task = ActiveTask {
                id: task.id.clone(),
                task_title: task.task_title.clone(),
                task_date: task.task_date.clone(),
                from_time: task.from_time.clone(),
                duration: Some(calculate_duration(&task.from_time.unwrap(), &task.to_time.unwrap())),
                task_status: Some("Pending".to_string()),
                task_description: task.task_description.clone(),
            };
            
            active_tasks.push(active_task);
        } else {
            automatic_tasks.push(task);
        }
    }

    automatic_tasks.sort_by(|a, b| {
        match (a.have_deadline.unwrap(), b.have_deadline.unwrap()) {
            (true, true) => a.deadline_date.cmp(&b.deadline_date),
            (false, true) => std::cmp::Ordering::Greater,
            (true, false) => std::cmp::Ordering::Less,
            (false, false) => std::cmp::Ordering::Equal,
        }
    });

    println!("Finished filtering tasks\n");

    for task in automatic_tasks {
        let mut current_finish_date: Option<NaiveDate> = None;
        let mut current_free_time_vec: Vec<TimeSpace> = Vec::new();
        
        for num_split in 1..(task.max_splits.unwrap_or(1) + 1) {
            println!("Try arranging task: {} with num_split: {}", task.task_title, num_split);

            let (free_time_vec, finish_date) = arrange_free_time(
                from_date, 
                &active_tasks, 
                task.duration.unwrap(), 
                num_split);

            if current_finish_date.is_none() || finish_date < current_finish_date.unwrap() {
                current_finish_date = Some(finish_date);
                current_free_time_vec = free_time_vec;
            }
        }
        
        println!("Current finish date: {:?}", current_finish_date);
        println!("Current free time vec: {:?}", current_free_time_vec);

        let num_split = current_free_time_vec.len() as i32;
        let time_base = task.duration.unwrap() / (num_split + 1);
        let mut time_left = task.duration.unwrap() - time_base * num_split;

        for index in 0..num_split as usize {
            println!("Start arranging task in free time with index: {}", index);
            if (task.duration.unwrap() / (num_split + 1)) + time_left 
                    >= current_free_time_vec[index].duration 
            {
                time_left = (task.duration.unwrap() / (num_split + 1)) 
                            + time_left 
                            - current_free_time_vec[index].duration;

                let active_task = ActiveTask {
                    id: task.id.clone(),
                    task_title: task.task_title.clone(),
                    task_date: Some(current_free_time_vec[index].date.to_string()),
                    from_time: Some(
                        current_free_time_vec[index]
                            .start_time
                            .format("%H:%M")
                            .to_string(),
                    ),
                    duration: Some(current_free_time_vec[index].duration),
                    task_status: Some("Pending".to_string()),
                    task_description: task.task_description.clone(),
                };

                active_tasks.push(active_task);
            } else {
                let time_left_for_each_task = time_left / (index as i32 + 1);
                for index_2 in (0..index + 1).rev() {
                    if index_2 > 0 {
                        let active_task = ActiveTask {
                            id: task.id.clone(),
                            task_title: task.task_title.clone(),
                            task_date: Some(current_free_time_vec[index_2].date.to_string()),
                            from_time: Some(
                                current_free_time_vec[index_2]
                                    .start_time
                                    .format("%H:%M")
                                    .to_string(),
                            ),
                            duration: Some(time_base + time_left_for_each_task),
                            task_status: Some("Pending".to_string()),
                            task_description: task.task_description.clone(),
                        };

                        time_left -= time_left_for_each_task;

                        active_tasks.push(active_task);
                    } else {
                        let active_task = ActiveTask {
                            id: task.id.clone(),
                            task_title: task.task_title.clone(),
                            task_date: Some(current_free_time_vec[index_2].date.to_string()),
                            from_time: Some(
                                current_free_time_vec[index_2]
                                    .start_time
                                    .format("%H:%M")
                                    .to_string(),
                            ),
                            duration: Some(time_base + time_left),
                            task_status: Some("Pending".to_string()),
                            task_description: task.task_description.clone(),
                        };

                        active_tasks.push(active_task);
                    }
                }
            }

            break;
        }
    }

    active_tasks
}