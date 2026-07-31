"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Experience } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  role: z.string().min(2, "Role is required"),
  company: z.string().min(2, "Company is required"),
  location: z.string().optional(),
  period: z.string().min(2, "Period (e.g. Jan 25 - Present) is required"),
  responsibilities: z.array(z.string().min(1, "Cannot be empty")).min(1),
  achievements: z.array(z.string()),
  technologies: z.array(z.string()),
  order: z.coerce.number().default(0),
});

type FormValues = z.infer<typeof formSchema>;

interface ExperienceFormProps {
  initialData: Experience | null;
  onSuccess: () => void;
}

export default function ExperienceForm({
  initialData,
  onSuccess,
}: ExperienceFormProps) {
  const form = useForm<FormValues>({
    defaultValues: initialData || {
      role: "",
      company: "",
      location: "",
      period: "",
      responsibilities: [""],
      achievements: [""],
      technologies: [""],
      order: 0,
    },
  });

  const {
    fields: respFields,
    append: appendResp,
    remove: removeResp,
  } = useFieldArray({
    control: form.control,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name: "responsibilities" as never,
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const url = initialData
        ? `/api/experience/${initialData.id}`
        : "/api/experience";
      const res = await fetch(url, {
        method: initialData ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) onSuccess();
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ScrollArea className="h-[65vh] px-1">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Period</FormLabel>
                  <FormControl>
                    <Input placeholder="Jan 25 - Present" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Tampa, FL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator className="my-6" />

          {/* Dynamic Responsibilities */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                Responsibilities
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendResp("")}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Bullet
              </Button>
            </div>
            {respFields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`responsibilities.${index}`}
                render={({ field }) => (
                  <FormItem className="flex items-start gap-2">
                    <FormControl>
                      <Input {...field} className="bg-zinc-900/50" />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeResp(index)}
                      className="mt-1 text-zinc-500 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </ScrollArea>

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {initialData ? "Update Experience" : "Create Experience"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
