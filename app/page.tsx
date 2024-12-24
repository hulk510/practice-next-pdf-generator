"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { downloadZip } from "@/services/downloadService";
import { FormData, formDataSchema } from "@/types/formData";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { DragDropImport } from "../components/DragDropImport";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { toast } from "../hooks/use-toast";
import { FormDataService } from "../services/formDataService";

export default function DynamicPDFGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
    defaultValues: {
      inheritanceRights: false,
      usageLevel1: 1,
      usageLevel2: 1,
      usageLevel3: 1,
      usageLevel4: 1,
      freeDescriptions: [{ content: "" }],
      contactInfos: [{ info: "" }],
    },
  });

  const {
    fields: freeDescriptionFields,
    append: appendFreeDescription,
    remove: removeFreeDescription,
  } = useFieldArray({
    control,
    name: "freeDescriptions",
  });

  const {
    fields: contactInfoFields,
    append: appendContactInfo,
    remove: removeContactInfo,
  } = useFieldArray({
    control,
    name: "contactInfos",
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await downloadZip(data);
      toast({
        title: "成功",
        description: "ZIPファイルが生成され、ダウンロードされました。",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error("Error downloading ZIP:", error);
      toast({
        title: "エラー",
        description:
          "ZIPファイルの生成に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportJSON = (data: FormData) => {
    try {
      const jsonString = FormDataService.exportJSON(data);
      FormDataService.createDownloadLink(jsonString, "form-data.json");
      toast({
        title: "成功",
        description: "フォームデータが正常にエクスポートされました。",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error("Error exporting JSON:", error);
      toast({
        title: "エラー",
        description:
          "フォームデータのエクスポートに失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    }
  };

  const importJSON = (jsonString: string) => {
    try {
      const importedData = FormDataService.importJSON(jsonString);
      reset(importedData);
      toast({
        title: "成功",
        description: "フォームデータが正常にインポートされました。",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error("Error importing JSON:", error);
      toast({
        title: "エラー",
        description:
          error instanceof Error
            ? error.message
            : "フォームデータのインポートに失敗しました。ファイルを確認してください。",
        variant: "destructive",
      });
    }
  };

  return (
    <div className='container mx-auto py-8 max-w-3xl'>
      <h1 className='text-3xl font-bold mb-8 text-center text-primary'>
        利用ガイドライン生成
      </h1>

      <Accordion type='single' collapsible className='mb-8'>
        <AccordionItem value='import-export'>
          <AccordionTrigger>データのインポート/エクスポート</AccordionTrigger>
          <AccordionContent>
            <div className='space-y-4'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-primary'>
                    データのエクスポート
                  </CardTitle>
                  <CardDescription>
                    現在のフォームデータをJSONファイルとしてエクスポートします。
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    type='button'
                    onClick={handleSubmit(exportJSON)}
                    className='w-full'
                  >
                    JSONエクスポート
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='text-primary'>
                    データのインポート
                  </CardTitle>
                  <CardDescription>
                    JSONファイルからフォームデータをインポートします。
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DragDropImport onImport={importJSON} />
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
        <Card>
          <CardHeader>
            <CardTitle className='text-primary'>権利継承</CardTitle>
            <CardDescription>
              権利を継承するかどうかを選択してください。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center space-x-2'>
              <Controller
                name='inheritanceRights'
                control={control}
                render={({ field }) => (
                  <Switch
                    id='inheritanceRights'
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-describedby='inheritanceRights-description'
                  />
                )}
              />
              <Label htmlFor='inheritanceRights'>権利継承を有効にする</Label>
            </div>
            <p
              id='inheritanceRights-description'
              className='text-sm text-muted-foreground mt-2'
            >
              権利継承を有効にすると、指定された権利が継承されます。
            </p>
          </CardContent>
        </Card>

        {["usageLevel1", "usageLevel2", "usageLevel3", "usageLevel4"].map(
          (use, index) => (
            <Card key={use}>
              <CardHeader>
                <CardTitle className='text-primary'>
                  使用レベル {index + 1}
                </CardTitle>
                <CardDescription>
                  使用レベル {index + 1} の設定を行ってください。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <Label htmlFor={use}>レベルを選択 (1-4)</Label>
                  <div className='flex items-center space-x-4'>
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
                          className='flex-grow'
                          aria-describedby={`${use}-description`}
                        />
                      )}
                    />
                    <Controller
                      name={use as keyof FormData}
                      control={control}
                      render={({ field }) => (
                        <div className='w-12 text-center font-bold'>
                          {typeof field.value === "number" ? field.value : ""}
                        </div>
                      )}
                    />
                  </div>
                  <div className='flex justify-between text-xs text-muted-foreground'>
                    <span>最小</span>
                    <span>最大</span>
                  </div>
                  <p
                    id={`${use}-description`}
                    className='text-sm text-muted-foreground'
                  >
                    1は最も制限が厳しく、4は最も緩やかです。プロジェクトの要件に応じて適切なレベルを選択してください。
                  </p>
                </div>
              </CardContent>
            </Card>
          ),
        )}

        <Card>
          <CardHeader>
            <CardTitle className='text-primary'>追加情報</CardTitle>
            <CardDescription>
              プロジェクトに関する追加情報を入力してください。
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <Label htmlFor='freeDescription'>自由記述</Label>
              {freeDescriptionFields.map((field, index) => (
                <div
                  key={field.id}
                  className='flex items-center space-x-2 mt-2'
                >
                  <Controller
                    name={`freeDescriptions.${index}.content`}
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder='プロジェクトに関する追加情報を入力'
                        className='flex-grow'
                      />
                    )}
                  />
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    onClick={() => removeFreeDescription(index)}
                    disabled={freeDescriptionFields.length === 1}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              ))}
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='mt-2'
                onClick={() => appendFreeDescription({ content: "" })}
              >
                <PlusCircle className='h-4 w-4 mr-2' />
                追加
              </Button>
            </div>
            <div>
              <Label htmlFor='contactInfo'>連絡先</Label>
              {contactInfoFields.map((field, index) => (
                <div
                  key={field.id}
                  className='flex items-center space-x-2 mt-2'
                >
                  <Controller
                    name={`contactInfos.${index}.info`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder='連絡先情報を入力'
                        className='flex-grow'
                      />
                    )}
                  />
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    onClick={() => removeContactInfo(index)}
                    disabled={contactInfoFields.length === 1}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              ))}
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='mt-2'
                onClick={() => appendContactInfo({ info: "" })}
              >
                <PlusCircle className='h-4 w-4 mr-2' />
                追加
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className='flex justify-center'>
          <Button
            type='submit'
            disabled={isLoading}
            className='w-full max-w-md'
          >
            {isLoading ? "生成中..." : "利用ガイドラインをダウンロード"}
          </Button>
        </div>
      </form>
    </div>
  );
}
