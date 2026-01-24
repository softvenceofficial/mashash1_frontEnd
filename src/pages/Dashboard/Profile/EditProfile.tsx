import ArrowLeftIcon from "@/assets/svgs/arrow-left.svg?react";
import UploadImage from "@/assets/svgs/Upload cloud.svg?react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import useProfileSettings from "@/components/Auth/hooks/use-profile-setting";
import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function EditProfile() {
  const [loading, setLoading] = useState(false);
  const { form, onSubmit, setAvatarFile, avatarFile, user } = useProfileSettings(setLoading);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const previewUrl = avatarFile 
    ? URL.createObjectURL(avatarFile) 
    : user?.avatar 
      ? `${import.meta.env.VITE_BASE_API_URL}${user.avatar}`
      : "";

  return (
    <section className="max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-2 mb-8">
        <Button
          variant="ghost"
          className="rounded-full p-2 h-auto hover:bg-muted"
          onClick={() => window.history.back()}
        >
          <ArrowLeftIcon className="size-6 text-black dark:text-white" />
        </Button>
        <h3 className="text-2xl font-bold">Edit Profile</h3>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="flex flex-col items-center justify-center gap-4">
            <div 
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Avatar className="size-32 border-2 border-dashed border-gray-300">
                <AvatarImage src={previewUrl} className="object-cover" />
                <AvatarFallback className="bg-muted">
                  <UploadImage className="size-8 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <p className="text-white text-xs font-medium">Change Photo</p>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
            <p className="text-sm text-muted-foreground">Click to upload new avatar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter first name" {...field} className="h-12 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter last name" {...field} className="h-12 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} className="h-12 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      className="h-12 rounded-xl block w-full" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full md:w-auto min-w-[200px] h-12 text-lg rounded-full"
            >
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
