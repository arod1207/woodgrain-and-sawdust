import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-walnut to-walnut-dark px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-cream">Create Account</h1>
          <p className="mt-2 text-cream/70">
            Join Woodgrain & Sawdust to start shopping
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-white shadow-xl rounded-xl",
              headerTitle: "text-walnut",
              headerSubtitle: "text-charcoal-light",
              socialButtonsBlockButton:
                "border-cream-dark hover:bg-cream-dark",
              formFieldLabel: "text-charcoal",
              formFieldInput:
                "border-cream-dark focus:border-amber focus:ring-amber",
              formButtonPrimary:
                "bg-amber hover:bg-amber-light text-white",
              footerActionLink: "text-amber hover:text-amber-light",
            },
          }}
        />
      </div>
    </div>
  );
};

export default SignUpPage;
