import React, { useState } from 'react';
import { PromptInput } from '../components/PromptInput';
import { CodePreview } from '../components/CodePreview';

export function Dashboard() {
  const [generatedCode, setGeneratedCode] = useState<any>(null);

  return (
    <div className="h-full overflow-y-auto">
      <div className="min-h-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Left Column - Prompt Input */}
            <div className="flex flex-col justify-center">
              <PromptInput onCodeGenerated={setGeneratedCode} />
            </div>

            {/* Right Column - Code Preview */}
            <div className="flex flex-col">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-200">Preview</h2>
                <p className="text-sm text-gray-400">
                  Generated code will appear here
                </p>
              </div>
              
              <div className="flex-1">
                {generatedCode ? (
                  <CodePreview 
                    generatedCode={generatedCode.generatedCode}
                    metadata={generatedCode.metadata}
                  />
                ) : (
                  <div className="h-full bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="text-4xl mb-4">🚀</div>
                      <p>Enter a prompt to generate your app</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
