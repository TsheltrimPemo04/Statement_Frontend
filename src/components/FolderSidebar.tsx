// components/FolderSidebar.tsx
import { useState, Fragment } from "react";

type Node = {
  label: string;
  type?: "folder" | "file" | "section";
  children?: Node[];
  defaultOpen?: boolean;
};

const TREE: Node[] = [
  {
    label: "ACC/CR/2025/7/7",
    type: "section",
    defaultOpen: true,
    children: [
      {
        label: "Exhibit File (EF)",
        type: "folder",
        defaultOpen: true,
        children: [
          { label: "EF01_Documentry Evidence", type: "folder" },
          { label: "EF02_Forensic Report", type: "folder" },
          {
            label: "EF03_Statements",
            type: "folder",
            defaultOpen: true,
            children: [
              { label: "Statement_1.pdf", type: "file" },
              { label: "Statement_2.pdf", type: "file" },
            ],
          },
        ],
      },
      {
        label: "Master Files (MF)",
        type: "folder",
        defaultOpen: true,
        children: [
          { label: "MF01_Internal Records", type: "folder" },
          { label: "MF02_Commission’s Order", type: "folder" },
          { label: "MF03_Correspondence", type: "folder" },
          { label: "MF04_Court Documents", type: "folder" },
          { label: "MF05_Chain of Custody", type: "folder" },
          { label: "MF06_Investigation Report", type: "folder" },
          { label: "MF07_Summon Order", type: "folder" },
        ],
      },
      {
        label: "Operation File (OF)",
        type: "folder",
        children: [
          { label: "OF01_Search and Seizure", type: "folder" },
          { label: "OF02_Arrest and Detention", type: "folder" },
        ],
      },
      {
        label: "Sundry Files (SF)",
        type: "folder",
        children: [{ label: "SF01_All that are not specified", type: "folder" }],
      },
      {
        label: "Working Files (WF)",
        type: "folder",
        children: [{ label: "WF01_Working Documents", type: "folder" }],
      },
    ],
  },
];

export default function FolderSidebar() {
  return (
    <aside className="w-full max-w-sm h-full overflow-auto bg-white border-r p-3 text-sm">
      <Tree nodes={TREE} />
    </aside>
  );
}

/* -------- Tree + Node -------- */

function Tree({ nodes }: { nodes: Node[] }) {
  return (
    <ul className="space-y-1">
      {nodes.map((n, i) => (
        <Fragment key={`${n.label}-${i}`}>
          <TreeNode node={n} depth={0} />
        </Fragment>
      ))}
    </ul>
  );
}

function TreeNode({ node, depth }: { node: Node; depth: number }) {
  const isFolder = node.type === "folder" || !!node.children?.length;
  const [open, setOpen] = useState(node.defaultOpen ?? depth < 1);

  const pad = 8 + depth * 16; // left padding per depth

  return (
    <li>
      <div
        className="flex items-center gap-2 rounded-md hover:bg-gray-50 cursor-default"
        style={{ paddingLeft: pad, paddingTop: 6, paddingBottom: 6 }}
      >
        {isFolder ? (
          <button
            aria-label={open ? "Collapse" : "Expand"}
            onClick={() => setOpen((v) => !v)}
            className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded hover:bg-gray-100"
          >
            <Chevron open={open} />
          </button>
        ) : (
          <span className="w-5 h-5" />
        )}

        {isFolder ? <FolderIcon /> : <FileIcon />}

        <span
          className={
            node.type === "section"
              ? "font-semibold text-gray-900"
              : isFolder
              ? "text-gray-900"
              : "text-gray-700"
          }
        >
          {node.label}
        </span>
      </div>

      {isFolder && open && node.children?.length ? (
        <ul className="space-y-1">
          {node.children.map((child, idx) => (
            <TreeNode key={`${child.label}-${idx}`} node={child} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

/* -------- Icons (inline SVG) -------- */

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-90" : ""}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M7.05 4.55a1 1 0 0 0 0 1.4L10.7 9.6l-3.65 3.65a1 1 0 1 0 1.4 1.4l4.35-4.35a1 1 0 0 0 0-1.4L8.45 4.55a1 1 0 0 0-1.4 0z" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg className="w-4.5 h-4.5 text-amber-600" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 4l2 2h8a2 2 0 0 1 2 2v1H2V6a2 2 0 0 1 2-2h6z" />
      <path d="M2 10h20v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8z" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg className="w-4.5 h-4.5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
      <path d="M14 2v6h6" className="opacity-70" />
    </svg>
  );
}
