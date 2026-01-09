import { MemberSchema , Member } from "@/validations/member";


export async function getMembers() : Promise<Member[]> {
  const res = await fetch(`http://localhost:3001/members`);
  if (!res.ok) {
    throw new Error("Failed to fetch members");
  }
  const json = await res.json();
  return MemberSchema.array().parse(json);
}