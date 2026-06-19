export interface UserData {
  uid: string;
  email: string;
  username: string;
  role: 'admin' | 'superadmin' | 'user';
  divisi: string | null;
}