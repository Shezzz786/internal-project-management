import React from 'react';
import { ChevronRight, ChevronLeft, Trash2 } from 'lucide-react';

const TaskCard = ({ task, onMove, onDelete }) => {
  const isTodo = task.status === 'Todo';
  const isInProgress = task.status === 'In Progress';
  const isDone = task.status === 'Done';

  return (
    <div className="glass-card" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div className="flex-between">
        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{task.title}</h4>
        <button onClick={() => onDelete(task._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.25rem' }} title="Delete Task">
          <Trash2 size={16} />
        </button>
      </div>
      
      {task.description && (
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          {task.description}
        </p>
      )}

      <div className="flex-between" style={{ marginTop: '0.5rem' }}>
        {/* Left Action */}
        <div>
          {isInProgress && (
            <button className="btn btn-secondary" style={{ padding: '0.4rem', fontSize: '0.85rem' }} onClick={() => onMove(task._id, 'Todo')}>
              <ChevronLeft size={16} /> Todo
            </button>
          )}
          {isDone && (
            <button className="btn btn-secondary" style={{ padding: '0.4rem', fontSize: '0.85rem' }} onClick={() => onMove(task._id, 'In Progress')}>
              <ChevronLeft size={16} /> In Progress
            </button>
          )}
        </div>
        
        {/* Right Action */}
        <div>
          {isTodo && (
            <button className="btn btn-primary" style={{ padding: '0.4rem', fontSize: '0.85rem' }} onClick={() => onMove(task._id, 'In Progress')}>
              Start <ChevronRight size={16} />
            </button>
          )}
          {isInProgress && (
            <button className="btn btn-primary" style={{ padding: '0.4rem', fontSize: '0.85rem', background: 'var(--success)' }} onClick={() => onMove(task._id, 'Done')}>
              Complete <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
