import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function MarkdownContent({ content, className = '', compact = false }) {
  if (!content || !String(content).trim()) {
    return null;
  }

  const rootClassName = ['markdown-content', compact ? 'markdown-content--compact' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClassName}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node: _node, href, children, ...props }) => {
            const isHashLink = href?.startsWith('#');
            return (
              <a
                href={href}
                {...props}
                target={isHashLink ? undefined : '_blank'}
                rel={isHashLink ? undefined : 'noopener noreferrer'}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownContent;
