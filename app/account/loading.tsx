export default function AccountLoading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-violet" />
        <span className="font-mono text-sm text-muted">Loading account...</span>
      </div>
    </div>
  );
}
