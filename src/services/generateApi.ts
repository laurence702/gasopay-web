import { generateApiClient } from './apiGenerator';

/**
 * Generate API client code and download it as a file
 */
export function generateApiClientFile(): void {
  const code = generateApiClient();
  
  // Create a blob with the generated code
  const blob = new Blob([code], { type: 'text/plain' });
  
  // Create a download link
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'generatedApi.ts';
  
  // Trigger the download
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
  
  console.log('API client generated successfully. Download started.');
}

// Note: This function is now exported and can be called from a component
// instead of being executed immediately
