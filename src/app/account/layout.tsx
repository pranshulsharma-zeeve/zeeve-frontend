import GradientBackground from "@/components/layout/gradient-background";
import LeftSection from "@/components/layout/left-section";
import ZeeveLogo from "@/components/zeeve-logo";
import ReCaptchaProvider from "@/providers/recaptcha-provider";

/** Layout for auth related pages. */
const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex min-h-screen bg-white">
      {/* background */}
      <GradientBackground />

      {/* main  */}
      <main className="absolute size-full flex-1">
        <div className="flex min-h-screen flex-row items-start justify-center gap-[54px] p-4 lg:items-center lg:p-0">
          {/* left */}
          <div className="hidden basis-1/2 flex-col items-end justify-center lg:flex">
            <LeftSection />
          </div>
          {/* right */}
          <div className="flex basis-full flex-col items-start justify-center lg:basis-1/2">
            <ZeeveLogo className="mb-[20px] flex self-center lg:hidden" />
            <ReCaptchaProvider>{children}</ReCaptchaProvider>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
