type AnswerBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; code: string };

const codeLinePattern = /\w+\([^)]*\)/;
const codeKeywordPattern =
  /^(class|const|let|var|function|return|import|export|if|for|while|switch|case)\b/;

const isCodeLine = (line: string) => {
  const trimmed = line.trim();

  if (!trimmed) return false;
  if (trimmed.startsWith("//")) return true;
  if (codeKeywordPattern.test(trimmed)) return true;
  if (codeLinePattern.test(trimmed) && /[{};]/.test(trimmed)) return true;
  if (/[{}]/.test(trimmed)) return true;
  if (/;$/g.test(trimmed)) return true;

  return false;
};

const isListItem = (line: string) =>
  /^(-|\*|•|\d+\.)\s+/g.test(line.trim());

const isHeadingLine = (line: string) => {
  const trimmed = line.trim();

  return trimmed.endsWith(":") && trimmed.length > 0 && trimmed.length < 80;
};

const normalizeListItem = (line: string) =>
  line.trim().replace(/^(-|\*|•|\d+\.)\s+/g, "");

const parseAnswer = (raw: string): AnswerBlock[] => {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const blocks: AnswerBlock[] = [];
  let paragraphBuffer: string[] = [];
  let listBuffer: string[] = [];
  let codeBuffer: string[] = [];
  let inCodeFence = false;

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      blocks.push({
        type: "paragraph",
        text: paragraphBuffer.join(" ").trim(),
      });
      paragraphBuffer = [];
    }
  };

  const flushList = () => {
    if (listBuffer.length > 0) {
      blocks.push({ type: "list", items: listBuffer });
      listBuffer = [];
    }
  };

  const flushCode = () => {
    if (codeBuffer.length > 0) {
      blocks.push({ type: "code", code: codeBuffer.join("\n") });
      codeBuffer = [];
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (inCodeFence) {
        flushCode();
      } else {
        flushParagraph();
        flushList();
      }

      inCodeFence = !inCodeFence;
      return;
    }

    if (inCodeFence) {
      codeBuffer.push(line);
      return;
    }

    if (!trimmed) {
      flushParagraph();
      flushList();
      flushCode();
      return;
    }

    if (isHeadingLine(trimmed)) {
      flushParagraph();
      flushList();
      flushCode();
      blocks.push({ type: "heading", text: trimmed.replace(/:$/g, "") });
      return;
    }

    if (isListItem(trimmed)) {
      flushParagraph();
      flushCode();
      listBuffer.push(normalizeListItem(line));
      return;
    }

    if (isCodeLine(trimmed)) {
      flushParagraph();
      flushList();
      codeBuffer.push(line);
      return;
    }

    if (codeBuffer.length > 0) {
      flushCode();
    }

    paragraphBuffer.push(trimmed);
  });

  flushParagraph();
  flushList();
  flushCode();

  return blocks;
};

type AnswerContentProps = {
  text: string;
};

export default function AnswerContent({ text }: AnswerContentProps) {
  const blocks = parseAnswer(text);

  return (
    <div className="mt-4 space-y-5">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <h3
              key={`${block.type}-${index}`}
              className="text-base font-semibold text-gray-900"
            >
              {block.text}
            </h3>
          );
        }

        if (block.type === "list") {
          return (
            <ul
              key={`${block.type}-${index}`}
              className="space-y-2 rounded-lg bg-white/70 px-4 py-3 text-gray-700 shadow-sm ring-1 ring-gray-200"
            >
              {block.items.map((item, itemIndex) => (
                <li key={`${block.type}-${index}-${itemIndex}`} className="pl-5">
                  <span className="relative -left-5 mr-2 inline-block text-gray-400">
                    •
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "code") {
          return (
            <pre
              key={`${block.type}-${index}`}
              className="overflow-x-auto rounded-xl bg-gray-900/95 p-4 text-sm text-gray-100 shadow-inner"
            >
              <code className="font-mono leading-relaxed">{block.code}</code>
            </pre>
          );
        }

        return (
          <p
            key={`${block.type}-${index}`}
            className="text-sm leading-relaxed text-gray-700 md:text-base"
          >
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
