export interface GroupUser {
  user_id: string;
  users: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export interface Message {
  id: string;
  message: string;
  created_at: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Group {
  id: string;
  name: string;
  description: string;
  created_at: string;
  created_by: string;
  users: GroupUser[];
  messages: Message[];
}
