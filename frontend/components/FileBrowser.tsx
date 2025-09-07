import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Folder, 
  File, 
  ChevronRight, 
  ChevronDown,
  FileText,
  Code,
  Database,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  content?: string;
  language?: string;
}

interface FileBrowserProps {
  files: FileNode[];
  onFileSelect?: (file: FileNode) => void;
  selectedFile?: string;
  className?: string;
}

export function FileBrowser({ files, onFileSelect, selectedFile, className }: FileBrowserProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/', '/src', '/backend']));

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (fileName: string, type: string) => {
    if (type === 'folder') {
      return <Folder className="h-4 w-4 text-blue-400" />;
    }
    
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
      case 'tsx':
      case 'js':
      case 'jsx':
        return <Code className="h-4 w-4 text-yellow-400" />;
      case 'sql':
        return <Database className="h-4 w-4 text-green-400" />;
      case 'json':
      case 'yaml':
      case 'yml':
        return <Settings className="h-4 w-4 text-purple-400" />;
      case 'md':
        return <FileText className="h-4 w-4 text-blue-400" />;
      default:
        return <File className="h-4 w-4 text-gray-400" />;
    }
  };

  const renderFileNode = (node: FileNode, level: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const isSelected = selectedFile === node.path;

    return (
      <div key={node.path}>
        <div
          className={cn(
            "flex items-center py-1.5 px-2 text-sm cursor-pointer hover:bg-gray-800 rounded transition-colors",
            isSelected && "bg-gray-800 text-leap-accent",
            "ml-" + (level * 4)
          )}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.path);
            } else {
              onFileSelect?.(node);
            }
          }}
        >
          <div className="flex items-center space-x-1 flex-1">
            {node.type === 'folder' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 w-4 h-4"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(node.path);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            )}
            {getFileIcon(node.name, node.type)}
            <span className="truncate">{node.name}</span>
          </div>
        </div>
        
        {node.type === 'folder' && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderFileNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className={cn("p-4 bg-gray-900/50 border-gray-700", className)}>
      <div className="space-y-1 max-h-96 overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
          <Folder className="h-4 w-4 mr-2" />
          Project Files
        </h3>
        {files.map(file => renderFileNode(file))}
      </div>
    </Card>
  );
}
