import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Typography
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

// Tauri API
import { invoke } from '@tauri-apps/api/core';

// CLDDatePicker component
const CLDDatePicker = ({title, value, setValue}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={title}
        value={value}
        onChange={(newValue) => setValue(newValue)}
        format="DD/MM/YYYY"
        views={['day', 'month', 'year']}
        fullWidth
      />
    </LocalizationProvider>
  );
};

CLDDatePicker.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
  setValue: PropTypes.func.isRequired
};

// CLDTimeRange component
const CLDTimeRange = ({fromValue, setFromValue, toValue, setToValue}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="From"
          value={fromValue}
          onChange={(newValue) => setFromValue(newValue)}
          ampm={false}
        />

        <Typography variant="h6" sx={{ marginX: 0.5 }}>—</Typography>

        <TimePicker
          label="To"
          value={toValue}
          onChange={(newValue) => setToValue(newValue)}
          ampm={false}
        />
      </LocalizationProvider>
    </Box>
  );
}
CLDTimeRange.propTypes = {
  fromValue: PropTypes.object.isRequired,
  setFromValue: PropTypes.func.isRequired,
  toValue: PropTypes.object.isRequired,
  setToValue: PropTypes.func.isRequired
};




// TaskModal component
const TaskModal = ({ selectedTaskID, handleClose }) => {
  console.log(selectedTaskID);
  const theme = useTheme();
  // Set states
  const [taskDetails, setTaskDetails] = useState({
    taskID: null,
    taskTitle: '',
    taskGroup: 'Normal',
    haveDeadline: true,
    deadlineDate: dayjs(),
    deadlineTime: dayjs(),
    restrict: true,
    taskDate: dayjs(),
    fromTime: dayjs(),
    toTime: dayjs(),
    duration: 0,
    maxSplits: 1,
    taskDescription: ''
  });

  const {
    taskTitle,
    taskGroup,
    haveDeadline,
    deadlineDate,
    deadlineTime,
    restrict,
    taskDate,
    fromTime,
    toTime,
    duration,
    maxSplits,
    taskDescription
  } = taskDetails;

  const setTaskDetail = (key, value) => {
    setTaskDetails(prevState => ({
      ...prevState,
      [key]: value
    }));
  };
  const setTaskTitle = (value) => setTaskDetail('taskTitle', value);
  const setTaskGroup = (value) => setTaskDetail('taskGroup', value);
  const setHaveDeadline = (value) => setTaskDetail('haveDeadline', value);
  const setDeadlineDate = (value) => setTaskDetail('deadlineDate', value);
  const setDeadlineTime = (value) => setTaskDetail('deadlineTime', value);
  const setRestrict = (value) => setTaskDetail('restrict', value);
  const setTaskDate = (value) => setTaskDetail('taskDate', value);
  const setFromTime = (value) => setTaskDetail('fromTime', value);
  const setToTime = (value) => setTaskDetail('toTime', value);
  const setDuration = (value) => setTaskDetail('duration', value);
  const setMaxSplits = (value) => setTaskDetail('maxSplits', value);
  const setTaskDescription = (value) => setTaskDetail('taskDescription', value);

  useEffect(() => {
    const fetchTask = async () => {
      if (selectedTaskID && selectedTaskID !== -1) {
        const selectedTask = await invoke('get_original_task', { taskId: selectedTaskID });
        console.log(selectedTask);
        
        setTaskDetails({
          taskID: selectedTask.task_id,
          taskTitle: selectedTask.task_title,
          taskGroup: selectedTask.task_group,
          haveDeadline: selectedTask.have_deadline,
          deadlineDate: dayjs(selectedTask.deadline_date),
          deadlineTime: dayjs().set('hour', selectedTask.deadline_time.split(':')[0]).set('minute', selectedTask.deadline_time.split(':')[1]),
          restrict: selectedTask.restrict,
          taskDate: dayjs(selectedTask.task_date),
          fromTime: dayjs().set('hour', selectedTask.from_time.split(':')[0]).set('minute', selectedTask.from_time.split(':')[1]),
          toTime: dayjs().set('hour', selectedTask.to_time.split(':')[0]).set('minute', selectedTask.to_time.split(':')[1]),
          duration: selectedTask.duration,
          maxSplits: selectedTask.max_splits,
          taskDescription: selectedTask.task_description
        });
      }
    };

    fetchTask();
  }, [selectedTaskID]);

  const handleSubmit = async () => {
    const taskData = {
      task_title: taskTitle,
      task_group: taskGroup,
      have_deadline: haveDeadline,
      deadline_date: deadlineDate.format('YYYY-MM-DD'),
      deadline_time: deadlineTime.format('HH:mm'),
      restrict: restrict,
      task_date: taskDate.format('YYYY-MM-DD'),
      from_time: fromTime.format('HH:mm'),
      to_time: toTime.format('HH:mm'),
      duration: duration,
      max_splits: maxSplits,
      task_description: taskDescription,
    };

    try {
      const response = await invoke('create_task', { task: taskData });
      handleClose();
      console.log(response);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <Dialog
      open={selectedTaskID !== null}
      onClose={handleClose}
      aria-labelledby="mini-modal-title"
      aria-describedby="mini-modal-description"
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          maxWidth: '90%',
          borderRadius: '10px',
        },
      }}
    >
      <DialogTitle id="mini-modal-title" sx={{ backgroundColor: theme.palette.primary.main, color: 'white' }}>
        <Typography variant="h6" fullWidth textAlign='center'>Task Details</Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ flexGrow: 1, paddingTop: 2 }}>
          <Grid container spacing={2}>
            {/* LINE 1 */}
            {/* Task title textfield */}
            <Grid item size={9}>
              <TextField 
                id='task-title' 
                label='Task Title' 
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                fullWidth 
              />
            </Grid>

            {/* Task group select */}
            <Grid item size={3}>
              <FormControl fullWidth>
                <InputLabel id="task-group-select-label">Task Group</InputLabel>
                <Select
                  labelId="task-group-select-label"
                  id="task-group-select"
                  value={taskGroup}
                  onChange={(e) => setTaskGroup(e.target.value)}
                  label="Task Group"
                >
                  <MenuItem value={'Normal'}>Normal</MenuItem>
                  <MenuItem value={'Important'}>Important</MenuItem>
                  <MenuItem value={'Urgent'}>Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* END LINE 1 */}

            {/* LINE 2 */}
            <Grid item size={2} style={{ display: 'flex', alignItems: 'center' }}>
              <Typography 
                variant="h5" 
                backgroundColor={theme.palette.primary.main}
                color='white' 
                padding={'10px 20px 10px 20px'}
                borderRadius={'0.5rem'}
              >
                Deadline:
              </Typography>
            </Grid>

            <Grid item size={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
              <FormControlLabel 
                control={<Switch value={haveDeadline} checked={haveDeadline} onChange={(e) => setHaveDeadline(e.target.checked)} />}
                label="Have deadline"
              />
            </Grid>

            <Grid item size={8} visibility={haveDeadline ? 'visible' : 'hidden' }>
              <Grid container spacing={2}>
                <Grid item size={4} style={{ display: 'flex', alignItems: 'center' }}>
                  <CLDDatePicker title="Deadline date" value={deadlineDate} setValue={setDeadlineDate} />
                </Grid>

                <Grid item size={4} style={{ display: 'flex', alignItems: 'center' }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker label="Deadline time" value={deadlineTime} onChange={(newValue) => setDeadlineTime(newValue)} ampm={false} />
                  </LocalizationProvider>
                </Grid>
                <Grid item size={4}></Grid>
              </Grid>
            </Grid>            

            {/* END LINE 2 */}

            {/* LINE 3 */}
            <Grid item size={2} style={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
                variant="h5" 
                backgroundColor={theme.palette.primary.main}
                color='white' 
                padding={'10px 20px 10px 20px'}
                borderRadius={'0.5rem'}
              >
                Time set:
              </Typography>
            </Grid>

            <Grid item size={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
              {/* Restrict switch */}
              <FormControlLabel 
                control={<Switch value={restrict} checked={restrict} onChange={(e) => setRestrict(e.target.checked)} />}
                label="Restrict"
              />
            </Grid>
            
            <Grid item size={8} display={restrict ? 'block' : 'none' }>
              <Grid container spacing={2}>
                <Grid item size={4}>
                  <CLDDatePicker title="Task date" value={taskDate} setValue={setTaskDate} />
                </Grid>
                <Grid item size={8}>
                  <CLDTimeRange fromValue={fromTime} setFromValue={setFromTime} toValue={toTime} setToValue={setToTime} />
                </Grid>
              </Grid>
            </Grid>

            <Grid item size={8} display={restrict ? 'none' : 'block' }>
              <Grid container spacing={2}>
                <Grid item size={6} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Typography variant="h6" color={theme.palette.primary.main}>Duration (in minutes):</Typography>
                  <TextField 
                    type='number'
                    value={duration}
                    onChange={(e) => setDuration(Math.max(0, e.target.value))}
                    sx={{ width: '150px' }}
                  >
                  </TextField>
                </Grid>
                <Grid item size={6} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Typography variant="h6" color={theme.palette.primary.main}>Max split:</Typography>
                  <TextField 
                    type='number'
                    value={maxSplits}
                    onChange={(e) => setMaxSplits(Math.max(1, e.target.value))}
                    sx={{ width: '100px' }}
                  >
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
            {/* END LINE 3 */}

            {/* LINE 4 */}
            <Grid item size={12} style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h5" backgroundColor={theme.palette.primary.main} color='white' padding={'10px 20px 10px 20px'} borderRadius={'0.5rem'}>
                Task Description:
              </Typography>
            </Grid>
            {/* END LINE 4 */}

            {/* LINE 5 */}
            <Grid item size={12}>
              <TextField 
                id='task-description'
                multiline
                rows={10}
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                fullWidth 
              />
            </Grid>
            {/* END LINE 5 */}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions style={{ justifyContent: 'space-between', padding: '0px 25px 20px 25px' }}>
        <Button 
          onClick={handleClose} 
          sx={{ 
            color: 'white', 
            backgroundColor: theme.palette.primary.main, 
            padding: '10px 20px 10px 20px',
            visibility: selectedTaskID != null ? 'hidden' : 'visible',
            transition: 'visibility 0s 0.3s, opacity 0.3s linear',
          }}
        >
          Delete
        </Button>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Button onClick={handleClose} sx={{ color: 'white', backgroundColor: theme.palette.primary.main, padding: '10px 20px 10px 20px' }}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} sx={{ color: 'white', backgroundColor: theme.palette.primary.main, padding: '10px 20px 10px 20px' }}>
            Accept
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default TaskModal;

TaskModal.propTypes = {
  selectedTaskID: PropTypes.number.isRequired,
  handleClose: PropTypes.func.isRequired
};