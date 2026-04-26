export type NiveauScolaire = 'Primaire' | 'Secondaire-Collège' | 'Primaire & Secondaire';

export interface Camarade {
  id: string;
  prenom: string;
  nom: string;
  photo_url?: string;
  video_url?: string;
  niveau: NiveauScolaire;
  annees?: string;
  activite: string;
  biographie?: string;
  telephone: string;
  created_at: string;
}

export type CamaradeInsert = Omit<Camarade, 'id' | 'created_at'>;
