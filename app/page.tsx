"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import dynamic from "next/dynamic";
import { useState } from "react";
import PDFDocument from "@/components/PDFDocument";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  },
);

export default function DynamicPDFGenerator() {
  const [formData, setFormData] = useState({
    inheritanceRights: false,
    usageLevel1: 1,
    usageLevel2: 1,
    usageLevel3: 1,
    usageLevel4: 1,
    freeDescription: "",
    contactInfo: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData((prev) => ({ ...prev, [name]: value[0] }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, inheritanceRights: checked }));
  };

  return (
    <div className='space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h1 className='text-2xl font-bold mb-4'>利用ガイドライン生成</h1>

      <div className='flex items-center space-x-2'>
        <Switch
          id='inheritanceRights'
          checked={formData.inheritanceRights}
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor='inheritanceRights'>権利継承</Label>
      </div>

      {[
        "usageLevel1",
        "usageLevel2",
        "usageLevel3",
        "usageLevel4",
      ].map((use) => (
        <div key={use} className='space-y-2'>
          <Label htmlFor={use}>{use}</Label>
          <div className='pt-2'>
            <Slider
              id={use}
              min={1}
              max={4}
              step={1}
              value={[formData[use as keyof typeof formData] as number]}
              onValueChange={(value) => handleSliderChange(use, value)}
            />
          </div>
          <div className='flex justify-between text-xs'>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
          </div>
        </div>
      ))}

      <div>
        <Label htmlFor='freeDescription'>自由記述</Label>
        <Input
          id='freeDescription'
          name='freeDescription'
          value={formData.freeDescription}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <Label htmlFor='contactInfo'>連絡先</Label>
        <Input
          id='contactInfo'
          name='contactInfo'
          value={formData.contactInfo}
          onChange={handleInputChange}
        />
      </div>

      <PDFDownloadLink
        document={<PDFDocument formData={formData} />}
        fileName='guideline.pdf'
        className='inline-block'
      >
        {/* @ts-expect-error */}
        {({ loading }) => <Button disabled={loading}>PDFをダウンロード</Button>}
      </PDFDownloadLink>
    </div>
  );
}
