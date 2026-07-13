import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => (
          <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-2xl font-bold mt-5 mb-3" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-xl font-bold mt-4 mb-2" {...props} />
        ),
        h4: ({ node, ...props }) => (
          <h4 className="text-lg font-bold mt-3 mb-2" {...props} />
        ),
        p: ({ node, ...props }) => <p className="my-2" {...props} />,
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside my-2" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-inside my-2" {...props} />
        ),
        a: ({ href, children, ...props }) => (
          <a
            href={href}
            className="text-primary underline underline-offset-2 hover:no-underline"
            {...props}
          >
            {children}
          </a>
        ),
        strong: ({ node, ...props }) => (
          <strong className="font-semibold" {...props} />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-primary/30 pl-4 italic"
            {...props}
          />
        ),
        code: ({ className, children, ...props }) =>
          className ? (
            <code
              className="bg-secondary p-2 rounded block my-2 overflow-x-auto text-sm font-mono"
              {...props}
            >
              {children}
            </code>
          ) : (
            <code
              className="bg-secondary px-1.5 py-0.5 rounded text-sm font-mono"
              {...props}
            >
              {children}
            </code>
          ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
