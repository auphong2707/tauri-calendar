// @generated automatically by Diesel CLI.

diesel::table! {
    tasks (id) {
        id -> Nullable<Integer>,
        task_title -> Text,
        task_group -> Nullable<Text>,
        deadline_date -> Nullable<Text>,
        deadline_time -> Nullable<Text>,
        task_date -> Nullable<Text>,
        from_time -> Nullable<Text>,
        to_time -> Nullable<Text>,
        restrict -> Nullable<Bool>,
        task_description -> Nullable<Text>,
    }
}
