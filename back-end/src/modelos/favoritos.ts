export interface Favorite {
  id?: number;
  user_id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  newsUrl: string;
  created_at?: Date;
  updated_at?: Date;
}
