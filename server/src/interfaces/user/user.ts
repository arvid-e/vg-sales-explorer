import type { Types } from 'mongoose';

export interface IUser {
  _id?: Types.ObjectId;
  githubId: number;      
  username: string;        
  avatarUrl?: string;    
  email?: string;         
  role: 'user' | 'admin'; 
}