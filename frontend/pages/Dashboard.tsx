import React, { useState } from 'react';
import { PromptInput } from '../components/PromptInput';
import { CodePreview } from '../components/CodePreview';

export function Dashboard() {
  const [generatedCode, setGeneratedCode] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleTogglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="min-h-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Left Column - Prompt Input */}
            <div className="flex flex-col justify-center">
              <PromptInput 
                onCodeGenerated={setGeneratedCode}
                showPreview={showPreview}
                onTogglePreview={handleTogglePreview}
              />
            </div>

            {/* Right Column - Code Preview */}
            <div className="flex flex-col">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-200">Preview</h2>
                <p className="text-sm text-gray-400">
                  {showPreview ? "Generated code and preview" : "Preview hidden until generation"}
                </p>
              </div>
              
              <div className="flex-1">
                {generatedCode ? (
                  <CodePreview 
                    generatedCode={generatedCode.generatedCode}
                    metadata={generatedCode.metadata}
                    showPreview={showPreview}
                    onTogglePreview={handleTogglePreview}
                  />
                ) : (
                  <CodePreview 
                    generatedCode={{}}
                    metadata={{ type: '', estimatedLines: 0, generatedAt: new Date() }}
                    showPreview={showPreview}
                    onTogglePreview={handleTogglePreview}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
