"use server";

import { Group } from "@/interface/group.interface";
import { Users } from "@/interface/users.interface";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getUsers(): Promise<Users[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, phone, created_at");

  if (error) {
    throw new Error(error.message);
  }

  return data as Users[];
}

export async function getGroups(): Promise<Group[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data, error } = await supabase
    .from("groups")
    .select(
      `
    id, 
    name, 
    description, 
    created_at,
    created_by,
    users:group_users(
      user_id,
      users:user_id(id, name, email, phone)
    ),
    messages:group_chats(
      id,
      message,
      created_at,
      sender:sender_id(id, name, email)
    )
  `
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  // Transform the data to match the Group interface
  const transformedData: Group[] = data.map((group: any) => ({
    id: group.id,
    name: group.name,
    description: group.description,
    created_at: group.created_at,
    created_by: group.created_by,
    users: group.users.map((user: any) => ({
      user_id: user.user_id,
      users: user.users,
    })),
    messages: group.messages.map((message: any) => ({
      id: message.id,
      message: message.message,
      created_at: message.created_at,
      sender: message.sender,
    })),
  }));

  return transformedData;
}

export interface Chat {
  id: string;
  message: string;
  created_at: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
  receiver: {
    id: string;
    name: string;
    email: string;
  };
}

export async function individualChat(userId: string): Promise<Chat[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data, error } = await supabase
    .from("chats")
    .select(
      `
      id,
      message,
      created_at,
      sender:sender_id (id, name, email),
      receiver:receiver_id (id, name, email)
    `
    )
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return data.map((item: any) => ({
    id: item.id,
    message: item.message,
    created_at: item.created_at,
    sender: item.sender || { id: "", name: "", email: "" },
    receiver: item.receiver || { id: "", name: "", email: "" },
  }));
}
