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
    .select("id, name, email, phone, created_at")
    .neq("id", user.id);

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

interface SendIndividualProp {
  text: string;
  sender_id: string;
  receiver_id: string;
}

export async function sendMessageToIndividual({
  text,
  sender_id,
  receiver_id,
}: SendIndividualProp) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/sign-in");

  const { error } = await supabase.from("chats").insert([
    {
      message: text,
      sender_id,
      receiver_id,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) throw new Error(error.message);
}

interface SendGroupMessageProp {
  text: string;
  sender_id: string;
  group_id: string;
}

interface GetGroupChatProp {
  group_id: string;
}

export interface GroupChat {
  id: string;
  message: string;
  created_at: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
  group_id: string;
}

export async function getGroupMessages(group_id: string): Promise<GroupChat[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/sign-in");

  // First get the messages
  const { data: messages, error: messagesError } = await supabase
    .from("group_chats")
    .select("*")
    .eq("group_id", group_id)
    .order("created_at", { ascending: true });

  if (messagesError) throw new Error(messagesError.message);

  if (!messages) return [];

  // Then get the senders' information
  const senderIds = Array.from(new Set(messages.map((msg) => msg.sender_id)));
  const { data: senders, error: sendersError } = await supabase
    .from("users")
    .select("id, name, email")
    .in("id", senderIds);

  if (sendersError) throw new Error(sendersError.message);

  // Create a map of sender information
  const senderMap = (senders || []).reduce(
    (acc, sender) => {
      acc[sender.id] = sender;
      return acc;
    },
    {} as Record<string, { id: string; name: string; email: string }>
  );

  // Combine the data
  return messages.map((message) => ({
    id: message.id,
    message: message.message,
    created_at: message.created_at,
    group_id: message.group_id,
    sender: senderMap[message.sender_id] || {
      id: message.sender_id,
      name: "Unknown User",
      email: "",
    },
  }));
}

export async function sendMessageToGroup({
  text,
  sender_id,
  group_id,
}: SendGroupMessageProp) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/sign-in");

  // Check if user is a member of the group
  const { data: memberCheck, error: memberError } = await supabase
    .from("group_users")
    .select("*")
    .eq("group_id", group_id)
    .eq("user_id", sender_id)
    .single();

  if (memberError || !memberCheck)
    throw new Error("You are not a member of this group");

  // Insert the message
  const { error } = await supabase.from("group_chats").insert([
    {
      message: text,
      sender_id,
      group_id,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) throw new Error(error.message);

  return { success: true };
}

export async function joinGroup(group_id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Check if user is already a member
  const { data: existingMember } = await supabase
    .from("group_users")
    .select("*")
    .eq("group_id", group_id)
    .eq("user_id", user.id)
    .single();

  if (existingMember) {
    return { success: true, message: "Already a member" };
  }

  // Add user to group
  const { error } = await supabase.from("group_users").insert([
    {
      group_id,
      user_id: user.id,
      joined_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/chat");
  return { success: true, message: "Joined group successfully" };
}
