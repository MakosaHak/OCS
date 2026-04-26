import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { NiveauScolaire } from '../types';
import { Camera, Video, Send, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

const AddProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    niveau: 'Primaire' as NiveauScolaire,
    annees: '',
    activite: '',
    biographie: '',
    telephone: ''
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert('Image trop lourde (max 2 Mo)');
        return;
      }
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 20 * 1024 * 1024) {
        alert('Vidéo trop lourde (max 20 Mo)');
        return;
      }
      setVideo(file);
    }
  };

  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!photo && !video) {
      alert('Veuillez ajouter au moins une photo ou une vidéo.');
      return;
    }

    try {
      setLoading(true);

      let photoUrl = '';
      if (photo) {
        photoUrl = await uploadFile(photo, 'profiles');
      }

      let videoUrl = '';
      if (video) {
        videoUrl = await uploadFile(video, 'profiles');
      }

      const { error } = await supabase.from('camarades').insert([
        {
          ...formData,
          photo_url: photoUrl || null,
          video_url: videoUrl || null
        }
      ]);

      if (error) throw error;

      setSuccess(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });

      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Erreur lors de l\'enregistrement.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '10rem 1rem' }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card" style={{ padding: '3rem', maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ backgroundColor: '#dcfce7', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <CheckCircle size={40} color="#22c55e" />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Bienvenue dans la famille !</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            Ton profil a été ajouté avec succès. Redirection vers l'accueil...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '2rem', cursor: 'pointer', fontWeight: 600 }}>
        <ArrowLeft size={20} /> Retour
      </button>

      <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>Rejoindre la promotion</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '3rem', fontSize: '1.1rem' }}>Partagez votre parcours avec vos anciens camarades.</p>

      <form onSubmit={handleSubmit} className="card" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Prénom *</label>
            <input type="text" required value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} placeholder="Prénom" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nom *</label>
            <input type="text" required value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} placeholder="Nom" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Media Selection Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div 
            onClick={() => document.getElementById('photo-input')?.click()}
            style={{ 
              border: '2px dashed #e2e8f0', 
              borderRadius: '20px', 
              padding: '2rem', 
              textAlign: 'center', 
              cursor: 'pointer',
              backgroundColor: photo ? '#f0fdf4' : '#f8fafc',
              transition: 'all 0.2s'
            }}
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
            ) : (
              <>
                <Camera size={32} color="var(--color-primary)" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Ajouter une photo</div>
              </>
            )}
            <input id="photo-input" type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
          </div>

          <div 
            onClick={() => document.getElementById('video-input')?.click()}
            style={{ 
              border: '2px dashed #e2e8f0', 
              borderRadius: '20px', 
              padding: '2rem', 
              textAlign: 'center', 
              cursor: 'pointer',
              backgroundColor: video ? '#f0fdf4' : '#f8fafc',
              transition: 'all 0.2s'
            }}
          >
            <Video size={32} color="var(--color-accent)" style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{video ? video.name : 'Ajouter une vidéo'}</div>
            <input id="video-input" type="file" accept="video/*" onChange={handleVideoChange} style={{ display: 'none' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Niveau *</label>
            <select value={formData.niveau} onChange={(e) => setFormData({ ...formData, niveau: e.target.value as NiveauScolaire })} style={{ width: '100%' }}>
              <option value="Primaire">Primaire</option>
              <option value="Secondaire-Collège">Secondaire-Collège</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Années (ex: 2005-2011)</label>
            <input type="text" value={formData.annees} onChange={(e) => setFormData({ ...formData, annees: e.target.value })} placeholder="Ex: 2000-2006" style={{ width: '100%' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Activité actuelle *</label>
          <input type="text" required value={formData.activite} onChange={(e) => setFormData({ ...formData, activite: e.target.value })} placeholder="Ex: Développeur, Étudiant, Entrepreneur..." style={{ width: '100%' }} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Numéro WhatsApp (avec indicatif) *</label>
          <input type="tel" required value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} placeholder="Ex: +225 0102030405" style={{ width: '100%' }} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Biographie (Optionnel)</label>
          <textarea value={formData.biographie} onChange={(e) => setFormData({ ...formData, biographie: e.target.value })} placeholder="Parlez-nous de vous..." style={{ width: '100%', minHeight: '120px' }} />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '1.2rem', fontSize: '1.1rem', borderRadius: '18px' }}>
          {loading ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Enregistrer mon profil</>}
        </button>
      </form>
    </div>
  );
};

export default AddProfile;
