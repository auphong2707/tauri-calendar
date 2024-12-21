import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
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

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimeField } from '@mui/x-date-pickers/TimeField';

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
        <TimeField
          label="From"
          value={fromValue}
          onChange={(newValue) => setFromValue(newValue)}
        />

        <Typography variant="h6" sx={{ marginX: 0.5 }}>—</Typography>

        <TimeField
          label="To"
          value={toValue}
          onChange={(newValue) => setToValue(newValue)}
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
const TaskModal = ({ isOpen, handleClose }) => {
  // Set states
  const [taskTitle, setTaskTitle] = useState('');
  const [taskGroup, setTaskGroup] = useState('Normal');

  const [deadlineDate, setDeadlineDate] = useState(dayjs());
  const [deadlineTime, setDeadlineTime] = useState(dayjs());

  const [restrict, setRestrict] = useState(true);
  const [taskDate, setTaskDate] = useState(dayjs());
  const [fromTime, setFromTime] = useState(dayjs());
  const [toTime, setToTime] = useState(dayjs());

  const [taskDescription, setTaskDescription] = useState('');

  const handleSubmit = async () => {
    const taskData = {
      title: taskTitle,
      group: taskGroup,
      deadlineDate: deadlineDate.format(),
      deadlineTime: deadlineTime.format(),
      restrict,
      taskDate: taskDate.format(),
      fromTime: fromTime.format(),
      toTime: toTime.format(),
      description: taskDescription,
    };

    try {
      const response = await invoke('create_task', taskData);
      handleClose();
      console.log(response);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };


  useEffect(() => {
    if (isOpen) {
      setTaskTitle('');
      setTaskGroup('Normal');
      setRestrict(true);
      setTaskDate(dayjs());
      setFromTime(dayjs());
      setToTime(dayjs());
      setTaskDescription('');
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="mini-modal-title"
      aria-describedby="mini-modal-description"
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          maxWidth: '70%',
          borderRadius: '10px',
        },
      }}
    >
      <DialogTitle id="mini-modal-title" sx={{ backgroundColor: 'olive', color: 'white' }}>
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
                backgroundColor='olive' 
                color='white' 
                padding={'10px 20px 10px 20px'}
                borderRadius={'0.5rem'}
              >
                Deadline:
              </Typography>
            </Grid>

            <Grid item size={3} style={{ display: 'flex', alignItems: 'center' }}>
              <CLDDatePicker title="Deadline date" value={deadlineDate} setValue={setDeadlineDate} />
            </Grid>

            <Grid item size={3} style={{ display: 'flex', alignItems: 'center' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimeField label="Deadline time" value={deadlineTime} onChange={(newValue) => setDeadlineTime(newValue)} />
              </LocalizationProvider>
            </Grid>

            <Grid item size={4}>
            </Grid>            

            {/* END LINE 2 */}

            {/* LINE 3 */}
            <Grid item size={2} style={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
                variant="h5" 
                backgroundColor='olive' 
                color='white' 
                padding={'10px 20px 10px 20px'}
                borderRadius={'0.5rem'}
              >
                Time set:
              </Typography>
            </Grid>

            <Grid item size={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Restrict switch */}
              <FormControlLabel 
                control={<Switch value={restrict} checked={restrict} onChange={(e) => setRestrict(e.target.checked)} />}
                label="Restrict"
              />
            </Grid>
            
            <Grid item size={8}>
              <Grid container spacing={2}>
                <Grid item size={3}>
                  <CLDDatePicker title="Task date" value={taskDate} setValue={setTaskDate} />
                </Grid>
                <Grid item size={9}>
                  <CLDTimeRange fromValue={fromTime} setFromValue={setFromTime} toValue={toTime} setToValue={setToTime} />
                </Grid>
              </Grid>
            </Grid>
            {/* END LINE 3 */}

            {/* LINE 4 */}
            <Grid item size={12} style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h5" backgroundColor='olive' color='white' padding={'10px 20px 10px 20px'} borderRadius={'0.5rem'}>
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
        <Button onClick={handleClose} sx={{ color: 'white', background: 'olive', padding: '10px 20px 10px 20px' }}>
          Delete
        </Button>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Button onClick={handleClose} sx={{ color: 'white', background: 'olive', padding: '10px 20px 10px 20px' }}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} sx={{ color: 'white', background: 'olive', padding: '10px 20px 10px 20px' }}>
            Accept
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default TaskModal;

TaskModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};