import { useState } from "react";
import AuthPageBg from "@/assets/images/authPageBg.jpg";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function SignUpLogIn({
  activatedTab,
}: {
  activatedTab: string;
}) {
  const [activeTab, setActiveTab] = useState(activatedTab || "login");

  return (
    <div
      className="relative flex h-full bg-cover bg-no-repeat bg-fixed bg-position-[center_right_20vw]"
      style={{ backgroundImage: `url(${AuthPageBg})` }}
    >
      <div className="basis-1/3"></div>
      <div className="rounded-2xl bg-background overflow-hidden basis-2/3">
        <div className="flex flex-col justify-center h-full px-[20%]">
          <h1 className="text-3xl text-center py-4 self-start">
            {activeTab === "login"
              ? "Log in to your account"
              : "Create a new account"}
          </h1>
          <div className="w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="!font-normal">
                <TabsTrigger value="login" className="text-lg font-normal">
                  Log In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="text-lg font-normal whitespace-nowrap"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm setActiveTab={setActiveTab} />
              </TabsContent>
              <TabsContent value="signup">
                <SignUpForm setActiveTab={setActiveTab} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
