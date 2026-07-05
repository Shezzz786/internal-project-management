import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { Plus, Folder } from 'lucide-react';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // For create modal
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/projects', { name, description });
      setProjects([data, ...projects]);
      setShowModal(false);
      setName('');
      setDescription('');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="main-content flex-center"><h2>Loading Projects...</h2></div>;

  return (
    <div className="main-content">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h2>Your Projects</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="glass-panel flex-center" style={{ padding: '3rem', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)' }}>
          <Folder size={48} opacity={0.5} />
          <p>No projects found. Create one to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {projects.map(project => (
            <Link to={`/project/${project._id}`} key={project._id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="glass-card" style={{ padding: '1.5rem', height: '100%' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-color)' }}>{project.name}</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {project.description || 'No description provided.'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Simple Modal overlay for creating project */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Create Project</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                className="input-field" 
                placeholder="Project Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
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
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
