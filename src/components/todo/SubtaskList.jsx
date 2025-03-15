import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import SubtaskItem from './SubtaskItem';
import useTodoStore from '../../store/todoStore';
import { toast } from 'react-hot-toast';

const SubtaskList = ({ todoId }) => {
  const { todos, updateTodo } = useTodoStore();
  const [newSubtask, setNewSubtask] = useState('');
  
  // Find the current todo
  const todo = todos.find(t => t.id === todoId);
  
  // Get subtasks or initialize empty array
  const subtasks = todo?.subtasks || [];
  
  // Add a new subtask
  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;
    
    const updatedSubtasks = [
      ...subtasks,
      {
        id: Date.now().toString(), // Generate a temporary ID
        title: newSubtask.trim(),
        is_completed: false,
        order: subtasks.length
      }
    ];
    
    try {
      await updateTodo(todoId, { subtasks: updatedSubtasks });
      setNewSubtask('');
    } catch (error) {
      toast.error('Failed to add subtask');
      console.error(error);
    }
  };
    // Toggle subtask completion
    const handleToggleSubtask = async (subtaskId) => {
        const updatedSubtasks = subtasks.map(subtask => 
          subtask.id === subtaskId 
            ? { ...subtask, is_completed: !subtask.is_completed }
            : subtask
        );
        
        try {
          await updateTodo(todoId, { subtasks: updatedSubtasks });
        } catch (error) {
          toast.error('Failed to update subtask');
          console.error(error);
        }
      };
      
      // Delete a subtask
      const handleDeleteSubtask = async (subtaskId) => {
        const updatedSubtasks = subtasks.filter(subtask => subtask.id !== subtaskId);
        
        try {
          await updateTodo(todoId, { subtasks: updatedSubtasks });
          toast.success('Subtask deleted');
        } catch (error) {
          toast.error('Failed to delete subtask');
          console.error(error);
        }
      };
      
      // Update subtask title
      const handleUpdateSubtask = async (subtaskId, newTitle) => {
        if (!newTitle.trim()) {
          handleDeleteSubtask(subtaskId);
          return;
        }
        
        const updatedSubtasks = subtasks.map(subtask => 
          subtask.id === subtaskId 
            ? { ...subtask, title: newTitle.trim() }
            : subtask
        );
        
        try {
          await updateTodo(todoId, { subtasks: updatedSubtasks });
        } catch (error) {
          toast.error('Failed to update subtask');
          console.error(error);
        }
      };
      
      // Handle drag and drop reordering
      const handleDragEnd = async (result) => {
        if (!result.destination) return;
        
        const items = Array.from(subtasks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        
        // Update order property
        const updatedSubtasks = items.map((item, index) => ({
          ...item,
          order: index
        }));
        
        try {
          await updateTodo(todoId, { subtasks: updatedSubtasks });
        } catch (error) {
          toast.error('Failed to reorder subtasks');
          console.error(error);
        }
      };
      
      return (
        <div>
          <div className="mb-4">
            <div className="flex">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                placeholder="Add a subtask..."
                className="input flex-1 mr-2"
              />
              <button
                onClick={handleAddSubtask}
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700"
              >
                Add
              </button>
            </div>
          </div>
          
          {subtasks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No subtasks yet. Add one above.
            </p>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="subtasks">
                {(provided) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {subtasks
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((subtask, index) => (
                        <Draggable 
                          key={subtask.id} 
                          draggableId={subtask.id.toString()} 
                          index={index}
                        >
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <SubtaskItem
                                subtask={subtask}
                                onToggle={() => handleToggleSubtask(subtask.id)}
                                onDelete={() => handleDeleteSubtask(subtask.id)}
                                onUpdate={(newTitle) => handleUpdateSubtask(subtask.id, newTitle)}
                              />
                            </li>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      );
    };
    
    export default SubtaskList;
    