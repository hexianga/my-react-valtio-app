import { styles } from "./css";
import { scripts } from "./js";

export const htmlBody = (summaryHtml: string, mainModuleTabs: string, moduleContents: string) => {
  return `<!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Steamer 部署自动化检测</title>
      <style>${styles}</style>
    </head>
    <body>
      <h1>Steamer 全量部署自动化检测</h1>
      ${summaryHtml}
      ${mainModuleTabs}
      ${moduleContents}
      <script>${scripts}</script>
    </body>
    </html>`;
};


/**
 * 转义HTML特殊字符
 * @param text 需要转义的文本
 * @returns 转义后的文本
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
