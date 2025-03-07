import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-white flex flex-col items-center justify-center border ">
      <form className="flex flex-col w-96">
        <h1 className="text-2xl font-medium text-black">Sign up</h1>
        <p className="text-sm text text-gray-500">
          Already have an account?{" "}
          <Link
            className="text-green-600 font-medium underline"
            href="/sign-in"
          >
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email" className="text-black">
            Full Name
          </Label>
          <Input
            type="text"
            name="name"
            placeholder="Full Name"
            minLength={4}
            required
            className="text-black bg-white focus-visible:ring-offset-0 focus-visible:ring-0"
          />
          <Label htmlFor="email" className="text-black">
            Email
          </Label>
          <Input
            name="email"
            placeholder="you@example.com"
            required
            className="text-black bg-white  bg-transparent  focus-visible:ring-offset-0 focus-visible:ring-0"
          />

          <Label htmlFor="password" className="text-black">
            Password
          </Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
            className="text-black bg-white  bg-transparent  focus-visible:ring-offset-0 focus-visible:ring-0"
          />

          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            Sign up
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  );
}
