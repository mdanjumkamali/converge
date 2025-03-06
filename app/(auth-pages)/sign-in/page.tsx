import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="h-screen w-full bg-white flex items-center justify-center border">
      <form className="flex flex-col w-96">
        <h1 className="text-2xl font-medium text-black">Sign in</h1>
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            className="text-green-600 font-medium underline"
            href="/sign-up"
          >
            Sign up
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8 ">
          <Label htmlFor="email" className="text-black">
            Email
          </Label>
          <Input
            name="email"
            placeholder="you@example.com"
            required
            className="bg-white text-black"
          />
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-black">
              Password
            </Label>
            <Link
              className="text-xs text-foreground underline "
              href="/forgot-password"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            required
            className="bg-white text-black"
          />
          <SubmitButton pendingText="Signing In..." formAction={signInAction}>
            Sign in
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  );
}
