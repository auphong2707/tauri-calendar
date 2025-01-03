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

    for index in 0..num_split as usize {
        sum_duration += free_time_vec[index].duration;
        if free_time_vec[index].duration < time_base {
            return false;
        }
    }

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
                &arranged_tasks[index].task_date,
                "%Y-%m-%d",
            )
            .unwrap();

            if mut_date < task_date {
                break;
            }
    
            let duration = arranged_tasks[index].duration.clone();
    
            let time_space = TimeSpace {
                date: task_date,
                start_time: NaiveTime::parse_from_str(
                    &arranged_tasks[index].from_time,
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
        if task.restrict {
            let active_task = ActiveTask {
                active_task_id: None,
                ref_task_id: task.task_id.clone().unwrap(),
                task_title: task.task_title.clone(),
                task_date: task.task_date.clone(),
                from_time: task.from_time.clone(),
                duration: calculate_duration(&task.from_time, &task.to_time),
                task_status: "Pending".to_string(),
                task_description: task.task_description.clone(),
            };
            
            active_tasks.push(active_task);
        } else {
            automatic_tasks.push(task);
        }
    }

    automatic_tasks.sort_by(|a, b| {
        match (a.have_deadline.clone(), b.have_deadline.clone()) {
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

        active_tasks.sort_by(|a, b| {
            let date_cmp = a.task_date.cmp(&b.task_date);
            if date_cmp == std::cmp::Ordering::Equal {
                a.from_time.cmp(&b.from_time)
            } else {
                date_cmp
            }
        });
        
        for num_split in 1..(task.max_splits.clone() + 1) {
            println!("Try arranging task: {} with num_split: {}", task.task_title, num_split);

            let (free_time_vec, finish_date) = arrange_free_time(
                from_date, 
                &active_tasks, 
                task.duration.clone(), 
                num_split);

            if current_finish_date.is_none() || finish_date < current_finish_date.unwrap() {
                current_finish_date = Some(finish_date);
                current_free_time_vec = free_time_vec;
            }
        }
        
        println!("Current finish date: {:?}", current_finish_date);
        println!("Current free time vec: {:?}", current_free_time_vec);

        let num_split = current_free_time_vec.len() as i32;
        let time_base = task.duration.clone() / (num_split + 1);
        let mut time_left = task.duration.clone() - time_base * num_split;

        for index in 0..num_split as usize {
            println!("Start arranging task in free time with index: {}", index);
            if (task.duration.clone() / (num_split + 1)) + time_left 
                    >= current_free_time_vec[index].duration 
            {
                time_left = (task.duration.clone() / (num_split + 1)) 
                            + time_left 
                            - current_free_time_vec[index].duration;

                let active_task = ActiveTask {
                    active_task_id: None,
                    ref_task_id: task.task_id.clone().unwrap(),
                    task_title: task.task_title.clone(),
                    task_date: current_free_time_vec[index].date.clone().to_string(),
                    from_time: current_free_time_vec[index].clone()
                                .start_time
                                .format("%H:%M")
                                .to_string(),
                    duration: current_free_time_vec[index].duration.clone(),
                    task_status: "Pending".to_string(),
                    task_description: task.task_description.clone(),
                };
                println!("Active task: {:?}", active_task.clone());
                active_tasks.push(active_task);

            } else {
                let time_left_for_each_task = time_left / (index as i32 + 1);
                println!("index + 1: {}, num_split: {}", index, num_split);
                for index_2 in (index..num_split as usize).rev() {
                    println!("Start arranging task in free time with index: {}", index_2);
                    if index_2 < num_split as usize - 1 {
                        let active_task = ActiveTask {
                            active_task_id: None,
                            ref_task_id: task.task_id.clone().unwrap(),
                            task_title: task.task_title.clone(),
                            task_date: current_free_time_vec[index_2].date.clone().to_string(),
                            from_time: current_free_time_vec[index_2].clone()
                                        .start_time
                                        .format("%H:%M")
                                        .to_string(),
                            duration: time_base + time_left_for_each_task,
                            task_status: "Pending".to_string(),
                            task_description: task.task_description.clone(),
                        };

                        time_left -= time_left_for_each_task;

                        println!("Active task: {:?}", active_task.clone());
                        active_tasks.push(active_task);

                    } else {
                        let active_task = ActiveTask {
                            active_task_id: None,
                            ref_task_id: task.task_id.clone().unwrap(),
                            task_title: task.task_title.clone(),
                            task_date: current_free_time_vec[index_2].date.clone().to_string(),
                            from_time: current_free_time_vec[index_2].clone()
                                        .start_time
                                        .format("%H:%M")
                                        .to_string(),
                            duration: time_base + time_left,
                            task_status: "Pending".to_string(),
                            task_description: task.task_description.clone(),
                        };

                        println!("Active task: {:?}", active_task.clone());
                        active_tasks.push(active_task);
                    }
                }
                break;
            }
        }
    }

    active_tasks
}