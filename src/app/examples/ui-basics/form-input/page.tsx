"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

/**
 * フォーム入力 サンプルページ
 *
 * @remarks
 * テキスト入力、チェックボックス、セレクトボックスなどフォーム要素の実装例。
 * shadcn/ui のフォームコンポーネントを活用しています。
 */
export default function FormInputPage() {
  const [textValue, setTextValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [selectValue, setSelectValue] = useState("");

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* 背景グラデーション */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-100/40 via-transparent to-brand-200/30 dark:from-brand-900/20 dark:to-brand-800/10" />

      {/* ノイズテクスチャオーバーレイ */}
      <div className="noise-texture pointer-events-none absolute inset-0 opacity-[0.02] mix-blend-overlay dark:opacity-[0.03]" />

      {/* メインコンテンツ */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:py-24">
        {/* ヒーローセクション */}
        <header
          className="animate-fade-in-scale mb-16 text-center"
          style={{ "--animation-delay": "0ms" } as React.CSSProperties}
        >
          <Badge variant="secondary" className="mb-6">
            UI Basics
          </Badge>
          <h1 className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            フォーム
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-600">
              入力
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            各種フォーム要素の実装例と状態管理
          </p>
        </header>

        {/* カードグリッド */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* テキスト入力 */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "100ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>テキスト入力</CardTitle>
              <CardDescription>Input コンポーネント</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-input">名前</Label>
                <Input
                  id="text-input"
                  type="text"
                  placeholder="名前を入力"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                />
                {textValue && (
                  <p className="text-sm text-muted-foreground">
                    入力値: {textValue}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-input">メールアドレス</Label>
                <Input
                  id="email-input"
                  type="email"
                  placeholder="example@email.com"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-input">パスワード</Label>
                <Input
                  id="password-input"
                  type="password"
                  placeholder="パスワードを入力"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disabled-input">無効化</Label>
                <Input
                  id="disabled-input"
                  type="text"
                  placeholder="入力できません"
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          {/* テキストエリア */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "200ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>テキストエリア</CardTitle>
              <CardDescription>Textarea コンポーネント</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="textarea">メッセージ</Label>
                <Textarea
                  id="textarea"
                  placeholder="メッセージを入力してください..."
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                  rows={4}
                />
                {textareaValue && (
                  <p className="text-sm text-muted-foreground">
                    文字数: {textareaValue.length}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* チェックボックスとスイッチ */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "300ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>チェックボックスとスイッチ</CardTitle>
              <CardDescription>
                Checkbox / Switch コンポーネント
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="checkbox"
                  checked={isChecked}
                  onCheckedChange={(checked) => setIsChecked(checked === true)}
                />
                <Label htmlFor="checkbox" className="cursor-pointer">
                  利用規約に同意する
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                チェック状態: {isChecked ? "ON" : "OFF"}
              </p>

              <div className="flex items-center space-x-3">
                <Switch
                  id="switch"
                  checked={isSwitchOn}
                  onCheckedChange={setIsSwitchOn}
                />
                <Label htmlFor="switch" className="cursor-pointer">
                  通知を受け取る
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                スイッチ状態: {isSwitchOn ? "ON" : "OFF"}
              </p>
            </CardContent>
          </Card>

          {/* セレクトボックス */}
          <Card
            className="animate-fade-in-up"
            style={{ "--animation-delay": "400ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>セレクトボックス</CardTitle>
              <CardDescription>Select コンポーネント</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="select">カテゴリを選択</Label>
                <Select value={selectValue} onValueChange={setSelectValue}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ui-basics">UI基礎</SelectItem>
                    <SelectItem value="layout">レイアウト</SelectItem>
                    <SelectItem value="animation">アニメーション</SelectItem>
                    <SelectItem value="react-hooks">React Hooks</SelectItem>
                    <SelectItem value="next-features">Next.js機能</SelectItem>
                  </SelectContent>
                </Select>
                {selectValue && (
                  <p className="text-sm text-muted-foreground">
                    選択値: {selectValue}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card
            className="animate-fade-in-up border-brand-200/50 bg-gradient-to-br from-brand-50/50 to-brand-100/30 sm:col-span-2 dark:border-brand-800/30 dark:from-brand-950/50 dark:to-brand-900/30"
            style={{ "--animation-delay": "500ms" } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>次のステップ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                他のサンプルページもぜひご覧ください。
              </p>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
              >
                カタログを見る
                <ChevronRight className="size-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
