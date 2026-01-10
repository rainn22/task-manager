import { MemberSchema, Member } from "@/validations/member";

const API_URL = "http://localhost:3001";

export async function getMembers(): Promise<Member[]> {
  const res = await fetch(`${API_URL}/members`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch members");
  }

  const json = await res.json();
  return MemberSchema.array().parse(json);
}
export async function getMembersByIds(
  memberIds: string[] = []
): Promise<Member[]> {
  if (memberIds.length === 0) return [];

  const res = await fetch(`${API_URL}/members`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch members");
  }

  const json = await res.json();
  const members = MemberSchema.array().parse(json);

  return members.filter((m) => memberIds.includes(m.id));
}
