import * as React from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Box, TextField, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Schema } from '../../amplify/data/resource'; 
import { generateClient } from 'aws-amplify/data';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json'; 
import { useState, useEffect } from 'react';
import { z } from 'zod';

Amplify.configure(outputs);

interface TaskListProps {
  tasks: string[];
  onDeleteTask: (index: number) => void;
}

const taskSchema = z.string().min(1, "Task cannot be empty").refine((val) => val.trim().length > 0, {
  message: "Task cannot be just whitespace",
});

const client = generateClient<Schema>();

export default function TaskList({ tasks, onDeleteTask }: TaskListProps) {
  const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);
  const [taskInput, setTaskInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sub = client.models.Todo.observeQuery().subscribe({
      next: ({ items }) => {
        setTodos([...items]);
    },
  });

  return () => sub.unsubscribe();
 }, []);

  const createTodo = async (task: string) => {
  await client.models.Todo.create({ content: task });
  }; 

  const handleAddTask = async () => {
    const validationResult = taskSchema.safeParse(taskInput);
    if (!validationResult.success) {
      setError(validationResult.error.errors[0].message);
      return;
    }
    setError(null); // Clear any previous error

    const trimmedTask = taskInput.trim();
    await createTodo(trimmedTask); // Call createTodo function to create a new task
  
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
        {tasks.map((task, index) => (
          <ListItem key={index} sx={{ borderBottom: '1px solid #ddd' }}>
            <ListItemText primary={task} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => onDeleteTask(index)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
