import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { SocketContext } from '../context/SocketContext';
import TaskCard from '../components/TaskCard';
import { Plus, ArrowLeft } from 'lucide-react';

const TaskBoard = () => {
  const { id: projectId } = useParams();
  const socket = useContext(SocketContext);
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      try {
        const { data } = await api.get(`/projects/${projectId}`);
        setProject(data.project);
        setTasks(data.tasks);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectAndTasks();
  }, [projectId]);

  // Socket setup for Real-Time Updates
  useEffect(() => {
    if (!socket || !projectId) return;

    // Join room
    socket.emit('join_project', projectId);

    // Listeners
    socket.on('task_created', (newTask) => {
      setTasks((prev) => [newTask, ...prev]);
    });

    socket.on('task_updated', (updatedTask) => {
      setTasks((prev) => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
    });

    socket.on('task_deleted', (taskId) => {
      setTasks((prev) => prev.filter(t => t._id !== taskId));
    });

    // Cleanup: leave room and remove listeners on unmount
    return () => {
      socket.emit('leave_project', projectId);
      socket.off('task_created');
      socket.off('task_updated');
      socket.off('task_deleted');
    };
  }, [socket, projectId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${projectId}/tasks`, { title, description });
      // We don't need to manually update state here because the socket event 'task_created' 
      // will be received by us as well (since we are in the room), keeping UI perfectly synced.
      setShowModal(false);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleMove = async (taskId, newStatus) => {
    // Optimistic UI update for immediate feedback
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
    } catch (err) {
      console.error('Failed to update task', err);
      // Revert could be implemented here on failure
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="main-content flex-center"><h2>Loading Board...</h2></div>;
  if (!project) return <div className="main-content flex-center"><h2>Project not found</h2></div>;

  const todoTasks = tasks.filter(t => t.status === 'Todo');
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
  const doneTasks = tasks.filter(t => t.status === 'Done');

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: '0' }}>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" className="btn btn-secondary" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 style={{ margin: 0 }}>{project.name}</h2>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real-time Task Board</span>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Task
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flex: 1, minHeight: 0, paddingBottom: '2rem' }}>
        {/* Column: Todo */}
        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem', overflow: 'hidden' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid var(--primary-color)', paddingBottom: '0.5rem' }}>To Do ({todoTasks.length})</h3>
          <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
            {todoTasks.map(task => (
              <TaskCard key={task._id} task={task} onMove={handleMove} onDelete={handleDelete} />
            ))}
          </div>
        </div>

        {/* Column: In Progress */}
        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem', overflow: 'hidden' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid var(--warning)', paddingBottom: '0.5rem' }}>In Progress ({inProgressTasks.length})</h3>
          <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
            {inProgressTasks.map(task => (
              <TaskCard key={task._id} task={task} onMove={handleMove} onDelete={handleDelete} />
            ))}
          </div>
        </div>

        {/* Column: Done */}
        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem', overflow: 'hidden' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid var(--success)', paddingBottom: '0.5rem' }}>Done ({doneTasks.length})</h3>
          <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
            {doneTasks.map(task => (
              <TaskCard key={task._id} task={task} onMove={handleMove} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>New Task</h3>
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                className="input-field" 
                placeholder="Task Title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
              <textarea 
                className="input-field" 
                placeholder="Description (Optional)" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows={3}
                style={{ resize: 'none' }}
              />
              <div className="flex-between" style={{ marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
