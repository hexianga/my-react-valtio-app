import React, { useState } from 'react';

interface JsonViewerProps {
  data: any;
  defaultExpanded?: boolean;
}

interface JsonNodeProps {
  data: any;
  keyName?: string;
  level: number;
  defaultExpanded?: boolean;
}

const JsonNode: React.FC<JsonNodeProps> = ({
  data,
  keyName,
  level,
  defaultExpanded = true,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const isObject = data !== null && typeof data === 'object';
  const isArray = Array.isArray(data);
  const isEmpty = isArray ? data.length === 0 : Object.keys(data).length === 0;

  if (!isObject) {
    // 基本类型
    let valueClass = 'text-gray-700';
    if (data === null) {
      valueClass = 'text-gray-500';
    } else if (typeof data === 'string') {
      valueClass = 'text-green-600';
    } else if (typeof data === 'number') {
      valueClass = 'text-blue-600';
    } else if (typeof data === 'boolean') {
      valueClass = 'text-orange-600';
    }

    const valueStr = typeof data === 'string' ? `"${data}"` : String(data);

    return (
      <div className="flex flex-wrap items-baseline gap-1">
        {keyName && (
          <>
            <span className="text-purple-600 font-medium">{keyName}</span>
            <span className="text-gray-500">:</span>
          </>
        )}
        <span className={`font-mono ${valueClass} break-all`}>{valueStr}</span>
      </div>
    );
  }

  const entries = isArray
    ? data.map((item, i) => [i, item])
    : Object.entries(data);

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-1 text-xs">
        {keyName && (
          <>
            <span className="text-purple-600 font-medium">{keyName}</span>
            <span className="text-gray-500">:</span>
          </>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 transition"
        >
          <span
            className={`transform transition-transform ${expanded ? 'rotate-90' : ''}`}
          >
            ▶
          </span>
          <span className="text-gray-500 font-mono">
            {isArray ? '[' : '{'}
            {isEmpty ? '' : '...'}
            {isArray ? ']' : '}'}
          </span>
        </button>
        {!isEmpty && (
          <span className="text-gray-400 text-sm">
            ({entries.length} {isArray ? 'items' : 'keys'})
          </span>
        )}
      </div>

      {expanded && !isEmpty && (
        <div className="ml-4 border-l border-gray-300 pl-4 py-1">
          {entries.map(([key, value], index) => (
            <div key={index} className="py-1">
              <JsonNode
                data={value}
                keyName={String(key)}
                level={level + 1}
                defaultExpanded={level < 2}
              />
            </div>
          ))}
          <div className="text-gray-500 font-mono">{isArray ? ']' : '}'}</div>
        </div>
      )}

      {expanded && isEmpty && (
        <div className="text-gray-400 text-sm py-1">
          {isArray ? '[]' : '{}'}
        </div>
      )}
    </div>
  );
};

const JsonViewer: React.FC<JsonViewerProps> = ({
  data,
  defaultExpanded = true,
}) => {
  return (
    <div className="w-full h-full p-4 bg-gray-50 font-mono text-sm overflow-auto">
      <JsonNode data={data} level={0} defaultExpanded={defaultExpanded} />
    </div>
  );
};

export default JsonViewer;
