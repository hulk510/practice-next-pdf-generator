"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { downloadZip } from "@/services/downloadService";
import { FormData, formDataSchema } from "@/types/formData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "../hooks/use-toast";

export default function DynamicPDFGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
    defaultValues: {
      inheritanceRights: false,
      usageLevel1: 1,
      usageLevel2: 1,
      usageLevel3: 1,
      usageLevel4: 1,
      freeDescription: "",
      contactInfo: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await downloadZip(data);
      toast({
        title: "Success",
        description: "ZIP file has been generated and downloaded.",
      });
    } catch (error) {
      console.error("Error downloading ZIP:", error);
      toast({
        title: "Error",
        description:
          "Failed to generate and download ZIP file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'
    >
      <h1 className='text-2xl font-bold mb-4'>利用ガイドライン生成</h1>

      <div className='flex items-center space-x-2'>
        <Controller
          name='inheritanceRights'
          control={control}
          render={({ field }) => (
            <Switch
              id='inheritanceRights'
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor='inheritanceRights'>権利継承</Label>
      </div>

      {["usageLevel1", "usageLevel2", "usageLevel3", "usageLevel4"].map(
        (use) => (
          <div key={use} className='space-y-2'>
            <Label htmlFor={use}>{use}</Label>
            <div className='pt-2'>
              <Controller
                name={use as keyof FormData}
                control={control}
                render={({ field }) => (
                  <Slider
                    id={use}
                    min={1}
                    max={4}
                    step={1}
                    value={[field.value as number]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                )}
              />
            </div>
            <div className='flex justify-between text-xs'>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
            </div>
          </div>
        ),
      )}

      <div>
        <Label htmlFor='freeDescription'>自由記述</Label>
        <Controller
          name='freeDescription'
          control={control}
          render={({ field }) => <Input id='freeDescription' {...field} />}
        />
      </div>

      <div>
        <Label htmlFor='contactInfo'>連絡先</Label>
        <Controller
          name='contactInfo'
          control={control}
          render={({ field }) => <Input id='contactInfo' {...field} />}
        />
      </div>

      <Button type='submit' disabled={isLoading}>
        {isLoading ? "生成中..." : "ZIPをダウンロード"}
      </Button>
    </form>
  );
}
