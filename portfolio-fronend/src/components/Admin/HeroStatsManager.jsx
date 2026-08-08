import React, { useEffect, useState } from 'react';
import { useData } from '../../contexts/DataContext';

const HeroStatsManager = () => {
  const { data, updateHeroStats } = useData();
  const [stats, setStats] = useState(data?.heroStats || []);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setStats(data?.heroStats || []);
  }, [data?.heroStats]);

  const updateStat = (index, field, value) => {
    setStats((prev) =>
      prev.map((stat, i) => (i === index ? { ...stat, [field]: value } : stat))
    );
  };

  const addStat = () => setStats((prev) => [...prev, { value: '', label: '' }]);
  const removeStat = (index) => setStats((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await updateHeroStats(stats);
      setMessage('✅ Hero stats updated successfully.');
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.error || error.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-manager">
      <div className="admin-manager-heading">
        <p className="admin-eyebrow">Hero</p>
        <h3>📊 Hero Statistics</h3>
      </div>

      {message && <div className="admin-message">{message}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-repeat-list">
          {stats.map((stat, index) => (
            <div className="admin-repeat-row" key={index}>
              <input
                value={stat.value || ''}
                onChange={(e) => updateStat(index, 'value', e.target.value)}
                placeholder="Value"
              />
              <input
                value={stat.label || ''}
                onChange={(e) => updateStat(index, 'label', e.target.value)}
                placeholder="Label"
              />
              <button type="button" className="btn-delete" onClick={() => removeStat(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={addStat}>
            + Add Stat
          </button>
          <button className="btn-submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Hero Stats'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HeroStatsManager;
