// @generated automatically by Diesel CLI.

diesel::table! {
    active_tasks (id) {
        id -> Nullable<Integer>,
        task_title -> Text,
        task_description -> Nullable<Text>,
        task_date -> Nullable<Text>,
        from_time -> Nullable<Text>,
        duration -> Nullable<Integer>,
        task_status -> Nullable<Text>,
    }
}

diesel::table! {
    tasks (id) {
        id -> Nullable<Integer>,
        task_title -> Text,
        task_group -> Nullable<Text>,
        have_deadline -> Nullable<Bool>,
        deadline_date -> Nullable<Text>,
        deadline_time -> Nullable<Text>,
        restrict -> Nullable<Bool>,
        task_date -> Nullable<Text>,
        from_time -> Nullable<Text>,
        to_time -> Nullable<Text>,
        duration -> Nullable<Integer>,
        max_splits -> Nullable<Integer>,
        task_description -> Nullable<Text>,
    }
}

diesel::joinable!(active_tasks -> tasks (id));

diesel::allow_tables_to_appear_in_same_query!(
    active_tasks,
    tasks,
);
