# ADR-0002: GitHub Copilot パイプラインの併用

- Status: Accepted
- Date: 2026-06-10
- 関連: [ADR-0001](./0001-adopt-autonomous-agent-pipeline.md), [docs/COPILOT_AGENT_ENVIRONMENT.html](../COPILOT_AGENT_ENVIRONMENT.html)

## Context（背景）

ADR-0001 で Claude Code ベースの自律開発パイプラインを採用した。
このプロジェクトでは GitHub Copilot も使用するため、Copilot coding agent / Copilot CLI による
同等のパイプラインを追加する必要がある。その際、既存の Claude 版と競合（二重レビュー・二重 ADR 起票・
重複セキュリティ監査）しない設計が求められる。

## Decision（決定）

**Claude 版と Copilot 版を置き換えではなく併用とし、ラベルとブランチ規則で処理を振り分ける。**

- **入口の振り分け**: `claude:auto` ラベル → claude-resolve-issue.yml、
  `copilot:auto` ラベル → copilot-resolve-issue.yml（API で coding agent に assign）。
  どちらを使うかは人間がラベル付けで選択する
- **ADR の振り分け**: 実装した側が ADR を担当する。`copilot/*` ブランチの PR がマージされたら
  copilot-adr.yml、それ以外は claude-adr.yml。両者は `if:` 条件で相互排他にしてある
- **セキュリティ監査**: 日次の定期実行は Claude 版を既定とし、Copilot 版（copilot-security-scan.yml）の
  cron は無効状態で用意する（手動実行は可能）。重複起票を避けるため
- **レビュー**: Claude 版（claude-review.yml）は全 PR を対象とし、Copilot code review は
  リポジトリ設定で有効化する。クロスレビュー（Copilot 実装 × Claude レビュー、またはその逆）を許容する
- **手順書の共有**: 手順の内容は `.claude/skills/`（Claude 用）と `.github/prompts/`（Copilot 用）で
  同期させる。resolve-issue 相当の作業ルールは copilot-instructions.md に記載する
  （coding agent の内部手順はカスタマイズ不可のため）

## Alternatives（検討した代替案）

- **Claude 版を Copilot 版で置き換える**: coding agent は構築コストが低いが、手順のカスタマイズ性が
  低く（instructions 経由のみ）、スキルで細かく制御できる Claude 版の利点を失う。学習目的の
  プロジェクトとして両方のアプローチを比較できる価値もあるため却下
- **単一のラベル（auto）で両方に振り分ける**: どちらが処理するかが非決定的になり、
  実行の追跡・デバッグが困難になるため却下。明示的な2ラベル方式とした
- **ADR を常に一方の Agent に集約する**: 実装の文脈（PR の議論）を持つ側が ADR を書く方が
  品質が高く、一方の認証情報・課金に依存が偏らないため、実装した側が担当する方式とした

## Consequences（帰結）

- 人間の承認行為は引き続き「ラベル付け」と「マージ」の2点。ラベルの選択で使用するエージェントを制御できる
- Copilot 版は PAT 2種類（`COPILOT_ASSIGN_PAT` / `COPILOT_CLI_PAT`）の発行・期限管理が必要になる
- coding agent の draft PR 運用により、Copilot 経路は自律度レベル2（マージのみ人間）が製品仕様として強制される
- 手順書が2系統（skills / prompts）になるため、手順を変更する際は両方を更新する必要がある
- フォローアップ: `copilot:auto` ラベルの作成、coding agent の有効化、PAT シークレットの登録、
  Automatic Copilot code review の有効化
