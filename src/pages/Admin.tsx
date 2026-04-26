import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Camarade, NiveauScolaire } from '../types';
import { Trash2, ShieldCheck, Lock, Loader2, LogOut, Edit3, X, Check, Camera, Video } from 'lucide-react';
import { motion } from 'framer-motion';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [camarades, setCamarades] = useState<Camarade[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State for Editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Camarade>>({});
  const [editLoading, setEditLoading] = useState(false);

  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPassword) {
      setIsAuthenticated(true);
      fetchCamarades();
    } else {
      alert('Mot de passe incorrect');
    }
  };

  const fetchCamarades = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('camarades')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCamarades(data || []);
    } catch (error) {
      console.error('Error fetching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmDelete = window.confirm(`Supprimer définitivement ${name} ?`);
    if (confirmDelete) {
      try {
        const { error } = await supabase.from('camarades').delete().eq('id', id);
        if (error) throw error;
        setCamarades(camarades.filter(c => c.id !== id));
      } catch (error) {
        alert('Erreur de suppression');
      }
    }
  };

  const startEditing = (c: Camarade) => {
    setEditingId(c.id);
    setEditForm(c);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
    if (e.target.files && e.target.files[0]) {
      try {
        setEditLoading(true);
        const url = await uploadFile(e.target.files[0], 'profiles');
        setEditForm({ ...editForm, [type === 'photo' ? 'photo_url' : 'video_url']: url });
      } catch (err) {
        alert('Erreur upload');
      } finally {
        setEditLoading(false);
      }
    }
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      setEditLoading(true);
      const { error } = await supabase
        .from('camarades')
        .update({
          prenom: editForm.prenom,
          nom: editForm.nom,
          niveau: editForm.niveau,
          annees: editForm.annees,
          activite: editForm.activite,
          biographie: editForm.biographie,
          telephone: editForm.telephone,
          photo_url: editForm.photo_url,
          video_url: editForm.video_url
        })
        .eq('id', editingId);

      if (error) throw error;
      
      setCamarades(camarades.map(c => c.id === editingId ? { ...c, ...editForm } as Camarade : c));
      setEditingId(null);
      alert('Modifié avec succès !');
    } catch (error) {
      alert('Erreur de mise à jour');
    } finally {
      setEditLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '8rem 1rem', display: 'flex', justifyContent: 'center' }}>
        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleLogin} className="card" style={{ padding: '3rem', maxWidth: '450px', width: '100%', textAlign: 'center' }}>
          <div style={{ backgroundColor: '#eff6ff', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <Lock size={32} color="var(--color-primary)" />
          </div>
          <h2 style={{ marginBottom: '1rem' }}>Admin</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Code secret"
            style={{ width: '100%', padding: '1rem', marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.2em' }}
            required
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Accéder</button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><ShieldCheck size={32} /> Gestion des Profils</h2>
        <button onClick={() => setIsAuthenticated(false)} className="btn" style={{ background: '#f1f5f9' }}><LogOut size={18} /> Quitter</button>
      </div>

      <div className="card" style={{ overflowX: 'auto', border: 'none' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead style={{ backgroundColor: '#f8fafc' }}>
            <tr>
              <th style={{ padding: '1.2rem', textAlign: 'left' }}>Infos / Médias</th>
              <th style={{ padding: '1.2rem', textAlign: 'left' }}>Niveau & Années</th>
              <th style={{ padding: '1.2rem', textAlign: 'left' }}>Activité & Bio</th>
              <th style={{ padding: '1.2rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem' }}><Loader2 className="animate-spin" /></td></tr>
            ) : camarades.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1.2rem' }}>
                  {editingId === c.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <input type="text" value={editForm.prenom} onChange={e => setEditForm({...editForm, prenom: e.target.value})} placeholder="Prénom" />
                      <input type="text" value={editForm.nom} onChange={e => setEditForm({...editForm, nom: e.target.value})} placeholder="Nom" />
                      <input type="tel" value={editForm.telephone} onChange={e => setEditForm({...editForm, telephone: e.target.value})} placeholder="WhatsApp" />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => document.getElementById('edit-photo')?.click()} className="btn" style={{ padding: '4px', background: '#f1f5f9' }}><Camera size={14}/></button>
                        <button onClick={() => document.getElementById('edit-video')?.click()} className="btn" style={{ padding: '4px', background: '#f1f5f9' }}><Video size={14}/></button>
                        <input id="edit-photo" type="file" hidden accept="image/*" onChange={e => handleFileChange(e, 'photo')} />
                        <input id="edit-video" type="file" hidden accept="video/*" onChange={e => handleFileChange(e, 'video')} />
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={c.photo_url || '/favicon.svg'} style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700 }}>{c.prenom} {c.nom}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{c.telephone}</div>
                      </div>
                    </div>
                  )}
                </td>
                <td style={{ padding: '1.2rem' }}>
                  {editingId === c.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <select value={editForm.niveau} onChange={e => setEditForm({...editForm, niveau: e.target.value as NiveauScolaire})}>
                        <option value="Primaire">Primaire</option>
                        <option value="Secondaire-Collège">Secondaire-Collège</option>
                        <option value="Primaire & Secondaire">Primaire & Secondaire</option>
                      </select>
                      <input type="text" value={editForm.annees} onChange={e => setEditForm({...editForm, annees: e.target.value})} placeholder="Années" />
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.niveau}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{c.annees}</div>
                    </div>
                  )}
                </td>
                <td style={{ padding: '1.2rem' }}>
                  {editingId === c.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <input type="text" value={editForm.activite} onChange={e => setEditForm({...editForm, activite: e.target.value})} placeholder="Activité" />
                      <textarea value={editForm.biographie} onChange={e => setEditForm({...editForm, biographie: e.target.value})} placeholder="Bio" style={{ fontSize: '0.8rem' }} />
                    </div>
                  ) : (
                    <div style={{ maxWidth: '200px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.activite}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{c.biographie}</div>
                    </div>
                  )}
                </td>
                <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    {editingId === c.id ? (
                      <>
                        <button disabled={editLoading} onClick={saveEdit} className="btn" style={{ background: '#dcfce7', color: '#166534', padding: '0.5rem' }}>
                          {editLoading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                        </button>
                        <button onClick={cancelEditing} className="btn" style={{ background: '#fee2e2', color: '#991b1b', padding: '0.5rem' }}>
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEditing(c)} className="btn" style={{ background: '#f1f5f9', color: '#475569', padding: '0.5rem' }}><Edit3 size={18} /></button>
                        <button onClick={() => handleDelete(c.id, c.prenom)} className="btn" style={{ background: '#fff1f2', color: '#e11d48', padding: '0.5rem' }}><Trash2 size={18} /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
