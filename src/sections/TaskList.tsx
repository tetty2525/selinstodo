import * as React from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Box, TextField, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import type { Schema } from '../../amplify/data/resource'; // Adjust the path as needed
import { z } from 'zod';

interface TaskListProps {
  tasks: Schema["Todo"]["type"][]; // 修正: tasksの型をstring[]からSchema["Todo"]["type"][]に変更
  onDeleteTask: (id: string) => void;
  onAddTask: (task: string) => void;
}

const taskSchema = z.string().min(1, "Task cannot be empty").refine((val) => val.trim().length > 0, {
  message: "Task cannot be just whitespace",
});

export default function TaskList({ tasks, onDeleteTask, onAddTask }: TaskListProps) {
  const [taskInput, setTaskInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddTask = async () => {
    const validationResult = taskSchema.safeParse(taskInput);
    if (!validationResult.success) {
      setError(validationResult.error.errors[0].message);
      return;
    }
    setError(null); // Clear any previous error

    const trimmedTask = taskInput.trim();
    await onAddTask(trimmedTask);
    console.log("Task added:", trimmedTask); // デバッグ情報

    setTaskInput('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTask();
    }
  };

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          marginBottom: 2,
        }}
      >
        <TextField
          id="taskInput"
          label="Enter a task"
          variant="outlined"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ minWidth: 300 }}
          error={!!error} // Apply error style if there is an error
          helperText={error} // Display error message
        />
        <Button variant="contained" size="large" onClick={handleAddTask}>
          Add
        </Button>
      </Box>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {tasks.map((task) => (
          <ListItem key={task.id} sx={{ borderBottom: '1px solid #ddd' }}>
            <ListItemText primary={task.content} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => onDeleteTask(task.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
