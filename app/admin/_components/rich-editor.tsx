"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Underline as UIcon,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
} from "lucide-react";
import { cn } from "@/lib/cn";

export function RichEditor({
  value,
  onChange,
  placeholder = "Write…",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-teal underline underline-offset-2" },
      }),
      ImageExt.configure({ HTMLAttributes: { class: "rounded-xl my-4" } }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[400px] p-6 prose-tint focus:outline-none [&_p.is-editor-empty]:before:content-[attr(data-placeholder)] [&_p.is-editor-empty]:before:text-ink-4 [&_p.is-editor-empty]:before:float-left [&_p.is-editor-empty]:before:pointer-events-none",
      },
    },
  });

  if (!editor) return <div className="min-h-[400px] rounded-xl border border-line-soft bg-bg-2 p-6 text-ink-3">Loading editor…</div>;

  return (
    <div className="rounded-xl border border-line-soft bg-bg overflow-hidden">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className="border-b border-line-soft bg-bg-2 px-3 py-2 flex flex-wrap items-center gap-0.5">
      <BtnGroup>
        <Btn icon={Bold} active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} label="Bold" />
        <Btn icon={Italic} active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} label="Italic" />
        <Btn icon={UIcon} active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} label="Underline" />
        <Btn icon={Strikethrough} active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} label="Strike" />
      </BtnGroup>
      <Divider />
      <BtnGroup>
        <Btn icon={Heading2} active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} label="H2" />
        <Btn icon={Heading3} active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} label="H3" />
        <Btn icon={Quote} active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} label="Quote" />
      </BtnGroup>
      <Divider />
      <BtnGroup>
        <Btn icon={List} active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} label="Bullets" />
        <Btn icon={ListOrdered} active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} label="Numbered" />
      </BtnGroup>
      <Divider />
      <BtnGroup>
        <Btn icon={AlignLeft} active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} label="Left" />
        <Btn icon={AlignCenter} active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} label="Center" />
      </BtnGroup>
      <Divider />
      <BtnGroup>
        <Btn
          icon={LinkIcon}
          active={editor.isActive("link")}
          onClick={() => {
            const url = prompt("URL?", editor.getAttributes("link").href ?? "https://");
            if (url === null) return;
            if (url === "") return editor.chain().focus().extendMarkRange("link").unsetLink().run();
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
          label="Link"
        />
        <Btn
          icon={ImageIcon}
          onClick={() => {
            const url = prompt("Image URL? (use /admin/media to upload)");
            if (!url) return;
            editor.chain().focus().setImage({ src: url }).run();
          }}
          label="Image"
        />
        <Btn icon={Code} active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()} label="Code" />
      </BtnGroup>
      <Divider />
      <BtnGroup>
        <Btn icon={Undo2} onClick={() => editor.chain().focus().undo().run()} label="Undo" />
        <Btn icon={Redo2} onClick={() => editor.chain().focus().redo().run()} label="Redo" />
      </BtnGroup>
    </div>
  );
}

function BtnGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}
function Divider() {
  return <div className="mx-1 h-5 w-px bg-line" />;
}
function Btn({
  icon: Icon,
  active,
  onClick,
  label,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  active?: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={cn(
        "grid h-8 w-8 place-items-center rounded transition-colors",
        active ? "bg-teal/15 text-teal" : "text-ink-3 hover:bg-bg hover:text-ink",
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={1.5} />
    </button>
  );
}
