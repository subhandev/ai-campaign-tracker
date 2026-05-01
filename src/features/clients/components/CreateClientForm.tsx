"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClientMutations } from "@/features/clients/hooks/useClients";
import { createClientSchema, CreateClientSchema } from "@/features/clients/schemas";

const INDUSTRIES = [
  "SaaS",
  "E-commerce",
  "Retail",
  "Health & Wellness",
  "Education",
  "Finance",
  "Real Estate",
  "Food & Beverage",
  "Travel",
  "Other",
];

export function CreateClientForm() {
  const router = useRouter();
  const { create, loading, error } = useClientMutations();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateClientSchema>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      name: "",
      company: "",
      industry: "",
      email: "",
      notes: "",
    },
  });

  const watched = watch();

  const onSubmit = async (data: CreateClientSchema) => {
    try {
      await create(data);
      router.push("/clients");
    } catch {
      // error handled in hook
    }
  };

  const initials = watched.name
    ? watched.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="name">
              Client Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter client name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company">Company / Brand (optional)</Label>
            <Input
              id="company"
              placeholder="Enter company or brand name"
              {...register("company")}
            />
            {errors.company && (
              <p className="text-xs text-destructive">{errors.company.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Industry (optional)</Label>
            <Select
              value={watched.industry}
              onValueChange={(val) =>
                setValue("industry", val, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about the client..."
              rows={4}
              {...register("notes")}
            />
            <div className="flex items-center justify-between">
              {errors.notes ? (
                <p className="text-xs text-destructive">{errors.notes.message}</p>
              ) : (
                <span />
              )}
              <p className="text-xs text-muted-foreground text-right">
                {watched.notes?.length ?? 0}/500
              </p>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/clients")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Client"}
            </Button>
          </div>
        </div>

        <div className="hidden lg:block">
          <p className="text-sm font-medium mb-4">Client Preview</p>
          <div className="rounded-xl border bg-muted/30 p-6 space-y-4">
            <div className="flex flex-col items-center gap-2">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-xl font-semibold">
                {initials}
              </div>
              <span className="font-medium text-sm">
                {watched.name || "Client Name"}
              </span>
              {watched.industry && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {watched.industry}
                </span>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Company / Brand</span>
                <span>{watched.company || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="truncate max-w-[140px]">
                  {watched.email || "—"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Notes</span>
                <span className="text-xs">
                  {watched.notes || "No notes added"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
