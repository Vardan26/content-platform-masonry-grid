import React from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryStyled } from "./ErrorBoundary.Styled";

const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => (
  <ErrorBoundaryStyled role="alert">
    <p>Something went wrong:</p>
    <pre>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </ErrorBoundaryStyled>
);

export const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
};
