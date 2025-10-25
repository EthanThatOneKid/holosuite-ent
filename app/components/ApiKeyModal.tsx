import React from 'react';

interface ApiKeyModalProps {
  onSelectKey: () => void;
  isSelectionInProgress: boolean;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSelectKey, isSelectionInProgress }) => {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">API Key Required</h3>
        <p className="py-4">
          Video generation with Veo requires a personal API key. Please select your key to proceed.
          This ensures your usage is correctly billed. For more information, please visit the{' '}
          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-primary"
          >
            billing documentation
          </a>.
        </p>
        <div className="modal-action">
          <button
            onClick={onSelectKey}
            disabled={isSelectionInProgress}
            className="btn btn-primary"
          >
            {isSelectionInProgress ? 'Opening Dialog...' : 'Select API Key'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
