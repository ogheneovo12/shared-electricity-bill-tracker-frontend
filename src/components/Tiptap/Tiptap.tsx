"use client";
import { Editor } from "@tiptap/core";
import { Color } from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import MenuBar from "./MenuBar";

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle,
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: "https",
  }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
];

const TiptapEditorForm = ({
  value,
  setValue,
  disabled = false,
}: {
  value: string;
  setValue: (value: string) => void;
  disabled?: boolean;
}) => {
  const [editor, setEditor] = useState<Editor>();

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(value || "Hello");
    }
  }, [editor]);

  useEffect(() => {
    if (editor) {
      if (disabled) {
        editor.setEditable(false);
      } else {
        editor.setEditable(true);
      }
    }
  }, [editor, disabled]);
  return (
    <EditorProvider
      slotBefore={<MenuBar />}
      extensions={extensions}
      content={value || "Hello World"}
      onBlur={() => {}}
      onUpdate={(props) => {
        let content = props.editor.getHTML();
        setValue(content);
      }}
      onCreate={(props) => {
        setEditor(props.editor);
      }}
    />
  );
};

export default TiptapEditorForm;
