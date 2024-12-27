// @generated automatically by Diesel CLI.

diesel::table! {
    active_tasks (active_task_id) {
        active_task_id -> Nullable<Integer>,
        ref_task_id -> Integer,
        task_title -> Text,
        task_description -> Text,
        task_date -> Text,
        from_time -> Text,
        duration -> Integer,
        task_status -> Text,
    }
}

diesel::table! {
    tasks (task_id) {
        task_id -> Nullable<Integer>,
        task_title -> Text,
        task_group -> Text,
        have_deadline -> Bool,
        deadline_date -> Text,
        deadline_time -> Text,
        restrict -> Bool,
        task_date -> Text,
        from_time -> Text,
        to_time -> Text,
        duration -> Integer,
        max_splits -> Integer,
        task_description -> Text,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    active_tasks,
    tasks,
);
